import {OpenApiSpec, Trie} from "@loopback/rest";
import {userDefinition} from "../models";

export const def: OpenApiSpec = {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Messanger",
    description: "This is api for my messanger using loopback 4",
  },
  paths: {
    "/signup": {
      post: {
        "x-operation-name": "signUp",
        requestBody: {
          description: "The account instance to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User model instance",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    actionResponse: {type: "number"},
                  },
                },
              },
            },
          },
        },
        parametrs: [
          {
            name: "email",
            in: "query",
            description: "Email of new user",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "password",
            in: "query",
            description: "Password of new user",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
      },
    },
    "/signin": {
      post: {
        "x-operation-name": "signIn",
        requestBody: {
          description: "The request body instance to login",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                    pattern:
                      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,512})",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "User model instance",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    actionResponse: {type: "number"},
                  },
                },
              },
            },
          },
        },
        parametrs: [
          {
            name: "email",
            in: "query",
            description: "Email of user to log in",
            required: true,
            schema: {
              type: "string",
              format: "email",
            },
          },
          {
            name: "password",
            in: "query",
            description: "Password of user to log in",
            required: true,
            schema: {
              type: "string",
              pattern:
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{5,512})",
            },
          },
        ],
      },
    },
  },
  components: {
    schemas: {
      User: {
        schema: userDefinition,
      },
    },
  },
};
