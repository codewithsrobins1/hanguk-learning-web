import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export type IssueReport = {
  user_id: string;
  module: 'vocab' | 'patterns' | 'read' | 'listen' | 'grammar' | 'grammar_milestone' | 'tests' | 'shadow';
  content_id: string;   // setId / patternId / passageId / exerciseId / lessonId / milestoneId / testId / dialogueId
  item_id?: string;     // specific card/question id, when one exists
  item_index?: number;  // position within the content (question index, round, line, etc.)
  section?: string;     // e.g. 'reading' | 'listening' for TOPIK tests
  snapshot?: Record<string, unknown>; // whatever's relevant to reproduce the issue — question text, options, marked answer, user's pick
  reason: string;
  details?: string;
};

export async function reportIssue(report: IssueReport) {
  await addDoc(collection(db, 'issue_reports'), {
    ...report,
    status: 'open',
    created_at: serverTimestamp(),
  });
}
