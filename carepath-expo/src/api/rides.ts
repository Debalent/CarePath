import { apiRequest } from "./client";
import { RideRequestInput, RideRequestResponse } from "../types/api";

export function requestRide(input: RideRequestInput, token: string): Promise<RideRequestResponse> {
  return apiRequest<RideRequestResponse>("/rides", { method: "POST", body: input, token });
}
