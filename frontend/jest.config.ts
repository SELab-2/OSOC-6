/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    collectCoverage: true,
    testPathIgnorePatterns: ['<rootDir>/.node/'],
    collectCoverageFrom: ['<rootDir>/src/**'],
    moduleFileExtensions: ['ts', 'js', 'tsx'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
};
