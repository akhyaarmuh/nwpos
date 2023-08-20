import ip from 'ip';
import cors from 'cors';
import path from 'path';
import open from 'open';
import dotenv from 'dotenv';
import express from 'express';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

import './config/Database.js';

import backup from './utilities/backup.js';
import handleReport from './utilities/report.js';
import handlePrint from './utilities/Printer.js';
import handleDisplay from './utilities/Displayer.js';

import buyRouter from './app/buy/router.js';
import categoryRouter from './app/category/router.js';
import customerRouter from './app/customer/router.js';
import dashboardRouter from './app/dashboard/router.js';
import productRouter from './app/product/router.js';
import reportRouter from './app/report/router.js';
import saleRouter from './app/sale/router.js';
import storeRouter from './app/store/router.js';
import supplierRouter from './app/supplier/router.js';
import unitRouter from './app/unit/router.js';
import userRouter from './app/user/router.js';
dotenv.config();

const dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

backup();
try {
  await handleReport();
} catch (error) {
  console.error(error);
}

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(dirname, 'client', 'build')));

app.post(`/${process.env.API_VERSION}/display`, handleDisplay);
app.post(`/${process.env.API_VERSION}/print`, handlePrint);

app.use(`/${process.env.API_VERSION}/buy`, buyRouter);
app.use(`/${process.env.API_VERSION}/category`, categoryRouter);
app.use(`/${process.env.API_VERSION}/customer`, customerRouter);
app.use(`/${process.env.API_VERSION}/dashboard`, dashboardRouter);
app.use(`/${process.env.API_VERSION}/product`, productRouter);
app.use(`/${process.env.API_VERSION}/report`, reportRouter);
app.use(`/${process.env.API_VERSION}/sale`, saleRouter);
app.use(`/${process.env.API_VERSION}/store`, storeRouter);
app.use(`/${process.env.API_VERSION}/supplier`, supplierRouter);
app.use(`/${process.env.API_VERSION}/unit`, unitRouter);
app.use(`/${process.env.API_VERSION}/user`, userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(dirname, 'client', 'build', 'index.html'));
});

app.listen(process.env.PORT, () => {
  console.log('Server running on: http://localhost:' + process.env.PORT);
  open(`http://localhost:${process.env.PORT}`, { app: 'chrome' });
});

app.listen(process.env.PORT, ip.address(), () => {
  console.log(`Server running on: http://${ip.address()}:${process.env.PORT}`);
  console.log('App started');
});

// INI ADALAH ENVIRONMENT .ENV

// TOKEN=54d6h465sx4hyf6d854hzx6846h854854dfx6hdz4
// PORT=3000
// MONGODB_URI= mongodb://127.0.0.1:27017/nwpos
// API_VERSION=api/v2
// PRINTER_ICON = true;
// PRINTER_BRAND = eppos;
