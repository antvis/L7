module.exports = {
    globals: {
        'ts-jest': {
            // @see https://github.com/kulshekhar/ts-jest/issues/933#issuecomment-479821844
            babelConfig: {
                plugins: [[
                    // import glsl as raw text
                    'babel-plugin-inline-import',
                    {
                        extensions: [
                            // 由于使用了 TS 的 resolveJsonModule 选项，JSON 可以直接引入，不需要当作纯文本
                            '.glsl'
                        ]
                    }
                ]],
            },
        },
    }
}