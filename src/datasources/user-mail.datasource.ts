import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './user-mail.datasource.json';

export class UserMailDataSource extends juggler.DataSource {
  static dataSourceName = 'UserMail';

  constructor(
    @inject('datasources.config.UserMail', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
