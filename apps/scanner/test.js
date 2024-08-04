import evdev from "evdev";

const inputDevicePath = "/dev/hidraw0";

const device = new evdev();

device.open(inputDevicePath);

let inputBuffer = "";

console.log(`Listening for barcode input on ${inputDevicePath}...`);

device.on("EV_KEY", (data) => {
  if (data.value === 1) {
    // Key press event
    const key = evdev.codes.byValue[data.code];
    if (key) {
      if (key === "KEY_ENTER") {
        console.log(`Barcode: ${inputBuffer}`);
        inputBuffer = "";
      } else {
        inputBuffer += key.replace("KEY_", "").toLowerCase();
      }
    }
  }
});

device.on("error", (err) => {
  console.error(`Error reading input device: ${err}`);
});
