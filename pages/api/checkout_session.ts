import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { mealOptions } from '../../utils/mealConfig';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2020-08-27" });

const YOUR_DOMAIN = process.env.APP_DOMAIN;


type Data = {
    id: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const session = await stripe.checkout.sessions.create({
        customer_email: req.body.email,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${mealOptions.drillSupper.name}/${req.body.date}`,
                    },
                    unit_amount: mealOptions.drillSupper.unit_cost,
                },
                quantity: req.body.drillSupperCount,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/thankyou`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.json({ id: session.id });
}