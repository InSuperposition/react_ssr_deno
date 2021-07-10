# react_ssr_deno

## Installation

1. clone repo

1. install and initialize VS Code [`deno` extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

1. [install `dvm` (deno version manager)](https://github.com/justjavac/dvm#installation)

1. install `deno`

   ```sh
   dvm install 1.11.5
   ```

## Run on local machine

1. in project root:

   ```sh
   deno run --import-map=import_map.json -A --unstable mod.ts
   ```

## Run in container

1. [install `docker`](https://docs.docker.com/get-docker/)

1. start container

   ```sh
   docker-compose up
   ```
