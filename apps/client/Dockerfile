
FROM my-base-image:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npx nx build client ${BUILD_FLAG}
CMD ["npx","nx","run","client:serve"]
FROM nginx:1.19.2

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/builder/dist/apps/client ./
COPY --from=builder /app/builder/apps/client/nginx.conf /etc/nginx/nginx.conf