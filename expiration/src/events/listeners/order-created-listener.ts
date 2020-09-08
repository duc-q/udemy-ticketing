import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@duc.q/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Times in milisecond
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting this many miliseconds to process the job`, delay)

    await expirationQueue.add({
      orderId: data.id,
    }, {
      delay,
    });

    msg.ack();
  }
}
