import {Entity, model, property} from "@loopback/repository";
import {userDefinition} from "./user.definition";

@model(userDefinition)
export class User extends Entity {
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
