import fs from "fs";

const HIDDevice = (devicePath: string) => fs.createReadStream(devicePath);

export default HIDDevice;
