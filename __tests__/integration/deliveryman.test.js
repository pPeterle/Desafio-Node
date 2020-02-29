import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../util/factories';

describe('Deliveryman test', () => {
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

  it('should return a list of deliverymans', async () => {
    const result = await request(app)
      .get('/deliveryman')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should not store deliveryman without all fields', async () => {
    const deliveryman = await factory.attrs('Deliveryman', {
      name: null,
    });

    const result = await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(400);
  });

  it('should store deliveryman', async () => {
    const deliveryman = await factory.attrs('Deliveryman');

    const result = await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(201);
    expect(result.body.name).toEqual(deliveryman.name);
    expect(result.body).toHaveProperty('id');
  });

  it('should update deliveryman', async () => {
    const deliveryman = await factory.attrs('Deliveryman');
    let result = await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    deliveryman.name = 'new name';
    const { id } = result.body;

    result = await request(app)
      .put(`/deliveryman/${id}`)
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    expect(result.body.name).toEqual(deliveryman.name);
    expect(result.body).toHaveProperty('id');
  });

  it('should not update deliveryman id', async () => {
    const deliveryman = await factory.attrs('Deliveryman');
    let result = await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    deliveryman.name = 'new name';
    const { id } = result.body;
    result.body.id = id + 1;

    result = await request(app)
      .put(`/deliveryman/${id}`)
      .send(result.body)
      .set('Authorization', `Bearer ${token}`);

    expect(result.body.id).toEqual(id);
  });

  it('should not update deliveryman with invalid id', async () => {
    const deliveryman = await factory.attrs('Deliveryman');

    const res = await request(app)
      .put(`/deliveryman/2132132454`)
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should not delete recipient with invalid id', async () => {
    const res = await request(app)
      .delete(`/deliveryman/2132132454`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should delete a recipient', async () => {
    const deliveryman = await factory.attrs('Deliveryman');
    let res = await request(app)
      .post(`/deliveryman`)
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    const { id } = res.body;

    res = await request(app)
      .delete(`/deliveryman/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
