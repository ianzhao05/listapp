import Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("list_like", (table) => {
    table.integer("list_id").references("list.id").onDelete("CASCADE");
    table
      .specificType("username", "citext")
      .references("user.username")
      .onDelete("CASCADE");
    table.primary(["list_id", "username"]);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("list_like");
