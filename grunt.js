"use strict";

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    lint: {
      files: ['app.js', 'grunt.js', 'server/**/*.js', 'test/**/*.js', 'public/js/*.js']
    },
    simplemocha : {
      all : {
        src : 'test/**/*.js',
        options : {
          globals : ['should'],
          timeout : 3000,
          ignoreLeaks : false,
          // grep: '*-test',
          ui : 'bdd',
          reporter : 'spec',
          recursive: true
        }
      }
    },
    // qunit: {
    //   files: ['test/**/*.html']
    // },
    // concat: {
    //   dist: {
    //     src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
    //     dest: 'dist/<%= pkg.name %>.js'
    //   }
    // },
    // min: {
    //   dist: {
    //     src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
    //     dest: 'dist/<%= pkg.name %>.min.js'
    //   }
    // },
    watch: {
      files: '<config:lint.files>',
      // tasks: 'lint qunit'
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        trailing: true,
        // boss: true,
        // eqnull: true,
        browser: true,
        node : true,
        es5 : true,
        laxcomma : true,
        // loopfunc : true,
        strict: true,
        expr: true
      },
      globals: {
        jQuery: true,
        it : true,
        beforeEach : true,
        after: true,
        describe: true,

        angular: true,
        RegisterCtrl: true,
        LoginCtrl: true,
        ModalCtrl: true,
        $location: true,
        $: true
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-simple-mocha');
  // Default task.
  // grunt.registerTask('default', 'lint qunit concat min');
  grunt.registerTask('default', 'lint simplemocha');

};
