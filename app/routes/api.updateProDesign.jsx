import { json } from "@remix-run/node";
import prisma from '../db.server';

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const id = formData.get('shop');
    const designs = formData.get('designs');

    if (!id || !designs) {
        return json({ success: false, message: "Shop and design are required." }, { status: 400 });
    }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: id },
            data: { designs },
        });

        return json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error('Error updating product design:', error);
        return json({ success: false, message: "Failed to update design." }, { status: 500 });
    }
};


