# Install dependencies only when needed
FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/connect-force/package.json ./packages/connect-force/package.json
COPY packages/connect-force/vendor ./packages/connect-force/vendor
COPY packages/api/package.json ./packages/api/package.json

# pnpm install
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# pnpm build
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED=1

ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL

RUN pnpm run build

RUN ls -al /app/packages/connect-force/

# Production image
FROM base AS prod

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/packages/connect-force/node_modules ./packages/connect-force/node_modules
COPY --from=prod-deps /app/packages/connect-force/vendor ./packages/connect-force/vendor

COPY --from=build /app/package.json ./
COPY --from=build /app/packages/connect-force/.next/ ./packages/connect-force/.next/
COPY --from=build /app/packages/connect-force/package.json ./packages/connect-force/

EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1
 
CMD [ "pnpm", "start" ]