"use client";

import React from "react";

/** Simple type for your progress stats */
type Stats = {
  total: number;
  complete: number;
  inProgress: number;
  pending: number;
};

/** Props for the reusable layout */
interface TrackerLayoutProps {
  pageTitle: string; // e.g. "Dynamic Programming Problems"
  stats: Stats; // { total, complete, inProgress, pending }
  statusFilter: string; // "All" | "pending" | "in-progress" | "complete"
  setStatusFilter: (filter: string) => void;
  categories: string[]; // All category options
  categoryFilter: string; // currently-selected category
  setCategoryFilter: (val: string) => void;
  types: string[]; // All type options
  typeFilter: string; // currently-selected type
  setTypeFilter: (val: string) => void;

  /** For the DP tracker, we need a search bar. We can make it optional. */
  showSearch?: boolean; // whether or not to display the search bar
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;

  /** Section header for the list portion, e.g. "Problem List" or "DSA Topics" */
  listTitle: string;
  /** How many items are currently shown after filtering */
  filteredItemsLength: number;

  /** Children typically will be the mapped list items. */
  children: React.ReactNode;
}

export default function TrackerLayout({
  pageTitle,
  stats,
  statusFilter,
  setStatusFilter,
  categories,
  categoryFilter,
  setCategoryFilter,
  types,
  typeFilter,
  setTypeFilter,
  showSearch = false,
  searchTerm = "",
  setSearchTerm,
  listTitle,
  filteredItemsLength,
  children,
}: TrackerLayoutProps) {
  return (
    <div className="bg-[#181A1B] text-gray-100 min-h-screen transition-colors duration-200 pb-6">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page heading */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#bab4ab] tracking-widest">
            {pageTitle}
          </h1>
        </div>

        {/* Progress Overview */}
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
            />
          </div>
          <div className="text-sm text-gray-400 mt-1 transition-colors duration-200">
            {stats.total ? Math.round((stats.complete / stats.total) * 100) : 0}
            % Completed
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg p-4 mb-6 border border-zinc-800 transition-colors duration-200">
          <h2 className="text-lg font-medium mb-3 text-[#bab4ab]">Filters</h2>
          <div
            className={`grid grid-cols-1 ${
              showSearch ? "md:grid-cols-3" : "md:grid-cols-2"
            } gap-4`}
          >
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Category
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, idx) => (
                  <option key={idx} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Type
              </label>
              <select
                className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-[#bab4ab] transition-all duration-200 focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                {types.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Search */}
            {showSearch && setSearchTerm && (
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
            )}
          </div>
        </div>

        {/* List Container */}
        <div className="bg-[#1F2223] rounded-lg shadow-lg overflow-hidden border border-zinc-800 transition-colors duration-200">
          <div className="p-4 border-b border-zinc-800 transition-colors duration-200 flex justify-between">
            <h2 className="text-lg font-medium text-[#bab4ab]">{listTitle}</h2>
            <span className="px-3 py-1 bg-zinc-800 text-gray-300 rounded-full text-sm font-medium">
              {filteredItemsLength} items
            </span>
          </div>

          {/* Whatever you pass as children goes here (the actual list) */}
          {children}
        </div>
      </div>
    </div>
  );
}
