import faker from 'faker';
import { factory } from 'factory-girl';
import User from '../../src/app/models/User';
import Recipient from '../../src/app/models/Recipient';
import Delivery from '../../src/app/models/Delivery';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Recipient', Recipient, {
  name: faker.name.findName(),
  street: faker.address.streetName(),
  number: faker.random.number(),
  complement: faker.name.findName(),
  state: faker.address.state(),
  city: faker.address.city(),
  cep: faker.random.number(),
});

factory.define('Deliveryman', Delivery, {
  name: faker.name.findName(),
  email: faker.internet.email(),
});

factory.define('Delivery', Delivery, {
  product: faker.name.findName(),
});

export default factory;
