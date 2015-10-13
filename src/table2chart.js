define('table2chart', function () {
    "use strict";

    var me = {};

    me.converters = {
        // TODO handle i18n conversions
        "number": function (val) {
            return parseFloat(val);
        },
        "string": function (val) {
            return val;
        },
        "date": function (val) {
            var d = me.converters.datetime(val);
            // only keep date
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());

        },
        "datetime": function (val) {
            return new Date(val);

        },
        "timeofday": function (val) {
            var m = val.match(/^(\d\d?):(\d\d?):(\d\d?)(\.(\d\d?\d?))?$/);
            if (m.length !== 5 && m.length !== 6) {
                throw Error('Bad timeofday value: ' + val);
            }
            var retval = [m[1], m[2], m[3]];
            if (m.length > 5 && m[5]) retval.push(m[5]);
            return retval;

        },
        "boolean": function (val) {
            if (val &&
                (val.toLowerCase() === 'true' ||
                    val.toLowerCase() === 'yes' ||
                    val.toLowerCase() === 'on')) {
                return true;
            }
            return false;
        }
    };

    // TODO replace the 'ignore' datatype with an option on the placeholder
    me.DATA_TYPE_IGNORE = 'ignore';

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

                if (!cell.dataType) {
                    if (index === 0) cell.dataType = 'string';
                    else cell.dataType = 'number';
                }

                if (cell.dataType && me.converters[cell.dataType]) {
                    cell.converter = me.converters[cell.dataType];
                } else {
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
                    if (cell.dataType !== me.DATA_TYPE_IGNORE) {
                        googleDataTable.addColumn(cell.dataType, cell.label);
                    }
                }

                for (var lineIndex = 0; lineIndex < this.getLineCount(); lineIndex++) {

                    var googleDataLine = [];

                    for (columnIndex = 0; columnIndex < this.getColumnCount(); columnIndex++) {

                        var headerCell = this.getHeaderCell(columnIndex);
                        if (headerCell.dataType !== me.DATA_TYPE_IGNORE) {
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

    function placeholderDomAdapter(placeholder) {
        return {
            applySize: function () {
                var sizeAsString = placeholder.getAttribute('data-t2c-size');
                if (sizeAsString) {
                    var dim = sizeAsString.split('x');
                    if (dim && dim.length === 2) {
                        placeholder.style.width = dim[0];
                        placeholder.style.height = dim[1];
                    }
                }
            },

            getGoogleOptions: function (tableAdapter) {


                var options = {};

                var optAsString = placeholder.getAttribute('data-t2c-options');
                //console.log(optAsString);
                if (optAsString) {
                    try {
                        options = JSON.parse(optAsString);
                    } catch (err) {
                        throw Error('Invalid JSON options: ' + optAsString);
                    }
                }

                if (!options.title) {
                    var caption = tableAdapter.getCaption();
                    if (caption) options.title = caption;
                }

                return options;
            },

            getTableAdapter: function (table) {
                if (!table) table = placeholder;

                var tableId = placeholder.getAttribute('data-t2c-source');

                if (tableId) table = document.getElementById(tableId);

                var tableAdapter = tableDomAdapter(table);

                return tableAdapter;
            },

            drawGoogleChart: function (table) {
                var kindId = placeholder.getAttribute('data-t2c');

                if (!google.visualization[kindId]) {
                    throw Error('Unknown Chart kind: ' + kindId);
                }

                var tableAdapter = this.getTableAdapter(table);

                var data = tableAdapter.toGoogleDataTable();

                this.applySize();

                var options = this.getGoogleOptions(tableAdapter);

                var wrapper = new google.visualization.ChartWrapper({
                    'chartType': kindId,
                    'dataTable': data,
                    'options': options,
                    'containerId': placeholder
                });
                wrapper.draw();
            }
        };
    }

    me.drawGoogleChart = function (placeholder, table) {

        var placeholderAdapter = placeholderDomAdapter(placeholder);

        placeholderAdapter.drawGoogleChart(table);
    };

    return me;
});
