import { ENTER, getChar } from "./keymap";

export class CodeBuilder {
  #str = "";

  process(hexCode: string) {
    const code = getChar(hexCode);
    if (code !== ENTER) {
      this.#str += code;
      return;
    }
    const fullCode = this.#str;
    this.#str = "";
    return fullCode;
  }
}
