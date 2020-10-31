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
        file: 'dist/index.iife.js',
        format: 'iife',
        exports: 'named',
        name: 'vuedfs',
        sourcemap: true,
      },
    ],
    external: ['vue'],
    plugins: [typescript()],
  },
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
