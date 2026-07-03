import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    eventName: { type: String, required: true },
    visitorId:  { type: String, required: true },
    sessionId:  { type: String, required: true },
    source:     { type: String, default: "direct" },
    page:       { type: String, default: "/" },
    country:    { type: String, default: "Unknown" },
    eventValue: { type: mongoose.Schema.Types.Mixed, default: null },
    type:       { type: String, enum: ["sum", "count", "unique"], default: "count" },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
