import ip from "ip";
import cors from "cors";
import open from "open";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import handleReport from "./utilities/report.js";
import path from "path";
import { fileURLToPath } from "url";
import "./config/Database.js";

import handlePrint from "./utilities/print.js";
import buyRouter from "./app/buy/router.js";
import categoryRouter from "./app/category/router.js";
import customerRouter from "./app/customer/router.js";
import dashboardRouter from "./app/dashboard/router.js";
import productRouter from "./app/product/router.js";
import reportRouter from "./app/report/router.js";
import saleRouter from "./app/sale/router.js";
import storeRouter from "./app/store/router.js";
import supplierRouter from "./app/supplier/router.js";
import unitRouter from "./app/unit/router.js";
import userRouter from "./app/user/router.js";

dotenv.config();

try {
  await handleReport();
} catch (error) {
  console.error(error);
}

const apiVersion = process.env.API_VERSION;
const port = process.env.PORT || 3000;
const dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const mode = process.env.MODE;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(dirname, "client", "build")));

app.post(`/${apiVersion}/print`, handlePrint);
app.use(`/${apiVersion}/buy`, buyRouter);
app.use(`/${apiVersion}/category`, categoryRouter);
app.use(`/${apiVersion}/customer`, customerRouter);
app.use(`/${apiVersion}/dashboard`, dashboardRouter);
app.use(`/${apiVersion}/product`, productRouter);
app.use(`/${apiVersion}/report`, reportRouter);
app.use(`/${apiVersion}/sale`, saleRouter);
app.use(`/${apiVersion}/store`, storeRouter);
app.use(`/${apiVersion}/supplier`, supplierRouter);
app.use(`/${apiVersion}/unit`, unitRouter);
app.use(`/${apiVersion}/user`, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  open(`http://localhost:${process.env.PORT}`, { app: "chrome" });
});

app.listen(port, ip.address(), () => {
  console.log(`Server running on http://${ip.address()}:${port}`);
  console.log("App started");
});

// INI ADALAH ENVIRONMENT .ENV

// TOKEN=54d6h465sx4hyf6d854hzx6846h854854dfx6hdz4
// PORT=3000
// MONGODB_URI= mongodb://127.0.0.1:27017/nwpos
// API_VERSION=api/v1
