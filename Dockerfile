FROM node:23-alpine3.20 AS base

WORKDIR /app
COPY package.json .

FROM base AS development

RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run" ,"dev"]

FROM base AS production

RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "run" ,"start"]