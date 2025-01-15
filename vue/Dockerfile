FROM node:20.17-alpine AS build
COPY . /app
WORKDIR /app
RUN npm install && npm run build
WORKDIR /app/dist
CMD [ "npm", "run", "dev" ]