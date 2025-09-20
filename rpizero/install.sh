
sshdest="$(rpi config user)@$(rpi config ip)"

# Upload all required files
# server bundle
# install dependencies inside dist, to avoid overhead on the server
npm --prefix ../apps/server/dist ci --omit=dev
rpi zip ../apps/server/dist server.zip
rpi upload server.zip
# client bundle
rpi zip ../apps/client/dist client.zip
rpi upload client.zip
# nginx config
rpi upload ./nginx.conf
# systemd service definition
rpi upload ./server.service

ssh -o ConnectTimeout=5 -o ServerAliveCountMax=2 -o ServerAliveInterval=10 $sshdest 'bash -s' <<EOF
sudo apt update
# sudo apt upgrade -y

# Configure wifi-connect
sudo apt install -y openssl build-essential cmake autoconf libtool
git clone https://github.com/hpaos/wifi-connect-headless-rpi.git
# Clone fork-origin with no german(?) ui>index.html (https://github.com/drkmsmithjr/wifi-connect-headless-rpi/pull/4#issuecomment-3304224532)
git clone https://github.com/drkmsmithjr/wifi-connect-headless-rpi.git wifi-connect-ui
cp -a wifi-connect-ui/ui/. wifi-connect-headless-rpi/ui
# Update sleep timeout from 15s to 30s
crontab -l | sed 's|@reboot sleep 15|@reboot sleep 30|' | crontab -
sudo ./wifi-connect-headless-rpi/scripts/rpi_headless_wifi_install.sh

# Install nginx
sudo apt install nginx -y
nginx -v

# nginx - create certificate
# Remove conflicting configurations
sudo rm -rf /etc/nginx/sites-enabled/*
# Copy nginx config
sudo cp ~/registry/nginx.conf  /etc/nginx/conf.d/default.conf
# sed -i '/http {/a \    include /etc/nginx/conf.d/*.conf;' /etc/nginx/nginx.conf
sudo apt install openssl -y
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 \
  -subj "/CN=localhost" \
  -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/nginx.key \
  -out /etc/nginx/ssl/nginx.crt
sudo chown -R root:www-data /etc/nginx

sudo systemctl start nginx
sudo systemctl enable nginx

# move client files to correct folder
sudo unzip -o ~/registry/client.zip -d /var/www/html

# Install node (bun is not available for armv6)
wget https://unofficial-builds.nodejs.org/download/release/v20.10.0/node-v20.10.0-linux-armv6l.tar.xz
tar -xf node-v20.10.0-linux-armv6l.tar.xz
cd node-v20.10.0-linux-armv6l
sudo cp -R * /usr/local/
cd ..
node -v
npm -v

# move server files to correct folder
sudo unzip -o ~/registry/server.zip -d /usr/local/node-server

# Configure service for node-server
sudo mv ~/registry/server.service /etc/systemd/system/server.service
sudo systemctl daemon-reload
sudo systemctl enable NetworkManager-wait-online.service
sudo systemctl enable server.service
sudo systemctl start server.service

EOF
