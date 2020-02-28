import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../util/factories';

describe('Recipient test', () => {
  let token;

  beforeAll(async () => {
    await truncate();
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const res = await request(app)
      .post('/sessions')
      .send(user);

    token = res.body.token;
  });

  it('should return a list of recipients', async () => {
    const result = await request(app)
      .get('/recipients')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should not store recipient without all fields', async () => {
    const recipient = await factory.attrs('Recipient', {
      street: null,
    });

    const result = await request(app)
      .post('/recipients')
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(400);
  });

  it('should store recipient', async () => {
    const recipient = await factory.attrs('Recipient');

    const result = await request(app)
      .post('/recipients')
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(201);
    expect(result.body.name).toEqual(recipient.name);
    expect(result.body).toHaveProperty('id');
  });

  it('should update recipient', async () => {
    const recipient = await factory.attrs('Recipient');
    const result = await request(app)
      .post('/recipients')
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    recipient.name = 'new name';

    const res = await request(app)
      .put(`/recipients/${result.body.id}`)
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(recipient.name);
    expect(res.body).toHaveProperty('id');
  });

  it('should not update recipient with invalid id', async () => {
    const recipient = await factory.attrs('Recipient');

    const res = await request(app)
      .put(`/recipients/2132132454`)
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should not delete recipient with invalid id', async () => {
    const res = await request(app)
      .delete(`/recipients/2132132454`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
