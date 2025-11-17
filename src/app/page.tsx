"use client";

import React, { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout";
import { dsaSheet } from "@/constants/dsa-sheet";
import { Dsa } from "@/types/Dsa";
import { StatusCode } from "@/enums/StatusCode";
import { codeToStatus } from "@/utils/codeToStatus";
import { statusToCode } from "@/utils/statusToCode";
import DSAItemList from "@/components/DSAItemList";
import { getStats } from "@/utils/getStats";

const DSA_PROGRESS_KEY = "dsa-progress-statuses";

export default function DSATracker() {
  const baseItems = dsaSheet.map((item, i) => ({
    ...item,
    status: "pending" as const,
    index: i,
  }));

  const [dsaItems, setDsaItems] = useState<
    (Dsa & { status: string; index: number })[]
  >([]);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [types, setTypes] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let finalItems: (Dsa & { status: string; index: number })[] = [
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
      const searchOK = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return catOK && typeOK && statOK && searchOK;
    });
  };

  const stats = getStats(dsaItems);
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
      showSearch={true}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      listTitle="DSA Topics"
      filteredItemsLength={filtered.length}
    >
      <DSAItemList
        filtered={filtered}
        dsaItems={dsaItems}
        updateItemStatus={updateItemStatus}
        useId
      />
    </TrackerLayout>
  );
}
