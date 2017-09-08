module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        modx: grunt.file.readJSON('_build/config.json'),
        sshconfig: grunt.file.readJSON('/Users/jako/Documents/MODx/partout.json'),
        banner: '/*!\n' +
        ' * <%= modx.name %> - <%= modx.description %>\n' +
        ' * Version: <%= modx.version %>\n' +
        ' * Build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' */\n',
        usebanner: {
            css: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'assets/components/switchtemplate/css/mgr/switchtemplate.min.css'
                    ]
                }
            },
            js: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                        'assets/components/switchtemplate/js/mgr/switchtemplate.min.js'
                    ]
                }
            }
        },
        uglify: {
            mgr: {
                src: [
                    'source/js/mgr/switchtemplate.js',
                    'source/js/mgr/helper/switchtemplate.combo.js',
                    'source/js/mgr/widgets/switchtemplate.grid.js',
                    'source/js/mgr/widgets/home.panel.js',
                    'source/js/mgr/sections/home.js'
                ],
                dest: 'assets/components/switchtemplate/js/mgr/switchtemplate.min.js'
            }
        },
        sass: {
            options: {
                outputStyle: 'expanded',
                sourcemap: false
            },
            mgr: {
                files: {
                    'source/css/mgr/switchtemplate.css': 'source/sass/mgr/switchtemplate.scss'
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('pixrem')(),
                    require('autoprefixer')({
                        browsers: 'last 2 versions, ie >= 8'
                    })
                ]
            },
            mgr: {
                src: [
                    'source/css/mgr/switchtemplate.css'
                ]
            }
        },
        cssmin: {
            mgr: {
                src: [
                    'source/css/mgr/switchtemplate.css'
                ],
                dest: 'assets/components/switchtemplate/css/mgr/switchtemplate.min.css'
            }
        },
        sftp: {
            css: {
                files: {
                    "./": [
                        'assets/components/switchtemplate/css/mgr/switchtemplate.min.css',
                        'source/css/mgr/switchtemplate.css'
                    ]
                },
                options: {
                    path: '<%= sshconfig.hostpath %>develop/switchtemplate/',
                    srcBasePath: 'develop/switchtemplate/',
                    host: '<%= sshconfig.host %>',
                    username: '<%= sshconfig.username %>',
                    privateKey: '<%= sshconfig.privateKey %>',
                    passphrase: '<%= sshconfig.passphrase %>',
                    showProgress: true
                }
            },
            js: {
                files: {
                    "./": [
                        'assets/components/switchtemplate/js/mgr/switchtemplate.min.js'
                    ]
                },
                options: {
                    path: '<%= sshconfig.hostpath %>develop/switchtemplate/',
                    srcBasePath: 'develop/switchtemplate/',
                    host: '<%= sshconfig.host %>',
                    username: '<%= sshconfig.username %>',
                    privateKey: '<%= sshconfig.privateKey %>',
                    passphrase: '<%= sshconfig.passphrase %>',
                    showProgress: true
                }
            }
        },
        watch: {
            js: {
                files: ['source/**/*.js'],
                tasks: ['uglify', 'usebanner:js', 'sftp:js']
            },
            css: {
                files: ['source/**/*.scss'],
                tasks: ['sass', 'postcss', 'cssmin', 'usebanner:css', 'sftp:css']
            },
            config: {
                files: ['_build/config.json'],
                tasks: ['default']
            }
        },
        bump: {
            copyright: {
                files: [{
                    src: 'core/components/switchtemplate/model/switchtemplate/switchtemplate.class.php',
                    dest: 'core/components/switchtemplate/model/switchtemplate/switchtemplate.class.php'
                }],
                options: {
                    replacements: [{
                        pattern: /Copyright \d{4}(-\d{4})? by/g,
                        replacement: 'Copyright ' + (new Date().getFullYear() > 2014 ? '2014-' : '') + new Date().getFullYear() + ' by'
                    }]
                }
            },
            version: {
                files: [{
                    src: 'core/components/switchtemplate/model/switchtemplate/switchtemplate.class.php',
                    dest: 'core/components/switchtemplate/model/switchtemplate/switchtemplate.class.php'
                }],
                options: {
                    replacements: [{
                        pattern: /version = '\d+.\d+.\d+[-a-z0-9]*'/ig,
                        replacement: 'version = \'' + '<%= modx.version %>' + '\''
                    }]
                }
            },
            homepanel: {
                files: [{
                    src: 'source/js/mgr/widgets/home.panel.js',
                    dest: 'source/js/mgr/widgets/home.panel.js'
                }],
                options: {
                    replacements: [{
                        pattern: /© \d{4}(-\d{4})? by/g,
                        replacement: '© ' + (new Date().getFullYear() > 2014 ? '2014-' : '') + new Date().getFullYear() + ' by'
                    }]
                }
            }
        }
    });

    //load the packages
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-ssh');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.renameTask('string-replace', 'bump');

    //register the task
    grunt.registerTask('default', ['bump', 'uglify', 'sass', 'postcss', 'cssmin', 'usebanner', 'sftp']);
};
