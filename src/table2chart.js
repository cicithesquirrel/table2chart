define('table2chart', function () {
    "use strict";

    var me = {};

    function isNotEmpty(val) {
        return val && val.trim() !== '';
    }

    me.converters = {
        // TODO handle i18n conversions
        "number": function (val) {
            var retval;
            if (isNotEmpty(val)) {
                val = val.trim();
                var m = val.match(/^-?(\d+(.\d+))$/);
                if (m) {
                    retval = parseFloat(val.trim());
                }
            }
            return retval;
        },
        "string": function (val) {
            return val.trim();
        },
        "date": function (val) {
            var retval = me.converters.datetime(val);
            if (retval) {
                retval.setUTCHours(0);
                retval.setUTCMinutes(0);
                retval.setUTCSeconds(0);
                retval.setUTCMilliseconds(0);
            }
            return retval;
        },
        "datetime": function (val) {
            var retval;
            if (isNotEmpty(val)) {
                val = val.trim();
                var m = val.match(/^\d+$/);
                if (m) {
                    val = parseInt(val);
                } else {
                    val = Date.parse(val);
                }
                retval = new Date(val);
            }
            return retval;
        },
        "timeofday": function (val) {
            var retval;
            if (isNotEmpty(val)) {
                val = val.trim();
                var m = val.match(/^(\d{1,2}):(\d{1,2})(:(\d{1,2})(\.(\d{1,3}))?)?$/);
                if (m) {
                    retval = [parseInt(m[1]), parseInt(m[2])];
                    if (m[4]) retval.push(parseInt(m[4]));
                    else retval.push(0);
                    if (m[6]) retval.push(parseInt(m[6]));
                }
            }
            return retval;

        },
        "boolean": function (val) {
            var retval;
            if (isNotEmpty(val)) {
                var lower = val.trim().toLowerCase();
                if (lower === 'true' ||
                    lower === 'yes' ||
                    lower === 'on') {
                    retval = true;
                } else if (lower === 'false' ||
                    lower === 'no' ||
                    lower === 'off') {
                    retval = false;
                }
            }
            return retval;
        }
    };

    // TODO replace the 'ignore' datatype with an option on the placeholder
    me.DATA_TYPE_IGNORE = 'ignore';

    function tableDomAdapter(table) {

        if (table.tagName.toLowerCase() !== 'table') {
            throw Error('Data source must be a table');
        }

        function getTableComponent(table) {
            var tableComponents = {};
            for (var i = 0; i < table.children.length; i++) {
                var child = table.children[i];
                if (child.tagName.toLowerCase() === 'caption') tableComponents.caption = child;
                if (child.tagName.toLowerCase() === 'tbody') tableComponents.tbody = child;
                if (child.tagName.toLowerCase() === 'thead') tableComponents.thead = child;
            }

            if (!tableComponents.tbody) throw Error('table has no "tbody" child');
            if (!tableComponents.thead) throw Error('table has no "thead" child');
            if (!tableComponents.caption) console.log('table has no "caption" child');

            return tableComponents;
        }

        return {
            tableComponents: getTableComponent(table),

            getCaption: function () {
                if (this.tableComponents.caption) return this.tableComponents.caption.textContent;
                return null;
            },
            __getHeaderLine: function () {
                return this.tableComponents.thead.children[0];
            },
            __getLine: function (index) {
                return this.tableComponents.tbody.children[index];
            },
            getColumnCount: function () {
                return this.__getHeaderLine().childElementCount;
            },
            getLineCount: function () {
                return this.tableComponents.tbody.childElementCount;
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
                    var dim = sizeAsString.split(';');
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

                return wrapper;
            }
        };
    }

    me.drawGoogleChart = function (placeholder, table) {

        var placeholderAdapter = placeholderDomAdapter(placeholder);

        return placeholderAdapter.drawGoogleChart(table);
    };

    return me;
});
