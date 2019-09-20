import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { AuthenticationComponent, registerAuthenticationStrategy } from "@loopback/authentication"
import * as path from 'path';
import { MySequence } from './sequence';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import { TokenServiceBindings, TokenServicesConstants, PasswordHasherBindings, UserServiceBindings } from './keys';
import { JWTService } from "./services/jwt-service";
import { MyUserService } from "./services/user-service";
import { hashPassword, BcryptHasher } from './services/hash.password.bcryptjs';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}

export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

export class ChatApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setUpBindings();

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServicesConstants.TOKEN_SECRET_VALUE
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServicesConstants.TOKEN_EXPIRES_IN_VALUE
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(
      JWTService
    );

    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
  }
}
