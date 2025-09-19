import HIDDevice from "./hid-device";
import { updateProduct } from "./server-integration";

const device = new HIDDevice(process.env.DEVICE);

device.on("data", updateProduct);
