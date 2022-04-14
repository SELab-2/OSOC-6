/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    testEnvironment: "jsdom",
    preset: "ts-jest",
    collectCoverage: true,
    testPathIgnorePatterns: ["<rootDir>/.node/"],
    collectCoverageFrom: ["<rootDir>/src/**"],
    moduleFileExtensions: ["ts", "js", "tsx"],
    moduleNameMapper: {
        // identity-obj-proxy tells jest to mock files with the specified extentions as CSS modules
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    globals: {
        // This is necessary because next.js forces { "jsx": "preserve" }, but ts-jest appears to require { "jsx": "react" }
        "ts-jest": {
            tsconfig: {
                jsx: "react-jsx",
            },
        },
    },
    "transformIgnorePatterns": [
        "node_modules/?!(react-icons)"
    ]
};
