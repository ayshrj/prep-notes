"use client";

import React, { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout";
import { dsaSheet } from "@/constants/dsa-sheet";
import { Dsa } from "@/types/Dsa";
import { getStatusClasses } from "@/utils/getStatusClasses";
import { StatusCode } from "@/enums/StatusCode";
import { codeToStatus } from "@/utils/codeToStatus";
import { statusToCode } from "@/utils/statusToCode";

const DSA_PROGRESS_KEY = "dsa-progress-statuses";

export default function DSATracker() {
  const baseItems = dsaSheet.map((item, i) => ({
    ...item,
    status: "pending" as const,
    _index: i,
  }));

  const [dsaItems, setDsaItems] = useState<
    (Dsa & { status: string; _index: number })[]
  >([]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);

  useEffect(() => {
    let finalItems: (Dsa & { status: string; _index: number })[] = [
      ...baseItems,
    ];
    const stored = localStorage.getItem(DSA_PROGRESS_KEY);

    if (stored) {
      try {
        const codes = JSON.parse(stored) as number[];
        if (codes.length === baseItems.length) {
          finalItems = baseItems.map((it, i) => ({
            ...it,
            status: codeToStatus(codes[i]),
          }));
        }
      } catch (err) {
        console.log("Error reading local storage:", err);
      }
    }
    setDsaItems(finalItems);

    if (!stored) {
      const pendingCodes = baseItems.map(() => StatusCode.Pending);
      localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(pendingCodes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dsaItems.length > 0) {
      const catSet = new Set(dsaItems.map((x) => x.category));
      const typeSet = new Set(dsaItems.map((x) => x.type));
      setCategories(["All", ...Array.from(catSet)]);
      setTypes(["All", ...Array.from(typeSet)]);
    }
  }, [dsaItems]);

  const updateItemStatus = (index: number, newStatus: string) => {
    const updated = [...dsaItems];
    updated[index].status = newStatus;
    setDsaItems(updated);

    const codes = updated.map((x) => statusToCode(x.status));
    localStorage.setItem(DSA_PROGRESS_KEY, JSON.stringify(codes));
  };

  const getFilteredItems = () => {
    return dsaItems.filter((item) => {
      const catOK =
        categoryFilter === "All" || item.category === categoryFilter;
      const typeOK = typeFilter === "All" || item.type === typeFilter;
      const statOK = statusFilter === "All" || item.status === statusFilter;
      return catOK && typeOK && statOK;
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
      filteredItemsLength={filtered.length}
    >
      <div className="divide-y divide-zinc-800 transition-colors duration-200">
        {filtered.map((item) => {
          const idx = dsaItems.findIndex(
            (x) => x.category === item.category && x.title === item.title
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
                    onClick={() => updateItemStatus(idx, "pending")}
                    className={getStatusClasses("pending", item.status)}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateItemStatus(idx, "in-progress")}
                    className={getStatusClasses("in-progress", item.status)}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateItemStatus(idx, "completed")}
                    className={getStatusClasses("completed", item.status)}
                  >
                    Completed
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
