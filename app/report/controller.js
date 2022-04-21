import Report from "./model.js";

export const getAllReport = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ data: reports });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteReportById = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
