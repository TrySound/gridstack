module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-doctoc');

    grunt.initConfig({
        sass: {
            options: {
                outputStyle: 'expanded'
            },
            dist: {
                files: {
                    'dist/gridstack.css': 'src/gridstack.scss'
                }
            }
        },

        doctoc: {
            options: {
                removeAd: false
            },
            readme: {
                options: {
                    target: './README.md'
                }
            },
            doc: {
                options: {
                    target: './doc/README.md'
                }
            },
            faq: {
                options: {
                    target: './doc/FAQ.md'
                }
            },
        }
    });

    grunt.registerTask('default', ['sass', 'doctoc']);
};
