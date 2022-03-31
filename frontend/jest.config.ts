/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    testEnvironment: 'node',
    preset: 'ts-jest',
    collectCoverage: true,
    //testPathIgnorePatterns: ['<rootDir>/.node/'],
    collectCoverageFrom: ['<rootDir>/src/**'],
    moduleFileExtensions: ['ts', 'js', 'tsx'],
};
