import { Dsa } from "@/types/Dsa";

export type DsaItem = Dsa & {
  id?: string | number;
  status: string;
  url?: string | string[];
};
