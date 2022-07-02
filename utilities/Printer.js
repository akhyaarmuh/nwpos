import dotenv from "dotenv";
import escpos from "escpos";
import USB from "escpos-usb";
dotenv.config();

import { toRupiah } from "./index.js";

escpos.USB = USB;

export default async (req, res) => {
  try {
    const device = new escpos.USB();
    const printer = new escpos.Printer(device);

    const { store, date, time, cart, total, pay, debt, cashback } = req.body;

    device.open(() => {
      printHeader(printer, store, date, time);
      printDetailProduct(printer, cart);
      printDetailPayment(printer, total, pay, debt, cashback);
      printFooter(printer, store.footer);
      printer.cut().cashdraw().close();
    });

    res.sendStatus(201);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

const printHeader = (printer, store, date, time) => {
  if (store.name) {
    printer
      .align("CT")
      .style("NORMAL")
      .size(1, 1)
      .text(store.name.toUpperCase());
  }

  printer.size(0, 0);

  if (store.city) {
    printer.text(store.city);
  }

  if (store.address) {
    const addressSplited = store.address.split("||");
    addressSplited.forEach((address) => {
      printer.text(address.trim());
    });
  }

  if (store.noHp) {
    printer.text(store.noHp);
  }

  printer.text(line(32)).align("RT").text(date).text(time);
};

const printDetailProduct = (printer, cart) => {
  cart.forEach((product) => {
    let str = "";
    let space = "";
    const ex = process.env.PRINTER_ICON ? " × " : " X ";
    const leng = process.env.PRINTER_ICON ? 31 : 32;
    const style = process.env.PRINTER_BRAND ? "NORMAL" : "B";
    str = toRupiah(product.qty) + ex + toRupiah(product.priceSelected);

    for (
      let i = 0;
      i < leng - (str.length + toRupiah(product.total).length);
      i++
    ) {
      space = space + ` `;
    }

    printer
      .align("LT")
      .style(style)
      .text(product.name)
      .style("NORMAL")
      .text(str + space + toRupiah(product.total));
  });
  printer.text(line(32));
};

const printDetailPayment = (printer, total, pay, debt, cashback) => {
  const style = process.env.PRINTER_BRAND ? "NORMAL" : "B";
  printer
    .style(style)
    .text(printHasil({ name: "total", value: toRupiah(total) }))
    .text(printHasil({ name: "bayar", value: toRupiah(pay) }));

  if (debt) {
    printer.text(printHasil({ name: "hutang", value: toRupiah(debt) }));
  }

  if (cashback) {
    printer.text(printHasil({ name: "kembali", value: toRupiah(cashback) }));
  }
  printer.style("NORMAL").text(line(32));
};

const printFooter = (printer, footer) => {
  if (footer) {
    printer.align("CT");
    const footerSplited = footer.split("||");
    footerSplited.forEach((foot) => {
      printer.text(foot.trim());
    });
  }
};

// utilities
const line = (count) => {
  let str = "";
  for (let i = 0; i < count; i++) {
    str = str + "-";
  }
  return str;
};

const printHasil = ({ name, value }) => {
  let str = "";
  let space = "";
  if (name == "total") {
    str = "Total       :";
    for (let i = 0; i < 32 - str.length - value.length; i++) {
      space = space + " ";
    }
    return str + space + value;
  } else if (name == "bayar") {
    str = "Bayar       :";
    for (let i = 0; i < 32 - str.length - value.length; i++) {
      space = space + " ";
    }
    return str + space + value;
  } else if (name == "kembali") {
    str = "Kembali     :";
    for (let i = 0; i < 32 - str.length - value.length; i++) {
      space = space + " ";
    }
    return str + space + value;
  } else {
    str = "Sisa Hutang :";
    for (let i = 0; i < 32 - str.length - value.length; i++) {
      space = space + " ";
    }
    return str + space + value;
  }
};
