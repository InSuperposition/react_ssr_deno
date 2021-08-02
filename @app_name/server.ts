import createApp from "../app/mod.ts";
import Landing from "./route/landing.tsx";

const app = await createApp("@app_name", Landing, true);
