import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { MAQAMS } from "@/data/maqams";

export default defineTool({
  name: "get_maqam",
  title: "Get maqam details",
  description:
    "Fetch the full detail of a single maqam (sacred site) by its id, including significance, visiting hours, addresses and nercha events.",
  inputSchema: {
    id: z.string().min(1).describe("The maqam id, e.g. 'mampuram' or 'ajmer-sharif'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const maqam = MAQAMS.find((m) => m.id === id);
    if (!maqam) {
      return {
        content: [{ type: "text", text: `No maqam found with id "${id}".` }],
        isError: true,
      };
    }
    const payload = {
      ...maqam,
      url: `https://ziyarath.com/maqam/${maqam.id}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { maqam: payload },
    };
  },
});
