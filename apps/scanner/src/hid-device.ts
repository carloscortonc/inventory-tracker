import fs from "fs";
import EventEmitter from "events";
import CodeBuilder from "./code-builder";
import log from "../../server/src/modules/logger";

class HIDDevice extends EventEmitter<{ data: [code: string] }> {
  devicePath: string;
  codeBuilder = new CodeBuilder();

  constructor(devicePath: string) {
    super();
    this.devicePath = devicePath;
    log.info("[HIDDevice] Initializing", { device: this.devicePath });
    this.read();
  }

  async checkIfDeviceExists() {
    return fs.promises
      .access(this.devicePath, fs.constants.R_OK)
      .then(() => true)
      .catch(() => false);
  }

  async read() {
    if (!this.checkIfDeviceExists()) {
      return log.error("[HIDDevice] Device not found!");
    }
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
