import { config } from "../config.js";

const BASE = config.backendApiUrl;

async function get<T>(path: string): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function health(): Promise<unknown> {
  return get("/api/health");
}

export interface ListShipmentsParams {
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
}

export async function listShipments(params: ListShipmentsParams = {}): Promise<unknown> {
  const sp = new URLSearchParams();
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.offset != null) sp.set("offset", String(params.offset));
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  const qs = sp.toString();
  return get(qs ? `/api/shipments?${qs}` : "/api/shipments");
}

export async function getShipment(id: number): Promise<unknown> {
  return get(`/api/shipments/${id}`);
}

export async function getShipmentDetails(id: number): Promise<unknown> {
  return get(`/api/shipments/${id}/details`);
}

export interface ListShipmentDetailsParams {
  limit?: number;
  offset?: number;
  from?: string;
  to?: string;
}

export async function listShipmentDetails(params: ListShipmentDetailsParams = {}): Promise<unknown> {
  const sp = new URLSearchParams();
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.offset != null) sp.set("offset", String(params.offset));
  if (params.from) sp.set("from", params.from);
  if (params.to) sp.set("to", params.to);
  const qs = sp.toString();
  return get(qs ? `/api/shipment-details?${qs}` : "/api/shipment-details");
}

export async function getShipmentDetail(id: number): Promise<unknown> {
  return get(`/api/shipment-details/${id}`);
}

export async function getCountries(): Promise<unknown> {
  return get("/api/reference/countries");
}

export async function getServiceCodes(): Promise<unknown> {
  return get("/api/reference/service-codes");
}

export async function getShipmentStatuses(): Promise<unknown> {
  return get("/api/reference/shipment-statuses");
}

export async function getDeliveryStatuses(): Promise<unknown> {
  return get("/api/reference/delivery-statuses");
}

export async function getLastTrackCodes(): Promise<unknown> {
  return get("/api/reference/last-track-codes");
}

export async function getSlaChecks(): Promise<unknown> {
  return get("/api/reference/sla-checks");
}
