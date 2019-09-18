import {SchemaObject} from "@loopback/rest";

export const userDefinition: SchemaObject = {
  name: "user",
  base: "User",
  idInjection: true,
  properties: {
    id: {
      type: "number",
      id: true,
      generated: true,
    },
    email: {
      type: "string",
      required: ["true"],
    },
    password: {
      type: "string",
      required: ["true"],
    },
  },
};
