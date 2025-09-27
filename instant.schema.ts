// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    tasks: i.entity({
      createdAt: i.date(),
      description: i.string().optional(),
      done: i.boolean(),
      title: i.string(),
    }),
  },
  links: {},
  rooms: {},
});

// This helps Typescript display nicer intellisense
export type AppSchema = typeof _schema;
const schema: AppSchema = _schema;
export default schema;
