module.exports = function (SerialPort, logFunction) {
    var hexer = require('hexer');

    if (typeof logFunction !== "function") {
        logFunction = console.log;
    }
    function dump(buffer) {
        return hexer(buffer, {group: 1});
    }

    SerialPort.prototype.__write = SerialPort.prototype.write;

    SerialPort.prototype.write = function write() {
        var buffer = arguments[0];
        if (!Buffer.isBuffer(buffer)) {
            buffer = new Buffer(buffer);
        }
        logFunction("--> send");
        logFunction(dump(buffer));
        this.__write.apply(this, arguments);
    };

    function applyConstructor(objectClass, arguments) {
        var o = Object.create(objectClass.prototype);
        return objectClass.apply(o, arguments) || o
    }

    return function SerialPortDebug(options) {
        var sp = applyConstructor(SerialPort, arguments);
        sp.on("data", function receive(data) {
            logFunction("<-- receive");
            logFunction(dump(data));
        });
        return sp;
    };
};