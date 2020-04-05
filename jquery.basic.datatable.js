// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    "use strict";

    // Create the defaults
    var pluginName = "basicDataTable",
        defaults = {
            data: [],
            formatters: {}
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        
        this.$element = $(element);

        this.$table = this.$element.find("table");

        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        if (options.loadOnly)
            this.renderLoadingPanel();
        else
            this.init();

    }

    $.extend(Plugin.prototype, {
        init: function () {

            //show loading panel
            this.renderLoadingPanel();
            //clear out existing table
            this.clear();
            //append rows from data
            this.renderDataRows();
            //show table
            this.removeLoadingPanel();
        },

        renderEmptyRow: function () {
            var $tbody = this.$table.find("tbody");
            $tbody.html("");
            var $th = this.$table.find("thead tr th");
            $tbody.append("<tr><td class='text-center' colspan='" + $th.length + "'>No results</td></tr>");
        },

        renderRow: function (row, $tbody, $th) {
            var allCells = "";
            for (var j = 0; j < $th.length; j++) {
                var formatterDelegate = null;
                var newCell = "";
                var $header = $($th[j]);
                var dataField = $header.attr("data-field");
                var formatter = $header.attr("data-formatter");

                if (dataField) {
                    if (formatter) {
                        // find object
                        var formatterDelegate = this.settings.formatters[formatter];

                        // is object a function?
                        if (typeof formatterDelegate === "function") {
                            newCell = formatterDelegate(row[dataField], row, dataField);
                        }
                    }
                    else {
                        newCell = row[dataField];
                    }
                }

                allCells += "<td>" + newCell + "</td>";
            }
            $tbody.append("<tr>" + allCells + "</tr>")
        },

        renderDataRows: function () {

            var $tbody = this.$table.find("tbody");
            var $th = this.$table.find("thead tr th");

            if (this.settings.data && this.settings.data.length && this.settings.data.length > 0) {

                for (var i = 0; i < this.settings.data.length; i++) {
                    this.renderRow(this.settings.data[i], $tbody, $th);
                }
            }
            else {
                this.renderEmptyRow();
            }
        },

        renderLoadingPanel: function () {
            var $div = this.$element.find("> div");
            //setting display to none speeds up loading because
            //the browser won't be forced to re-render every time row is added.
            this.$table.css("display", "none");
            $div.css("display", "");
        },

        removeLoadingPanel: function () {
            var $div = this.$element.find("> div");
            $div.css("display", "none");
            this.$table.css("display", "table");
        },

        reload: function (data) {

            this.settings.data = data;
            this.init();

        },

        clear: function () {
            this.$table.find("tbody").detach();
            this.$table.append($('<tbody></tbody>'));
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    $.fn[pluginName] = function (options) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {

                // Only allow the plugin to be instantiated once,
                // so we check that the element has no plugin instantiation yet
                if (!$.data(this, 'plugin_' + pluginName)) {

                    // if it has no instance, create a new one,
                    // pass options to our plugin constructor,
                    // and store the plugin instance
                    // in the elements jQuery data object.
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });

            // If the first parameter is a string and it doesn't start
            // with an underscore or "contains" the `init`-function,
            // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }

                // Allow instances to be destroyed via the 'destroy' method
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });

            // If the earlier cached method
            // gives a value back return the value,
            // otherwise return this to preserve chainability.
            return returns !== undefined ? returns : this;
        }
    };

})(jQuery, window, document);
