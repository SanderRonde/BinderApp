module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		minified: {
			files: {
				src: [
					'Scripts/*.js'
				],
				dest: 'build/Scripts/'
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false
			},
			targets: {
				files: [
					{
						expand: true,
						src: ['css.css', 'polymer.css'],
						dest: 'build/',
						ext: '.css'
					}
				]
			}
		},
		copy: {
			main: {
				files: [
					{ expand: true, src: ['Scripts/jquery-2.0.3.min.js', 'Scripts/jquery.color-2.1.2.min.js', 'jquery.easing.js'], dest: 'build/' },
					{ expand: true, src: ['Images/*'], dest: 'build/' },
					{ expand: true, src: ['Colorpicker/**'], dest: 'build/' },
					{ expand: true, src: ['LICENSE.txt', 'manifest.json'], dest: 'build/' },
					{ expand: true, src: ['icon-large.png', 'icon-small.png', 'icon-supersmall.png', 'manifest.json', 'Segoe_UI.ttf'], dest: 'build/' }
				]
			},
			dev: {
				files: [
					{ expand: true, src: ['html/*'], dest: 'build/' },
					{ expand: true, src: ['Scripts/*'], dest: 'build/' },
					{ expand: true, src: ['Images/*'], dest: 'build/' },
					{ expand: true, src: ['Colorpicker/**'], dest: 'build/' },
					{ expand: true, src: ['LICENSE.txt', 'manifest.json'], dest: 'build/' },
					{ expand: true, src: ['css.css', 'polymer.css', 'icon-large.png', 'icon-small.png', 'icon-supersmall.png', 'manifest.json', 'Segoe_UI.ttf'], dest: 'build/' }
				]
			},
			js: {
				files: [
					{ expand: true, src: ['Scripts/js.js'], dest: 'build/' }
				]
			}
		},
		usebanner: {
			jsCssBanner: {
				options: {
					position: 'top',
					banner: '/* Original can be found at https://github.com/SanderRonde/BinderApp \n * This code may only be used under the MIT style license found in the LICENSE.txt file \n**/',
					linebreak: true
				},
				files: {
					src: ['build/Scripts/background.js', 'build/Scripts/js.js', 'build/Scripts/polymer.js', 'build/Scripts/searchWorker.js', 'build/Scripts/worker.js', 'build/css.css', 'build/polymer.css']
				}
			},
			htmlBanner: {
				options: {
					position: 'top',
					banner: '<!--Original can be found at https://github.com/SanderRonde/BinderApp\nThis code may only be used under the MIT style license found in the LICENSE.txt file-->\n',
					linebreak: true
				},
				files: {
					src: ['build/html/*']
				}
			}
		},
		processhtml: {
			with: {
				files: {
					'build/html/withSuperSearch.html': ['html/window.html']
				}
			},
			without: {
				files: {
					'build/html/withoutSuperSearch.html': ['html/window.html']
				}
			},
			blue: {
				options: {
					strip: true
				},
				files: [
					{ expand: true, src: ['build/html/withoutSuperSearch.html', 'build/html/withSuperSearch.html'], filter: 'isFile', ext: '.blue.html' }
				]
			},
			black: {
				options: {
					strip: true
				},
				files: [
					{ expand: true, src: ['build/html/withoutSuperSearch.html', 'build/html/withSuperSearch.html'], filter: 'isFile', ext: '.black.html' }
				]
			},
			red: {
				options: {
					strip: true
				},
				files: [
					{ expand: true, src: ['build/html/withoutSuperSearch.html', 'build/html/withSuperSearch.html'], filter: 'isFile', ext: '.red.html' }
				]
			},
			white: {
				options: {
					strip: true
				},
				files: [
					{ expand: true, src: ['build/html/withoutSuperSearch.html', 'build/html/withSuperSearch.html'], filter: 'isFile', ext: '.white.html' }
				]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: false,
					collapseWhitespace: true,
					minifyCSS: true
				},
				files: [
					{ expand: true, src: ['build/html/*'], filter: 'isFile' }
				]
			}
		},
		zip: {
			'using-cwd': {
				cwd: 'build/',
				src: ['build/**', '!build/Binder App.zip'],
				dest: 'build/Binder App.zip'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-minified');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-processhtml');

	grunt.registerTask('build', ['minified', 'cssmin', 'copy:main', 'processhtml', 'usebanner', 'htmlmin', 'zip']);
	grunt.registerTask('dev', ['copy:dev', 'processhtml', 'htmlmin']);
	grunt.registerTask('updateJs', ['copy:js']);
}