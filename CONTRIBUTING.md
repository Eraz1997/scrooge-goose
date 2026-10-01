# Goose Development Guidelines 👨‍💻

## Folder structure 🪛

- `.github` contains CI workflows to build Scrooge Goose
- `backend` contains the code of the REST API backend, written in Rust
- `web` contains the code of the web app, written in TypeScript using SolidJS and Park UI

## Setup 🪛

Install [mise](https://mise.jdx.dev/) and [Docker](https://docs.docker.com/engine/install/), then install local development tools and dependencies:

```shell
mise trust
mise install
mise run setup
```

## Run 🧸

You can start the backend and the frontend altogether. The application will be fully served by the backend at `http://localhost:5000`, proxying the frontend as well.

```shell
mise run dev
```

Similarly, you can format and lint all components:

```shell
mise run lint
```

For component-specific operations and other commands, use `mise tasks` to get a list. You can also `cd` into component directories and use bare tool-chain commands.

## Release 🚀

Update web and backend package versions and push a new tag `X.Y.Z`, the CI will build and release a new version of the bundle.
