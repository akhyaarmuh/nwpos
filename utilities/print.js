import escpos from "escpos";
import usb from "escpos-usb";
escpos.USB = usb;
import Store from "../app/store/model.js";
import { displayDate, toRupiah } from "./index.js";

const line = (count) => {
  let str = "";
  for (let i = 0; i < count; i++) {
    str = str + "-";
  }
  return str;
};

const printDetail = ({ qty, price, total }) => {
  let str = "";
  let space = "";
  str = toRupiah(qty) + " x " + toRupiah(price);

  for (let i = 0; i < 32 - (str.length + toRupiah(total).length); i++) {
    space = space + ` `;
  }
  return str + space + toRupiah(total);
};

const printFooter = ({ name, value }) => {
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

  printer
    .text(line(32))
    .align("RT")
    .text(displayDate(date))
    .text(time)
    .align("LT");
};

const printBody = (printer, cart, total, pay, debt, cashback) => {
  cart.forEach((product) => {
    printer
      .style("B")
      .text(product.name)
      .style("NORMAL")
      .text(printDetail(product));
  });

  printer
    .text(line(32))
    .style("B")
    .text(printFooter({ name: "total", value: toRupiah(total) }))
    .text(printFooter({ name: "bayar", value: toRupiah(pay) }));

  if (debt) {
    printer.text(printFooter({ name: "hutang", value: toRupiah(debt) }));
  }

  if (cashback) {
    printer.text(printFooter({ name: "kembali", value: toRupiah(cashback) }));
  }

  printer.style("NORMAL").text(line(32));
};

export const printStruk = async ({
  date,
  time,
  cart,
  total,
  pay,
  debt,
  cashback,
}) => {
  try {
    const store = await Store.find();
    const device = new escpos.USB();

    if (!device) throw "Printer tidak ditemukan";

    const options = { encoding: "GB18030" };
    const printer = new escpos.Printer(device, options);

    device.open(function () {
      printHeader(printer, store[0], date, time);

      printBody(printer, cart, total, pay, debt, cashback);

      printer.align("CT");

      const footerSplited = store[0].footer.split("||");
      footerSplited.forEach((footer) => {
        printer.text(footer.trim());
      });

      printer.cashdraw().cut().close();
    });
  } catch (error) {
    throw error;
  }
};
