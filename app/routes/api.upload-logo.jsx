import { json } from '@remix-run/node';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../db.server'; // Adjust the path as needed

export const action = async ({ request }) => {
    try {
        const body = new URLSearchParams(await request.text());
        const image = body.get('image');
        const filename = body.get('filename');

        if (!filename) {
            return json({ success: false, message: 'Image and filename are required' }, { status: 400 });
        }

        // Prepare file details
        const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
        const uniqueId = uuidv4();
        const filePath = join(process.cwd(), 'public/assets/logos', filename);

        // Write the file
        await writeFile(filePath, base64Data, 'base64');

        // Save logo details in the database
        const logo = await prisma.Logos.create({
            data: {
                id: uniqueId,
                filename,
                imagepath: `/assets/logos/${filename}`,
            },
        });

        return json({ success: true, logo });
    } catch (error) {
        console.error('Error handling request:', error);
        return json({ success: false, message: 'File upload failed: ' + error.message }, { status: 500 });
    }
};
