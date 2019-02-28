import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript';
import autoprefixer from 'autoprefixer';

export default {
    input: './src/browser/index.ts',
    output: [{
        file: './dist/bundle.browser.js',
        format: 'system',
        sourcemap: true
    }],
    plugins: [
        typescript(),
        postcss({ plugins: [autoprefixer()] }),
        // postcss({ modules: true }),
        babel({ exclude: 'node_modules/**' }),
        resolve(),
        commonjs(),
    ],
    external: [
        '@schirkan/reactron-interfaces',
        'react',
        'react-dom',
        '@fortawesome/fontawesome-svg-core',
        '@fortawesome/free-regular-svg-icons',
        '@fortawesome/free-solid-svg-icons',
        '@fortawesome/react-fontawesome',
        'numeral',
        'moment',
        'moment-timezone'
    ]
};