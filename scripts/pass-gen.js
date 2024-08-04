import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import path from "path";
import generator from "generate-password";

const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY = "SRV_PASSWORD";

const psw = generator.generate({
  length: 30,
  numbers: true,
  symbols: false,
  strict: true,
});
const content = `${KEY}="${psw}"`;
fs.writeFileSync(path.join(__dirname, "..", ".env"), content);
console.log("Password written");
