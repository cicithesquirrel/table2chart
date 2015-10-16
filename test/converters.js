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
            test.string(t2c.converters.string('   ')).is('');
        });
    });

    describe('number', function () {
        it('Convert integer', function () {
            test.number(t2c.converters.number('123')).is(123);
        });

        it('Convert negative integer', function () {
            test.number(t2c.converters.number('-123')).is(-123);
        });

        it('Convert float', function () {
            test.number(t2c.converters.number('123.45')).is(123.45);
        });

        it('Convert negative float', function () {
            test.number(t2c.converters.number('-123.45')).is(-123.45);
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

        it('Convert valid value with spaces', function () {
            test.number(t2c.converters.number(' 123 ')).is(123);
        });

        it('Convert value with spaces inside to undefined', function () {
            test.undefined(t2c.converters.number(' 1 2 3 '));
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

        it('Convert valid value with spaces', function () {
            test.array(t2c.converters.timeofday(' 1:2:3.4 ')).is([1, 2, 3, 4]);
        });
    });

    describe('boolean', function () {
        it('Convert "true"', function () {
            test.bool(t2c.converters.boolean('tRuE')).isTrue();
        });

        it('Convert "yes"', function () {
            test.bool(t2c.converters.boolean('yEs')).isTrue();
        });

        it('Convert "on"', function () {
            test.bool(t2c.converters.boolean('oN')).isTrue();
        });

        it('Convert "false"', function () {
            test.bool(t2c.converters.boolean('fAlSe')).isFalse();
        });

        it('Convert "no"', function () {
            test.bool(t2c.converters.boolean('nO')).isFalse();
        });

        it('Convert "off"', function () {
            test.bool(t2c.converters.boolean('oFf')).isFalse();
        });

        it('Convert empty string to undefined', function () {
            test.undefined(t2c.converters.boolean(''));
        });

        it('Convert spaces to undefined', function () {
            test.undefined(t2c.converters.boolean('  '));
        });

        it('Convert unspecified value to undefined', function () {
            test.undefined(t2c.converters.boolean('sdfjkyt'));
        });
    });

    describe('date', function () {
        it('Accept valid date in ISO 8601', function () {
            test.date(t2c.converters.date('2015-03-25')).is(new Date('2015-03-25'));
        });

        it('Accept valid date in ISO 8601 with hour', function () {
            test.date(t2c.converters.date('2015-03-25T11:22:33.444Z')).is(new Date(Date.parse('2015-03-25')));
        });

        it('Accept valid date in millis', function () {
            test.date(t2c.converters.date('1444929318525')).is(new Date(Date.parse('2015-10-15')));
        });

        it('Convert empty string to undefined', function () {
            test.undefined(t2c.converters.date(''));
        });

        it('Convert spaces to undefined', function () {
            test.undefined(t2c.converters.date('  '));
        });
    });

    describe('datetime', function () {
        it('Accept valid datetime in ISO 8601 with hour', function () {
            test.date(t2c.converters.datetime('2015-03-25T23:45:01.03Z')).is(new Date(Date.parse('2015-03-25T23:45:01.030Z')));
        });

        it('Accept valid datetime in ISO 8601 without hour', function () {
            test.date(t2c.converters.datetime('2015-03-25')).is(new Date(Date.parse('2015-03-25T00:00:00.000Z')));
        });

        it('Accept valid date in millis', function () {
            test.date(t2c.converters.datetime('1444929318525')).is(new Date(Date.parse('2015-10-15T17:15:18.525Z')));
        });

        it('Convert empty string to undefined', function () {
            test.undefined(t2c.converters.datetime(''));
        });

        it('Convert spaces to undefined', function () {
            test.undefined(t2c.converters.datetime('  '));
        });
    });
});
