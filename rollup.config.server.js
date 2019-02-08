import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';

export default {
    input: './src/server/index.ts',
    output: [{
        file: './dist/bundle.server.js',
        format: 'cjs',
        sourcemap: true
    }],
    plugins: [
        typescript(),
        babel({ exclude: 'node_modules/**' }),
        resolve(),
        commonjs()
    ],
    external: [
        '@schirkan/reactron-interfaces',
        'electron',
        'request-promise-native'
    ]
};