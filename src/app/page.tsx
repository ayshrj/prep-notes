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

  // Updated dark-only status classes for buttons
  const getStatusClasses = (status: string, currentStatus: string) => {
    const baseClasses = "px-3 py-1 text-xs rounded-md border ";
    if (status === "pending") {
      return (
        baseClasses +
        (currentStatus === "pending"
          ? "bg-zinc-800 text-zinc-200 border-zinc-700"
          : "bg-gray-700 text-gray-300 border-gray-600")
      );
    } else if (status === "in-progress") {
      return (
        baseClasses +
        (currentStatus === "in-progress"
          ? "bg-stone-800 text-stone-200 border-stone-700"
          : "bg-gray-700 text-gray-300 border-gray-600")
      );
    } else if (status === "complete") {
      return (
        baseClasses +
        (currentStatus === "complete"
          ? "bg-gray-900 text-white border-gray-800"
          : "bg-gray-700 text-gray-300 border-gray-600")
      );
    }
    return baseClasses;
  };

  const stats = getProgressStats();
  const filteredItems = getFilteredItems();

  return (
    <div className="bg-black text-gray-100 min-h-screen transition-colors duration-200 pb-6">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">DSA Progress Tracker</h1>
        </div>

        {/* Progress overview */}
        <div className="bg-zinc-900 rounded-lg shadow p-4 mb-6 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3">Progress Overview</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-zinc-800 text-gray-200 rounded p-3 flex-1 transition-colors duration-200">
              <div className="text-gray-400 text-sm">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gray-800 text-white rounded p-3 flex-1 transition-colors duration-200">
              <div className="text-gray-300 text-sm">Complete</div>
              <div className="text-xl font-bold">{stats.complete}</div>
            </div>
            <div className="bg-zinc-800 text-zinc-200 rounded p-3 flex-1 transition-colors duration-200">
              <div className="text-zinc-300 text-sm">In Progress</div>
              <div className="text-xl font-bold">{stats.inProgress}</div>
            </div>
            <div className="bg-stone-800 text-stone-200 rounded p-3 flex-1 transition-colors duration-200">
              <div className="text-stone-300 text-sm">Pending</div>
              <div className="text-xl font-bold">{stats.pending}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-zinc-700 rounded-full overflow-hidden transition-colors duration-200">
            <div
              style={{ width: `${(stats.complete / stats.total) * 100}%` }}
              className="h-full bg-zinc-400"
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1 transition-colors duration-200">
            {Math.round((stats.complete / stats.total) * 100)}% Complete
          </div>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-lg shadow p-4 mb-6 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-colors duration-200"
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
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-colors duration-200"
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
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white transition-colors duration-200"
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
        <div className="bg-zinc-900 rounded-lg shadow overflow-hidden transition-colors duration-200">
          <div className="p-4 border-b border-zinc-800 transition-colors duration-200">
            <h2 className="text-lg font-medium">
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
                  className="p-4 hover:bg-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full border ${
                          item.status === "pending"
                            ? "bg-stone-800 text-stone-200 border-stone-700"
                            : item.status === "in-progress"
                            ? "bg-zinc-800 text-zinc-200 border-zinc-700"
                            : "bg-gray-900 text-white border-gray-800"
                        }`}
                      >
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
