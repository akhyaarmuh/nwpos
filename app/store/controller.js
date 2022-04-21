import Store from "./model.js";

export const getStore = async (req, res) => {
  try {
    const store = await Store.find();
    res.status(200).json({ data: store[0] });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const updateStore = async (req, res) => {
  try {
    const store = await Store.find();
    await Store.findOneAndUpdate({ _id: store[0]._id }, req.body);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
