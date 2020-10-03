import Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("list", (table) => {
    table.increments("id").primary();
    table.text("name").notNullable();
    table
      .specificType("author", "citext")
      .references("user.username")
      .notNullable()
      .index()
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("list");
