import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

import factory from '../util/factories';

describe('Deliveryman Actions', () => {
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

  async function createDelivery(deliverymanId) {
    const delivery = await factory.attrs('Delivery');
    const recipient = await factory.attrs('Recipient');
    const deliveryman = await factory.attrs('Deliveryman');

    let res = await request(app)
      .post('/recipients')
      .send(recipient)
      .set('Authorization', `Bearer ${token}`);

    delivery.recipient_id = res.body.id;

    await request(app)
      .post('/deliveryman')
      .send(deliveryman)
      .set('Authorization', `Bearer ${token}`);

    if (!deliverymanId) {
      res = await request(app)
        .post('/deliveryman')
        .send(deliveryman)
        .set('Authorization', `Bearer ${token}`);

      delivery.deliveryman_id = res.body.id;
    } else {
      delivery.deliveryman_id = 1;
    }

    return delivery;
  }

  it('should return all deliveries that are not canceled and delivered', async () => {
    const delivery = await createDelivery();

    const delivery2 = await createDelivery();

    await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    await request(app)
      .post('/delivery')
      .send(delivery2)
      .set('Authorization', `Bearer ${token}`);

    const result = await request(app)
      .get(`/deliveryman/${delivery.deliveryman_id}/deliveries`)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBe(1);
  });

  it('should return all deliveries that are delivered', async () => {
    const delivery = await createDelivery();

    await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    const result = await request(app)
      .get(`/deliveryman/${delivery.deliveryman_id}/deliveries-finished`)
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body.length).toBeGreaterThanOrEqual(0);
  });

  it('should update delivery status to retired', async () => {
    const delivery = await createDelivery();

    let result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    result = await request(app)
      .put(`/deliveryman/${result.body.id}/retirar`)
      .send({
        start_date: '2020-02-29T22:00:00-03:00',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('id');
  });

  it.skip('should not update delivery status to retired when the deliveryman take more than 5 deliveries', async () => {
    const deliveryList = [
      await createDelivery(1),
      await createDelivery(1),
      await createDelivery(1),
      await createDelivery(1),
      await createDelivery(1),
      await createDelivery(1),
    ];

    const idDeliveries = await deliveryList.map(async delivery => {
      const res = await request(app)
        .post('/delivery')
        .send(delivery)
        .set('Authorization', `Bearer ${token}`);
      return res.body.id;
    });

    await idDeliveries.forEach(async id => {
      const newId = await id;
      const result = await request(app)
        .put(`/deliveryman/${newId}/retirar`)
        .send({
          start_date: '2020-02-28T22:00:00-03:00',
        })
        .set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty('id');
    });
  });

  it('should update delivery status to delivered', async () => {
    const delivery = await createDelivery();

    let result = await request(app)
      .post('/delivery')
      .send(delivery)
      .set('Authorization', `Bearer ${token}`);

    const { id } = result.body;

    result = await request(app)
      .post('/files')
      .attach(
        'file',
        '/media/pedro/Linux/Roctseat/Desafio/tmp/uploads/3cd52f2d6886dc04303f715d98387eeb.jpg'
      )
      .set('Authorization', `Bearer ${token}`);

    result = await request(app)
      .put(`/deliveryman/${id}/entregar`)
      .send({
        end_date: '2020-02-28T22:00:00-03:00',
        signature_id: `${result.body.id}`,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('id');
  });
});
