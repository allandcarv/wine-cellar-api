import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import File from '../app/models/File';
import User from '../app/models/User';
import Wine from '../app/models/Wine';

const models = [File, User, Wine];

class Database {
  constructor() {
    this.connection = new Sequelize(databaseConfig);

    this.init();
    this.associate();
  }

  init() {
    models.forEach(model => model.init(this.connection));
  }

  associate() {
    models.forEach(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
