/*===================================================================================================================

    UI CONTROL

  ===================================================================================================================
 */



// Regex to match valid IP addresses
var ip_regex = "\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b";


// Reset the form on reload
$(document).ready(function () {
    resetForms();
});


/**
 * Auto focus on IP Address field for IE 9
 * Example from:
 * I like stuff, "How to Make HTML5 Autofocus Work in IE", March 29, 2012, Accessed November 25, 2013,
 * http://ilikestuffblog.com/2012/03/29/how-to-make-html5-autofocus-work-in-ie/
 */
$(function() {
  $('[autofocus]:not(:focus)').eq(0).focus();
});


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
    var hosts   = $("#num_hosts").val();

    $("#ip_calc").html(ip);

    if (ip.match(ip_regex)) {
        if (netmask && netmask.match(ip_regex)) {
            var total = getTotalHosts(getCIDR(netmask));
            $("#num_hosts_calc").html(numberWithCommas(total));
            $("#cidr_calc").html(getCIDR(netmask));
            $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
            $("#last_addr_calc").html(getBroadcast(ip, netmask));
            $("#range_calc").html(getRange(ip, netmask));
        }
        if (hosts) {
            var cidr = getCIDRFromHosts(hosts);
            netmask  = getNetmask(cidr);
            $("#num_hosts_calc").html(numberWithCommas(hosts));
            $("#cidr_calc").html(cidr);
            $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
            $("#last_addr_calc").html(getBroadcast(ip, netmask));
            $("#range_calc").html(getRange(ip, netmask));
        }
        if ($("#slider").slider("value") != 1) {
            var cidr = $("#slider").slider("value");
            netmask  = getNetmask(cidr);
            var total = getTotalHosts(getCIDR(netmask));
            $("#num_hosts_calc").html(numberWithCommas(total));
            $("#cidr_calc").html(cidr);
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
        $("#slider").slider("value", getCIDR(netmask));
        $(".cidr_calc").val($("#slider").slider("value"));

        if (ip) {
            $("#net_addr_calc").html(numToIP(getNetworkAddress(ip, netmask)));
            $("#last_addr_calc").html(getBroadcast(ip, netmask));
            $("#range_calc").html(getRange(ip, netmask));
        }
    }
});


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
    $("#cidr_slider").html(ui.value);

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
    $("#slider").slider("value", getCIDR(netmask));
    $(".cidr_calc").val($("#slider").slider("value"));

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
        //success: "valid",
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
        "background-color": '#EBEBE4'
    });
    $("#num_hosts").val("");
    
    // disable the slider
    sliderDisable();

    // remove form validation errors from num_hosts
    $("label[for='num_hosts']").hide();

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

    // clear any validation errors
    $(".error").hide();

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
    sliderDisable();

    // remove form validation errors from mask
    // remove form validation errors from num_hosts
    $("label[for='mask']").hide();

    // Blank out previous values
    $("#mask_calc").html("");
    $("#cidr_calc").html("");
});

//$("#slider").slider("disable");