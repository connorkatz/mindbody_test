'use strict';

// =======================
// Model -- Get Data
// =======================
function appModel() {
    var programsData;
    var pricingData;
    var activeItemsPricingData;
    $.when(
        $.getJSON('https://api.myjson.com/bins/5bdb3', function(data) {
            programsData = data;
        }),
        $.getJSON('https://api.myjson.com/bins/47axv', function(data) {
            pricingData = data;
        }),
        $.getJSON('https://api.myjson.com/bins/17oy7', function(data) {
            activeItemsPricingData = data;
        })
    ).then(function() {
        var rawData = {programs: programsData, pricing: pricingData, activeItemsPricing: activeItemsPricingData}

        appViewModel(rawData);

    });
}