"use client";

import { Dsa, dsaSheet as initialData } from "@/constants/dsa-sheet";
import { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout";
import { getStatusClasses } from "@/utils/getStatusClasses";

const DSA_PROGRESS_KEY = "dsa-progress-tracker";

export default function DSATracker() {
  /** ------------------------------
   *  1) Data & local state
   */
  const [dsaItems, setDsaItems] = useState<(Dsa & { status: string })[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);

  /** ------------------------------
   *  2) Load from localStorage or default
   */
  useEffect(() => {
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
  }, []);

  /** ------------------------------
   *  3) Build filter dropdowns
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
   *  4) Update status
   */
  const updateItemStatus = (index: number, newStatus: string) => {
    const updatedItems = [...dsaItems];
    updatedItems[index].status = newStatus;
    setDsaItems(updatedItems);
    localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(updatedItems));
  };

  /** ------------------------------
   *  5) Filtering
   */
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

  /** ------------------------------
   *  6) Progress stats
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
   *  7) Render with shared layout
   */
  return (
    <TrackerLayout
      pageTitle="Data Structure and Algorithms"
      stats={stats}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      categories={categories}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      types={types}
      typeFilter={typeFilter}
      setTypeFilter={setTypeFilter}
      listTitle="DSA Topics"
      filteredItemsLength={filteredItems.length}
      /** no showSearch prop => defaults to false */
    >
      {/* The actual item list goes here as children */}
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
}
