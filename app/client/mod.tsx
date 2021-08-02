import React from "react";
import ReactDOM from "react-dom";
import { APP_NAME } from "../constants.ts";

// export function hydrate(App: () => JSX.Element, id: string) {
//   return ReactDOM.hydrate(<App />, document.getElementById(id));
// }

// export function render(App: () => JSX.Element, id: string) {
//   return ReactDOM.render(<App />, document.getElementById(id));
// }

export default async function createClient(
  id = APP_NAME,
  clientPath: string,
  ssr = true
) {
  const { diagnostics, files } = await Deno.emit(clientPath, {
    bundle: "module",
    importMapPath: "../import_map.json",
    compilerOptions: {
      lib: ["dom", "dom.iterable", "es2020"],
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

  return files;
}
