/* jshint node: true */
/* globals describe, it */
"use strict";

var requirejs = require('requirejs');
requirejs.config({
    "baseUrl": "src"
});
var test = require('unit.js');
var t2c = requirejs('table2chart');

describe('"converters" tests', function () {

    describe('string', function () {
        it('Accept valid string', function () {
            test.string(t2c.converters.string('some string')).is('some string');
        });

        it('Accept empty string', function () {
            test.string(t2c.converters.string('')).is('');
        });

        it('Accept spaces', function () {
            test.string(t2c.converters.string('   ')).is('   ');
        });
    });

    describe('number', function () {
        it('Convert integer', function () {
            test.number(t2c.converters.number('123')).is(123);
        });

        it('Convert float', function () {
            test.number(t2c.converters.number('123.45')).is(123.45);
        });

        it('Convert empty string to undefined', function () {
            test.undefined(t2c.converters.number(''));
        });

        it('Convert spaces to undefined', function () {
            test.undefined(t2c.converters.number('  '));
        });

        it('Convert letters to undefined', function () {
            test.undefined(t2c.converters.number('abc'));
        });
    });

    describe('timeofday', function () {
        it('Convert hour without millis', function () {
            test.array(t2c.converters.timeofday('1:2:3')).is([1, 2, 3]);
        });

        it('Convert hour with millis', function () {
            test.array(t2c.converters.timeofday('1:2:3.4')).is([1, 2, 3, 4]);
        });

        it('Convert hour without seconds', function () {
            test.array(t2c.converters.timeofday('1:2')).is([1, 2, 0]);
        });

        it('Convert invalid string to undefined', function () {
            test.undefined(t2c.converters.timeofday('00::'));
        });

        it('Convert letters to undefined', function () {
            test.undefined(t2c.converters.timeofday('abc'));
        });

        it('Convert empty string to undefined', function () {
            test.undefined(t2c.converters.timeofday(''));
        });

        it('Convert spaces to undefined', function () {
            test.undefined(t2c.converters.timeofday('  '));
        });
    });
});
