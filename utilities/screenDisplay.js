import escpos from "escpos";
import usb from "escpos-usb";
escpos.USB = usb;

const device = new escpos.USB.findPrinter();
console.log(device.length);
// const printer = new escpos.Printer(device);
