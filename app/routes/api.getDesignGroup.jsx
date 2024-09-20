import { json } from '@remix-run/node';
import prisma from '../db.server'; // Adjust this import based on your structure

export const loader = async () => {
    try {
        const shop = 'customizer-product-public-app.myshopify.com'; // Retrieve this as needed
        const designSettings = await prisma.designSettings.findUnique({
            where: { id: shop },
        });
        return json({ success: true, designGroup: designSettings?.designGroup || '' });
    } catch (error) {
        console.error('Error fetching Design settings:', error);
        return json({ success: false, message: error.message }, { status: 500 });
    }
};
