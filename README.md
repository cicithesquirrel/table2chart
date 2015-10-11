# table2chart

Builds [Google Chart](https://developers.google.com/chart/) from simple HTML tables.

# Usage

  * Add [RequireJS](http://www.requirejs.org/) if you do not already have
  * Add a few _table2chart_ options on the table via the `data-t2c-*` attributes
  * Add a `div` as the chart placeholder (optional)
  * Execute `table2chart.apply(placeholder, table)` when the page is fully loaded
  
Want to know more? Have a look to the HTML files inside the `test` folder!

# What is missing

The following does not work:
  * Other data types than `string` and `number` (e.g. `date`)
  * Internationalized data formatting in the table
  * Ignoring some columns
