import { DsaItem } from "@/types/DsaItem";

export const getStats = (dsaItems: DsaItem[]) => {
  const total = dsaItems.length;
  const completed = dsaItems.filter((x) => x.status === "completed").length;
  const inProgress = dsaItems.filter((x) => x.status === "in-progress").length;
  const pending = dsaItems.filter((x) => x.status === "pending").length;
  return { total, completed, inProgress, pending };
};
