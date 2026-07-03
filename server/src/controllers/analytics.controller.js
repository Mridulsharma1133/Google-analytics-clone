import Event from "../models/Event.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const [
      topEvents,
      topPages,
      topSources,
      topCountries,
      recentEvents,
      dailyTrend,
    ] = await Promise.all([

      // Top Events
      Event.aggregate([
        {
          $group: {
            _id: "$eventName",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            eventName: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Top Pages
      Event.aggregate([
        {
          $group: {
            _id: "$page",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            page: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Top Sources
      Event.aggregate([
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            source: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Top Countries
      Event.aggregate([
        {
          $group: {
            _id: "$country",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            country: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Recent Events
      Event.find()
        .sort({ createdAt: -1 })
        .limit(20)
        .select(
          "eventName page source country visitorId createdAt"
        ),

      // Daily Trend
      Event.aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
            events: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            events: 1,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        topEvents,
        topPages,
        topSources,
        topCountries,
        recentEvents,
        dailyTrend,
      },
    });

  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};