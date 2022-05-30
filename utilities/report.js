import Sale from "../app/sale/model.js";
import Report from "../app/report/model.js";

const reportYear = async () => {
  const date = new Date();
  const oldYear = date.getFullYear() - 1;
  const month = date.getMonth();

  const allSale = await Sale.find({ date: new RegExp(`${oldYear}`) });
  if (!allSale[0]) return;

  if (month === 0) return;

  await Report.deleteMany({ moment: new RegExp(`${oldYear}`) });

  const sale = allSale.reduce((tot, num) => tot + num.total, 0);
  const profit = allSale.reduce((tot, num) => tot + num.profit, 0);

  const newReport = new Report({ moment: `Tahun ${oldYear}`, profit, sale });
  await newReport.save();

  await Sale.deleteMany({ date: new RegExp(`${oldYear}`) });
};

const reportMonth = async () => {
  const date = new Date();
  const months = [];
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month === 0) {
    const sales = await Sale.find({ date: new RegExp(`11 ${year - 1}`) });
    if (!sales[0]) return;
    const sale = sales.reduce((tot, num) => tot + num.total, 0);
    const profit = sales.reduce((tot, num) => tot + num.profit, 0);

    const newReport = new Report({
      moment: `Bulan: 11 ${year - 1}`,
      sale,
      profit,
    });
    await newReport.save();
    return;
  }

  for (let i = month - 1; i >= 0; i--) {
    const sale = await Sale.findOne({ date: new RegExp(`${i} ${year}`) });
    if (sale) {
      const report = await Report.findOne({
        moment: new RegExp(`${i} ${year}`),
      });
      if (!report) {
        months.unshift(i);
      }
    }
  }

  months.forEach(async (month) => {
    const sales = await Sale.find({ date: new RegExp(`${month} ${year}`) });
    const sale = sales.reduce((tot, num) => tot + num.total, 0);
    const profit = sales.reduce((tot, num) => tot + num.profit, 0);
    const newReport = new Report({
      moment: `Bulan: ${month} ${year}`,
      sale,
      profit,
    });
    await newReport.save();
  });
};

export default async () => {
  await reportYear();
  await reportMonth();
};
