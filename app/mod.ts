import createClient from "./client/mod.tsx";
import createServer from "./server/mod.tsx";

export default async function createApp(
  id: string,
  app: () => JSX.Element,
  ssr = false
) {
  console.info("");
  const clientFiles = await createClient(id, path);
  console.log("client output", clientFiles);

  return createServer(/* client, */ { app, id, files });
}
