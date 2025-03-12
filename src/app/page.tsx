"use client";

import { Dsa, dsaSheet as initialData } from "@/constants/dsa-sheet";
import { useState, useEffect } from "react";

const DSA_PROGRESS_KEY = "dsa-progress-tracker";

export default function DSATracker() {
  const [dsaItems, setDsaItems] = useState<
    (Dsa & {
      status: string;
    })[]
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

  // Custom status classes for buttons using the provided colors
  const getStatusClasses = (status: string, currentStatus: string) => {
    const baseClasses =
      "px-3 py-1 sm:px-6 sm:py-2 text-xs md:text-sm rounded-md border transition-all duration-200 cursor-pointer ";
    if (status === "pending") {
      return (
        baseClasses +
        (currentStatus === "pending"
          ? "border-red-600 bg-red-900/25 text-red-300 shadow-md hover:bg-red-900/40"
          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
      );
    } else if (status === "in-progress") {
      return (
        baseClasses +
        (currentStatus === "in-progress"
          ? "border-blue-600 bg-slate-800 text-blue-300 shadow-md hover:bg-slate-700"
          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
      );
    } else if (status === "complete") {
      return (
        baseClasses +
        (currentStatus === "complete"
          ? "border-green-600 bg-green-900/20 text-green-300 shadow-md hover:bg-green-900/30"
          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700")
      );
    }
    return baseClasses;
  };

  const stats = getProgressStats();
  const filteredItems = getFilteredItems();

  return (
    <div className="bg-[#181A1B] text-gray-100 min-h-screen transition-colors duration-200 pb-6">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#bab4ab] tracking-widest">
            Data Structure and Algorithms
          </h1>
        </div>

        {/* Progress overview */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-[#bab4ab]">
            Progress Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              onClick={() => setStatusFilter("All")}
              className={`bg-zinc-800 text-gray-200 rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                statusFilter === "All"
                  ? "border-4"
                  : "border-4 border-transparent"
              }`}
            >
              <div className="text-gray-300 text-sm">All</div>
              <div className="text-xl font-bold text-gray-400">
                {stats.total}
              </div>
            </div>
            <div
              onClick={() => setStatusFilter("complete")}
              className={`border-green-600 bg-green-900/20 text-[#bab4ab] rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                statusFilter === "complete"
                  ? "border-4"
                  : "border-4 border-transparent"
              }`}
            >
              <div className="text-green-300 text-sm">Complete</div>
              <div className="text-xl font-bold text-green-400">
                {stats.complete}
              </div>
            </div>
            <div
              onClick={() => setStatusFilter("in-progress")}
              className={`border-blue-600 bg-slate-800 text-[#bab4ab] rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                statusFilter === "in-progress"
                  ? "border-4"
                  : "border-4 border-transparent"
              }`}
            >
              <div className="text-blue-300 text-sm">In Progress</div>
              <div className="text-xl font-bold text-blue-400">
                {stats.inProgress}
              </div>
            </div>
            <div
              onClick={() => setStatusFilter("pending")}
              className={`border-red-600 bg-red-900/25 text-[#bab4ab] rounded-lg p-3 flex-1 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer ${
                statusFilter === "pending"
                  ? "border-4"
                  : "border-4 border-transparent"
              }`}
            >
              <div className="text-red-300 text-sm">Pending</div>
              <div className="text-xl font-bold text-red-400">
                {stats.pending}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden transition-colors duration-200">
            <div
              style={{
                width: `${
                  stats.total ? (stats.complete / stats.total) * 100 : 0
                }%`,
              }}
              className="h-full bg-green-600 transition-colors duration-300"
            ></div>
          </div>
          <div className="text-sm text-gray-400 mt-1 transition-colors duration-200">
            {stats.total ? Math.round((stats.complete / stats.total) * 100) : 0}
            % Complete
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-[#bab4ab]">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Category
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
          </div>
        </div>

        {/* Item list - Improved design */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg overflow-hidden border border-zinc-800 transition-colors duration-200">
          <div className="p-4 border-b border-zinc-800 transition-colors duration-200 flex justify-between">
            <h2 className="text-lg font-medium text-[#bab4ab]">DSA Topics</h2>
            <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium">
              {filteredItems.length} items
            </span>
          </div>

          <div className="divide-y divide-zinc-800 transition-colors duration-200">
            {filteredItems.map((item) => {
              const itemIndex = dsaItems.findIndex(
                (i) => i.category === item.category && i.title === item.title
              );

              return (
                <div
                  key={`${item.category}-${item.title}`}
                  className="p-5 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-[#bab4ab] text-lg">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex gap-2 text-sm text-gray-400 mb-3">
                        <span className="px-2 py-0.5 bg-zinc-800 rounded-md">
                          {item.category}
                        </span>
                        <span className="px-2 py-0.5 bg-zinc-800 rounded-md">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => updateItemStatus(itemIndex, "pending")}
                        className={getStatusClasses("pending", item.status)}
                      >
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          updateItemStatus(itemIndex, "in-progress")
                        }
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
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <p>No items match your filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
