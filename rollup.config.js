import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const input = 'src/index.ts';
const external = [...Object.keys(pkg.peerDependencies || {})];

export default [
  {
    input,
    external,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [typescript()],
  },
  {
    input,
    external,
    output: {
      dir: 'dist',
      format: 'es',
    },
    plugins: [
      typescript({ declaration: true, declarationDir: 'dist', rootDir: 'src' }),
    ],
  },
];
