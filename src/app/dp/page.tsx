"use client";

import React, { useState, useEffect } from "react";
import TrackerLayout from "@/components/TrackerLayout";
import { dpLinks } from "@/constants/dp-links";
import { Dsa } from "@/types/Dsa";
import { StatusCode } from "@/enums/StatusCode";
import { codeToStatus } from "@/utils/codeToStatus";
import { statusToCode } from "@/utils/statusToCode";
import DSAItemList from "@/components/DSAItemList";
import { getStats } from "@/utils/getStats";

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

  const stats = getStats(dsaItems);
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
      <DSAItemList
        filtered={filtered}
        dsaItems={dsaItems}
        updateItemStatus={updateItemStatus}
        useId
      />
    </TrackerLayout>
  );
}
