import Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("follow", (table) => {
    table
      .specificType("username", "citext")
      .references("user.username")
      .onDelete("CASCADE");
    table
      .specificType("follows", "citext")
      .references("user.username")
      .onDelete("CASCADE");
    table.primary(["username", "follows"]);
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("follow");
