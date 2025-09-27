FROM nginx:alpine

# Create directory for SSL certs
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed certificate
RUN apk add --no-cache openssl && \
  openssl req -x509 -nodes -days 365 \
  -subj "/CN=inventory-tracker" \
  -addext "subjectAltName=DNS:inventory-tracker,IP:127.0.0.1" \
  -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy bundle files
COPY --from=source . /var/www/html

EXPOSE 80 443