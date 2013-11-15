
/**
 * Function to pad binary numbers with 0 up to 8
 */
function padBinary(orig) {
    var output = orig;
    
    if (output.length < 8) {
        for (var i = 0; i < 8; i++) {
            
            output = "0" + output;
        }
    }

    return output;
}


/**
 * Converts a decimal number to the binary equivilent
 */
function decToBin(val) {
    var base   = 2;
    var intNum = parseInt(val);
    var binary = padBinary(intNum.toString(base));

    return binary;
}


/**
 * Converts a decimal number to the hex equivilent
 */
function decToHex(val) {
    var base = 16;
    
    if (val < 0) {
        val = 0xFFFFFFFF + val + 1;
    }

    return val.toString(base);
}


/**
 * Convert a full IP to binary with out dots
 */
function ipToBin(ip) {
    var ip_arr = ip.split(".");
    var ip_bin;

    for (var i = 0; i < ip_arr.length; i++) {
        ip_bin = ip_bin + decToBin(ip_arr[i]);
    }

    return ip_bin;
}


/**
 * Convert a full IP to hex
 */
function ipToHex(ip) {
    var ip_arr = ip.split(".");
    var ip_hex = new Array();

    for (var i = 0; i < ip_arr.length; i++) {
        ip_hex[i] = decToHex(parseInt(ip_arr[i], 10));
    }

    return ip_hex;
}

console.log(ipToBin("192.168.1.6"));
console.log(ipToBin("255.255.255.254"));
console.log(decToHex(192));
console.log(ipToHex("192.168.1.6"));
console.log(ipToHex("255.255.255.254"));


/**
 * Function to determine the netmask based on CIDR notation.  Based on example from:
 * StackOverflow, "Converting CIDR address to subnet mask and network address", 
 * May 31, 2010, Accessed November 13, 2013, 
 * http://stackoverflow.com/questions/2942299/converting-cidr-address-to-subnet-mask-and-network-address 
 */
function getNetmask(cidr) {
	var mask = 0xffffffff << (32 - cidr);
	var maskStr = [ (mask >>> 24) , (mask >> 16 & 0xff) , (mask >> 8 & 0xff) , (mask & 0xff) ].join('.'); 
    var bin = parseInt(mask, 10).toString(2);

    console.log(mask + ", " + maskStr + ", " + bin);
	return maskStr;
}


/**
 * Adds commas to numbers.  Based on example from:
 * StackOverflow, "How to print a number with commas as thousands separators in JavaScript",
 * May 25, 2010, Accessed November 14, 2013,
 * http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/**
 * Create the CIDR slider
 */
$("#slider").slider({
    min: 0,
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
    var value = $(this).val();
    $("#mask_calc").html(value);
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
    var total   = Math.pow(2, (32 - ui.value)) - 2;
    var netmask = getNetmask(ui.value);
    $("#num_hosts_calc").html(total);
    $("#mask_calc").html(netmask);
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


