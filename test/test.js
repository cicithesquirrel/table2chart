require.config({
    baseUrl: '../src'
});

require(['table2chart'],
    function (t2c) {
        $(function () {
            $('[data-t2c]').each(function (indexInArray, o) {
                t2c.apply(o);
            });
        });
    });
