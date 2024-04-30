FROM node:20.12.2-bookworm-slim AS base

######## Build image ########
FROM base AS build
# Install 'dumb-init' to handle signal forwarding
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

# Copy package.json files for caching dependencies
COPY package.json package-lock.json ./
COPY lib/express-lib/package.json lib/express-lib/package.json
COPY lib/logger-lib/package.json lib/logger-lib/package.json
COPY services/user-service/package.json services/user-service/package.json

RUN npm ci --omit=dev

######## Production image ########
FROM base
ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /usr/src/app

# Copy dependencies
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node lib/express-lib ./lib/express-lib
COPY --chown=node:node lib/logger-lib ./lib/logger-lib

# Copy user service
COPY --chown=node:node services/user-service ./services/user-service

# Start the application using 'dumb-init' to manage subprocesses
CMD ["dumb-init", "node", "services/user-service/index.js"]
