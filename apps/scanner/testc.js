import fs from "fs";

// Replace this with the correct input device file (e.g., /dev/input/event0)
const inputDevicePath = "/dev/hidraw0";

fs.open(inputDevicePath, "r", (err, fd) => {
  if (err) {
    console.error(`Failed to open input device: ${err}`);
    return;
  }

  const buffer = Buffer.alloc(24);

  console.log(`Listening for barcode input on ${inputDevicePath}...`);

  const readInput = () => {
    fs.read(fd, buffer, 0, buffer.length, null, (err, bytesRead) => {
      if (err) {
        console.error(`Error reading input device: ${err}`);
        return;
      }

      if (bytesRead > 0) {
        // Process the input data (buffer) here
        // Example: Convert buffer to string or handle key codes
        // console.log(`Input data: ${buffer.toString("hex")}`);
        console.log(
          `Input data: [${buffer.toString()}] [${JSON.stringify(buffer)}]`
        );
      }

      // Continue reading
      readInput();
    });
  };

  readInput();
});
