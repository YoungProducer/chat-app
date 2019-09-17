import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  FilterBuilder,
} from "@loopback/repository";
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from "@loopback/rest";
import {hash, compare, genSalt} from "bcryptjs";
import {promisify} from "util";
import {User} from "../models";
import {UserRepository} from "../repositories";
import {runInNewContext} from "vm";

export class UserController {
  hashAsync = promisify(hash);
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post("/signup", {
    responses: {
      "200": {
        description: "User model instance",
        content: {"application/json": {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, {exclude: ["id"]}),
        },
      },
    })
    user: Omit<User, "id">,
  ): Promise<User | string> {
    let decodedUser: Omit<User, "id"> = user;
    decodedUser.password = await this.hashAsync(user.password, 10);

    genSalt(10, function(err, salt) {
      if (err) return err;
      hash(user.password, salt, function(err, hash) {
        if (err) return err;
        decodedUser.password = hash;
      });
    });

    return this.userRepository.create(decodedUser);
  }

  @get("/users/count", {
    responses: {
      "200": {
        description: "User model count",
        content: {"application/json": {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object("where", getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @post("/signin", {
    responses: {
      "200": {
        description: "Array of User model instances",
        content: {
          "application/json": {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async signIn(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, {exclude: ["id"]}),
        },
      },
    })
    user: Omit<User, "id">,
  ): Promise<string> {
    const filterBuilder = new FilterBuilder();
    const filter = filterBuilder
      .fields("id", "email", "password")
      .limit(10)
      .offset(0)
      .order(["id ASC"])
      .where({email: user.email})
      .build();

    const foundUser: User[] = await this.userRepository.find(filter);

    let result: string = "";

    return result;
  }

  @get("/users", {
    responses: {
      "200": {
        description: "Array of User model instances",
        content: {
          "application/json": {
            schema: {type: "array", items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(@param.path.string("email") email: string): Promise<User[]> {
    const filterBuilder = new FilterBuilder();
    const filterForUsers = filterBuilder
      .fields("id", "email", "password")
      .limit(10)
      .offset(0)
      .order(["id ASC"])
      .where({email: email})
      .build();

    return this.userRepository.find(filterForUsers);
  }

  @patch("/users", {
    responses: {
      "200": {
        description: "User PATCH success count",
        content: {"application/json": {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object("where", getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get("/users/{id}", {
    responses: {
      "200": {
        description: "User model instance",
        content: {"application/json": {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async findById(@param.path.number("id") id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  @patch("/users/{id}", {
    responses: {
      "204": {
        description: "User PATCH success",
      },
    },
  })
  async updateById(
    @param.path.number("id") id: number,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put("/users/{id}", {
    responses: {
      "204": {
        description: "User PUT success",
      },
    },
  })
  async replaceById(
    @param.path.number("id") id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del("/users/{id}", {
    responses: {
      "204": {
        description: "User DELETE success",
      },
    },
  })
  async deleteById(@param.path.number("id") id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
