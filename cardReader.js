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
                let info = "No Card Detected!";
                console.log(info);
                resolve(info);
            }
        }, 10000);

        parser.on("data", (line) => {
            dataReceived = true;
            clearTimeout(timeoutId);
            port.close();
            console.log("Id Card detected : " + line);
            resolve(line);
        });
    });
}
module.exports = { checkID, openPort };

// console.log(checkID().then(console.log, console.error));
