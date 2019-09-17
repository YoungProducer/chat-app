import {ChatApplication} from "./application";
import {ApplicationConfig} from "@loopback/core";

export {ChatApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new ChatApplication(options);
  await app.boot();
  await app.migrateSchema();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
