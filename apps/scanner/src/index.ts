import HID from "node-hid";
import { CodeBuilder } from "./code-builder";

const devices = HID.devices();

const device = new HID.HID(devices[0].path);

// prettier-ignore
let codeBuilder = new CodeBuilder(), code: string;
device.on("data", function (data) {
  console.log("[RAW]", data);
  const hexCode = Buffer.from([data[2]]).toString("hex");
  if ((code = codeBuilder.process(hexCode))) {
    console.log("[barcode]", code);
  }
});
