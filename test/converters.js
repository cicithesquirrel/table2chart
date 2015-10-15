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

    it('string', function () {
        test.string(t2c.converters.string('some string')).is('some string');
    });

    it('string is empty', function () {
        test.string(t2c.converters.string('')).is('');
    });

    it('number is integer', function () {
        test.number(t2c.converters.number('123')).is(123);
    });

    it('number is float', function () {
        test.number(t2c.converters.number('123.45')).is(123.45);
    });

    it('number is undefined', function () {
        test.undefined(t2c.converters.number(''));
    });

    it('number is undefined with spaces', function () {
        test.undefined(t2c.converters.number('  '));
    });

    it('number is undefined with letters', function () {
        console.log(t2c.converters.number('abc'));
        test.undefined(t2c.converters.number('abc'));
    });

});
