import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { mealOptions } from '../../utils/mealConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

const YOUR_DOMAIN = process.env.APP_DOMAIN;


type Data = {
    id: string
}

async function getSessionData(session: Stripe.Checkout.Session) {
    const line_items = await stripe.checkout.sessions.listLineItems(session.id);
    const customer = session.customer ? await stripe.customers.retrieve(session.customer) : {};

    return line_items.data.map(line_item => {
        return {
            sessionId: session.id,
            item: line_item.description,
            quantity: line_item.quantity,
            customer_email: customer ? customer.email : 'Unknown Email',
        }
    })

    
}

async function getDrillSupperTransactions(){
    const checkoutSessions = await stripe.checkout.sessions.list();

    const transactions = [];

    for (let session of checkoutSessions.data) {
        const line_items = await getSessionData(session);
        transactions.push(...line_items);
    }

    const drillSuppers = transactions.filter(transaction => transaction.item.startsWith(mealOptions.drillSupper.name));

    const dates = {};

    for (let drillSupperTransaction of drillSuppers) {
        const date = drillSupperTransaction.item.split('/')[1];

        if (!dates[date]) {
            dates[date] = [];
        }

        dates[date].push(drillSupperTransaction);
    }

    return dates;
}



export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const password = req.body.password;

    if (req.body.password !== 'password123') {
        res.status(401);
        res.end();
    }

    const drillSuppers = await getDrillSupperTransactions()

    res.json(drillSuppers);
}