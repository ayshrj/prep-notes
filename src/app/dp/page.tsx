"use client";

import { dpLinks as links } from "@/constants/dp-links";
import { Dsa } from "@/constants/dsa-sheet";
import React, { useState, useEffect } from "react";

const DSAProblemTracker = () => {
  // Extract problem names and create initial data
  const extractProblemName = (url: string) => {
    try {
      const urlObj = new URL(url);

      // For atcoder links
      if (url.includes("atcoder.jp")) {
        return "Frog Jump 2";
      }

      // For naukri.com links
      if (url.includes("naukri.com")) {
        const path = urlObj.pathname;
        const problemSegment = path.split("/").pop();

        // Extract problem name from the segment
        const nameMatch = problemSegment?.match(/([a-zA-Z0-9-]+)_\d+/);
        if (nameMatch && nameMatch[1]) {
          return nameMatch[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }
      }

      return "Unknown Problem";
    } catch (error) {
      console.log(error);
      return "Invalid URL";
    }
  };

  // Initial data structure
  const createInitialData = () => {
    return links.map((link, index) => ({
      id: index,
      title: extractProblemName(link.url),
      url: link.url,
      category:
        index < 1
          ? "Introduction to DP"
          : index < 6
          ? "1D DP"
          : index < 13
          ? "2D/3D DP and DP on Grids"
          : index < 24
          ? "DP on Subsequences"
          : index < 34
          ? "DP on Strings"
          : index < 40
          ? "DP on Stocks"
          : index < 47
          ? "DP on LIS"
          : index < 54
          ? "MCM DP | Partition DP"
          : "DP on Squares",
      type: link.diff,
      status: "pending",
    }));
  };

  const PROGRESS_KEY = "dp-progress-tracker";
  const [dsaItems, setDsaItems] = useState<
    (Dsa & {
      status: string;
      id: number;
      url?: string;
    })[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Initialize from localStorage or set defaults
    const loadData = () => {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);

      if (savedProgress) {
        setDsaItems(JSON.parse(savedProgress));
      } else {
        const initialItems = createInitialData();
        setDsaItems(initialItems);
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(initialItems));
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
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedItems));
  };

  const getFilteredItems = () => {
    return dsaItems.filter((item) => {
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesType = typeFilter === "All" || item.type === typeFilter;
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesType && matchesStatus && matchesSearch;
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

  // Custom status classes for buttons
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
            Dynamic Programming Problems
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
              <div className="text-green-300 text-sm">Completed</div>
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
            % Completed
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-[#bab4ab]">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Category
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
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
                {types.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Search
              </label>
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Item list */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg overflow-hidden border border-zinc-800 transition-colors duration-200">
          <div className="p-4 border-b border-zinc-800 transition-colors duration-200 flex justify-between">
            <h2 className="text-lg font-medium text-[#bab4ab]">Problem List</h2>
            <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium">
              {filteredItems.length} items
            </span>
          </div>

          <div className="divide-y divide-zinc-800 transition-colors duration-200">
            {filteredItems.map((item, index) => {
              const itemIndex = dsaItems.findIndex((i) => i.id === item.id);
              return (
                <div
                  key={index}
                  className="p-5 hover:bg-zinc-800/50 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[#bab4ab] text-lg hover:underline"
                        >
                          {item.title}
                        </a>
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
};

export default DSAProblemTracker;
