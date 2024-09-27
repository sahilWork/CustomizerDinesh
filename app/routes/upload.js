// app/routes/upload.js
import fs from 'fs';
import path from 'path';
import { json } from '@remix-run/node';
import { prisma } from '../db.server';

export const action = async ({ request }) => {
  const formData = await request.formData();

  // Log form data keys to check what's being sent
  console.log('Form data keys:', [...formData.keys()]);

  const base64Image = formData.get('image'); // Ensure this matches the client-side
  const filename = formData.get('filename');

  // Check if base64Image or filename is not found
  if (!base64Image || !filename) {
    console.error('Missing image or filename');
    return json({ message: 'Image or filename not provided' }, { status: 400 });
  }
  
  // Remove any prefix that may be included in the base64 string
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const imageBuffer = Buffer.from(base64Data, 'base64');
  const newPath = path.join(uploadDir, filename);

  // Write the image to file
  try {
    fs.writeFileSync(newPath, imageBuffer);
  } catch (error) {
    console.error('Error writing file:', error);
    return json({ message: error.message }, { status: 500 });
  }

  // Save image info to the database using Prisma
  const uploadedImage = await prisma.image.create({
    data: {
      filename,
      imagepath: `/uploads/${filename}`, // Use backticks for template literals
    },
  });

  return json(uploadedImage);
};


export const loader = async () => {
  return json({ message: "Upload successful!" });
};
