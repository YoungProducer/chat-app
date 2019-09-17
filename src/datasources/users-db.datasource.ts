import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './users-db.datasource.json';

export class UsersDbDataSource extends juggler.DataSource {
  static dataSourceName = 'UsersDb';

  constructor(
    @inject('datasources.config.UsersDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
