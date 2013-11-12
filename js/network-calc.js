/**
 * Create the CIDR slider
 */
$("#slider").slider({
    min: 0,
    max: 32,
    slide: function( event, ui ) {
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
    var value = $(this).val();
    $("#mask_calc").html(value);
});


/**
 * Output the value of the slider on the page next to the bar and in the 
 * results section
 */
$(".cidr_calc").val($("#slider").slider("value"));


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
    var ip = "\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b";
        return value.match(ip);
    }, 'Please enter a valid IP address');

    $('#netmask').validate({
        rules: {
    	    ip_address: {
                required: true,
                IP4Checker: true
            },
            mask: {
            	IP4Checker: true
            }
        },
        messages: {
        	ip_address: "Please enter a valid IP address",
        	mask: "Please enter a valid subnet mask"
        }
    });
});