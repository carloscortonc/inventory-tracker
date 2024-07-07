import mongoose from "mongoose";
import { resolveString } from "./utils";
import config from "@/modules/config";
import log from "@/modules/logger";

/** Plugin for removing unwanted fields */
mongoose.plugin(function (schema: mongoose.Schema) {
  (["toObject", "toJSON"] as const).forEach((k) => {
    schema.set(k, {
      transform: function (_: any, ret: any) {
        delete ret._id; // remove _id field
        delete ret.__v; // remove __v field
        return ret;
      },
    });
  });
});

export async function init(database: string) {
  const connectionUri = resolveString(config.mongo.uri, {
    ...config.mongo,
    database,
  });
  await mongoose.connect(connectionUri).then(
    () => log.info(`Database connection to [${database}] established`),
    (err: any) => {
      log.error(`Error connecting to database [${database}] (${err.message})`);
      throw err;
    }
  );
}

export async function cleanup() {
  log.info("Closing database connection");
  mongoose.connection.close();
}
