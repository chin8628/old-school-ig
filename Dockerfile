FROM node:20-alpine AS base
FROM base as builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN yarn --frozen-lockfile

RUN yarn prisma generate
RUN yarn build

FROM base as runner

WORKDIR /app

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN mkdir /app/database && touch /app/database/main.sqlite

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/database/main.sqlite
ENV MINIO_ENDPOINT=minio.cloudian.in.th
ENV MINIO_BUCKET=old-school-ig
ENV MINIO_PATH=https://minio.cloudian.in.th/old-school-ig

VOLUME /app/database

# RUN rm -rf /app/database/* && touch /app/database/main.sqlite
# RUN mv /app/public /app/.next/standalone/public
# RUN mv /app/.next/static /app/.next/standalone/.next/static

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node --trace-warnings server.js