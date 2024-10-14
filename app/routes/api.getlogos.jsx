import { json } from '@remix-run/node';
import prisma from '../db.server'; // Adjust the path as needed

export const action = async ({ request }) => {
    try {
        const logos = await prisma.Logos.findMany({
            select: {
                id: true,
                imagepath: true,
                filename: true,
            },
        });

        return json({ success: true, logos });
    } catch (error) {
        console.error('Error fetching logos:', error);
        return json({ success: false, message: 'Failed to fetch logos: ' + error.message }, { status: 500 });
    }
};
