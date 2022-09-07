// import path from "path";
import { spawn } from "child_process";
// import { dirname } from "../index.js";

// mongorestore --db=nwpos --archive=./nwpos.gzip --gzip

const DB_NAME = "nwpos";
const ARCHIVE_PATH = "C:/nwdev/nwpos/nwpos.gzip";

const restore = () => {
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
