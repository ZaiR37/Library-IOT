const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");

let dataReceived = false;
let timeoutId;

let port;
let parser;

function openPort() {
    port = new SerialPort("COM4", {
        baudRate: 9600,
    });
    parser = new Readline();
    port.pipe(parser);

    parser.on("error", (err) => {
        console.log(`Error: ${err.message}`);
    });
    port.on("open", () => {
        console.log("port open");
    });
}

function checkID() {
    return new Promise((resolve, reject) => {
        let dataReceived = false;
        let timeoutId = setTimeout(() => {
            if (!dataReceived) {
                port.close();
                resolve("No Card Detected!");
            }
        }, 10000);

        parser.on("data", (line) => {
            dataReceived = true;
            clearTimeout(timeoutId); // stop the setTimeout
            port.close();
            resolve(line);
        });
    });
}

module.exports = { checkID, openPort };


// console.log(checkID().then(console.log, console.error));
