/* eslint-disable import/no-anonymous-default-export */
import { randomNumber } from './utils';

/*
 * Mirage JS guide on Factories: https://miragejs.com/docs/data-layer/factories
 */
import { Factory } from 'miragejs';

/*
 * Faker Github repository: https://github.com/Marak/Faker.js#readme
 */
import { faker } from '@faker-js/faker';

const user = {
  user: Factory.extend({
    name() {
      return faker.fake('{{name.findName}}');
    },
    mobile() {
      return faker.fake('{{phone.phoneNumber}}');
    },
    // @ts-ignore
    afterCreate(user, server) {
      const messages = server.createList('message', randomNumber(10), { user });

      user.update({ messages });
    },
  }),
};

export default user;
