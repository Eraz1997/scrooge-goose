# Goose Development Guidelines 👨‍💻

## Folder structure 🪛

- `.github` contains CI workflows to build Scrooge Goose
- `backend` contains the code of the REST API backend, written in Rust
- `web` contains the code of the web app, written in TypeScript using SolidJS and Park UI

## Setup 🪛

### Web 🕷️

1. Install `fnm` ([guide](https://github.com/Schniz/fnm))

1. Install the latest Node.js version:

   ```sh
   fnm install --latest --corepack-enabled
   fnm use <INSTALLED_VERSION>
   ```

1. Install dependencies with `pnpm install`

### Backend 🎒

1. Install Docker ([guide](https://docs.docker.com/engine/install/))

1. [Install Rust](https://www.rust-lang.org/tools/install)

## Run Locally 🧸

### Web 🕷️

```sh
pnpm dev
```

If you run the frontend only, you can access it at `http://localhost:3000/<path>`.

### Backend 🎒

```sh
cargo run
```

The backend service is available at `http://localhost:5000/<path>`. Paths starting with `/api` will be forwarded to API handlers, while the others will be forwarded to the frontend server, if any is running.

## Lint and Format 🧽

### Web 🕷️

```sh
pnpm lint
pnpm format
```

### Backend 🎒

```sh
cargo fmt
cargo clippy -- --deny warnings
```
