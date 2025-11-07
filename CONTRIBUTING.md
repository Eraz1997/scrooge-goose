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

The frontend service is available at `http://localhost:3000/<path>`.

### Backend 🎒

```sh
docker run --rm -p 5432:5432 --name scrooge-goose-db -e POSTGRES_PASSWORD=postgres postgres
cargo run
```

The backend service is available at `http://localhost:5000/<path>`. You need to 

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
