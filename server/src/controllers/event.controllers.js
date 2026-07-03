import Event from "../models/Event.model.js";

// POST /api/v1/events  — ingest a raw event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/events  — list all events (paginated)
export const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 50, source, eventName } = req.query;
    const filter = {};
    if (source) filter.source = source;
    if (eventName) filter.eventName = eventName;

    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Event.countDocuments(filter);
    res.json({ success: true, total, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/events/ga-report  — GA-style events report
export const getGAReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to)   match.createdAt.$lte = new Date(to);
    }

    const report = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$eventName",
          count:          { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
          totalValue:     { $sum: { $toDouble: { $ifNull: ["$eventValue", 0] } } },
        },
      },
      {
        $project: {
          eventName:      "$_id",
          count:          1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
          totalValue:     1,
          _id:            0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/events/traffic  — sessions/visitors over time
export const getTrafficAnalysis = async (req, res) => {
  try {
    const { from, to, groupBy = "day" } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to)   match.createdAt.$lte = new Date(to);
    }

    const dateFormat = groupBy === "hour" ? "%Y-%m-%dT%H:00" : "%Y-%m-%d";

    const traffic = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date:    { $dateToString: { format: dateFormat, date: "$createdAt" } },
            source:  "$source",
          },
          sessions:       { $addToSet: "$sessionId" },
          uniqueVisitors: { $addToSet: "$visitorId" },
          pageviews:      { $sum: 1 },
        },
      },
      {
        $project: {
          date:           "$_id.date",
          source:         "$_id.source",
          sessions:       { $size: "$sessions" },
          uniqueVisitors: { $size: "$uniqueVisitors" },
          pageviews:      1,
          _id:            0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // source breakdown
    const sourceBreakdown = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id:     "$source",
          visits:  { $sum: 1 },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      {
        $project: {
          source:   "$_id",
          visits:   1,
          visitors: { $size: "$visitors" },
          _id:      0,
        },
      },
      { $sort: { visits: -1 } },
    ]);

    res.json({ success: true, traffic, sourceBreakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/events/custom  — custom event aggregation by type
export const getCustomEvents = async (req, res) => {
  try {
    const { source, eventName, type } = req.query;
    const match = {};
    if (source)    match.source    = source;
    if (eventName) match.eventName = eventName;
    if (type)      match.type      = type;

    const data = await Event.aggregate([
      { $match: match },
      {
        $group: {
          _id:   { eventName: "$eventName", source: "$source", type: "$type" },
          count:          { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
          sum:            { $sum: { $toDouble: { $ifNull: ["$eventValue", 0] } } },
        },
      },
      {
        $project: {
          eventName:      "$_id.eventName",
          source:         "$_id.source",
          type:           "$_id.type",
          count:          1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
          sum:            1,
          result: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id.type", "sum"]    }, then: "$sum"   },
                { case: { $eq: ["$_id.type", "unique"] }, then: { $size: "$uniqueVisitors" } },
              ],
              default: "$count",
            },
          },
          _id: 0,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getEventNames = async (
  req,
  res
) => {
  try {
    const eventNames =
      await Event.distinct(
        "eventName"
      );

    res.status(200).json({
      success: true,
      eventNames,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};