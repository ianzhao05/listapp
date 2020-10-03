import Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("user", (table) => {
    table.increments("id").primary();
    table.specificType("username", "citext").notNullable().unique();
    table.string("password", 60).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("user");
