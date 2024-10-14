import nodemailer from 'nodemailer';

// Action for handling the POST request
export const action = async ({ request }) => {
    const data = await request.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webbdeveloper24@gmail.com',
            pass: 'czdv trjw whev rdpu'
        },
    });
    let imageUrls = data.image_urls;
    // If imageUrls is a string, split it by a delimiter (e.g., comma)
    if (typeof imageUrls === 'string') {
        imageUrls = imageUrls.split(',').map(url => url.trim());
    }
    // Filter out any falsy values (like empty strings
    imageUrls = imageUrls.filter(Boolean);
    // Format image URLs into a string with line breaks
    const formattedImageUrls = imageUrls.join('\n');

    const mailOptions = {
        from: data.email,
        to: 'webbdeveloper24@gmail.com',
        subject: 'New Order Quote Request',
        text: `
            Business Name: ${data.businessName}
            Contact Person: ${data.contactPerson}
            Email: ${data.email}
            Phone: ${data.phone}
            Address: ${data.address}
            Product: ${data.product_name}
            Quantity: ${data.product_qty}
            SVG Images: ${formattedImageUrls}
            
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
};

// Optionally, if you want to handle GET requests as well
export const loader = async () => {
    return new Response('This route is for sending quotes only.', { status: 405 });
};
