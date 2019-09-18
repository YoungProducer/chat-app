import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  FilterBuilder,
} from "@loopback/repository";
import {
  api,
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
import {def} from "./user.controller.api";
import {User} from "../models";
import {UserRepository} from "../repositories";
import {E_ActionResponse, I_RequestResponse} from "../middleware";

@api(def)
export class UserController {
  filterBuilder = new FilterBuilder();
  hashAsync = promisify(hash);

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async signUp(user: Omit<User, "id">): Promise<I_RequestResponse> {
    let requestResponse: I_RequestResponse = {
      actionResponse: E_ActionResponse.DEFAULT,
    };
    const filter = this.filterBuilder
      .fields("id", "email", "password")
      .limit(10)
      .offset(0)
      .order(["id ASC"])
      .where({email: user.email})
      .build();
    let decodedUser: Omit<User, "id"> = user;
    decodedUser.password = await this.hashAsync(user.password, 10);

    if ((await this.userRepository.findOne(filter)) === null) {
      genSalt(10, function(err, salt) {
        if (err) {
          requestResponse.actionResponse = E_ActionResponse.ERROR;
        }

        hash(user.password, salt, function(err, hash) {
          if (err) {
            requestResponse.actionResponse = E_ActionResponse.ERROR;
          }

          decodedUser.password = hash;
        });
      });

      this.userRepository.create(decodedUser);
      requestResponse.actionResponse = E_ActionResponse.SUCCESS;
    } else {
      requestResponse.actionResponse = E_ActionResponse.EMAIL_ALREADY_EXIST;
    }

    return requestResponse;
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

  async signIn(user: Omit<User, "id">): Promise<I_RequestResponse> {
    let requestResponse: I_RequestResponse = {
      actionResponse: E_ActionResponse.DEFAULT,
    };
    const filter = this.filterBuilder
      .fields("id", "email", "password")
      .limit(10)
      .offset(0)
      .order(["id ASC"])
      .where({email: user.email})
      .build();

    const found: User | null = await this.userRepository.findOne(filter);
    if (found !== null) {
      if (await compare(user.password, found.password)) {
        requestResponse.actionResponse = E_ActionResponse.SUCCESS;
      } else requestResponse.actionResponse = E_ActionResponse.INVALID_PASSWORD;
    } else requestResponse.actionResponse = E_ActionResponse.USER_NOT_FOUND;

    return requestResponse;
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
    const filterForUsers = this.filterBuilder
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
