export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json',
            diagnostics: {
                ignoreCodes: [1343],
            },
        }],
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/main.tsx',
    ],
};
