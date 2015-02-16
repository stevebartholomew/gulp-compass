'use strict';
var fs = require('fs'),
  compass = require('../lib/compass'),
  path = require('path'),
  iconv = require('iconv-lite');

require('mocha');
require('should');

var read_file = function(filepath) {
  var contents;
  try {
    contents = fs.readFileSync(String(filepath));
    contents = iconv.decode(contents, 'utf-8');
    // Strip any BOM that might exist.
    if (contents.charCodeAt(0) === 0xFEFF) {
      contents = contents.substring(1);
    }
    return contents;
  } catch(e) {
    throw new Error('Unable to read "' + filepath + '" file');
  }
};

describe('gulp-compass plugin', function() {
  describe('compass()', function() {
    var actual, expected;
    this.timeout(60000);

    it('compile scss to css', function(done) {
      compass(path.join(__dirname, 'sass/compile.scss'), {
        project: __dirname,
        style: 'compressed',
        css: 'css',
        sass: 'sass',
        logging: false
      }, function(code, stdout, stderr, new_path) {
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/compile.css');
        actual = read_file(path.join(__dirname, 'css/compile.css'));
        expected = read_file(path.join(__dirname, 'expected/compile.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('compile sass to css', function(done) {
      compass(path.join(__dirname, 'sass/simple.sass'), {
        project: __dirname,
        style: 'compressed',
        css: 'css',
        sass: 'sass',
        logging: false
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/simple.css');
        actual = read_file(path.join(__dirname, 'css/simple.css'));
        expected = read_file(path.join(__dirname, 'expected/simple.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test releate path with config.rb config', function(done) {
      compass(path.join(__dirname, 'sass/base/compile.scss'), {
        project: __dirname,
        config_file: path.join(__dirname, 'config.rb')
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/base/compile.css');
        actual = read_file(path.join(__dirname, 'css/base/compile.css'));
        expected = read_file(path.join(__dirname, 'expected/compile.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test import_path option', function(done) {
      compass(path.join(__dirname, 'sass/import.scss'), {
        project: __dirname,
        style: 'compressed',
        import_path: 'bower_components'
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/import.css');
        actual = read_file(path.join(__dirname, 'css/import.css'));
        expected = read_file(path.join(__dirname, 'expected/import.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test import_path array option', function(done) {
      compass(path.join(__dirname, 'sass/import2.scss'), {
        project: __dirname,
        style: 'compressed',
        import_path: ['bower_components', 'bower_components2']
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/import2.css');
        actual = read_file(path.join(__dirname, 'css/import2.css'));
        expected = read_file(path.join(__dirname, 'expected/import2.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test require option', function(done) {
      compass(path.join(__dirname, 'sass/require.scss'), {
        project: __dirname,
        style: 'compressed',
        require: 'susy'
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/require.css');
        actual = read_file(path.join(__dirname, 'css/require.css'));
        expected = read_file(path.join(__dirname, 'expected/require.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test spriting with compass', function(done) {
      compass(path.join(__dirname, 'sass/spriting.scss'), {
        project: __dirname,
        style: 'compressed',
        css: 'css',
        sass: 'sass',
        image: 'images',
        relative: true
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/spriting.css');
        actual = read_file(path.join(__dirname, 'css/spriting.css'));
        expected = read_file(path.join(__dirname, 'expected/spriting.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test multiple require option', function(done) {
      compass(path.join(__dirname, 'sass/multiple-require.scss'), {
        project: __dirname,
        style: 'compressed',
        require: ['susy', 'modular-scale']
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/multiple-require.css');
        actual = read_file(path.join(__dirname, 'css/multiple-require.css'));
        expected = read_file(path.join(__dirname, 'expected/require.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test environment option', function(done) {
      compass(path.join(__dirname, 'sass/base/compile2.scss'), {
        project: __dirname,
        config_file: path.join(__dirname, 'config.rb'),
        environment: 'development'
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/base/compile2.css');
        actual = read_file(path.join(__dirname, 'css/base/compile2.css'));
        expected = read_file(path.join(__dirname, 'expected/compile2.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('test config_file option and overwrite output style', function(done) {
      compass(path.join(__dirname, 'sass/base/compile3.scss'), {
        project: __dirname,
        config_file: path.join(__dirname, 'config.rb'),
        style: 'expanded'
      }, function(code, stdout, stderr, new_path){
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/base/compile3.css');
        actual = read_file(path.join(__dirname, 'css/base/compile3.css'));
        expected = read_file(path.join(__dirname, 'expected/compile2.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('should normalize ./ paths in sass and css options', function(done) {
      compass(path.join(__dirname, 'sass/simple.sass'), {
        project: __dirname,
        sass: './sass',
        css: './css',
        logging: true
      }, function(code, stdout, stderr, new_path) {
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/simple.css');
        actual = read_file(path.join(__dirname, 'css/simple.css'));
        expected = read_file(path.join(__dirname, 'expected/simple.css'));
        actual.should.equal(expected);
        done();
      });
    });

    it('should allow absolute paths in sass and css options', function(done) {
      compass(path.join(__dirname, 'sass/simple2.sass'), {
        project: __dirname,
        sass: __dirname + '/sass',
        css: __dirname + '/css',
        logging: true
      }, function(code, stdout, stderr, new_path) {
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/simple2.css');
        done();
      });
    });

    it('import a directory’s contents', function(done) {
      compass(path.join(__dirname, 'sass/partial.scss'), {
        project: __dirname,
        config_file: path.join(__dirname, 'config.rb'),
        style: 'compressed',
        css: 'css',
        sass: 'sass',
        logging: false
      }, function(code, stdout, stderr, new_path) {
        code.should.be.equal(0);
        stderr.should.be.empty;
        new_path.should.equal(__dirname + '/css/partial.css');
        actual = read_file(path.join(__dirname, 'css/partial.css'));
        expected = read_file(path.join(__dirname, 'expected/partial.css'));
        actual.should.equal(expected);
        done();
      });
    });

  });
});
