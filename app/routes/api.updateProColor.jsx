import { json } from "@remix-run/node";
import prisma from '../db.server';

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const shop = formData.get('shop');
    const colors = formData.get('colors');

    if (!shop || !colors) {
        return json({ success: false, message: "Shop and colors are required." }, { status: 400 });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: shop },
            data: { colors },
        });

        return json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product colors:', error);
        return json({ success: false, message: "Failed to update colors." }, { status: 500 });
    }
};
