import { SchemaObject } from "@loopback/rest";

export const userDefinition: SchemaObject = {
  name: "User",
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
    firstName: {
      type: "string",
      required: ["true"]
    },
    lastName: {
      type: "string",
      required: ["true"]
    }
  },
};
