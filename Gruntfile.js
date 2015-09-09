module.exports = function(grunt) {

    'use strict';

    var jsLibs = [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/velocity/velocity.js'
    ];

    // project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    loadPath: ['bower_components/font-awesome/scss']
                },
                files: {
                    'assets/css/main.min.css' : '_sass/main.scss'
                }
            }
        },

        autoprefixer: {
            dist: {
                files: {
                    'assets/css/main.min.css' : 'assets/css/main.min.css'
                }
            }
        },

        uglify: {
            dist: {
                files: {
                    'assets/js/libs.min.js': jsLibs
                }
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'assets/js/*.js',
                '!assets/js/libs.min.js'
            ]
        },

        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'bower_components/font-awesome/', src: 'fonts/**', dest: 'assets/'}
                ]
            }
        },

        watch: {
            css: {
                files: '_sass/*.scss',
                tasks: ['sass', 'autoprefixer']
            },
            jshint: {
                files: 'assets/js/*.js',
                tasks: ['jshint']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['sass', 'autoprefixer', 'uglify', 'copy', 'jshint', 'watch']);

};
