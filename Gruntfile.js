var grunt = require("grunt");
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-release');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
grunt.loadNpmTasks('grunt-browserify');
grunt.loadNpmTasks('grunt-contrib-jasmine');
grunt.initConfig({
	jshint: {
		all: ['src/**/*.js', '*.js', 'tests/**/*.js'],
		options:{
			esnext:true
		}
	},
	release: {
		options: {
			bump: true,
			npm: true,
			npmTag: "<%= version %>"
		}
	},
	browserify: {
	  dist: {
	    files: {
	      'browser/studio-browser-client-with-dependecies.js': ['src/**/*.js']
	    }
	  }
	},
	jsdoc : {
        dist : {
            src: ['src/*.js','README.md'],
            options: {
                destination: '.documentation',
                template : "node_modules/ink-docstrap/template",
              	configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
            }
        }
    },
    jsdoc2md: {
		dist: {
			src: 'src/*.js',
			dest: '.documentation/README.md'
		}
  	},
  	jasmine: {
	    dist: {
			src: 'browser/*.js',
			options: {
				specs: 'tests/**/*_tests.js'
			}
	    }
  	}
});
grunt.registerTask("test", ["browserify", "jasmine"]);
grunt.registerTask("all", ["jshint"]);
grunt.registerTask("default", ["all"]);
grunt.registerTask("doc",["jsdoc","jsdoc2md"]);
grunt.registerTask("prod", ["all", "release"]);

