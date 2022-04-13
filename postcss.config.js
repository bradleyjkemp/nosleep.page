const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
    plugins: [
        purgecss({
            content: [
                {
                    // Modals are activated by JS so purgecss can't statically find one
                    raw: '<html><body><div class="modal is-active"></div></body></html>',
                    extension: 'html'
                },
                './src/**/*.html'
            ]
        })
    ]
}
