import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';
import { useState, useEffect } from 'react';

const OrderShow = ({ order, currentUser }) => {
  // console.log(`OrderShow -> currentUser`, currentUser)
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      console.log(`findTimeLeft -> msLeft`, msLeft)

      setTimeLeft(Math.round(msLeft/1000))

      // if (msLeft < 0)
      //   clearInterval(timerId);
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    }
  }, []);

  if (timeLeft < 0) {
    return (
      <div>
        Order expired
      </div>
    )
  }

  return (
    <div>
      Time left to pay: {timeLeft}
      <StripeCheckout
        token={token => {
          console.log(token)
        }}
        stripeKey="pk_test_BmWKtbqrvk1iwHJs5uhfY110"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return {
    order: data
  }
}

export default OrderShow;