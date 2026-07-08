import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { MAQAMS } from "@/data/maqams";

export default defineTool({
  name: "list_maqams",
  title: "List maqams (sacred sites)",
  description:
    "List sacred Islamic sites (maqams / dargahs / shrines) documented on Ziyarath, with optional filtering by region or category. Returns name, location, category, era and a short description.",
  inputSchema: {
    region: z
      .enum(["kerala", "india", "middle-east", "worldwide"]) 
      .optional()
      .describe("Filter by region."),
    category: z
      .enum(["sahaba", "sufi", "scholar", "shaheed", "prophet"]) 
      .optional()
      .describe("Filter by category of the person the maqam commemorates."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ region, category }) => {
    const filtered = MAQAMS.filter(
      (m) => (!region || m.region === region) && (!category || m.category === category),
    ).map((m) => ({
      id: m.id,
      name: m.name,
      malayalamName: m.malayalamName,
      location: m.location,
      city: m.city,
      country: m.country,
      region: m.region,
      category: m.category,
      era: m.era,
      description: m.description,
      url: `https://ziyarath.com/maqam/${m.id}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { maqams: filtered, total: filtered.length },
    };
  },
});
