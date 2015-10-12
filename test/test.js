require.config({
    baseUrl: '../src',
    paths: {
        "jquery": "../bower_components/jquery/dist/jquery"
    }
});

require(['table2chart', 'jquery'],
    function (t2c, $) {
        // on-load, apply charting
        $(function () {
            $('[data-t2c]').each(function (indexInArray, o) {
                t2c.apply(o);
            });
        });
    });
