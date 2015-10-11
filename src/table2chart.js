define('table2chart', function () {

    function tableDomAdapter(table) {
        return {
            getCaption: function () {
                return table.children[0].textContent;
            },
            applySize: function () {
                var sizeAsString = table.getAttribute('data-t2c-size');
                if (sizeAsString) {
                    var dim = sizeAsString.split('x');
                    if (dim && dim.length === 2) {
                        var currentStyle = table.style;
                        if (!currentStyle) currentStyle = '';
                        table.style = 'width:' + parseInt(dim[0]) + ';height:' + parseInt(dim[1]) + ';' + currentStyle;
                    }
                }
            },
            __getHead: function () {
                return table.children[1];
            },
            __getBody: function () {
                return table.children[2];
            },
            __getHeaderLine: function () {
                return this.__getHead().children[0];
            },
            __getLine: function (index) {
                return this.__getBody().children[index];
            },
            getColumnCount: function () {
                return this.__getHeaderLine().childElementCount;
            },
            getLineCount: function () {
                return this.__getBody().childElementCount;
            },
            getHeaderCell: function (index) {
                var cell = {};

                var domCell = this.__getHeaderLine().children[index];

                cell.label = domCell.textContent;

                cell.dataType = domCell.getAttribute('data-t2c-type');

                if (cell.dataType === 'number') {
                    cell.converter = parseFloat;
                } else if (cell.dataType === 'string') {
                    cell.converter = null;
                } else {
                    //default
                    cell.converter = null;
                }

                return cell;
            },
            getDataCell: function (lineIndex, columnIndex) {
                var header = this.getHeaderCell(columnIndex);
                var line = this.__getLine(lineIndex);
                var td = line.children[columnIndex];
                var retval = td.textContent;
                if (header.converter) {
                    retval = header.converter(retval);
                }
                return retval;
            },

            toGoogleChartDataTable: function () {
                var googleDataTable = new google.visualization.DataTable();

                var converters = [];

                var columnIndex;

                for (columnIndex = 0; columnIndex < this.getColumnCount(); columnIndex++) {

                    var cell = this.getHeaderCell(columnIndex);
                    googleDataTable.addColumn(cell.dataType, cell.label);
                }

                for (var lineIndex = 0; lineIndex < this.getLineCount(); lineIndex++) {

                    var googleDataLine = [];

                    for (columnIndex = 0; columnIndex < this.getColumnCount(); columnIndex++) {
                        var cellData = this.getDataCell(lineIndex, columnIndex);
                        googleDataLine.push(cellData);
                    }

                    googleDataTable.addRows([googleDataLine]);
                }

                return googleDataTable;
            }
        };
    }



    function makeColumnChart(table) {
        var tableAdapter = tableDomAdapter(table);

        //console.log('makeColumnChart: ' + tableAdapter);

        var data = tableAdapter.toGoogleChartDataTable();

        tableAdapter.applySize();

        var options = {
            title: tableAdapter.getCaption(),
            legend: {
                position: 'top',
                maxLines: 3
            },
            bar: {
                groupWidth: '75%'
            },
            isStacked: true,
        };

        var chart = new google.visualization.ColumnChart(table);
        chart.draw(data, options);
    }


    var factories = {
        'ColumnChart': makeColumnChart
    };


    return {
        apply: function (table) {

            var kindId = table.getAttribute('data-t2c');
            var factory = factories[kindId];
            if (!factory) {
                throw Error('Unknown chart kind: ' + kindId);
            }

            factory(table);
        }
    };
});
