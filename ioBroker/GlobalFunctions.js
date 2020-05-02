// Logging in Datei /var/log/iobroker/YYYY-MMM-DD_scripts.log

var fs = require('fs');

function flog(txt) {
   var ts = new Date();
   var ms = ts.getMilliseconds();
    if (ms < 10) {
        ms = "00" + ms;
    }
    else if (ms > 9 && ms < 100) {
        ms = "0" + ms;
    }
    ts = formatDate(ts, "YYYY-MM-DD hh:mm:ss.") + ms + " \t";
    var fdd=formatDate(ts, "YYYY-MM-DD");
    var fn = "/opt/iobroker/log/"+fdd+"_scripts.log";
    fs.appendFileSync(fn, ts + txt + "\n");
}

function tolog(logging,val) {
    if (logging===true) {
        log(val);
    }
}
