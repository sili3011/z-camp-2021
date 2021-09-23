FROM node:14
WORKDIR /app
COPY . .
RUN ls -ahl
RUN npm install
RUN npm install -g expo-cli
RUN expo build:web
RUN ls -ahl
  
FROM nginx:1.14.1-alpine
COPY --from=0 /app/default.conf .
COPY ./default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=0 /app/web-build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
EXPOSE 80