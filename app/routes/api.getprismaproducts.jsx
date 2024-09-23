// routes/api/getproducts.js
import { json } from '@remix-run/node';
import prisma from '../db.server';

export const loader = async () => {
    try {
        const products = await prisma.product.findMany({
            select: {
                id: true,
                title: true,
                designs: true,
                colors: true,
            },
        });
        return json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return json({ success: false, message: 'Error fetching products' }, { status: 500 });
    }
};
