import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox, Modal, FormLayout, TextField } from '@shopify/polaris';
import Layout from '../components/Layout';
import { authenticate } from '../shopify.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    return { session };
}

const ProductListing = () => {
    const { session } = useLoaderData();
    const [shop, setShop] = useState(session.shop);
    const [products, setProducts] = useState([]);
    const [designInputs, setDesignInputs] = useState([]);
    const [colorInputs, setColorInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [browsePopupVisible, setBrowsePopupVisible] = useState(false);
    const [addPopupVisible, setAddPopupVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedDesigns, setSelectedDesigns] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/getproducts');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchDesignSettings = async () => {
            try {
                const response = await fetch('/api/getDesignGroup');
                const data = await response.json();
                if (data.success) {
                    const existingInputs = data.designGroup.split(',').map((name, index) => ({
                        id: Date.now() + index,
                        name: name.trim(),
                    }));
                    setDesignInputs(existingInputs);
                }
            } catch (error) {
                console.error('Error fetching design settings:', error);
            }
        };

        const fetchColorSettings = async () => {
            try {
                const response = await fetch('/api/getColorGroup');
                const data = await response.json();
                if (data.success) {
                    const existingInputs = data.colorGroup.split(',').map((name, index) => ({
                        id: Date.now() + index,
                        name: name.trim(),
                    }));
                    setColorInputs(existingInputs);
                }
            } catch (error) {
                console.error('Error fetching color settings:', error);
            }
        };

        Promise.all([fetchProducts(), fetchDesignSettings(), fetchColorSettings()])
            .finally(() => setLoading(false));
    }, []);

    // Open browse popup when there's a search query
    useEffect(() => {
        if (searchQuery) {
            openBrowsePopup();
        } else {
            closeBrowsePopup();
        }
    }, [searchQuery]);

    const handleProductChange = (product) => {
        setSelectedProducts((prev) =>
            prev.includes(product) ? prev.filter(item => item !== product) : [...prev, product]
        );
    };

    const openAddModal = (product) => {
        setCurrentProduct(product);
        setSelectedDesigns([]);
        setSelectedColors([]);
        setAddPopupVisible(true);
    };

    const handleDesignChange = (value) => {
        setSelectedDesigns((prev) =>
            prev.includes(value) ? prev.filter(design => design !== value) : [...prev, value]
        );
    };

    const handleColorChange = (value) => {
        setSelectedColors((prev) =>
            prev.includes(value) ? prev.filter(color => color !== value) : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        const data = {
            product: currentProduct,
            designs: selectedDesigns.join(', '),
            colors: selectedColors.join(', '),
        };

        try {
            const response = await fetch('/api/saveProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (result.success) {
                closeAddPopup();
            } else {
                console.error('Error saving product.');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const closeAddPopup = () => {
        setAddPopupVisible(false);
    };

    const closeBrowsePopup = () => {
        setBrowsePopupVisible(false);
    };

    const openBrowsePopup = () => {
        setBrowsePopupVisible(true);
    };

    const proAddDatabase = async () => {

    }

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <Layout><h2>Loading...</h2></Layout>;
    }

    return (
        <Layout>
            <h2 style={{ textAlign: 'center', margin: '20px 0', color: '#333' }}>Choose Products</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                    value={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                    placeholder="Search for products..."
                    style={{ marginRight: '10px' }} // Optional margin for spacing
                />
                <Button onClick={openBrowsePopup} primary>Browse Products</Button>
            </div>

            <Modal
                open={browsePopupVisible}
                onClose={closeBrowsePopup}
                title="Browse Products"
            >
                <Modal.Section>
                    <TextField
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        placeholder="Search for products..."
                    />
                    {filteredProducts.map(product => (
                        <div key={product.id} style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label={`${product.title} - $${product.variants[0].price}`}
                                checked={selectedProducts.includes(product.handle)}
                                onChange={() => handleProductChange(product.handle)}
                            />
                        </div>
                    ))}
                    <Button
                        onClick={proAddDatabase}
                    >
                        Add
                    </Button>
                </Modal.Section>
            </Modal>

            <Modal
                open={addPopupVisible}
                onClose={closeAddPopup}
                title={`Add Details for ${currentProduct}`}
                primaryAction={{
                    content: 'Save',
                    onAction: handleSubmit,
                }}
            >
                <Modal.Section>
                    <FormLayout>
                        <div style={{ marginTop: '20px' }}>
                            <h3>Design Options</h3>
                            {designInputs.map(design => (
                                <Checkbox
                                    key={design.id}
                                    label={design.name}
                                    checked={selectedDesigns.includes(design.name)}
                                    onChange={() => handleDesignChange(design.name)}
                                />
                            ))}
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <h3>Color Options</h3>
                            {colorInputs.map(color => (
                                <Checkbox
                                    key={color.id}
                                    label={color.name}
                                    checked={selectedColors.includes(color.name)}
                                    onChange={() => handleColorChange(color.name)}
                                />
                            ))}
                        </div>
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </Layout>
    );
};

export default ProductListing;
