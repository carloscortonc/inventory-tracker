# Inventory-tracker

Application to keep track of inventory of any kind, using barcodes as item identifiers. It is composed of:

- **server**: provides access to the inventory, adding/updating items.
- **client** (pwa): allows registering new items via barcode, and displays inventory information.
- **scanner**: can be integrated as part of the server. Is a physical device to read barcodes and perform inventory updates, and is supposed to be located next to the inventory location.

## System Architecture

The main constraint is that the scanner must me on-site. Depending on where the server is located, two architectures can be defined:

- The server is also on-site, so the scanner would be part of it
- The server is independent, in a different location

### Server on-site

In this case, the server would be inside the internal network, so:

- Users (accesing from the PWA served from the server) would also need to be connected to the same internal network.
- The application would only be accessible from within the network (on-site).
- Setup is easier, and security less demanding, as requests will only be performed from within.
- Need physical access to the server to update its software.

<div align="center">
  <img src="./docs/onsite.svg" width="600" alt="on-site diagram" />
</div>

### Server off-site

The server would be deployed elsewhere, so:

- It is now exposed on the internet, accessible by anyone, so security is a concern.
- Increased complexity, as the scanner is now independent and needs to communicate with the server.
- The application would now be accesible from anywhere.
- Software updates can easely be rolled out.

<div align="center">
  <img src="./docs/offsite.svg" width="600" alt="off-site diagram" />
</div>

## Application flow

### Registering new items

The first step is to register the items for which we wish to track inventory. The steps are the following:

1. **[client]** A new item is scanned using the web-app, obtaining its code-id
2. **[client]** A request is sent to the server to fetch information related to the code-id
3. **[server]** The server queries the code to find product information (name), currently via scraping
4. **[client]** A form is created, using the retrieved information as default values, and sent back to the server
5. **[server]** The new item is registered in the db

<div align="center">
  <br />
  <img src="./docs/ui/scan-flow.gif" width="300" alt="scan flow" />
</div>

### Removing items from inventory

When an item is removed from inventory, it needs to be scanned so inventory is updated. The steps are the following:

1. **[scanner]** A code is read, and a `decrease` request is sent to the server
2. **[server]** It first checks that the product exists, and updates its quantity by `-1`
3. **[server]** If the new quantity is below its configured threshold, an email is sent to the administrator with the full list of items whose quantity is also below threshold

### Updating item information

Users can access the web-app to check the list of products, update information for any of them, or delete them.
This flow is mainly used to update the quantity of an item, after re-stocking.

<div align="center">
  <br />
  <img src="./docs/ui/item-actions.png" width="300" alt="item actions" />
</div>

## Development

To develop locally the following tools are required:

- [node 20](https://nodejs.org/en/download)
- [docker (docker compose)](https://www.docker.com/get-started/)
- [bun](https://bun.com/docs/installation) (for bundling the server)

The run the project in development mode, execute on the root:

```sh
npm run start
```

This will:

- Start ther server on port 8080
- Start the web app on port 3000
- Start `docker compose` with an nginx server that proxies to both of the above

### Scanner

Debugging scanner events for connecting/disconnecting device:

```sh
sudo udevadm monitor --udev
```

> [!NOTE]  
> In our scanner we will assume the device is connected when the server starts up.

## Delivery

As this is intended to be bundled in a small device (like Raspberry Pi Zero W) and placed in any desired location, a mechanism to configure access to the internet is required, for tasks like sending emails or retrieving information for a given barcode.
To solve this, the project uses [wifi-connect](https://github.com/balena-os/wifi-connect):

- It checks for internet connection, and when not found, it create an AP.
- After the user connects to the AP, is redirected to a web page where a list of available wifi networks is shown
- The user selects the correct network, and inputs its password
- The utility attempts to connect to the network and checks internet access. If successful, the AP is disabled, and the process completed.

### Raspberry Pi Zero W

The [Raspberry Pi Zero W](https://www.raspberrypi.com/products/raspberry-pi-zero-w/) is very small computer, which makes it suitable to host this project. The challenge is its low resources (512MB RAM, ARMv6 architecture).
To account for this, instead of using docker on the server we will manually install all project dependencies and requirements:

- Check internet connection on boot
- Systemd for server to run on boot, after internet connection available
- node and nginx for running the apps

> [!NOTE]  
> To automate all the required steps, a [script](./rpizero/install.sh) was created. It relies on [rpi-cli](https://github.com/carloscortonc/rpi-cli)

### Logging

Once packaged into the Raspberrypi Zero, it is not longer possible to check logs unless having physical access to the raspi (screen, ssh-ing).
Without using a Saas to send and check the logs, a straightforward way to achieve this with the current setup is to send them to a new collection in the mongodb we are already using (assuming o cloud version).

To do this, we could modify [our logger](./apps/server/src/modules/logger.ts) to allow changing the `stream` used for logging:

```diff
@@ /modules/logger.ts @@

+export const setStream = (stream: LoggerStream) => {
+  _stream = stream;
+};
```

And the update the stream when the db connection is stablished:

```diff
@@ /modules/db.ts @@

  await mongoose.connect(connectionUri).then(
-    () => log.info(`Database connection to [${database}] established`),
+    () => {
+      log.info(`Database connection to [${database}] established`);
+      const dbStreamer = getDbStreamer();
+      setStream(dbStreamer);
+    },

    ...

+ const getDbStreamer = (): LoggerStream => {
+   const schema = new mongoose.Schema({}, { strict: false });
+   const Model = mongoose.model("server_logs", schema);
+   return {
+     write: (message: string) => Model.create({ message }),
+   };
+ };
```
