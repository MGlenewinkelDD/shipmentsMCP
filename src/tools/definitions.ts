/** Tool definitions for OpenRouter (OpenAI function-calling format) */
export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "listShipments",
      description:
        "List or search shipments with optional pagination and date range. Use limit (e.g. 10–100) and offset for paging. Use from and to (YYYY-MM-DD) for date range.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max number of results (e.g. 10 or 100)" },
          offset: { type: "number", description: "Offset for pagination" },
          from: { type: "string", description: "Start date YYYY-MM-DD" },
          to: { type: "string", description: "End date YYYY-MM-DD" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getShipment",
      description: "Get a single shipment by its numeric ID.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "Shipment ID" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getShipmentDetails",
      description: "Get detailed info (tracking, SLA, delivery status, etc.) for a specific shipment by ID.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "Shipment ID" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "listShipmentDetails",
      description:
        "List shipment details with optional pagination and date range. Use limit, offset, from (YYYY-MM-DD), to (YYYY-MM-DD).",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Max number of results" },
          offset: { type: "number", description: "Offset for pagination" },
          from: { type: "string", description: "Start date YYYY-MM-DD" },
          to: { type: "string", description: "End date YYYY-MM-DD" },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getShipmentDetail",
      description: "Get one shipment detail record by its numeric ID.",
      parameters: {
        type: "object",
        properties: { id: { type: "number", description: "Shipment detail ID" } },
        required: ["id"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getCountries",
      description: "Lookup table of countries (country codes and names).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getServiceCodes",
      description: "Lookup table of service codes (e.g. RTD) and descriptions.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getShipmentStatuses",
      description: "Lookup table of shipment statuses (e.g. PENDING).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getDeliveryStatuses",
      description: "Lookup table of delivery statuses (e.g. NOT_RECEIVED).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getLastTrackCodes",
      description: "Lookup table of last track codes and descriptions.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "getSlaChecks",
      description: "Lookup table of SLA check results and descriptions.",
      parameters: { type: "object", properties: {} },
    },
  },
];
