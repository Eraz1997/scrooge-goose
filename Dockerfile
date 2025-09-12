# Web Builder Stage (node:24.7.0-trixie)

from node@sha256:a22d64d626515462248d80659745c9de26454a527b0441ec796b3f8f6106bfc2 as web-builder

    copy web /src
    workdir /src
    run npm install -g pnpm
    run pnpm install --frozen-lockfile
    run pnpm vite build --outDir /dist

# Backend Builder Stage (rust:1.89.0-trixie)

from rust@sha256:9e1b362e100b2c510355314491708bdc59d79b8ed93e94580aba9e4a370badab as backend-builder

    copy backend /src
    workdir /src
    run cargo install --path . --root /dist

# Runtime (debian:trixie-20250908-slim)

from debian@sha256:c2880112cc5c61e1200c26f106e4123627b49726375eb5846313da9cca117337 as runtime

    ## Install System Dependencies

    run apt update
    run apt install -y curl

    ## Install Artifacts

    copy --from=web-builder /dist /static
    copy --from=backend-builder /dist /app

    ## Set Up Health Checks

    healthcheck --interval=10s --timeout=1m --retries=5 --start-interval=20s cmd curl http://localhost:5000/api/health

    ## Runtime Command

    cmd /app/bin/scrooge-goose-api \
        --dev-frontend-server-port 0 \
        --host 0.0.0.0 \
        --log-level info \
        --port 5000 \
        --static-files-path /static
