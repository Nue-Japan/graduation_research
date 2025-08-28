FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Unity の WebGL ビルド成果物をコピー
COPY build/ .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
