/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: {
        // isolatedModules: fast transpile-only, no type-checking here — `npm run typecheck`
        // (run separately, and in CI) is what actually catches type errors
        '^.+\\.(t|j)sx?$': ['ts-jest', { isolatedModules: true }],
    },
    // d3 ships as ESM-only, as do several of its own transitive dependencies (internmap, etc.);
    // rather than chase that whole subtree by name, just don't skip node_modules for the transform
    transformIgnorePatterns: [],
    moduleNameMapper: {
        '\\.module\\.(sc|c)ss$': '<rootDir>/test/mocks/style-mock.js',
    },
    testPathIgnorePatterns: ['/node_modules/', '<rootDir>/public/'],
};
