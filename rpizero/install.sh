
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
sudo apt install -y openssl build-essential cmake autoconf libtool git
git clone https://github.com/hpaos/wifi-connect-headless-rpi.git
# Checkout latest SHA we are interested in
git -C wifi-connect-headless-rpi checkout dcc509d46498b1301326dc8b321305181f74dce1
# Execute installation
sudo ./wifi-connect-headless-rpi/scripts/rpi_headless_wifi_install.sh
# Update sleep timeout from 15s to 30s
sudo crontab -l | sed 's|@reboot sleep 15|@reboot sleep 30|' | sudo crontab -
# Concat log contents
sudo sed -i -e 's/exec &>/exec \&>>/' ./wifi-connect-headless-rpi/scripts/run.sh
echo Logs available at /var/log/wifi-connect-headless-rpi.log 

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
sudo unzip -o ~/registry/client.zip -d /var/www/html > /dev/null

# Install node (bun is not available for armv6)
wget https://unofficial-builds.nodejs.org/download/release/v20.10.0/node-v20.10.0-linux-armv6l.tar.xz
tar -xf node-v20.10.0-linux-armv6l.tar.xz
cd node-v20.10.0-linux-armv6l
sudo cp -R * /usr/local/
cd ..
echo NODE_VERSION=$(node -v)
echo NPM_VERSION=$(npm -v)

# move server files to correct folder
sudo unzip -o ~/registry/server.zip -d /usr/local/node-server > /dev/null
sudo chmod +x /usr/local/node-server/index.js

# Configure service for node-server
sudo mv ~/registry/server.service /etc/systemd/system/server.service
sudo systemctl daemon-reload
sudo systemctl enable NetworkManager-wait-online.service
sudo systemctl enable server.service
sudo systemctl start server.service

# Reboot for changes to be applied
sudo reboot

EOF
