# table2chart

Have a table? Want a chart? Try this!

[table2chart](https://github.com/cicithesquirrel/table2chart) can build any [Google Chart](https://developers.google.com/chart/) from a simple HTML table.

Well, OK, you'll have to add a few metadata, I'll admit that...

# Usage
## Dumbest 

  1. ["Require"](http://www.requirejs.org/) `table2chart` in your page.
  2. Separate headers from data lines with `thead` and `tbody` elements (that's a common good practice, and should've already done this, no?)
  3. Choose a Chart Type by adding a `data-t2c` attribute (possible values are the name of the `google.visualization` method to call to build the chart, see [Google Chart](https://developers.google.com/chart/))
  3. When the page is loaded (use [JQuery](http://api.jquery.com/ready/) or [Google API](https://developers.google.com/feed/v1/reference#setOnLoadCallback) for this), call `table2chart.drawGoogleChart(table)`

And that's it!

And if this doesn't suit you, well... sorry pal, you fell out of the defaults and you'll have to check out the full options below...

## Full options

  * Start with _dumbest usage_.
  * Want a title? Add a `caption` element to your `table`.
  * You can specify a column datatype with the `data-t2c-datatype` attribute the column header (`/table/thead/tr/td@data-t2c-datatype`). Values allowed are:
    * `string`: Labels, default value for first column;
    * `number`: Numeric value (_integer_ or _float_), default value for all columns except the first;
    * `datetime`: Anything that can be parsed by JS `new Date(string)` (see [W3Schools](http://www.w3schools.com/js/js_date_formats.asp)' tutorial);
    * `date`: Like `datetime` but only date, month and year are kept;
    * `timeofday`: Any string matching the following pattern `^(\d{1,2}):(\d{1,2})(:(\d{1,2})(\.(\d{1,3}))?)?$` (e.g. _23:15:32_ or _23:15:32.652_ or _23:15_);
    * `boolean`: Boolean value (_true_, _yes_, _on_ meaning `true`, others meaning `false`);
    * `ignore`: Stub type to indicate that value should not appear in any chart.
  * You can draw your chart on a any element in the page, not only the table:
    * Add a `div` (or any other element that suits you) as the chart placeholder with the following attributes:
      * `data-t2c`: Chart type, i.e. the name of the `google.visualization` method to call (see [Google Chart](https://developers.google.com/chart/) for possible values);
      * `data-t2c-source`: ID of the table in page DOM;
      * `data-t2c-size`: (Optional) Size of the chart (e.g. `100%x900` for `width:100%;height:900`). When not defined, [Google Chart](https://developers.google.com/chart/) will use the size of the placeholder;
      * `data-t2c-options`: (Optional) [JSON](http://json.org/) options for [Google Chart](https://developers.google.com/chart/):
        * See [Google Chart](https://developers.google.com/chart/) for available options for the chart type that you chose;
        * Defaults to empty object `{}`;
        * As JSON syntax imposes the use of `"` (_double quotes_) for property names and string values, this attribute should be put between `'` (_single quotes_).
    * When the page is fully loaded, call `table2chart.drawGoogleChart(placeholder, table)`.
  
Want to know more? Have a look to the HTML files inside the `demo` folder!

# What is missing

The following does not work:
  * Internationalized data formatting in the table
