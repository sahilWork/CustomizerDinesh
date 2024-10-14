import { json } from '@remix-run/node';
import prisma from '../db.server'; 
import { join } from 'path';
import { unlink } from 'fs/promises'; 

export const action = async ({ request }) => {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return json({ success: false, message: 'Logo ID is required' }, { status: 400 });
    }

    try {
        const logo = await prisma.Logos.findUnique({
            where: { id },
        });

        if (!logo) {
            return json({ success: false, message: 'Logo not found' }, { status: 404 });
        }
        await prisma.Logos.delete({
            where: { id },
        });
        const filePath = join(process.cwd(), 'public/assets/logos', logo.filename); 
        await unlink(filePath); 

        return json({ success: true });
    } catch (error) {
        console.error('Error deleting logo:', error);
        return json({ success: false, message: 'Failed to delete logo: ' + error.message }, { status: 500 });
    }
};
