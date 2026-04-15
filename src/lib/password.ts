import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string) {
  const [salt, storedHash] = hash.split(":");
  const buf = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return timingSafeEqual(buf, Buffer.from(storedHash, "hex"));
}
