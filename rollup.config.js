import typescript from '@rollup/plugin-typescript';

export default [
  // {
  //   input: 'src/index.ts',
  //   output: {
  //     dir: 'dist',
  //   },
  //   // external: ['vue'],
  //   plugins: [typescript({ declaration: true, outDir: 'dist' })],
  // },
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
    },
    external: ['vue'],
    plugins: [typescript()],
  }
];