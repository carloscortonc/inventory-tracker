import HIDDevice from "./hid-device";
import { updateProduct } from "./server-integration";

const devicePath = "/dev/hidraw0";

const device = new HIDDevice(devicePath);

device.on("data", updateProduct);
