import React, { useEffect, useState } from "react";
import { Settings, PlusCircle, BarChart3 } from "lucide-react";
import api from "../utils/api";

export default function Configurations() {
  const [configs, setConfig] = useState([]);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [eventName, setEventName] = useState("");
  const [aggregationType, setAggregationType] = useState("count");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
    loadConfigs();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await api.get("/events/names");

      if (response.success) {
        setEvents(response.eventNames);

        if (response.eventNames.length > 0) {
          setEventName(response.eventNames[0]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await api.post("/kpi/config", {
      title,
      eventName,
      aggregationType,
    });

    if (response.success) {
      alert("KPI Created Successfully");

      loadConfigs(); // ← add this

      setTitle("");
      setEventName("");
      setAggregationType("count");
    }
  };

  const loadConfigs = async () => {
    try {
      const res = await api.get("/kpi/config");
      console.log("Config Response", res);
      if (res.success) {
        setConfig(res.kpis);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this KPI?",
    );

    if (!confirmed) return;

    try {
      const res = await api.delete(`/kpi/config/${id}`);

      if (res.success) {
        loadConfigs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/kpi/config/${id}/toggle`);

      if (res.success) {
        loadConfigs();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Settings size={30} className="text-indigo-600" />

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              KPI Configuration
            </h1>

            <p className="text-gray-500 mt-1">
              Create custom metrics that will automatically appear on your
              dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Card */}
        <div className="lg:col-span-2">
          '{/* KPI Configurations Table */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Existing KPI Configurations
            </h3>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Title</th>

                  <th className="text-left p-3">Event</th>

                  <th className="text-left p-3">Type</th>

                  <th className="text-left p-3">Visible</th>

                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {configs?.map((kpi) => (
                  <tr key={kpi._id} className="border-b">
                    <td className="p-3">{kpi.title}</td>

                    <td className="p-3">{kpi.eventName}</td>

                    <td className="p-3">{kpi.aggregationType}</td>

                    <td>
                      <button
                        onClick={() => handleToggle(kpi._id)}
                        className={
                          kpi.isVisible
                            ? "bg-green-500 text-white px-3 py-1 rounded"
                            : "bg-gray-500 text-white px-3 py-1 rounded"
                        }
                      >
                        {kpi.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(kpi._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle size={22} className="text-indigo-600" />

              <h2 className="text-lg font-semibold text-gray-800">
                Create KPI
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* KPI Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KPI Title
                </label>

                <input
                  type="text"
                  placeholder="Revenue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  required
                />
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Name
                </label>

                <select
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  {events.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              {/* Aggregation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aggregation Type
                </label>

                <select
                  value={aggregationType}
                  onChange={(e) => setAggregationType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option value="count">Count</option>

                  <option value="sum">Sum</option>

                  <option value="unique">Unique Count</option>
                </select>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
              >
                {loading ? "Creating KPI..." : "Create KPI"}
              </button>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={20} className="text-emerald-500" />

              <h3 className="font-semibold text-gray-800">How KPIs Work</h3>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Select an existing event and choose how it should be calculated.
              </p>

              <div className="bg-gray-50 rounded-lg p-3">
                <strong>Count</strong>
                <p>Counts how many times an event occurred.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <strong>Sum</strong>
                <p>Adds all event values together.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <strong>Unique Count</strong>
                <p>Counts unique visitors who triggered the event.</p>
              </div>
            </div>
          </div>

          {/* Existing Events */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
            <h3 className="font-semibold text-gray-800 mb-4">
              Available Events
            </h3>

            <div className="flex flex-wrap gap-2">
              {events.map((event) => (
                <span
                  key={event}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
                >
                  {event}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
