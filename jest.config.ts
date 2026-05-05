import type { Config } from 'jest';

const config: Config = {
  preset: "ts-jest",
  "testPathIgnorePatterns": [
    "<rootDir>/astro-i18nya",
    "<rootDir>/dist"
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

export default config;
