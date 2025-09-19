import { ChildProcess, spawn } from "child_process";
import EventEmitter from "events";
import log from "../../server/src/modules/logger";

class UdevMonitor extends EventEmitter<{ add: []; remove: [] }> {
  deviceName: string;
  private process: ChildProcess;

  constructor(device: string) {
    super();
    this.deviceName = device.replace("/dev/", "");

    this.process = spawn("udevadm", ["monitor", "--udev"]);
    this.process.stdout.on("data", (data: Buffer) => {
      // udevadm outputs device blocks separated by double newlines
      const blocks = data.toString().split("\n\n");

      for (const block of blocks) {
        const lines = block.split("\n").map((l) => l.trim());

        for (const line of lines) {
          if (!line.startsWith("UDEV ")) continue;
          const r = /^UDEV\s+\[\d+\.\d+\]\s+(?<action>\w+)\s+[^(]+?\/(?<device>\w+)\s+/.exec(line);
          if (!r || r.groups?.device !== this.deviceName) continue;

          this.emit(r.groups!.action as "add" | "remove");
        }
      }
    });

    this.process.stderr.on("data", (data) => {
      log.error(`[udevadm] error: ${data}`);
    });

    this.process.on("error", (err) => {
      log.error("[udevadm::process]", err);
    });
  }
}

export default UdevMonitor;
