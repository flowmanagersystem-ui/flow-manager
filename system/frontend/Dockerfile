# ---------- Build Angular ----------
FROM node:20.19.1 as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---------- Nginx ----------
FROM nginx:1.28-alpine

COPY --from=builder /app/dist/flow-manager/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
# COPY mime.types /etc/nginx/mime.types

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
