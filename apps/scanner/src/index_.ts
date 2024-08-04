// import HID from "node-hid";
import { SerialPort } from "serialport";
import express from "express";

const app = express();
const port = process.env.PORT || 8080;

app.get("/devices", async function (req, res) {
  // const list = HID.devices();
  const list = await SerialPort.list();
  res.send(list);
});

app.listen(port, function () {
  console.log(`[scanner] listening on port ${port}!`);
});
