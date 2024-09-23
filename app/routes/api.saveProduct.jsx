
import { json } from '@remix-run/node';
import prisma from '../db.server'; // Import your Prisma instance


export const action = async ({ request }) => {
    try {
        const formData = new URLSearchParams(await request.text());
        const id = formData.get('shop');
        const title = formData.get('products');
        const designs = formData.get("designs") || null; // Allow null if not provided
        const colors = formData.get("colors") || null; // Allow null if not provided

        const listProduct = title.split(',');
        let items = [];
        listProduct.map(product => {
            items.push({
                id: id + '_' + product,
                title: product,
                designs: designs,
                colors: colors,
            });
        });
        const method = request.method;
        if (method === 'POST') {
            const createdItems = await prisma.product.createMany({
                data: items,
            });
            return json({ success: true, createdItems });
        } else {
            return json({ success: false, message: 'Unsupported request method' }, { status: 405 });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return json({ success: false, message: 'Values already Existed.' }, { status: 500 });
    }
};
