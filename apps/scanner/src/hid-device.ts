import fs from "fs";
import EventEmitter from "events";
import CodeBuilder from "./code-builder";
import log from "../../server/src/modules/logger";

class HIDDevice extends EventEmitter<{ data: [code: string] }> {
  devicePath: string;
  codeBuilder = new CodeBuilder();
  isReading = false;

  constructor(devicePath: string) {
    super();
    this.devicePath = devicePath;
    log.info("[HIDDevice] Initializing", { device: this.devicePath });
    this.waitForDevice();
  }

  async waitForDevice() {
    if (await this.checkIfDeviceExists()) {
      this.read();
      return;
    }
    const devName = this.devicePath.replace("/dev/", "");
    const watcher = fs.watch("/dev", async (eventType, filename) => {
      // Check if the event is for our device
      if (filename !== devName || eventType !== "rename") return;
      // Check if the device now exists
      if (await this.checkIfDeviceExists()) {
        return;
      }
      // Debounce
      setTimeout(async () => {
        if (await this.checkIfDeviceExists()) {
          watcher.close();
          this.read();
        }
      }, 100);
    });
  }

  async checkIfDeviceExists() {
    return fs.promises
      .access(this.devicePath, fs.constants.R_OK)
      .then(() => true)
      .catch(() => false);
  }

  read() {
    if (this.isReading) return;
    this.isReading = true;
    const stream = fs.createReadStream(this.devicePath);
    log.info("[HIDDevice] Device connected", { device: this.devicePath });

    stream.on("data", (data: Buffer) => {
      let code: string;
      const hexCode = Buffer.from([data[2]]).toString("hex");
      if ((code = this.codeBuilder.process(hexCode))) {
        this.emit("data", code);
        log.info("[HIDDevice] Code read", { code });
      }
    });

    const cleanup = () => {
      log.info("[HIDDevice] Device disconnected", { device: this.devicePath });
      this.isReading = false;
      !stream.closed && stream.close();
      this.waitForDevice();
    };

    stream.on("error", cleanup);
    stream.on("close", cleanup);
  }
}

export default HIDDevice;
