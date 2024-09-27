// app/routes/index.jsx
import { useState } from 'react';

const LogoForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1]; // Get Base64 string without metadata

      const params = `id=customizer-product-public-app.myshopify.com&image=${base64String}&filename=${file.name}`;

      // const params = new URLSearchParams();
      // params.append('image', base64String);
      // params.append('filename', file.name); // Optionally send the original filename

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });

        const result = await response.json();
        if (response.ok) {
          setMessage('Upload successful: ' + result.filename);
        } else {
          setMessage('Upload failed: ' + result.message);
        }
      } catch (error) {
        setMessage('Upload error: ' + error.message);
      }
    };

    reader.readAsDataURL(file); // Read file as Base64
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="image" onChange={handleFileChange} required />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LogoForm;
