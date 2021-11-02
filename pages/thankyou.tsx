import Head from 'next/head'
import { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";

import { mealOptions, validMealDates } from '../utils/mealConfig';

const stripePromise = loadStripe("pk_test_51J1TyKLqUjiXusfCouAMNY7rpc8oqlT2Nnmlg2fKdNX1MKxh6KRjGY264kYrFcgKE9KF9VNVSNi9CmVVa7rRrJZ200XFNM9APy");

export default function Home() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<null|string>(null);
  const [vegetarianMealCount, setVegetarianMealCount] = useState(0);
  const [nonVegetarianMealCount, setNonVegetarianMealCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const mealDates = validMealDates();

  const canSubmit = (!loading) && (selectedDate !== null && selectedDate !== "null") && (vegetarianMealCount + nonVegetarianMealCount > 0);

  const handleCheckoutSubmit = async () => {
      console.log('submit');
      const stripe = await stripePromise;

      if (!stripe) {
          console.error('Stripe not ready to respond')
          return;
      }

      setLoading(true);

      try {
        const body = {
          name,
          email,
          date: selectedDate,
          vegetarianMealCount: vegetarianMealCount,
          nonVegetarianMealCount: nonVegetarianMealCount,
        }
  
        const response = await fetch("/api/checkout_session", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const session = await response.json();
        console.log(session);
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        console.log(result);
        if (result.error) {
            console.error(result.error);
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        }
      } finally {
        setLoading(false);
      }
      
  };

  return (
    <>
      <Head>
        <title>Purchase Drill Suppers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container-fluid" style={{ maxWidth: 500, marginTop: '2em' }}>
        <div className="row">
          <div className="col">
            <h1>Thank you</h1>
            <p>You will receive a confirmation email through shortly and your name will be on the list in the Sutling Room</p>
          </div>
        </div>
      </div>
    </>
  )
}
