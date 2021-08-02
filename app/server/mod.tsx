import React from "react";
import { renderToString } from "react-dom/server";
import { Html } from "/component/mod.tsx";
import { opine } from "opine";
import { APP_NAME, CLIENT_NAME } from "../constants.ts";
import { ServerOpts } from "../types.ts";

console.info("deno cwd", Deno.cwd());

const srvr = opine();

function AppDefault() {
  return (
    <Html fileName={CLIENT_NAME} id={APP_NAME}>
      Default App
    </Html>
  );
}

export default function createServer(
  id = APP_NAME,
  { app: App = AppDefault, name = CLIENT_NAME, files = {} }: ServerOpts
) {
  const html = renderToString(
    <Html fileName={name} id={id}>
      <App />
    </Html>
  );

  const clientPath = `${name}.js`;
  const clientSourceMapPath = `${clientPath}.map`;

  // FIXME:
  // const sourceMap = JSON.parse(files["deno:///bundle.js.map"]);
  // const sources = sourceMap.sources.map((val: string) => {
  //   const end = val.length - 1;
  //   return val.substring(1, end);
  // });
  // const patchedSourceMap = {
  //   ...sourceMap,
  //   sources,
  // };
  // console.log("patched source map", patchedSourceMap.sources);

  srvr.use(clientPath, (_req, res) => {
    res
      .set("sourcemap", clientSourceMapPath)
      .type("application/javascript")
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .send(client);
  });

  // srvr.use(clientSourceMapPath, (req, res, next) => {
  //   res
  //     .type("application/json")
  //     // FIXME: see https://github.com/denoland/deno/pull/10781
  //     .json(patchedSourceMap);
  // });

  srvr.use("/", (_req, res) => {
    res.type("text/html").send(html);
  });

  const port = 3000;

  const app = srvr.listen({ port });
  console.info(`React SSR App listening on port ${port}`, app);

  return app;
}
