import React from "react";
import ReactDOMServer from "react-dom/server";
import { Html } from "/component/mod.tsx";
import { opine } from "opine";
import { appName, clientName } from "../constants.ts";

const { diagnostics, files } = await Deno.emit("../app/client/mod.tsx", {
  bundle: "module",
  importMapPath: "../import_map.json",
  compilerOptions: {
    lib: ["dom", "dom.iterable", "es2021"],
    target: "es2020",
    sourceMap: true,
  },
});

if (diagnostics) {
  console.log("diagnostics", diagnostics);
}

if (files) {
  console.log("files", files);
}

const srvr = opine();

export interface ServerOpts {
  app: () => JSX.Element;
  fileName?: string;
  id: string;
}

const defaultOptions: ServerOpts = {
  app: function DefaultApp() {
    return (
      <Html fileName={clientName} id={appName}>
        Default App
      </Html>
    );
  },
  fileName: clientName,
  id: appName,
};

export default function server(options = defaultOptions) {
  const { fileName, id, app: App } = options;

  const html = ReactDOMServer.renderToString(
    <Html fileName={fileName} id={id}>
      <App />
    </Html>
  );

  const bundlePath = `${fileName}.js`;
  const bundleMapPath = `${fileName}.js.map`;

  // FIXME:
  const sourceMap = JSON.parse(files["deno:///bundle.js.map"]);
  const sources = sourceMap.sources.map((val: string) => {
    const end = val.length - 1;
    return val.substring(1, end);
  });
  const patchedSourceMap = {
    ...sourceMap,
    sources,
  };
  console.log("patched source map", patchedSourceMap.sources);

  srvr.use(bundlePath, (req, res, next) => {
    res
      .set("sourcemap", bundleMapPath)
      // .type('application/javascript')
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .send(files["deno:///bundle.js"]);
  });

  srvr.use(bundleMapPath, (req, res, next) => {
    res
      .type("application/json")
      // FIXME: see https://github.com/denoland/deno/pull/10781
      .json(patchedSourceMap);
  });

  srvr.use("/", (req, res, next) => {
    res.type("text/html").send(html);
  });

  const port = 3000;

  srvr.listen({ port });

  console.log(`React SSR App listening on port ${port}`);
}
