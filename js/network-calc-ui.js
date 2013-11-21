/*===================================================================================================================

    UI CONTROL

  ===================================================================================================================
 */



// Regex to match valid IP addresses
var ip_regex = "\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b";

// Reset the form on reload
$("#calculator")[0].reset();




/**
 * Create the CIDR slider
 */
$("#slider").slider({
    min: 1,
    max: 30,
    slide: function(event, ui) {
    	$(".cidr_calc").val(ui.value);   
    }
});


/**
 * Output the value of the IP address field to the results section
 */
$("#ip_address").keyup(function() {
    var value = $(this).val();
    $("#ip_calc").html(value);
});


/**
 * Output the value of the Netmask field to the results section
 */
$("#mask").keyup(function() {
    var netmask = $(this).val();
    var ip      = $("#ip_address").val();
    $("#mask_calc").html(netmask);

    // if there is a valid netmask populate the results
    if (netmask.match(ip_regex)) {
        var total = getTotalHosts(getCIDR(netmask));
        $("#num_hosts_calc").html(numberWithCommas(total));
        $("#cidr_calc").html(getCIDR(netmask));
        $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
        $("#last_addr_calc").html(getBroadcast(ip, netmask));
        $("#range_calc").html(getRange(ip, netmask));
    }
});


/**
 * Output the value of the slider on the page next to the bar and in the 
 * results section
 */
$(".cidr_calc").val($("#slider").slider("value"));


/**
 * Updates the number of hosts based on the CIDR slider
 */
$("#slider").on("slide", function(event, ui) {
    var total   = getTotalHosts(ui.value);
    var netmask = getNetmask(ui.value);
    var ip      = $("#ip_address").val();

    $("#num_hosts_calc").html(numberWithCommas(total));
    $("#mask_calc").html(netmask);
    $("#cidr_calc").html(ui.value);

    if (ip) {
        $("#last_addr_calc").html(getBroadcast(ip, netmask));
        $("#range_calc").html(getRange(ip, netmask));
        $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
    }
});


/**
 * Output the value of the # Hosts to the results section
 */
$("#num_hosts").keyup(function() {
    var value = $(this).val();
    $("#num_hosts_calc").html(value);
});


/**
 * IP address validation - based on example from: 
 * Suprotim Agarwal, "Validate IP Address using jQuery", DeVCURRY, April 27, 2010, Accessed November 12, 2013, 
 * http://www.devcurry.com/2010/04/validate-ip-address-using-jquery.html#.Ud8U1zs3sUJ
 */
$(function() {
    $.validator.addMethod('IP4Checker', function(value) {
        return value.match(ip_regex);
    }, 'Please enter a valid IP address');

    $('#calculator').validate({
        success: "valid",
        rules: {
    	    ip_address: {
                required: true,
                IP4Checker: true
            },
            mask: {
            	IP4Checker: true
            },
            num_hosts: {
            	number: true
            }
        },
        messages: {
        	ip_address: "Please enter a valid IP address",
        	mask: "Please enter a valid subnet mask",
        	num_hosts: "Please enter a valid number"
        }
    });
});



$("#mask").click(function() {

    // enable the mask field
    $("#mask").attr('ignore', 'false').css({
        "background-color": "white"
    });

    // disable the num_hosts field
    $("#num_hosts").attr('ignore','true').css({
        'background-color': '#EBEBE4'
    });
    $("#num_hosts").val("");
    
    // disable the slider
    $("#slider").removeClass("ui-state-default");
    $("#slider").addClass("ui-state-disabled");

    // Blank out previous values
    $("#cidr_calc").html("");
    $("#num_hosts_calc").html("");
});


$("#slider .ui-slider-handle").focus(function() {

    // enable the slider
    $("#slider").slider("enable");

    // disable the mask field
    $("#mask").attr('ignore','true').css({
        'background-color': '#EBEBE4'
    });
    $("#mask").val("");

    // disable the num hosts field
    $("#num_hosts").attr('ignore','true').css({
        'background-color': '#EBEBE4'
    });
    $("#num_hosts").val("");

    // Blank out previous values
    $("#mask_calc").html("");
    $("#num_hosts_calc").html("");
});


$("#num_hosts").click(function() {

    // enable the num_hosts field
    $("#num_hosts").attr('ignore', 'false').css({
        "background-color": "white"
    });

    // disable the mask field
    $("#mask").attr('ignore','true').css({
        'background-color': '#EBEBE4'
    });
    $("#mask").val("");
    
    // disable the slider
    $("#slider").removeClass("ui-state-default");
    $("#slider").addClass("ui-state-disabled");

    // Blank out previous values
    $("#mask_calc").html("");
    $("#cidr_calc").html("");
});

//$("#slider").slider("disable");