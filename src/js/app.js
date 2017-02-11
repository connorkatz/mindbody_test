'use strict';

// =======================
// Get data
// =======================
function getData() {
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
        processRawData(rawData);
    });
}


// ===============================
// Process Data
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

        // add Visibility propery to {program
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

    console.log(appData);

    renderTemplate(appData);
}


// ===============================
// Render Template Blocks
// ===============================
function renderTemplate(appData) {
    var template = Handlebars.compile($('#program_item_template').html());
    Handlebars.registerHelper("formatCurrency", function(number) {
        var numDollars = number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        return '$' + numDollars;
    });
    var output = template(appData);
    $('#program_items_container_block').html(output);
}


// ===============================
// Data Utility Functions
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

// =======================
// UI Functions
// =======================

// add class active
function activateBlock(block) {
    block.addClass('active');
}

// remove class active
function deactivateBlock(block) {
    block.removeClass('active');
}

// remove class placeholder
function removePlaceholder(element) {
    element.removeClass('placeholder');
}

// add classPlaceholder
function addPlaceholder(element) {
    element.addClass('placeholder');
}

// toggle sales details
function toggleSalesDetails(element, trigger) {
    var moreText = "more";
    var lessText = "less";
    if(element.hasClass('active')) {
        deactivateBlock(element);
        trigger.text(moreText);
        element.slideUp('fast');
    }
    else {
        activateBlock(element);
        trigger.text(lessText);
        element.slideDown('fast');
    }
}

// toggle active class on multiselect
function toggleMultiselect(element) {
    if(element.hasClass('active')) {
        deactivateBlock(element);
    }
    else {
        activateBlock(element);
    }
}

// count number of checkboxes that are checked
function countNumChecked(checkBoxItems) {
    var numItemsChecked = 0;
    checkBoxItems.each(function() {
        if($(this).prop('checked')) {
            numItemsChecked++;
        }
    });
    return numItemsChecked;
}

// set label of multiselect
function setMultiselectLabel(multiselectItem, defaultText) {
    var checkboxItems = multiselectItem.find('input[type="checkbox"]');
    var multiselectLabel = multiselectItem.children('span');
    var numItemsChecked = countNumChecked(checkboxItems);
    var labelText;
    var labelEndSingular = "Item Selected";
    var labelEndPlural = "Items Selected";
    var stringNumItems = numItemsChecked.toString();
    if(numItemsChecked === 0) {
        labelText = defaultText;
        addPlaceholder(multiselectItem);
    }
    else {
        removePlaceholder(multiselectItem);
        if(numItemsChecked === 1) {
            labelText = stringNumItems + ' ' + labelEndSingular;
        }
        else {
            labelText = stringNumItems + ' ' + labelEndPlural;
        }
    }
    multiselectLabel.text(labelText);
}

// ===============================
// Document Ready
// ===============================
$(document).ready(function() {

    // Get Data and Render Template
    getData();

    // Global .ready Variables
    var defaultMultiselectText = $('.form_multiselect').first().children('span').text();

    // show main nav
    $('#mobile_nav_show').click(function() {
        activateBlock($('#overlay'));
        activateBlock($('#main_nav'));
        return false;
    });

    // hide main nav
    $('#mobile_nav_close').click(function() {
        deactivateBlock($('#main_nav'));
        deactivateBlock($('#overlay'));
        return false;
    });

    // show main nav submenus
    $('.nav_lvl_1 a').click(function() {
        var $link = $(this).parent();
        var $linkSubnav = $link.children('.nav_lvl_2')
        var $navLinks = $('.nav_lvl_1 > li');
        var $subnavLinks = $('.nav_lvl_2');
        $navLinks.each(function() {
            deactivateBlock($(this));
        });
        $subnavLinks.each(function() {
            deactivateBlock($(this));
        });
        activateBlock($link);
        activateBlock($linkSubnav);
        return false;
    });

    // toggle sales details
    $('#program_items_container_block').on('click', '.sales_details_more', function() {
        var $this = $(this);
        var salesDetails = $this.prev();
        toggleSalesDetails(salesDetails, $this);
    });

    // show new program form
    $('#add_new_program').click(function() {
        activateBlock($('#overlay'));
        activateBlock($('#new_program_form'));
        return false;
    });

    // hide new program form
    $('#new_program_form .btn').click(function() {
        deactivateBlock($('#overlay'));
        deactivateBlock($('#new_program_form'));
        return false;
    });

    // remove placeholder style on <select> after change
    $('#new_program_form select').change(function() {
        var $this = $(this);
        if($this.hasClass('placeholder')) {
            removePlaceholder($this);
        }
    });

    // toggle multiselect
    $('.form_multiselect > span').click(function() {
        var multiselectItem = $(this).parent();
        toggleMultiselect(multiselectItem);
    });

    // handled change on multiselect checkbox
    $('.form_multiselect input[type="checkbox"]').change(function() {
        var mulitselectItem = $(this).closest('.form_multiselect');
        setMultiselectLabel(mulitselectItem, defaultMultiselectText);
    });


}); // end document ready
