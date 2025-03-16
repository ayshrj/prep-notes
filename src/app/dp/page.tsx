"use client";

import React, { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout";
import { dpLinks } from "@/constants/dp-links";
import { Dsa } from "@/types/Dsa";
import { getStatusClasses } from "@/utils/getStatusClasses";
import { StatusCode } from "@/enums/StatusCode";
import { codeToStatus } from "@/utils/codeToStatus";
import { statusToCode } from "@/utils/statusToCode";

const DP_PROGRESS_KEY = "dp-progress-statuses";

export default function DSAProblemTracker() {
  const extractProblemName = (url: string) => {
    try {
      const urlObj = new URL(url);

      if (url.includes("atcoder.jp")) {
        return "Frog Jump 2";
      }
      if (url.includes("naukri.com")) {
        const path = urlObj.pathname;
        const problemSegment = path.split("/").pop();
        if (problemSegment) {
          const match = problemSegment.match(/([a-zA-Z0-9-]+)_\d+/);
          if (match && match[1]) {
            return match[1]
              .split("-")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
          }
        }
      }
      return "Unknown Problem";
    } catch (error) {
      console.error(error);
      return "Invalid URL";
    }
  };

  const createInitialData = () => {
    return dpLinks.map((link, i) => {
      const category =
        i < 1
          ? "Introduction to DP"
          : i < 6
          ? "1D DP"
          : i < 13
          ? "2D/3D DP and DP on Grids"
          : i < 24
          ? "DP on Subsequences"
          : i < 34
          ? "DP on Strings"
          : i < 40
          ? "DP on Stocks"
          : i < 47
          ? "DP on LIS"
          : i < 54
          ? "MCM DP | Partition DP"
          : "DP on Squares";

      return {
        id: i,
        title: extractProblemName(link.url),
        url: link.url,
        category,
        type: link.diff,
        status: "pending" as const,
      };
    });
  };

  const [dsaItems, setDsaItems] = useState<
    (Dsa & { status: string; id: number; url?: string })[]
  >([]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);

  useEffect(() => {
    const base = createInitialData();
    const stored = localStorage.getItem(DP_PROGRESS_KEY);

    if (stored) {
      try {
        const codes = JSON.parse(stored) as number[];
        if (codes.length === base.length) {
          const merged = base.map((item, i) => ({
            ...item,
            status: codeToStatus(codes[i]),
          }));
          setDsaItems(merged);
          return;
        }
      } catch (err) {
        console.log("Error parsing stored statuses:", err);
      }
    }

    setDsaItems(base);

    localStorage.setItem(
      DP_PROGRESS_KEY,
      JSON.stringify(base.map(() => StatusCode.Pending))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dsaItems.length > 0) {
      const uniqueCategories = [
        "All",
        ...new Set(dsaItems.map((x) => x.category)),
      ];
      const uniqueTypes = ["All", ...new Set(dsaItems.map((x) => x.type))];
      setCategories(uniqueCategories);
      setTypes(uniqueTypes);
    }
  }, [dsaItems]);

  const updateItemStatus = (index: number, newStatus: string) => {
    const updated = [...dsaItems];
    updated[index].status = newStatus;
    setDsaItems(updated);

    const codes = updated.map((item) => statusToCode(item.status));
    localStorage.setItem(DP_PROGRESS_KEY, JSON.stringify(codes));
  };

  const getFilteredItems = () => {
    return dsaItems.filter((item) => {
      const catOK =
        categoryFilter === "All" || item.category === categoryFilter;
      const typeOK = typeFilter === "All" || item.type === typeFilter;
      const statusOK = statusFilter === "All" || item.status === statusFilter;
      const searchOK = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return catOK && typeOK && statusOK && searchOK;
    });
  };

  const getStats = () => {
    const total = dsaItems.length;
    const completed = dsaItems.filter((x) => x.status === "completed").length;
    const inProgress = dsaItems.filter(
      (x) => x.status === "in-progress"
    ).length;
    const pending = dsaItems.filter((x) => x.status === "pending").length;
    return { total, completed, inProgress, pending };
  };

  const stats = getStats();
  const filtered = getFilteredItems();

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
      showSearch={true}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      listTitle="Problem List"
      filteredItemsLength={filtered.length}
    >
      <div className="divide-y divide-zinc-800 transition-colors duration-200">
        {filtered.map((item) => {
          const actualIndex = dsaItems.findIndex((x) => x.id === item.id);
          return (
            <div
              key={item.id}
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
                    onClick={() => updateItemStatus(actualIndex, "pending")}
                    className={getStatusClasses("pending", item.status)}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateItemStatus(actualIndex, "in-progress")}
                    className={getStatusClasses("in-progress", item.status)}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateItemStatus(actualIndex, "completed")}
                    className={getStatusClasses("completed", item.status)}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          <p>No items match your filter criteria</p>
        </div>
      )}
    </TrackerLayout>
  );
}
