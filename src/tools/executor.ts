import * as backend from "../services/backendApi.js";

const REFERENCE_TOOLS = new Set([
  "getCountries",
  "getServiceCodes",
  "getShipmentStatuses",
  "getDeliveryStatuses",
  "getLastTrackCodes",
  "getSlaChecks",
]);

const cache = new Map<string, unknown>();

export async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (REFERENCE_TOOLS.has(name) && cache.has(name)) {
    return JSON.stringify(cache.get(name));
  }

  let result: unknown;
  switch (name) {
    case "listShipments":
      result = await backend.listShipments({
        limit: args.limit as number | undefined,
        offset: args.offset as number | undefined,
        from: args.from as string | undefined,
        to: args.to as string | undefined,
      });
      break;
    case "getShipment":
      result = await backend.getShipment(Number(args.id));
      break;
    case "getShipmentDetails":
      result = await backend.getShipmentDetails(Number(args.id));
      break;
    case "listShipmentDetails":
      result = await backend.listShipmentDetails({
        limit: args.limit as number | undefined,
        offset: args.offset as number | undefined,
        from: args.from as string | undefined,
        to: args.to as string | undefined,
      });
      break;
    case "getShipmentDetail":
      result = await backend.getShipmentDetail(Number(args.id));
      break;
    case "getCountries":
      result = await backend.getCountries();
      cache.set(name, result);
      break;
    case "getServiceCodes":
      result = await backend.getServiceCodes();
      cache.set(name, result);
      break;
    case "getShipmentStatuses":
      result = await backend.getShipmentStatuses();
      cache.set(name, result);
      break;
    case "getDeliveryStatuses":
      result = await backend.getDeliveryStatuses();
      cache.set(name, result);
      break;
    case "getLastTrackCodes":
      result = await backend.getLastTrackCodes();
      cache.set(name, result);
      break;
    case "getSlaChecks":
      result = await backend.getSlaChecks();
      cache.set(name, result);
      break;
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
  return JSON.stringify(result);
}
