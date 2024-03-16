import { DisplayType } from "../enums/displayType";
import { Weather } from "./weather";

export class DisplayData {
  fetchingData!: boolean;
  type!: DisplayType;
  weather?: Weather | null;
  cityInfo?: string | null;
  errorMsg!: string | null;
}