require.config({
    baseUrl: '../src',
    /*paths: {
    'jquery': '../bower_components/jquery/dist/jquery.js'
    }*/
});

require(['table2chart'],
    function (t2c) {
        $(function () {
            $('table[data-t2c]').each(function (indexInArray, table) {
                t2c.apply(table);
            });
        });
    });
