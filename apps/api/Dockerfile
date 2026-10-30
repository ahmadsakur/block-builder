FROM docker.io/library/node:22-alpine
RUN corepack enable
WORKDIR /repo

COPY . .
RUN pnpm install --frozen-lockfile --ignore-scripts --filter @block-builder/api...

WORKDIR /repo/apps/api
ENV NODE_ENV=production
EXPOSE 3001
CMD ["sh", "-c", "pnpm db:migrate && pnpm db:seed && pnpm start"]
