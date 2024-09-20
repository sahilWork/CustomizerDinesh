import { json } from '@remix-run/node';
import prisma from '../db.server'; // Adjust this import based on your structure

export const loader = async () => {
    try {
        const shop = 'customizer-product-public-app.myshopify.com'; // Retrieve this as needed
        const colorSettings = await prisma.colorSettings.findUnique({
            where: { id: shop },
        });
        return json({ success: true, colorGroup: colorSettings?.colorGroup || '' });
    } catch (error) {
        console.error('Error fetching color settings:', error);
        return json({ success: false, message: error.message }, { status: 500 });
    }
};
