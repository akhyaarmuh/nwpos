import { toRupiah } from "./index.js";
import escpos from "escpos";
import serial from "escpos-serialport";
import screenDisplay from "escpos-screen";
escpos.Serial = serial;
escpos.Screen = screenDisplay;

let myInterval;

export default async (req, res) => {
  clearInterval(myInterval);
  const type = req.body.type;
  const port = req.body.port || "COM3";
  const content = req.body.content;

  try {
    if (type === "home") {
      displayHome(port, content.line1, content.line2);
    } else if (type === "detail") {
      displayDetail(port, content);
    } else if (type === "total") {
      displayTotal(port, content);
    } else if (type === "pay") {
      displayPay(port, content);
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const displayHome = (port, line1, line2) => {
  let space1 = "";
  let space1back = "";
  const centerLine1 = Math.ceil((20 - line1.length) / 2);
  for (let i = 0; i < centerLine1; i++) {
    space1 = space1 + " ";
  }
  for (let i = 0; i < 20 - (centerLine1 + line1.length); i++) {
    space1back = space1back + " ";
  }

  if (line2.length > 20) {
    let runningText = "     " + line2 + "     ";
    myInterval = setInterval(() => {
      const [device, screen] = getScreenDevice(port);

      const arr = runningText.split("");
      const out = arr.shift();
      arr.push(out);
      runningText = arr.join("");

      device.open(() => {
        screen.moveHome();
        screen.horizontalScroll();
        screen.text(space1 + line1 + space1back);
        screen.move(1, 2);
        screen.horizontalScroll();
        screen.text(runningText.slice(0, 20));
        screen.close();
      });
    }, 700);
  } else {
    let space2 = "";
    let space2back = "";
    const centerLine2 = Math.ceil((20 - line2.length) / 2);
    for (let i = 0; i < centerLine2; i++) {
      space2 = space2 + " ";
    }
    for (let i = 0; i < 20 - (centerLine2 + line2.length); i++) {
      space2back = space2back + " ";
    }

    const [device, screen] = getScreenDevice(port);
    device.open(() => {
      // screen.clear();
      screen.moveHome();
      screen.horizontalScroll();
      screen.text(space1 + line1 + space1back);
      screen.move(1, 2);
      screen.horizontalScroll();
      screen.text(space2 + line2 + space2back);
      screen.close();
    });
  }
};

const displayDetail = (port, content) => {
  const price = toRupiah(content.priceSelected);
  const qty = toRupiah(content.qty);
  const total = toRupiah(content.total);
  const calc = " x ";
  let spaces = "";
  let backSpaces = "";
  for (
    let i = 0;
    i < 20 - (price.length + qty.length + total.length + 3);
    i++
  ) {
    spaces = spaces + " ";
  }
  for (let i = 0; i < 20 - content.name.length; i++) {
    backSpaces = backSpaces + " ";
  }

  const [device, screen] = getScreenDevice(port);

  device.open(() => {
    // screen.clear();
    screen.moveHome();
    screen.horizontalScroll();
    screen.text(content.name.slice(0, 20) + backSpaces);
    screen.move(1, 2);
    screen.horizontalScroll();
    screen.text(price + calc + qty + spaces + total);
    screen.close();
  });
};

const displayTotal = (port, content) => {
  const total = toRupiah(content.total);
  let spaces = "";
  for (let i = 0; i < 20 - total.length; i++) {
    spaces = spaces + " ";
  }

  const [device, screen] = getScreenDevice(port);
  device.open(() => {
    // screen.clear();
    screen.moveHome();
    screen.horizontalScroll();
    screen.text("Total:" + "              ");
    screen.move(1, 2);
    screen.horizontalScroll();
    screen.text(spaces + total);
    screen.close();
  });
};

const displayPay = (port, content) => {
  let spacesPay = "",
    spacesCashback = "";
  const pay = toRupiah(content.pay);
  const cashback = toRupiah(content.cashback);
  for (let i = 0; i < 20 - (9 + pay.length); i++) {
    spacesPay = spacesPay + " ";
  }
  for (let i = 0; i < 20 - (9 + cashback.length); i++) {
    spacesCashback = spacesCashback + " ";
  }

  const [device, screen] = getScreenDevice(port);
  device.open(() => {
    // screen.clear();
    screen.moveHome();
    screen.horizontalScroll();
    screen.text("BAYAR  : " + pay + spacesPay);
    screen.move(1, 2);
    screen.horizontalScroll();
    screen.text("KEMBALI: " + cashback + spacesCashback);
    screen.close();
  });
};

const getScreenDevice = (port) => {
  const device = new escpos.Serial(port);
  const screen = new escpos.Screen(device);

  return [device, screen];
};
