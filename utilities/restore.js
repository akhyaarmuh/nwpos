import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// mongorestore --db=nwpos --archive=./nwpos.gzip --gzip

const restore = () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const DB_NAME = "nwpos";
  const ARCHIVE_PATH = path.join(dirname, `${DB_NAME}.gzip`);

  const child = spawn("mongorestore", [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", data.toString("ascii"));
  });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code ", code);
    else if (signal) console.log("Process exit with signal ", signal);
    else console.log("Backup is successfull ✅");
  });
};

restore();
