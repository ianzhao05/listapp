const environment = process.env.NODE_ENV || "development";
import config from "../../knexfile";
import knex from "knex";
import Hashids from "hashids";

export const hashListIds = new Hashids("listeroo");
export const hashItemIds = new Hashids("itemeroo");
export const hashCommentIds = new Hashids("commenteroo");

export const db = knex(config[environment]);
