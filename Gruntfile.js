module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %>*/'
            },
            dist: {
                files: {
                    'dist/core.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'core/*.js']
        },
        watch: {
            files: ['lib/js/**/*.js'],
            tasks: ['mod_dev']
        },
        mod_dev: {
            src: './lib/js/',
            dest: './public/js/',
            // core task生成的文件将会与module.js合并
            core: {
                //charset: 'utf-8', // default
                //sourceMapDest: false, // 若不输出sourcemap则值为false，否则指定目录。若不设定此值，默认设定路径与dest路径相同
                files: {
                    // main-module : module-path
                    'core/base.js': 'core.js'
                }
            },
            snippet: {
                src: ['./lib/js/pages/snippet/', './lib/js/widget/'],
                files: {
                    'snippets.js': 'snippets.js',
                    'vote-new.js': 'vote-new.js',
                    'edit-snippet.js': 'edit-snippet.js',
                    'login.js': 'login.js',
                    'voting.js': 'voting.js',
                    'register.js': 'register.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-mod-dev');

    grunt.registerTask('default', ['mod_dev']);
};
