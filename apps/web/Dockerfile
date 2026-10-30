FROM docker.io/library/node:22-alpine AS build
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @block-builder/web...

ARG API_URL=http://api:3001
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV API_URL=$API_URL NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @block-builder/web build

FROM docker.io/library/node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1
COPY --from=build /repo/apps/web/.next/standalone ./
COPY --from=build /repo/apps/web/.next/static ./apps/web/.next/static
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
