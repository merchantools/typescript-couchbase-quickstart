module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__test__/**/*.test.(ts|tsx)'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
}
