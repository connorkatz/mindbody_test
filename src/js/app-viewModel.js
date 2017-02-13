'use strict';

// ===============================
// Data -- Processing
// ===============================
function processRawData(rawData) {

    // get numbuer of Visible Programs
    var numUniqueActiveIDs = getUniqueIDCount(rawData.activeItemsPricing, 'ProgramID');
    var i = 0;
    $.each(rawData.programs, function() {
        var programID = this.ProgramID;
        var programItemPricing = [];

        // get matching pricing objects
        $.each(rawData.pricing, function() {
            if(programID === this.ProgramID) {
                programItemPricing.push(this);
            }
        });

        // add matching pricing objects to {program}
        this.ProgramPricingDetails = programItemPricing;

        // add Visibility propery to {program}
        if(i < numUniqueActiveIDs) {
            this.Visible = true;
        }
        else {
            this.Visible = false;
        }
        i++;
    });
    delete rawData.pricing;
    delete rawData.activeItemsPricing;
    var appData = rawData;

    renderTemplates(appData);
}

// ===============================
// Data -- Helpers
// ===============================
function getUniqueIDCount(object, key) {
    var uniqueIDs = [];
    var itemID = 0;
    $.each(object, function() {
        itemID = this[key];
        if($.inArray(itemID, uniqueIDs) == -1) {
            uniqueIDs.push(itemID);
        }
    });
    return uniqueIDs.length;
}