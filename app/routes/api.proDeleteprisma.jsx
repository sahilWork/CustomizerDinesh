import { json } from "@remix-run/node";
import prisma from '../db.server';

export const action = async ({ request }) => {
    const formData = new URLSearchParams(await request.text());
    const shop = formData.get('shop');

    if (!shop) {
        return json({ success: false, message: "Shop are required." }, { status: 400 });
    }

    try {
        const updatedProduct = await prisma.product.delete({
            where: { id: shop },
        });

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        return json({ success: flase });
    }
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
};
