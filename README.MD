 * JQUERY basic datatable plugin:  Bare bones but highly optimized loading of large tables and databinding with custom formatters, requires JQUERY, supports some lite versions of jquery:

        <script>
            $(function() {
                $("#testTable").basicDataTable(
                    {
                        data: [{col1:"test1", col2:"test2"}],
                        formatters:{boldFormatter: function(value, row){return "<b>"+value+"</b>"}}
                    });
            });

            //to call api methods:
            $("#testTable").basicDataTable('reload', [{col1:"test1", col2:"test2"}]);

        </script>
        
        <div id="test-databound-table">
            <table>
                <thead><tr><th data-field="col1" data-formatter="boldFormatter">col1</th><th data-field="col2">col2</th></tr></thead>
                <tbody></tbody>
            </table>
            <div rel="loading-panel">
                loading...
            </div>
        </div>

