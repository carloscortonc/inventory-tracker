import fs from "fs";

// Replace this with the correct input device file (e.g., /dev/input/event0)
const inputDevicePath = "/dev/hidraw0";

const keyMap = {
  2: "1",
  3: "2",
  4: "3",
  5: "4",
  6: "5",
  7: "6",
  8: "7",
  9: "8",
  10: "9",
  11: "0",
  16: "q",
  17: "w",
  18: "e",
  19: "r",
  20: "t",
  21: "y",
  22: "u",
  23: "i",
  24: "o",
  25: "p",
  30: "a",
  31: "s",
  32: "d",
  33: "f",
  34: "g",
  35: "h",
  36: "j",
  37: "k",
  38: "l",
  44: "z",
  45: "x",
  46: "c",
  47: "v",
  48: "b",
  49: "n",
  50: "m",
  28: "ENTER",
};

// Helper function to process input events
function processInputEvent(buffer) {
  const eventType = buffer.readUInt16LE(16);
  const eventCode = buffer.readUInt16LE(18);
  const eventValue = buffer.readInt32LE(20);

  if (eventType === 1 && eventValue === 1) {
    // Key press event
    return keyMap[eventCode] || "";
  }
  return "";
}

// Function to read barcode input
function readBarcodeInput(fd) {
  const buffer = Buffer.alloc(24);
  let barcode = "";

  const readInput = () => {
    fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead) => {
      if (err) {
        console.error(`Error reading input device: ${err}`);
        return;
      }

      if (bytesRead > 0) {
        const char = processInputEvent(buffer);
        if (char === "ENTER") {
          if (barcode) {
            console.log(`Barcode: ${barcode}`);
            barcode = "";
          }
        } else {
          barcode += char;
          console.log(
            `[barcode::${barcode.length.toString().padEnd(2)}]`,
            buffer,
            buffer.toString()
          );
        }
      }

      // Continue reading
      readInput();
    });
  };

  readInput();
}

// Open the input device and start reading
fs.open(inputDevicePath, "r", (err, fd) => {
  if (err) {
    console.error(`Failed to open input device: ${err}`);
    return;
  }

  console.log(`Listening for barcode input on ${inputDevicePath}...`);
  readBarcodeInput(fd);
});
