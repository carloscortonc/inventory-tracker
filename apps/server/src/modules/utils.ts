import { sha256 } from "js-sha256";

/* TODO reimplement */
export function resolveString(value: string, parameters: Record<string, any>) {
  let final = value;
  for (let key in parameters) {
    const sKey = `\\\${${key}}`;
    const paramValue = parameters[key];
    const regex = new RegExp(sKey, "g");
    final = final.replace(regex, paramValue);
  }
  return final;
}

export const hash = (s: string) => sha256(s);
