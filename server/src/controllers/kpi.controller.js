import KPI from "../models/KPI.model.js";
import Event from "../models/Event.model.js";

export const getKPIs = async (req, res) => {
  try {
    const kpis = await KPI.find({
      isVisible: true,
    });

    const result = [];

    for (const kpi of kpis) {
      let value = 0;

      if (kpi.aggregationType === "count") {
        value = await Event.countDocuments({
          eventName: kpi.eventName,
        });
      }

      else if (kpi.aggregationType === "sum") {
        const sumResult = await Event.aggregate([
          {
            $match: {
              eventName: kpi.eventName,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $toDouble: "$eventValue",
                },
              },
            },
          },
        ]);

        value = sumResult[0]?.total || 0;
      }

      else if (kpi.aggregationType === "unique") {
        const uniqueVisitors =
          await Event.distinct(
            "visitorId",
            {
              eventName: kpi.eventName,
            }
          );

        value = uniqueVisitors.length;
      }

      result.push({
        title: kpi.title,
        eventName: kpi.eventName,
        type: kpi.aggregationType,
        value,
      });
    }

    res.status(200).json({
      success: true,
      kpis: result,
    });
  }

  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const createKPI = async (req, res) => {
  try {
    const {
      title,
      eventName,
      aggregationType,
    } = req.body;

    const kpi = await KPI.create({
      title,
      eventName,
      aggregationType,
    });

    res.status(201).json({
      success: true,
      kpi,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllKPIConfigs = async (
  req,
  res
) => {
  try {
    const kpis = await KPI.find();

    res.status(200).json({
      success: true,
      kpis,
    });
  }

  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const deleteKPI = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Deleting KPI:", id);

    const deletedKPI = await KPI.findByIdAndDelete(id);

    if (!deletedKPI) {
      return res.status(404).json({
        success: false,
        message: "KPI not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "KPI deleted successfully",
      deletedKPI,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};