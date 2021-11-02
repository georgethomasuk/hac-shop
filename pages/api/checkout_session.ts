import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'
import { mealOptions } from '../../utils/mealConfig';

const stripe = new Stripe('sk_test_51J1TyKLqUjiXusfCjAaSX7pAc37us8BatbmfbnGeeF7M7aCjETYAJz6YYY5b9Syv3faZqlbNjI7435C28O7YuwPO00zmUOqDUM', { apiVersion: "2020-08-27" });

const YOUR_DOMAIN = 'https://hac-shop.vercel.app/drill';


type Data = {
    id: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    console.log(req.body);

    const session = await stripe.checkout.sessions.create({
        customer_email: req.body.email,
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${mealOptions.vegetarianMeal.name} (${req.body.date})`,
                    },
                    unit_amount: mealOptions.vegetarianMeal.unit_cost,
                },
                quantity: req.body.vegetarianMealCount,
            },
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${mealOptions.nonVegetarianMeal.name} (${req.body.date})`,
                    },
                    unit_amount: mealOptions.nonVegetarianMeal.unit_cost,
                },
                quantity: req.body.nonVegetarianMealCount,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/thankyou`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.json({ id: session.id });
}