Because of resources restrictions on rpi-zero, some changes have to be made:

- Avoid docker and install directly required dependencies on the host (node, nginx)
- Wifi-connect currently throws an error (https://github.com/balena-os/wifi-connect/issues/559), so found an alternative here https://github.com/hpaos/wifi-connect-headless-rpi
- Services are required for nodejs server to be started on boot
- nginx.conf is the same as /nginx/nginx.conf, with the exception of the proxy to server (use localhost instead of container name)
