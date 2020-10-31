import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        // dir: 'dist',
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true,
      },
      {
        // dir: 'dist',
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        // dir: 'dist',
        file: 'dist/index.umd.js',
        format: 'umd',
        exports: 'named',
        name: 'vuedfs',
        sourcemap: true,
      },
    ],
    external: ['vue'],
    plugins: [typescript()],
  },
  // this config applies settings for creating type declarations
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
    },
    plugins: [
      typescript({ declaration: true, declarationDir: 'dist', rootDir: 'src' }),
    ],
  },
];
