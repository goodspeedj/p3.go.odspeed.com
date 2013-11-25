/*===================================================================================================================

    UTILITY FUNCTIONS

  ===================================================================================================================
 */


/** 
 * Test for IE 9.  Function from:
 * James Padolsey, "Detect IE in JS using conditional comments", August 20, 2010, 
 * Accessed November 25, 2013, http://james.padolsey.com/javascript/detect-ie-in-js-using-conditional-comments/
 */
var ie = (function(){
 
    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : undef;
 
}());


/**
 * "Disables" the slider by loading CSS rules to make the slider look disabled
 * Truely disabling the slider would make it impossible to re-enable it by click
 */
function sliderDisable() {
    if (ie <= 9) {
        $("#slider").addClass("ui-state-disabled");

        // filter attribute causes issues with ie 9
        $("#slider").css({
            "filter": ""
        });
    }
    $("#slider").removeClass("ui-state-default");
}

/**
 * Reset the form on page reload.  Based on example from:
 * StackOverflow, "Is it possible to clear a form an reset (reload) the page with one button?",
 * March 7, 2013, Accessed November 25, 2013, 
 * http://stackoverflow.com/questions/6666363/is-it-possible-to-clear-a-form-an-reset-reload-the-page-with-one-button
 */
function resetForms() {
    for (i = 0; i < document.forms.length; i++) {
        document.forms[i].reset();
    }
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
 * Will convert an IP address to it's binary number equivilent.  For example the
 * IP of 192.168.1.6 is 110000001010100000000000100000000110 in binary which 
 * translates to -1062731514 as a number.
 */
function ipToNum(ip) {
    console.log(ip);
    var ip_num = ip.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
    console.log("here: "+ ip_num[1]<<24);
    return (+ip_num[1]<<24) + (+ip_num[2]<<16) + (+ip_num[3]<<8) + (+ip_num[4]);
}


/**
 * Converts a number of a binary representation (i.e.: -1062731514) back into 
 * an IP address.
 */
function numToIP(num) {
    return [ (num >>> 24) , (num >> 16 & 0xff) , (num >> 8 & 0xff) , (num & 0xff) ].join('.');
}




/*===================================================================================================================

    GETTER FUNCTIONS

  ===================================================================================================================
 */


/**
 * Will get the last address in the network.  
 *  1. Perform a bitwise NOT on the network mask which gives the size of the 
 *     network range.
 *  2. Get the network address as a binary number
 *  3. Convert the binary number back to dotted notation
 *  4. Split off the last octet of the network address
 *  5. Add the last octet of the network address to the value of the netmask
 *     compliment (NOT)
 *  6. Add the last IP binary to the network address binary
 *  7. Return the last IP as a string
 */
function getBroadcast(ip, mask) {
    var not_mask     = (~ipToNum(mask));               
    var net_addr_bin = getNetworkAddress(ip, mask);     
    var net_addr     = numToIP(net_addr_bin);           
    var ip_arr       = net_addr.split(".");              
    var last_oct     = ip_arr[3];
    var last_ip_oct  = last_oct + not_mask;             
    var last_ip      = (+last_ip_oct + +net_addr_bin);  

    return numToIP(last_ip);
}


/**
 * Gets the CIDR notation by converting the netmask into binary and counting the 1's
 */
function getCIDR(mask) {
    var mask_num = ipToBin(mask);
    var mask_arr = mask_num.split("");

    var cidr = 0;
    for (var i = 0; i < mask_arr.length; i++) {
        if (mask_arr[i] == "1") {
            cidr++;
        }
    }

    return cidr;
}


/**
 * Get the CIDR from the number of hosts field - just a simple lookup table
 */
function getCIDRFromHosts(hosts) {
    if (hosts > 1073741822)     { return 1; }
    else if (hosts > 536870910) { return 2; }
    else if (hosts > 268435454) { return 3; }
    else if (hosts > 134217726) { return 4; }
    else if (hosts > 67108862)  { return 5; }
    else if (hosts > 33554430)  { return 6; }
    else if (hosts > 16777214)  { return 7; }
    else if (hosts > 8388606)   { return 8; }
    else if (hosts > 4194302)   { return 9; }
    else if (hosts > 2097150)   { return 10; }
    else if (hosts > 1048574)   { return 11; }
    else if (hosts > 524286)    { return 12; }
    else if (hosts > 262142)    { return 13; }
    else if (hosts > 131070)    { return 14; }
    else if (hosts > 65534)     { return 15; }
    else if (hosts > 32766)     { return 16; }
    else if (hosts > 16382)     { return 17; }
    else if (hosts > 8190)      { return 18; }
    else if (hosts > 4094)      { return 19; }
    else if (hosts > 2046)      { return 20; }
    else if (hosts > 1022)      { return 21; }
    else if (hosts > 510)       { return 22; }
    else if (hosts > 254)       { return 23; }
    else if (hosts > 126)       { return 24; }
    else if (hosts > 62)        { return 25; }
    else if (hosts > 30)        { return 26; }
    else if (hosts > 14)        { return 27; }
    else if (hosts > 6)         { return 28; }
    else if (hosts > 2)         { return 29; }
    else                        { return 30; }
}


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

    return maskStr;
}


/**
 * Gets the first address in the network by performing a bitwise AND on the IP
 * and Netmask.  Will return the number of the binary representation.  For 
 * example:
 * IP      = 192.168.1.6   = -1062731514
 * Netmask = 255.255.255.0 = -256
 * 
 * Bitwise AND:
 * (-1062731514 & -256) = -1062731520 which can be converted to 192.168.1.0
 */
function getNetworkAddress(ip, mask) {
    console.log("getNetworkAddress: " + ip);
    var ip_num   = ipToNum(ip);
    var mask_num = ipToNum(mask);

    return (ip_num & mask_num);
}


/**
 * Get the host address range.  Add one to the network address and subtract
 * one from the broadcast address
 */
function getRange(ip, mask) {
    var first = getNetworkAddress(ip, mask); 
    var last  = getBroadcast(ip, mask);

    last  = ipToNum(last);

    first = +first + 1;
    last  = +last - 1; 

    return numToIP(first) + " - " + numToIP(last);
}


function getTotalHosts(cidr) {
    return Math.pow(2, (32 - cidr)) - 2;
}