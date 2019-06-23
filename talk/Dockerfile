FROM node:10.12.0 as build-deps

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn
COPY . ./ 
RUN yarn build

FROM nginx:1.12-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/index.html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]