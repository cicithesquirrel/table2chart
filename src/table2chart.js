define('table2chart', function () {
    "use strict";

    var DATA_TYPE_IGNORE = 'ignore';

    function tableDomAdapter(table) {

        if (table.tagName.toLowerCase() !== 'table') {
            throw Error('Data source must be a table');
        }

        var domCaption, domTBody, domTHead;

        for (var i = 0; i < table.children.length; i++) {
            var child = table.children[i];
            if (child.tagName.toLowerCase() === 'caption') domCaption = child;
            if (child.tagName.toLowerCase() === 'tbody') domTBody = child;
            if (child.tagName.toLowerCase() === 'thead') domTHead = child;
        }
        if (!domTBody) throw Error('table has no "tbody" child');
        if (!domTHead) throw Error('table has no "thead" child');
        if (!domCaption) console.log('table has no "caption" child');

        return {
            getCaption: function () {
                if (domCaption) return domCaption.textContent;
                return null;
            },
            __getHeaderLine: function () {
                return domTHead.children[0];
            },
            __getLine: function (index) {
                return domTBody.children[index];
            },
            getColumnCount: function () {
                return this.__getHeaderLine().childElementCount;
            },
            getLineCount: function () {
                return domTBody.childElementCount;
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

            toGoogleDataTable: function () {
                var googleDataTable = new google.visualization.DataTable();

                var converters = [];

                var columnIndex;

                for (columnIndex = 0; columnIndex < this.getColumnCount(); columnIndex++) {

                    var cell = this.getHeaderCell(columnIndex);
                    if (cell.dataType !== DATA_TYPE_IGNORE) {
                        googleDataTable.addColumn(cell.dataType, cell.label);
                    }
                }

                for (var lineIndex = 0; lineIndex < this.getLineCount(); lineIndex++) {

                    var googleDataLine = [];

                    for (columnIndex = 0; columnIndex < this.getColumnCount(); columnIndex++) {

                        var headerCell = this.getHeaderCell(columnIndex);
                        if (headerCell.dataType !== DATA_TYPE_IGNORE) {
                            var cellData = this.getDataCell(lineIndex, columnIndex);
                            googleDataLine.push(cellData);
                        }


                    }

                    googleDataTable.addRows([googleDataLine]);
                }

                return googleDataTable;
            }
        };
    }

    function applySize(on) {
        var sizeAsString = on.getAttribute('data-t2c-size');
        if (sizeAsString) {
            var dim = sizeAsString.split('x');
            if (dim && dim.length === 2) {
                on.style.width = dim[0];
                on.style.height = dim[1];
            }
        }
    }


    function getGoogleOptions(on) {
        var optAsString = on.getAttribute('data-t2c-options');
        //console.log(optAsString);
        if (optAsString) {
            try {
                return JSON.parse(optAsString);
            } catch (err) {
                throw Error('Invalid JSON options: ' + optAsString);
            }
        }
        return undefined;
    }

    return {

        apply: function (placeholder, table) {

            if (!table) table = placeholder;

            var tableId = placeholder.getAttribute('data-t2c-source');

            if (tableId) table = document.getElementById(tableId);

            var kindId = placeholder.getAttribute('data-t2c');

            if (!google.visualization[kindId]) {
                throw Error('Unknown Chart kind: ' + kindId);
            }

            var tableAdapter = tableDomAdapter(table);

            var data = tableAdapter.toGoogleDataTable();

            applySize(placeholder);

            var options = getGoogleOptions(placeholder) || {};

            if (!options.title) {
                var caption = tableAdapter.getCaption();
                if (caption) options.title = caption;
            }

            var chart = new google.visualization[kindId](placeholder);
            chart.draw(data, options);
        }
    };
});
