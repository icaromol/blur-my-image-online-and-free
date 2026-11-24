FROM node:26-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN v=$(node -p "require('./package.json').packageManager.slice(5)") && npm install --global --allow-scripts=pnpm "pnpm@$v"
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm build:server

FROM node:26-slim@sha256:e6bedef217677b276c591795e169840edd9096dbf13f29df8ef8d1856b8820bc
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
USER node
EXPOSE 3000
CMD ["node", "dist-server/node.js"]
