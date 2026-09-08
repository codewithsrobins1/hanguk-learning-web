import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['scripts/**/*.js', 'firebase-seed/**/*.js', 'tests/**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // error → warn
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];

export default eslintConfig;
