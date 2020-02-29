import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../util/factories';

describe('Delivery test', () => {
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

  async function createDelivery() {
    const delivery = await factory.attrs('Delivery');
    const recipient = await factory.attrs('Recipient');
    const deliveryman = await factory.attrs('Deliveryman');

    let res = await request(app)
      .post('/recipients')
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    delivery.recipient_id = res.body.id;

    res = await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    delivery.deliveryman_id = res.body.id;

    return delivery;
  }

  it('should return a list of deliveries', async () => {
    const result = await request(app)
      .get('/delivery')
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should not store delivery without all fields', async () => {
    const delivery = await factory.attrs('Delivery');

    const result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(400);
  });

  it('should store delivery', async () => {
    const delivery = await createDelivery();
    const result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(201);
    expect(result.body.product).toEqual(delivery.product);
    expect(result.body).toHaveProperty('id');
  });

  it('should not update delivery with invalid id', async () => {
    const delivery = await createDelivery();
    const result = await request(app)
      .put(`/delivery/1544554545154454154`)
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(400);
  });

  it('should not update delivery id', async () => {
    const delivery = await createDelivery();

    let result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    const { id } = result.body;
    result.body.id = id + 1;

    result = await request(app)
      .put(`/delivery/${id}`)
      .send(result.body)
      .set('Authorization', `Bearer ${token}`);

    expect(result.body.id).toEqual(id);
  });

  it('should not update delivery with invalid id', async () => {
    const delivery = await createDelivery();

    const res = await request(app)
      .put(`/delivery/2132132454`)
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should update delivery', async () => {
    const delivery = await createDelivery();

    let result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    delivery.product = 'new product name';
    const { id } = result.body;

    result = await request(app)
      .put(`/delivery/${id}`)
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.product).toBe(delivery.product);
  });

  it('should not delete delivery with invalid id', async () => {
    const res = await request(app)
      .delete(`/delivery/213213245498797865461`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  it('should delete a delivery', async () => {
    const delivery = await createDelivery();

    let res = await request(app)
      .post(`/delivery`)
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    const { id } = res.body;

    res = await request(app)
      .delete(`/delivery/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
