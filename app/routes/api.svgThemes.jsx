import { json } from "@remix-run/node";

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const shop = formData.get('shop');
    const accessToken = formData.get('accessToken');

    if (!shop || !accessToken) {
        return json({ success: false, message: "Shop or Access Token are required." }, { status: 400 });
    }

    try {
        const response = await fetch(`https://${shop}/admin/api/2023-07/themes.json`, {
            method: 'GET',
            headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
            },
        });
    
        const data = await response.json();
        const id = data.themes[0].id;

        return json({ success: true, themeId: id });
    } catch (error) {
        console.error('Error deleting product:', error);
        return json({ success: flase });
    }
};
