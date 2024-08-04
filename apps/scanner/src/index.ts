import HIDDevice from "./hid-device";
import CodeBuilder from "./code-builder";
import { sendCode } from "./server-integration";

const devicePath = "/dev/hidraw0";

const device = HIDDevice(devicePath);

// prettier-ignore
let codeBuilder = new CodeBuilder(), code: string;
device.on("data", function (data: Buffer) {
  const hexCode = Buffer.from([data[2]]).toString("hex");
  if ((code = codeBuilder.process(hexCode))) {
    console.log("[barcode]", code);
    sendCode(code);
  }
});

console.log("Scanner listenning for barcodes");
