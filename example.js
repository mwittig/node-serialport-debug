// EtherPortClient is the type of the serialport which shall be debugged
var EtherPortClient = require ("etherport-client").EtherPortClient;

// SerialPortDebug is a proxy type for SerialPortDebug
var SerialPortDebug = require ("./serialport-debug")(EtherPortClient);

// port to be used by EtherPortClient and EtherPort
var port=7711;

// now we create an instance of the proxy which actually returns an instance of EtherPortClient with
// some instrumentation to dump the messages
var sp = new SerialPortDebug({
    host: 'localhost',
    port: port
});

// The rest of the code is sample code to exchange with an Etherport server-side serialport
var loremIpsum = require('lorem-ipsum');
function makeText() {
    return loremIpsum({sentenceLowerBound: 3})
}
sp.on("open", function() {
    sp.write(makeText());
});

sp.on("data", function() {
    sp.write(makeText());
});

// this is the server-side
var EtherPort = require ("etherport");
var sp1 = new EtherPort({
    port: port
});

sp1.on("data", function() {
    sp1.write(makeText());
});




