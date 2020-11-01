import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default [
  // this config applies settings for creating type declarations
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
    },
    external: ['vue'],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'dist',
        emitDeclarationOnly: true,
        rootDir: 'src',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
      },
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],
    external: ['vue'],
    plugins: [typescript()],
  },
];
