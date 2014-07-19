'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');
var raptorTemplates = require('../');
var through = require('through');

describe('raptor-templates/api' , function() {

    before(function() {
        require('../compiler').defaultOptions.checkUpToDate = false;
    });

    beforeEach(function(done) {

        done();
    });

    it('should allow a template to be rendered using a callback', function(done) {
        raptorTemplates.render(
            nodePath.join(__dirname, 'test-project/hello.rhtml'),
            {
                name: 'John'
            },
            function(err, output) {
                if (err) {
                    return done(err);
                }

                expect(output).to.equal('Hello John!');
                done();
            });
    });

    it('should allow a template to be rendered to a context wrapping a string builder', function(done) {
        var context = raptorTemplates.createContext();
        context
            .on('end', function() {
                expect(context.getOutput()).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });

        raptorTemplates.render(
            nodePath.join(__dirname, 'test-project/hello.rhtml'),
            {
                name: 'John'
            },
            context);

        context.end();
    });

    it('should allow a template to be rendered to a context wrapping a stream', function(done) {
        var output = '';

        var stream = through(function write(data) {
            output += data;
        });

        var context = raptorTemplates.createContext(stream);
        context
            .on('end', function() {
                expect(output).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });

        raptorTemplates.render(
            nodePath.join(__dirname, 'test-project/hello.rhtml'),
            {
                name: 'John'
            },
            context);

        context.end();
    });

    it('should allow a template to be rendered to a stream', function(done) {
        

        var output = '';
        var outStream = through(function write(data) {
                output += data;
            });


        raptorTemplates.stream(
            nodePath.join(__dirname, 'test-project/hello.rhtml'),
            {
                name: 'John'
            })
            .pipe(outStream)
            .on('end', function() {
                expect(output).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });
    });


    /// TEMPLATE LOADING:

    it('should allow a template to be loaded and rendered using a callback', function(done) {
        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello.rhtml'));
        template.render({
                name: 'John'
            },
            function(err, output) {
                if (err) {
                    return done(err);
                }

                expect(output).to.equal('Hello John!');
                done();
            });
    });

    it('should allow a template to be loaded and rendered to a context wrapping a string builder', function(done) {
        var context = raptorTemplates.createContext();
        context
            .on('end', function() {
                expect(context.getOutput()).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });

        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello.rhtml'));
        template.render({
                name: 'John'
            },
            context);

        context.end();
    });

    it('should allow a template to be loaded and rendered to a context wrapping a stream', function(done) {

        var output = '';

        var stream = through(function write(data) {
            output += data;
        });

        var context = raptorTemplates.createContext(stream);
        context
            .on('end', function() {
                expect(output).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });

        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello.rhtml'));
        template.render({
                name: 'John'
            },
            context);

        context.end();
    });

    it('should allow a template to be loaded and rendered to a stream', function(done) {
        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello.rhtml'));

        var output = '';
        var outStream = through(function write(data) {
                output += data;
            });


        template.stream({
                name: 'John'
            })
            .pipe(outStream)
            .on('end', function() {
                expect(output).to.equal('Hello John!');
                done();
            })
            .on('error', function(e) {
                done(e);
            });
    });

    it('should allow a template to be rendered to a string synchronously using renderSync', function() {
        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello.rhtml'));
        var output = template.renderSync({ name: 'John' });
        expect(output).to.equal('Hello John!');
    });

    it('should throw an error if beginAsync is used with renderSync', function() {
        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello-async.rhtml'));
        var output;
        var e;

        try {
            output = template.renderSync({
                nameDataProvider: function(arg, callback) {
                    setTimeout(function() {
                        callback(null, 'John');
                    }, 100);
                }
            });
        } catch(_e) {
            e = _e;
        }

        expect(output).to.equal(undefined);
        expect(e).to.not.equal(undefined);
    });

    it('should throw errors correctly with renderSync', function() {
        var template = raptorTemplates.load(nodePath.join(__dirname, 'test-project/hello-error.rhtml'));
        var output;
        var e;

        try {
            output = template.renderSync();
        } catch(_e) {
            e = _e;
        }

        expect(output).to.equal(undefined);
        expect(e).to.not.equal(undefined);
    });

});
