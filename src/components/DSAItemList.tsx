import { Dsa } from "@/types/Dsa";
import { getStatusClasses } from "@/utils/getStatusClasses";
import React from "react";

type DSAItem = Dsa & { id: string; status: string; url?: string };

interface DSAItemListProps {
  filtered: DSAItem[];
  dsaItems: DSAItem[];
  updateItemStatus: (index: number, status: string) => void;
  useId?: boolean;
}

const DSAItemList: React.FC<DSAItemListProps> = ({
  filtered,
  dsaItems,
  updateItemStatus,
  useId = false,
}) => {
  return (
    <>
      {filtered.map((item) => {
        const index = dsaItems.findIndex((x) =>
          useId
            ? x.id === item.id
            : x.category === item.category && x.title === item.title
        );

        return (
          <div
            key={useId ? item.id : `${item.category}-${item.title}`}
            className="p-5 hover:bg-zinc-800/50 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {useId && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#bab4ab] text-lg hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <h3 className="font-medium text-[#bab4ab] text-lg">
                      {item.title}
                    </h3>
                  )}
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
                {["pending", "in-progress", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateItemStatus(index, status)}
                    className={getStatusClasses(status, item.status)}
                  >
                    {status === "completed"
                      ? "Completed"
                      : status.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DSAItemList;
