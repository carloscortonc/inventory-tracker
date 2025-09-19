import fs from "fs";
import EventEmitter from "events";
import CodeBuilder from "./code-builder";
import log from "../../server/src/modules/logger";
import UdevMonitor from "./udev-monitor";

class HIDDevice extends EventEmitter<{ data: [code: string] }> {
  devicePath: string;
  udev: UdevMonitor;
  codeBuilder = new CodeBuilder();
  isReading = false;
  debounceTimeout?: NodeJS.Timeout;

  constructor(devicePath: string) {
    super();
    this.devicePath = devicePath;
    log.info("[HIDDevice] Initializing", { device: this.devicePath });
    // this.udev = new UdevMonitor(this.devicePath);
    // this.udev.on("add", () => this.checkForDevice());
    // this.udev.on("remove", () => this.checkForDevice());
    setInterval(() => this.verify(), 1000 * 60);
    // Initial check
    this.checkForDevice();
  }

  verify() {
    this.checkIfDeviceExists().then((e) => (e ? this.read() : {}));
  }

  async checkForDevice() {
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(async () => {
      this.verify();
    }, 1000);
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
      this.isReading = false;
      !stream.closed && stream.destroy();
    };

    stream.on("error", cleanup);
    stream.on("close", () => {
      log.info("[HIDDevice] Device disconnected", { device: this.devicePath });
      cleanup();
    });
  }
}

export default HIDDevice;
