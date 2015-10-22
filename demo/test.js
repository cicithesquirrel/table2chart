/* This the config for requirejs in this project */
require.config({
    baseUrl: '../src',
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery"
    }
});

/* Load table2chart. JQuery is needed *only* for drawing the chart after the page is fully loaded. */
require(['table2chart', 'jquery'],
    function (t2c, $) {
        // on-load, apply charting
        $(function () {
            $('[data-t2c]').each(function (indexInArray, o) {
                t2c.drawGoogleChart(o);
            });
        });
    });
