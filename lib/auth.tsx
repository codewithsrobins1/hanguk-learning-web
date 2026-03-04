'use client';

const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:|on\w+\s*=/i;
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/;
const HAS_NUMBER = /\d/;

function validateSignUpInputs(
  email: string,
  password: string,
  username: string
): string | null {
  if (HTML_SCRIPT_PATTERN.test(username) || HTML_SCRIPT_PATTERN.test(email)) {
    return 'Invalid characters detected in username or email.';
  }
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!HAS_NUMBER.test(password))
    return 'Password must contain at least one number.';
  if (!SPECIAL_CHARS.test(password))
    return 'Password must contain at least one special character.';
  return null;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';

type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const snap = await getDoc(doc(db, 'profiles', userId));
  return snap.exists() ? (snap.data() as Profile) : null;
};

const updateActivity = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];
  const ref = doc(db, 'profiles', userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const p = snap.data() as Profile;
  if (p.last_active_date === today) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const isConsecutive = p.last_active_date === yesterday;
  const newStreak = isConsecutive ? p.current_streak + 1 : 1;
  const newLongest = Math.max(newStreak, p.longest_streak);

  await updateDoc(ref, {
    last_active_date: today,
    current_streak: newStreak,
    longest_streak: newLongest,
  });
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await fetchProfile(firebaseUser.uid);
        setProfile(p);
        await updateActivity(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (e: any) {
      return { error: e.message ?? 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    const validationError = validateSignUpInputs(email, password, username);
    if (validationError) return { error: validationError };
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, 'profiles', newUser.uid), {
        id: newUser.uid,
        username,
        display_name: username,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: new Date().toISOString().split('T')[0],
        created_at: serverTimestamp(),
      });
      return { error: null };
    } catch (e: any) {
      return { error: e.message ?? 'Sign up failed' };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.uid);
      setProfile(p);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
