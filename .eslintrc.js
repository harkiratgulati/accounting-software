module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals', 'prettier'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json']
  }
};
