import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe('sk_test_51J1TyKLqUjiXusfCjAaSX7pAc37us8BatbmfbnGeeF7M7aCjETYAJz6YYY5b9Syv3faZqlbNjI7435C28O7YuwPO00zmUOqDUM', { apiVersion: "2020-08-27" });

const YOUR_DOMAIN = 'https://hac-shop.vercel.app/drill';


type Data = {
    id: string
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Vegetarian Drill Supper',
                        images: ['https://images.immediate.co.uk/production/volatile/sites/30/2020/08/caponata-pasta_1-197841f.jpg?webp=true&quality=90&resize=500%2C454'],
                    },
                    unit_amount: 500,
                },
                quantity: 2,
            },
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: 'Meat Drill Supper',
                        images: ['https://images.immediate.co.uk/production/volatile/sites/30/2020/08/coconut-squash-dhansak-a3a9133.jpg?quality=90&webp=true&resize=600,545'],
                    },
                    unit_amount: 500,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}?success=true`,
        cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    res.json({ id: session.id });
}