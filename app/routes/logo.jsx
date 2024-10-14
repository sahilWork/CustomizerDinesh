import React, { useEffect, useState } from 'react';
import { Button, Modal, Card, DataTable, Pagination } from '@shopify/polaris';

const LogoForm = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);
    const [logos, setLogos] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 10; 
    const fetchLogos = async () => {
        try {
            const response = await fetch('/api/getlogos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },  
                body: '',
            }); 
            const data = await response.json();
            if (data.success) {
                setLogos(data.logos);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Error fetching logos: ' + err.message);
        }
    };

    useEffect(() => {
        fetchLogos();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            const params = new URLSearchParams();
            params.append('image', base64String);
            params.append('filename', file.name);

            try {
                const response = await fetch('/api/upload-logo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },  
                    body: params.toString(),
                });

                const result = await response.json();
                if (response.ok) {
                    setMessage('Upload successful: ' + result.logo.filename);
                    setPopupVisible(false); 
                    setLogos((prevLogos) => [
                        ...prevLogos,
                        {
                            id: result.logo.id, 
                            filename: result.logo.filename,
                            imagepath: result.logo.imagepath,
                        },
                    ]);
                   
                } else {
                    setMessage('Upload failed: ' + result.message);
                }
            } catch (error) {
                setMessage('Upload error: ' + error.message);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this logo?');
        if (!confirmed) return;

        try {
            const response = await fetch('/api/logoremove', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();
            if (response.ok) {
                setLogos((prevLogos) => prevLogos.filter((logo) => logo.id !== id));
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Error deleting logo: ' + error.message);
        }
    };

    const openPopup = () => setPopupVisible(true);
    const closePopup = () => setPopupVisible(false);

    // Pagination logic
    const totalPages = Math.ceil(logos.length / pageSize);
    const currentLogos = logos.slice((page - 1) * pageSize, page * pageSize);

    const rows = currentLogos.map((logo) => [
        <img src={logo.imagepath} alt={logo.filename} width={50} />,
        logo.filename,
        <Button onClick={() => handleDelete(logo.id)} destructive>Remove</Button>,
    ]);

    return (
        <div>
            <Card title="Logo Upload" sectioned>
                <Button onClick={openPopup} primary>Add Logo</Button>
            </Card>

            <Modal
                open={popupVisible}
                onClose={closePopup}
                title="Upload Logo"
                primaryAction={{
                    content: 'Upload',
                    onAction: handleSubmit,
                }}
            >
                <Modal.Section>
                    <form onSubmit={handleSubmit}>
                        <input type="file" name="image" onChange={handleFileChange} required />
                        {message && <p>{message}</p>}
                    </form>
                </Modal.Section>
            </Modal>

            <Card title="Uploaded Logos" sectioned>
                {error && <p>{error}</p>}
                {currentLogos.length > 0 ? (
                    <>
                        <DataTable
                            columnContentTypes={['component', 'text']}
                            headings={['Logo', 'Filename', 'Actions']}
                            rows={rows}
                        />
                        <Pagination
                            hasPrevious={page > 1}
                            hasNext={page < totalPages}
                            onPrevious={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                            label={`Page ${page} of ${totalPages}`}
                        />
                    </>
                ) : (
                    <p>No logos uploaded yet.</p>
                )}
            </Card>
        </div>
    );
};

export default LogoForm;
