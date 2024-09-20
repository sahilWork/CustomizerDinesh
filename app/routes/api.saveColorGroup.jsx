// app/routes/api/save-data.js
// import { json } from '@remix-run/node';
// import prisma from '../db.server'; // Import your Prisma instance


// export const action = async ({ request }) => {
//     try {
//         const formData = new URLSearchParams(await request.text());
//         const shop = formData.get('shop');
//         const colorGroup = formData.get('colorGroup');
//         const method = request.method;
//         if (method === 'POST') {
//             const result = await prisma.colorSettings.findUnique({
//                 where: {
//                     id: shop, // Specify the ID of the record to check for existence
//                 },
//             });
//             return json({ success: true, result });
//         } else {
//             return json({ success: false, message: 'Unsupported request method' }, { status: 405 });
//         }
//     } catch (error) {
//         console.error('Error handling request:', error);
//         return json({ success: false, message: error.message }, { status: 500 });
//     }
// };
// app/routes/api/save-data.js
import { json } from '@remix-run/node';
import prisma from '../db.server'; // Import your Prisma instance


export const action = async ({ request }) => {
    try {
        const formData = new URLSearchParams(await request.text());
        const shop = formData.get('shop');
        const colorGroup = formData.get('colorGroup');
        const method = request.method;
        if (method === 'POST') {
            const result = await prisma.colorSettings.upsert({
                where: {
                    id: shop, // Specify the ID of the record to check for existence
                },
                update: {
                    colorGroup: colorGroup,
                },
                create: {
                    id: shop,
                    colorGroup: colorGroup,
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
