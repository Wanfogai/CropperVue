module.exports =
{
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ["node", "node-addons"],
    },
    moduleNameMapper: {
        "^@vue/test-utils": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
        "^@/components/widget/Croper": "<rootDir>/src/components/widget/Croper/index.ts",
        "^@/components": "<rootDir>/src/components/index.ts",
        "^@/app/interfaces": "<rootDir>/src/app/interfaces/index.ts"
    },
    moduleFileExtensions: ['vue', 'js', 'ts', 'tsx', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
        '^.+\\.vue$': '@vue/vue3-jest'
    }
}
