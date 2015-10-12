# table2chart

Builds [Google Chart](https://developers.google.com/chart/) from simple HTML tables.

# Usage

  * Add [RequireJS](http://www.requirejs.org/) if you do not already have
  * Add a `caption` to your `table` if you want a title to the chart. Add a `thead` and `tbody` to your table to separate headers from data lines. `tfooter` will be ignored.
  * Add a `data-t2c-datatype` attribute on each column header (`/table/thead/tr/td@data-t2c-datatype`). Values allowed are:
    * `string`: Labels, default value for first column
    * `number`: Numeric value (_integer_ or _float_), default value for all columns except the first
    * `boolean`: Boolean value (_true_, _yes_, _on_ meaning `true`, others meaning `false`)
    * `ignore`: Marker to indicate that value should not appear in the chart
  * Add a `div` (or any other element that suits you) as the chart placeholder with the following attributes:
    * `data-t2c`: Chart type, name of the `google.visualization` method to call (see [Google Chart](https://developers.google.com/chart/) for possible values)
    * `data-t2c-source`: (Optional) ID of the table in page DOM
    * `data-t2c-size`: (Optional) Size of the chart (e.g. `100%x900` for `width:100%;height:900`). When not defined, [Google Chart](https://developers.google.com/chart/) will use the size of the placeholder
    * `data-t2c-options`: (Optional) JSON options for [Google Chart](https://developers.google.com/chart/). Defaults to empty object `{}`. As JSON syntax imposes the use of `"` (_double quotes_) for property names and string values, this attribute should be put between `'` (_single quotes_). See [Google Chart](https://developers.google.com/chart/) for available options for the chart type that you chose.
  * Add JavaScript that, when the page is fully loaded, calls `table2chart.apply(placeholder, table)`, passing the DOM elements of the placeholder and the table. The second arg is optional:
    * If the placeholder is the table (not recommended as it will "break" HTML syntax)
    * If the placeholder has the `data-t2c-source` attribute
  
Want to know more? Have a look to the HTML files inside the `test` folder!

# What is missing

The following does not work:
  * Data types `date`, `datetime`, `timeofday`
  * Internationalized data formatting in the table
