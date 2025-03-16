import { StatusCode } from "@/enums/StatusCode";

export const codeToStatus = (code: number): string => {
  switch (code) {
    case StatusCode.Pending:
      return "pending";
    case StatusCode.InProgress:
      return "in-progress";
    case StatusCode.Complete:
      return "completed";
    default:
      return "pending";
  }
};
