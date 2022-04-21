import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import handleReport from "./utilities/createReport.js";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";
import "./config/Database.js";
import userRouter from "./app/user/router.js";
import categoryRouter from "./app/category/router.js";
import unitRouter from "./app/unit/router.js";
import productRouter from "./app/product/router.js";
import customerRouter from "./app/customer/router.js";
import supplierRouter from "./app/supplier/router.js";
import saleRouter from "./app/sale/router.js";
import buyRouter from "./app/buy/router.js";
import storeRouter from "./app/store/router.js";
import reportRouter from "./app/report/router.js";

dotenv.config();
await handleReport();

const apiVersion = process.env.API_VERSION;
const port = process.env.PORT || 5000;
const dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(dirname, "client", "build")));

app.use(`/${apiVersion}/user`, userRouter);
app.use(`/${apiVersion}/category`, categoryRouter);
app.use(`/${apiVersion}/unit`, unitRouter);
app.use(`/${apiVersion}/product`, productRouter);
app.use(`/${apiVersion}/customer`, customerRouter);
app.use(`/${apiVersion}/supplier`, supplierRouter);
app.use(`/${apiVersion}/sale`, saleRouter);
app.use(`/${apiVersion}/buy`, buyRouter);
app.use(`/${apiVersion}/store`, storeRouter);
app.use(`/${apiVersion}/report`, reportRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
  open(`http://localhost:${process.env.PORT}`, { app: "chrome" });
  console.log("App started");
});

// TOKEN=54d6h465sx4hyf6d854hzx6846h854854dfx6hdz4
// PORT=3000
// MONGODB_URI= mongodb://127.0.0.1:27017/nwpos
// API_VERSION=api/v1
