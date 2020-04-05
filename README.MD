 * JQUERY basic datatable plugin:  supports efficient loading of large tables by passing array of objects:

        <script>
            $(function() {
                $("#testTable").basicDataTable(
                    {
                        data: [{col1:"test1", col2:"test2"}],
                        formatters:{boldFormatter: function(value, row){return "<b>"+value+"</b>"}}
                    });
            });

            //to call public function:
            $("#testTable").basicDataTable('reload', [{col1:"test1", col2:"test2"}]);

        </script>
        //html:
        <div id="testTable">
            <table>
                <thead><tr><th data-field="col1" data-formatter="boldFormatter">col1</th><th data-field="col2">col2</th></tr></thead>
                <tbody></tbody>
            </table>
            <div rel="loading panel" style ="background-color:#333333;padding-top: 20%;text-align: center;min-height: 200px;width: 100%; border: 1px solid #999999;">
                <i class="fa fa-spin fa-spinner fa-2x" style="color:white;"></i>
            </div>
        </div>

