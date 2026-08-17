# first we build angular
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# now we serve angular with nginx
FROM nginx:alpine

COPY --from=build /app/dist/my-academy-project/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80