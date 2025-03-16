import { StatusCode } from "@/enums/StatusCode";

export const statusToCode = (status: string): number => {
  switch (status) {
    case "pending":
      return StatusCode.Pending;
    case "in-progress":
      return StatusCode.InProgress;
    case "completed":
      return StatusCode.Complete;
    default:
      return StatusCode.Pending;
  }
};
