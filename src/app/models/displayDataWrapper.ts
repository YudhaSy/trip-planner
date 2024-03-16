import { DisplayType } from "../enums/displayType";
import { Weather } from "./weather";

export class DisplayDataWrapper {
  fetchingData!: boolean;
  fetchingMsg!: string;
  type!: DisplayType;
  weather?: Weather | null;
  cityInfo?: string | null;
  errorMsg!: string | null;
}