import mongoose from "mongoose";

const getDate = (date) => {
  const splited = date.split(" ");
  const month = splited[1];
  let bulan;

  switch (month) {
    case "Januari":
      bulan = 0;
      break;
    case "Februari":
      bulan = 1;
      break;
    case "Maret":
      bulan = 2;
      break;
    case "April":
      bulan = 3;
      break;
    case "Mei":
      bulan = 4;
      break;
    case "Juni":
      bulan = 5;
      break;
    case "Juli":
      bulan = 6;
      break;
    case "Agustus":
      bulan = 7;
      break;
    case "September":
      bulan = 8;
      break;
    case "Oktober":
      bulan = 9;
      break;
    case "November":
      bulan = 10;
      break;
    case "Desember":
      bulan = 11;
  }

  return `${splited[0]} ${bulan} ${splited[2]}`;
};

const productSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true],
  },
  desc: {
    type: String,
  },
  units: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: [true],
    },
  ],
  modal: {
    type: Number,
    required: [true],
  },
  stock: {
    type: Number,
    required: [true],
  },
  unit: {
    type: Object,
    required: [true],
  },
  price: {
    type: Object,
    required: [true],
  },
  salePrice: {
    type: Object,
    required: [true],
  },
});
const productUpdatedSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: [true],
    },
    name: {
      type: String,
      required: [true],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true],
    },
    desc: {
      type: String,
    },
    units: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Unit",
        required: [true],
      },
    ],
    modal: {
      type: Number,
      required: [true],
    },
    stock: {
      type: Number,
      required: [true],
    },
    unit: {
      type: Object,
      required: [true],
    },
    price: {
      type: Object,
      required: [true],
      default: 0,
    },
    salePrice: {
      type: Object,
      required: [true],
      default: 0,
    },
  },
  { timestamps: true }
);

const saleSchema = new mongoose.Schema({
  invoice: {
    type: String,
    required: [true, "Invoice harus diisi"],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  keuntungan: {
    type: Number,
    required: [true, "Keuntungan harus diisi"],
  },
  cart: [
    {
      type: Object,
      required: [true, "Barang jual harus diisi"],
    },
  ],
  date: {
    type: String,
    required: [true, "date harus diisi"],
  },
  time: {
    type: String,
    required: [true, "time Harus diisi"],
  },
  status: {
    type: Boolean,
    required: [true, "Satuan Harus diisi"],
  },
  hutang: {
    type: Number,
  },
  credit: {
    type: Array,
  },
});
const saleUpdatedSchema = new mongoose.Schema(
  {
    invoice: {
      type: String,
      required: [true],
    },
    cart: [
      {
        type: Object,
        required: [true],
      },
    ],
    date: {
      type: String,
      required: [true],
    },
    time: {
      type: String,
      required: [true],
    },
    profit: {
      type: Number,
      required: [true],
    },
    total: {
      type: Number,
      required: [true],
    },
    debt: {
      type: Number,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    payHistory: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
const ProductUpdated = mongoose.model("ProductUpdated", productUpdatedSchema);

const Sale = mongoose.model("Sale", saleSchema);
const SaleUpdated = mongoose.model("SaleUpdated", saleUpdatedSchema);

mongoose.connect("mongodb://127.0.0.1:27017/halim");

mongoose.connection.on("open", () => {
  console.log("database connected");
});

// ini update product
const products = await Product.find();
let arr = [];
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
products.forEach((product) => {
  if (
    isEmpty(product.price.ecer) ||
    isEmpty(product.price.partai) ||
    isEmpty(product.unit)
  )
    return;

  arr.push({
    _id: product._id,
    barcode: product.barcode,
    name: product.name,
    category: product.category,
    desc: product.nett,
    units: product.units,
    modal: product.modal,
    stock: product.stock,
    unit: product.unit,
    price: product.price.ecer,
    salePrice: product.price.partai,
  });
});
await ProductUpdated.insertMany(arr);
// akhir update product

// ini update sale
const sales = await Sale.find();
let sale = [];
sales.forEach((sal) => {
  const payload = {
    _id: sal._id,
    invoice: sal.invoice,
    cart: sal.cart.map((pro) => ({
      _id: pro._id,
      name: pro.name,
      unit: pro.unit,
      unitQty: pro.ket.unit[pro.unit],
      price: pro.price,
      qty: pro.qty,
      qtyInput: pro.qty,
      total: pro.total,
      modal: pro.ket.modal,
      profit: (pro.total - pro.modal) / pro.qty,
    })),
    date: getDate(sal.date),
    time: sal.time,
    profit: sal.keuntungan,
    total: sal.cart.reduce((tot, num) => tot + num.total, 0),
    payHistory: sal.credit,
  };

  if (sal.hutang) {
    payload.debt = sal.hutang;
  }

  if (sal.customer) {
    payload.customer = sal.customer;
  }

  sale.push(payload);
});
await SaleUpdated.insertMany(sale);
// ini akhir update sale

console.log("update selesai");
