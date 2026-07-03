import KPI from "../models/Kpi.model.js";

export const toggleKPIVisibility = async (req, res) => {
  try {

    const kpi = await KPI.findById(req.params.id);

    if (!kpi) {
      return res.status(404).json({
        success: false,
        message: "KPI not found",
      });
    }

    kpi.isVisible = !kpi.isVisible;

    await kpi.save();

    res.status(200).json({
      success: true,
      kpi,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};