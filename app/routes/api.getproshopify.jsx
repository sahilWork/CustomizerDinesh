import { json } from "@remix-run/node";

export const loader = async () => {


    const response = await fetch('https://customizer-product-public-app.myshopify.com/admin/api/2023-10/products.json', {
        headers: {
            'X-Shopify-Access-Token': 'shpua_9150b14272deee34ca9c4b7472ac8266',
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Response('Failed to fetch products', { status: response.status });
    }

    const data = await response.json();
    return json(data);
};


