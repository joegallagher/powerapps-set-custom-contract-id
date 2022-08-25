var contractLibrary = window.Sdk || {};

(function () {

    this.updateContractForm = function(executionContext, contractId) {
        
        var formContext = executionContext.getFormContext();
        formContext.getAttribute("new_contract").setValue(contractId);    


    }

    this.repairId = function(executionContext) {
        var today = new Date();
        var day = today.getDate().toString();
        if(day.length == 1) {
            day = "0" + day;
        }
        var month = (today.getMonth()+1).toString();
        if(month.length == 1) {
            month = "0" + month;
        }

        var year = today.getFullYear().toString();
        year = year.slice(-2);

        var dateString = day + month + year; 
        console.log(dateString);

        setRepairId(executionContext, dateString);

    }



    var setRepairId = function(executionContext, dateString) {
        return Xrm.WebApi.retrieveMultipleRecords("new_repaircontract", "?$select=new_contract&$filter=startswith(new_contract,'$dateString') and statecode eq 0&$orderby=new_contract desc".replace("$dateString", dateString)).then(
            function success(result) {
                var finalDatestring = dateString;
                console.log(result.entities.length)

                if (result.entities.length == 0)
                {
                    finalDatestring = finalDatestring + "-1"
                }
                else  {
                    var latestId = result.entities[0].new_contract;
                    latestId = latestId.slice(-1);
                    var latestIdInt = parseInt(latestId, 10);
                    latestIdInt += 1;
                    latestId = latestIdInt.toString();
                    finalDatestring = finalDatestring + "-" + latestId;
                }

                var formContext = executionContext.getFormContext();
                if (formContext.getAttribute("new_contract").getValue() == null) {
                    formContext.getAttribute("new_contract").setValue(finalDatestring);
                }

            },
            function (error) {
                console.log(error.message); 
            }
        );
        
        
    }

    this.contractId = function(executionContext,dateString) {
        return Xrm.WebApi.retrieveMultipleRecords("new_contract", "?$select=new_contract&$filter=statecode eq 0&$orderby=new_contract desc").then(
            function success(result) {
                console.log(result)
        
                var latestRecord = result.entities[0];
                var latestContractId = latestRecord.new_contract;  
                var latestContractInt = parseInt(latestContractId, 10);
                latestContractInt += 1; 
                latestContractId = latestContractInt.toString();
                console.log(typeof(latestContractId));
                var formContext = executionContext.getFormContext();

                if (formContext.getAttribute("new_contract").getValue() == null) {
                    formContext.getAttribute("new_contract").setValue(latestContractId);
                } 
            },
            function (error) {
                console.log(error.message);
            }
        );
    }

}).call(contractLibrary);