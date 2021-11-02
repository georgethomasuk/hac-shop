import Head from 'next/head'
import Image from 'next/image'
import { loadStripe } from "@stripe/stripe-js";
import styles from '../styles/Home.module.css'

const stripePromise = loadStripe("pk_test_51J1TyKLqUjiXusfCouAMNY7rpc8oqlT2Nnmlg2fKdNX1MKxh6KRjGY264kYrFcgKE9KF9VNVSNi9CmVVa7rRrJZ200XFNM9APy");

export default function Drill() {

    const handleClick = async () => {
        const stripe = await stripePromise;

        if (!stripe) {
            return;
        }

        const response = await fetch("/api/checkout_session", {
            method: "POST",
        });
        const session = await response.json();
        // When the customer clicks on the button, redirect them to Checkout.
        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Drill Suppers</title>
                <meta name="description" content="Buy a drill supper" />
            </Head>

            <main className={styles.main}>
                <form method="POST">
                    <h1>Booking</h1>
                    <fieldset style={{ padding: '1em', marginBottom: '2em' }}>
                        <legend>Person</legend>
                        <div>
                            <label htmlFor="initials" style={{ display: 'block', width: '250px' }}>Initials</label>
                            <input id="initials" type="text" style={{ display: 'block', width: '250px' }} />
                        </div>
                        <div>
                            <label htmlFor="name" style={{ display: 'block', width: '250px' }}>Name</label>
                            <input id="name" type="text" style={{ display: 'block', width: '250px' }} />
                        </div>
                    </fieldset>
                    <fieldset style={{ padding: '1em' }}>
                        <legend>Meals</legend>
                        <div>
                            <label htmlFor="meat-meal" style={{ display: 'block', width: '250px' }}>Non-Vegetarian</label>
                            <input id="meat-meal" type="integer" style={{ display: 'block', width: '250px' }} />
                        </div>
                        <div style={{ marginTop: '2em' }}>
                            <label htmlFor="veg-meal" style={{ display: 'block', width: '250px' }}>Vegeratian</label>
                            <input id="veg-meal" type="integer" style={{ display: 'block', width: '250px' }} />
                        </div>
                    </fieldset>
                    <button type="button" id="checkout-button" role="link" onClick={handleClick}>
                        Checkout
                    </button>
                </form>
            </main>
        </div>
    )
}
