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
 * Output to the results section based on the ip address field
 */
$("#ip_address").keyup(function() {
    var ip      = $(this).val();
    var netmask = $("#mask").val();
    $("#ip_calc").html(ip);

    if (ip.match(ip_regex)) {
    	console.log("netmask: " + netmask);
    	if (netmask && netmask.match(ip_regex)) {
    		console.log("inner");
    		var total = getTotalHosts(getCIDR(netmask));
	        $("#num_hosts_calc").html(numberWithCommas(total));
	        $("#cidr_calc").html(getCIDR(netmask));
	        $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
	        $("#last_addr_calc").html(getBroadcast(ip, netmask));
	        $("#range_calc").html(getRange(ip, netmask));
    	}
    }
});


/**
 * Output to the results section based on the netmask field
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

        if (ip) {
        	$("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
	        $("#last_addr_calc").html(getBroadcast(ip, netmask));
	        $("#range_calc").html(getRange(ip, netmask));
        }
    }
});


/**
 * Output the value of the slider on the page next to the bar and in the 
 * results section
 */
$(".cidr_calc").val($("#slider").slider("value"));


/**
 * Output to the results section based on the CIDR slider
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
 * Output to the results section based on the num hosts field
 */
$("#num_hosts").keyup(function() {
    var value   = $(this).val();
    var cidr    = getCIDRFromHosts(value);
    var netmask = getNetmask(cidr);
    var ip      = $("#ip_address").val();

    $("#num_hosts_calc").html(value);
    $("#cidr_calc").html(cidr);
    $("#mask_calc").html(netmask);

    if (ip) {
        $("#last_addr_calc").html(getBroadcast(ip, netmask));
        $("#range_calc").html(getRange(ip, netmask));
        $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
    }
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



$("#mask").focus(function() {

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


$("#num_hosts").focus(function() {

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