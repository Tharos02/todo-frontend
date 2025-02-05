FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG BUILD_FOR_SYSTEM=dev
ENV BUILD_FOR_SYSTEM=${BUILD_FOR_SYSTEM}

RUN npm run build-${BUILD_FOR_SYSTEM}

FROM nginx:stable-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/todo-frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
