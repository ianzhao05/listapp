import Knex from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("item", (table) => {
    table.increments("id").primary();
    table.text("content").notNullable();
    table
      .integer("list_id")
      .references("list.id")
      .notNullable()
      .index()
      .onDelete("CASCADE");
    table.integer("order").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("item");
