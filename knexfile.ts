import knexStringcase from "knex-stringcase";
import dotenv from "dotenv";
dotenv.config({ path: "./.env.local" });

export default {
  development: knexStringcase({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      extension: "ts",
    },
  }),

  production: knexStringcase({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      extension: "ts",
    },
  }),
};
