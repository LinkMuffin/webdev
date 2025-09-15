import { pb } from "@/lib/pb";

export type RGLItem = { i: string; x: number; y: number; w: number; h: number };
export type Layout = RGLItem[];

const DEFAULT_LAYOUT: Layout = [
  { i: "maize",    x: 0, y: 0, w: 4, h: 3 },
  { i: "weather",  x: 4, y: 0, w: 4, h: 3 },
  { i: "forecast", x: 8, y: 0, w: 4, h: 3 },
  { i: "gusts",    x: 0, y: 3, w: 4, h: 3 },
  { i: "radar",    x: 0, y: 3, w: 12, h: 6 },
];

export type DashboardRecord = { id: string; layout_json: any; widgets_json?: any };

export async function loadOrCreateDashboard(): Promise<DashboardRecord> {
  const uid = pb.authStore.model?.id;
  if (!uid) throw new Error("not authenticated");
  try {
    const rec = await pb.collection("dashboards").getFirstListItem(`user = "${uid}"`);
    return rec as any;
  } catch (e: any) {
    // 404 -> anlegen
    const rec = await pb.collection("dashboards").create({
      user: uid,
      layout_json: DEFAULT_LAYOUT,
      widgets_json: { order: ["maize", "weather", "forecast", "radar"] },
    });
    return rec as any;
  }
}

let saveTimer: any;
export async function saveLayoutDebounced(dashboardId: string, layout: Layout, delay = 600) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await pb.collection("dashboards").update(dashboardId, { layout_json: layout });
      // optional: toast/console
      // console.log("Dashboard saved");
    } catch (e) {
      console.error("Saving layout failed:", e);
    }
  }, delay);
}

export function getDefaultLayout(): Layout {
  return [...DEFAULT_LAYOUT];
}

