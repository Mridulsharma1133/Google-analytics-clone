// models/KPI.js

import mongoose from "mongoose";
const kpiSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    eventName: {
      type: String,
      required: true
    },

    aggregationType: {
      type: String,
      enum: ["count", "sum", "unique"],
      default: "count"
    },

    isVisible: {
      type: Boolean,
      default: true
    },

    dashboardOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const KPI =
  mongoose.models.KPI ||
  mongoose.model("KPI", kpiSchema);
export default KPI