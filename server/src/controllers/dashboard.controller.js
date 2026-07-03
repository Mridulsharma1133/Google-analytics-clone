import Event from "../models/Event.model.js";
import User from "../models/User.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const last7  = new Date(now - 7  * 24 * 60 * 60 * 1000);

    const [totalEvents, recentEvents, uniqueVisitors, topEvents, dailyTrend] =
      await Promise.all([
        Event.countDocuments(),
        Event.countDocuments({ createdAt: { $gte: last30 } }),
        Event.distinct("visitorId", { createdAt: { $gte: last30 } }),
        Event.aggregate([
          { $match: { createdAt: { $gte: last30 } } },
          { $group: { _id: "$eventName", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 },
          { $project: { eventName: "$_id", count: 1, _id: 0 } },
        ]),
        Event.aggregate([
          { $match: { createdAt: { $gte: last7 } } },
          {
            $group: {
              _id:    { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              events: { $sum: 1 },
              visitors: { $addToSet: "$visitorId" },
            },
          },
          {
            $project: {
              date:     "$_id",
              events:   1,
              visitors: { $size: "$visitors" },
              _id:      0,
            },
          },
          { $sort: { date: 1 } },
        ]),
      ]);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      stats: {
        totalEvents,
        recentEvents,
        uniqueVisitors: uniqueVisitors.length,
        totalUsers,
        topEvents,
        dailyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
