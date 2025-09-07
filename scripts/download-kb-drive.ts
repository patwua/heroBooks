import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const FOLDER_ID = "1DYvvEb5H7Gk2CpK7O_JtdtBoDPWsv7lQ";
const OUTPUT_DIR = path.join(process.cwd(), "kb", "drive_raw");

mkdirSync(OUTPUT_DIR, { recursive: true });

execSync(`gdown --folder ${FOLDER_ID} -O ${OUTPUT_DIR} --remaining-ok`, {
  stdio: "inherit",
});
