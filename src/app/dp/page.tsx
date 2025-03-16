"use client";

import { dpLinks as links } from "@/constants/dp-links";
import { Dsa } from "@/constants/dsa-sheet";
import React, { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout"; // <--- import
import { getStatusClasses } from "@/utils/getStatusClasses";

const PROGRESS_KEY = "dp-progress-tracker";

const DSAProblemTracker = () => {
  /** ------------------------------
   *  1) Prepare data & local state
   */
  const extractProblemName = (url: string) => {
    try {
      const urlObj = new URL(url);

      // For atcoder links
      if (url.includes("atcoder.jp")) {
        return "Frog Jump 2";
      }

      // For naukri links
      if (url.includes("naukri.com")) {
        const path = urlObj.pathname;
        const problemSegment = path.split("/").pop();

        // Extract name from the final path segment
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

  // Build initial data from your dpLinks
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

  const [dsaItems, setDsaItems] = useState<
    (Dsa & { status: string; id: number; url?: string })[]
  >([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");

  /** ------------------------------
   *  2) Load from localStorage or defaults
   */
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      setDsaItems(JSON.parse(savedProgress));
    } else {
      const initialItems = createInitialData();
      setDsaItems(initialItems);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(initialItems));
    }
  }, []);

  /** ------------------------------
   *  3) Build filter dropdowns after we load items
   */
  useEffect(() => {
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

  /** ------------------------------
   *  4) Update a problem's status
   */
  const updateItemStatus = (index: number, newStatus: string) => {
    const updatedItems = [...dsaItems];
    updatedItems[index].status = newStatus;
    setDsaItems(updatedItems);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updatedItems));
  };

  /** ------------------------------
   *  5) Filter / Search logic
   */
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

  /** ------------------------------
   *  6) Stats
   */
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

  // Derived data
  const stats = getProgressStats();
  const filteredItems = getFilteredItems();

  /** ------------------------------
   *  7) Final render using our shared layout
   */
  return (
    <TrackerLayout
      pageTitle="Dynamic Programming Problems"
      stats={stats}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      categories={categories}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      types={types}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      showSearch={true} // enable the search bar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      listTitle="Problem List"
      filteredItemsLength={filteredItems.length}
    >
      {/* The actual item list goes here as children */}
      <div className="divide-y divide-zinc-800 transition-colors duration-200">
        {filteredItems.map((item, idx) => {
          const itemIndex = dsaItems.findIndex((i) => i.id === item.id);
          return (
            <div
              key={idx}
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
                    onClick={() => updateItemStatus(itemIndex, "in-progress")}
                    className={getStatusClasses("in-progress", item.status)}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateItemStatus(itemIndex, "complete")}
                    className={getStatusClasses("complete", item.status)}
                  >
                    Completed
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
    </TrackerLayout>
  );
};

export default DSAProblemTracker;
