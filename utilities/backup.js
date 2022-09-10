import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

// mongodump --db=nwpos --archive=./nwpos.gzip --gzip

export default (message = false) => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const [bln, tgl, thn] = getDate();
  const DB_NAME = "nwpos";
  const ARCHIVE_PATH = path.join(dirname, `${DB_NAME}.gzip`);
  const ARCHIVE_PATH2 = path.join(
    dirname,
    "backup",
    `${bln}-${tgl}-${thn}.gzip`
  );

  backup(DB_NAME, ARCHIVE_PATH);
  backup(DB_NAME, ARCHIVE_PATH2, message);
  deleteOldBackup(dirname);
};

const backup = (DB_NAME, ARCHIVE_PATH, message) => {
  const child = spawn("mongodump", [
    `--db=${DB_NAME}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  // child.stderr.on("data", (data) => {
  //   console.log("stderr:\n", data.toString("ascii"));
  // });
  child.on("error", (error) => {
    console.log("error:\n", error);
  });
  child.on("exit", (code, signal) => {
    if (code) {
      console.log("Process exit with code ", code);
    } else if (signal) {
      console.log("Process exit with signal ", signal);
    } else {
      if (message) console.log("Backup is successfull ✅");
    }
  });
};

const getDate = () => {
  const date = new Date();
  const tgl = date.getDate();
  const bln = date.getMonth();
  const thn = date.getFullYear();
  return [bln, tgl, thn];
};

const deleteOldBackup = (dirname) => {
  const [bln] = getDate();
  const files = fs.readdirSync(`${dirname}/backup`);

  const thisMonth = files.filter((file) => {
    const month = file.split("-");
    if (month[0] == bln) return file;
  });

  if (thisMonth.length > 1) {
    const oldMonth = files.filter((file) => {
      const month = file.split("-");
      if (month[0] != bln) return file;
    });

    if (oldMonth > 0) {
      oldMonth.forEach((old) => {
        fs.rmSync(`${dirname}/backup/${old}`);
      });
    }
  }
};
