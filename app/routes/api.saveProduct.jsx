
import { json } from '@remix-run/node';
import prisma from '../db.server'; // Import your Prisma instance


export const action = async ({ request }) => {
    try {
        const formData = new URLSearchParams(await request.text());
        const shop = formData.get('shop');
        const prodcuts = formData.get('products');
        const method = request.method;
        if (method === 'POST') {
            const result = await prisma.designSettings.upsert({
                where: {
                    id: shop, // Specify the ID of the record to check for existence
                },
                update: {
                    designGroup: designGroup,
                },
                create: {
                    id: shop,
                    designGroup: designGroup,
                },
            });
            return json({ success: true, result });
        } else {
            return json({ success: false, message: 'Unsupported request method' }, { status: 405 });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return json({ success: false, message: error.message }, { status: 500 });
    }
};
