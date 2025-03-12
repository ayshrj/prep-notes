"use client";

import { dsaSheet as initialData } from "@/constants/dsa-sheet";
import { useState, useEffect } from "react";

const DSA_PROGRESS_KEY = "dsa-progress-tracker";

export default function DSATracker() {
  const [dsaItems, setDsaItems] = useState<
    {
      status: string;
      category: string;
      title: string;
      type: string;
    }[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);

  useEffect(() => {
    // Initialize from localStorage or set defaults
    const loadData = () => {
      const savedProgress = localStorage.getItem(DSA_PROGRESS_KEY);

      if (savedProgress) {
        setDsaItems(JSON.parse(savedProgress));
      } else {
        const initialItems = initialData.map((item) => ({
          ...item,
          status: "pending",
        }));
        setDsaItems(initialItems);
        localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(initialItems));
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Extract unique categories and types for filters
    if (dsaItems.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(dsaItems.map((item) => item.category)),
      ];
      const uniqueTypes = [
        "All",
        ...new Set(dsaItems.map((item) => item.type)),
      ];

      setCategories(uniqueCategories);
      setTypes(uniqueTypes);
    }
  }, [dsaItems]);

  const updateItemStatus = (index: number, newStatus: string) => {
    const updatedItems = [...dsaItems];
    updatedItems[index].status = newStatus;
    setDsaItems(updatedItems);
    localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(updatedItems));
  };

  const getFilteredItems = () => {
    return dsaItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesType = typeFilter === "All" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesCategory && matchesType && matchesStatus;
    });
  };

  const getProgressStats = () => {
    const total = dsaItems.length;
    const complete = dsaItems.filter(
      (item) => item.status === "complete"
    ).length;
    const inProgress = dsaItems.filter(
      (item) => item.status === "in-progress"
    ).length;
    const pending = dsaItems.filter((item) => item.status === "pending").length;

    return { total, complete, inProgress, pending };
  };

  // Enhanced colorful status classes for buttons
  const getStatusClasses = (status: string, currentStatus: string) => {
    const baseClasses =
      "px-3 py-1 text-xs rounded-md border transition-all duration-200 ";
    if (status === "pending") {
      return (
        baseClasses +
        (currentStatus === "pending"
          ? "bg-red-900 text-red-100 border-red-800 shadow-md hover:bg-red-800"
          : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
      );
    } else if (status === "in-progress") {
      return (
        baseClasses +
        (currentStatus === "in-progress"
          ? "bg-indigo-900 text-indigo-100 border-indigo-800 shadow-md hover:bg-indigo-800"
          : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
      );
    } else if (status === "complete") {
      return (
        baseClasses +
        (currentStatus === "complete"
          ? "bg-emerald-900 text-emerald-100 border-emerald-800 shadow-md hover:bg-emerald-800"
          : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700")
      );
    }
    return baseClasses;
  };

  const getStatusTagClasses = (status: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 rounded-full border ";
    if (status === "pending") {
      return baseClasses + "bg-red-900 text-red-100 border-red-800";
    } else if (status === "in-progress") {
      return baseClasses + "bg-indigo-900 text-indigo-100 border-indigo-800";
    }
    return baseClasses + "bg-emerald-900 text-emerald-100 border-emerald-800";
  };

  const stats = getProgressStats();
  const filteredItems = getFilteredItems();

  return (
    <div className="bg-black text-gray-100 min-h-screen transition-colors duration-200 pb-6">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            DSA Progress Tracker
          </h1>
        </div>

        {/* Progress overview */}
        <div className="bg-zinc-900 rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-white">
            Progress Overview
          </h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-zinc-800 text-gray-200 rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg border border-zinc-700">
              <div className="text-gray-400 text-sm">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-emerald-900 text-white rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg border border-emerald-800">
              <div className="text-emerald-200 text-sm">Complete</div>
              <div className="text-xl font-bold">{stats.complete}</div>
            </div>
            <div className="bg-indigo-900 text-white rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg border border-indigo-800">
              <div className="text-indigo-200 text-sm">In Progress</div>
              <div className="text-xl font-bold">{stats.inProgress}</div>
            </div>
            <div className="bg-red-900 text-white rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg border border-red-800">
              <div className="text-red-200 text-sm">Pending</div>
              <div className="text-xl font-bold">{stats.pending}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
            <div
              style={{ width: `${(stats.complete / stats.total) * 100}%` }}
              className="h-full bg-emerald-600"
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1 transition-colors duration-200">
            {Math.round((stats.complete / stats.total) * 100)}% Complete
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-white">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Category
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-all duration-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Type
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-all duration-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Status
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-all duration-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Item list */}
        <div className="bg-zinc-900 rounded-lg shadow-lg overflow-hidden border border-zinc-800 transition-colors duration-200">
          <div className="p-4 border-b border-zinc-800 transition-colors duration-200">
            <h2 className="text-lg font-medium text-white">
              DSA Topics ({filteredItems.length})
            </h2>
          </div>

          <div className="divide-y divide-zinc-800 transition-colors duration-200">
            {filteredItems.map((item) => {
              const itemIndex = dsaItems.findIndex(
                (i) => i.category === item.category && i.title === item.title
              );

              return (
                <div
                  key={`${item.category}-${item.title}`}
                  className="p-4 hover:bg-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <span className={getStatusTagClasses(item.status)}>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 transition-colors duration-200">
                      {item.category} • {item.type}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => updateItemStatus(itemIndex, "pending")}
                      className={getStatusClasses("pending", item.status)}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateItemStatus(itemIndex, "in-progress")}
                      className={getStatusClasses("in-progress", item.status)}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateItemStatus(itemIndex, "complete")}
                      className={getStatusClasses("complete", item.status)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
