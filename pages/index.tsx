import Head from 'next/head'
import { useState } from 'react'
import { loadStripe } from "@stripe/stripe-js";

import { mealOptions, validMealDates } from '../utils/mealConfig';

const stripePromise = loadStripe("pk_test_51J1TyKLqUjiXusfCouAMNY7rpc8oqlT2Nnmlg2fKdNX1MKxh6KRjGY264kYrFcgKE9KF9VNVSNi9CmVVa7rRrJZ200XFNM9APy");

export default function Home() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<null|string>(null);
  const [drillSupperCount, setDrillSupperCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const mealDates = validMealDates();

  const canSubmit = (!loading) && (selectedDate !== null && selectedDate !== "null") && (drillSupperCount > 0);

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
          drillSupperCount: drillSupperCount,
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
            <h1>Purchase Drill Suppers</h1>
            <p>Book a drill supper at the HAC, which includes a main meal and a dessert.</p>
            <p>Bookings can be made up until 6pm on the day.</p>
          </div>
        </div>
        <form onSubmit={(event) => {handleCheckoutSubmit(); event.preventDefault();}}>
          <div className="row mt-4">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label">Your Name (required):</label>
                    <input type="text" className="form-control" id="nameInput" aria-describedby="nameHelp" required value={name} onChange={event => setName(event.target.value)} disabled={loading}/>
                    <div id="nameHelp" className="form-text">To add to our list on the night.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">Email address (required):</label>
                    <input type="email" className="form-control" id="emailInput" aria-describedby="emailHelp" required  value={email} onChange={event => setEmail(event.target.value)} disabled={loading}/>
                    <div id="emailHelp" className="form-text">So we can send you a receipt.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col">
              <div className="card">
                <div className="card-body">
              
                  <div className="row">
                    <div className="col">
                      <select className="form-select" aria-label="Default select example" defaultValue="null" onChange={event => setSelectedDate(event.target.value)} disabled={loading}>
                        <option value="null" disabled>Select Date</option>
                        {
                          mealDates.map(mealDate => {
                            return <option key={mealDate.date.toISODate()} value={mealDate.date.toISO().split('.')[0]} disabled={mealDate.onSale === false}>
                              {mealDate.date.toFormat('ccc dd LLL, h.mma', { locale: "en-GB" })}{mealDate.onSale === false ? ` (${mealDate.offSaleReason})` : ''}
                            </option>
                          })
                        }
                      </select>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6">
                              <div className="fs-8 fw-bold">{mealOptions.drillSupper.name}</div>
                              <div className="fs-10">£{mealOptions.drillSupper.unit_cost / 100}</div>
                            </div>
                            <div className="col-6">
                              <div className="row mt-1">
                                <div className="col-4 text-center">
                                  <button type="button" disabled={drillSupperCount < 1 || loading} className="btn btn-secondary" onClick={() => setDrillSupperCount(drillSupperCount - 1)}>-</button>
                                </div>
                                <div className="col-4 card text-center">
                                  <div className="card-body" style={{ height: 38, padding: 0 }}>
                                    <p style={{ lineHeight: '38px' }}>{drillSupperCount}</p>
                                  </div>
                                </div>
                                <div className="col-4 text-center">
                                  <button type="button" className="btn btn-secondary" onClick={() => setDrillSupperCount(drillSupperCount + 1)}  disabled={loading  || drillSupperCount >= mealOptions.drillSupper.max}>+</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4 mb-4">
            <div className="col mb-4">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit" disabled={canSubmit === false}>
                  { 
                    loading ? <div className="spinner-border" role="status"></div> : <span>Checkout (£{(drillSupperCount * mealOptions.drillSupper.unit_cost) / 100})</span>
                  }  
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
