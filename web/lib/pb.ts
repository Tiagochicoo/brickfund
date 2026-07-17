import PocketBase from "pocketbase";
import { PB_URL } from "./types";

let _client: PocketBase | null = null;

export function getPb(): PocketBase {
  if (typeof window === "undefined") {
    const pb = new PocketBase(PB_URL);
    pb.autoCancellation(false);
    return pb;
  }
  if (!_client) {
    _client = new PocketBase(PB_URL);
    _client.autoCancellation(false);
  }
  return _client;
}
