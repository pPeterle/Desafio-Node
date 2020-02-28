import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../util/factories';

describe('user tests', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user passwrod when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);
    expect(compareHash).toBe(true);
  });

  it('should not be able to register without email', async () => {
    const user = await factory.attrs('User', {
      email: null,
    });

    const response = await request(app)
      .post('/users')
      .send(user);

    expect(response.status).toBe(400);
  });

  it('should be able to create a user', async () => {
    const user = await factory.attrs('User');
    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should list all users', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(0);
  });
});
