import React, { useState, useEffect } from 'react';
import { Card, Button, Checkbox, Modal, FormLayout, TextField, DataTable } from '@shopify/polaris';
import Layout from '../components/Layout';
import { authenticate } from '../shopify.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);
    return { session };
};

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
    const [designPopupVisible, setDesignPopupVisible] = useState(false);
    const [colorPopupVisible, setColorPopupVisible] = useState(false);
    const [successPopupVisible, setSuccessPopupVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedDesigns, setSelectedDesigns] = useState({});
    const [selectedColors, setSelectedColors] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [addedProducts, setAddedProducts] = useState([]);
    const [deletePopupVisible, setDeletePopupVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/getproshopify');
                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchPrismaProducts = async () => {
            try {
                const response = await fetch('/api/getprismaproducts');
                const data = await response.json();
                setAddedProducts(data.products);
                const initialDesigns = {};
                const initialColors = {};
                const initialSelectedProducts = [];

                data.products.forEach(pro => {
                    initialDesigns[pro.id] = pro.designs ? pro.designs.split(',') : [];
                    initialColors[pro.id] = pro.colors ? pro.colors.split(',') : [];
                    initialSelectedProducts.push(pro.title);
                });

                setSelectedDesigns(initialDesigns);
                setSelectedColors(initialColors);
                setSelectedProducts(initialSelectedProducts);
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

        Promise.all([
            fetchProducts(),
            fetchDesignSettings(),
            fetchPrismaProducts(),
            fetchColorSettings(),
        ]).finally(() => setLoading(false));
    }, []);

    const handleProductChange = (product) => {
        setSelectedProducts((prev) =>
            prev.includes(product) ? prev.filter(item => item !== product) : [...prev, product]
        );
    };

    const openAddModal = (product) => {
        setCurrentProduct(product);
        setAddPopupVisible(true);
    };

    const handleDesignChange = (design, productId) => {
        setSelectedDesigns((prev) => {
            const currentDesigns = prev[productId] || [];
            const updatedDesigns = currentDesigns.includes(design)
                ? currentDesigns.filter(d => d !== design)
                : [...currentDesigns, design];

            return { ...prev, [productId]: updatedDesigns };
        });
    };

    const handleColorChange = (color, productId) => {
        setSelectedColors((prev) => ({
            ...prev,
            [productId]: prev[productId]
                ? prev[productId].includes(color)
                    ? prev[productId].filter(c => c !== color)
                    : [...prev[productId], color]
                : [color]
        }));
    };

    const proAddDatabase = async () => {
        let proList = selectedProducts.join(',');
        try {
            const params = `shop=${shop}&products=${proList}`;
            const response = await fetch('/api/saveProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });

            const result = await response.json();
            if (result.success) {

                setBrowsePopupVisible(false);
                setSuccessPopupVisible(true); // Show popup on success
            } else {
                console.error('Error saving product settings.');
                setBrowsePopupVisible(false);
            }
        } catch (err) {
            console.error('Submission error:', err);
        }
    };

    const saveProductColors = async (product) => {
        const colorsToSave = selectedColors[product] || [];
        if (colorsToSave.length > 0) {
            try {
                const params = `shop=${currentProduct}&colors=${colorsToSave.join(',')}`;
                const response = await fetch('/api/updateProColor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params,
                });

                const result = await response.json();
                if (result.success) {
                    closeColorPopup();
                } else {
                    console.error('Error saving color settings.');
                }
            } catch (err) {
                console.error('Submission error:', err);
            }
        }
    };

    const saveProductDesign = async (product) => {
        const designToSave = selectedDesigns[product] || [];
        if (designToSave.length > 0) {
            try {
                const params = `shop=${currentProduct}&designs=${designToSave.join(',')}`;
                const response = await fetch('/api/updateProDesign', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params,
                });

                const result = await response.json();
                if (result.success) {
                    closeDesignPopup();
                } else {
                    console.error('Error saving design settings.');
                }
            } catch (err) {
                console.error('Submission error:', err);
            }
        }
    };

    const openDeletePopup = async (productId) => {

        try {
            const params = `shop=${productId}`;
            const response = await fetch('/api/proDeleteprisma', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params,
            });

            const result = await response.json();
            if (result.success) {
                setAddedProducts((prev) => prev.filter(item => item.id !== productId));
                setDeletePopupVisible(true);
            } else {
                console.error('Error deleting product.');
            }
        } catch (error) {
            console.error('Error:', error);
        }


    };



    const closeAddPopup = () => {
        setAddPopupVisible(false);
    };

    const closeDesignPopup = () => {
        setDesignPopupVisible(false);
    };

    const closeColorPopup = () => {
        setColorPopupVisible(false);
    };

    const closeSuccessPopup = () => {
        setSuccessPopupVisible(false);
    };

    const openDesignPopup = () => {
        setDesignPopupVisible(true);
    };

    const openColorPopup = () => {
        setColorPopupVisible(true);
    };

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
                    style={{ marginRight: '10px' }}
                />
                <Button onClick={() => setBrowsePopupVisible(true)} primary>Browse Products</Button>
            </div>

            <Modal
                open={browsePopupVisible}
                onClose={() => setBrowsePopupVisible(false)}
                title="Browse Products"
            >
                <Modal.Section>
                    {products.filter(product => product.title.toLowerCase().includes(searchQuery.toLowerCase())).map(product => (
                        <div key={product.id} style={{ marginBottom: '10px' }}>
                            <Checkbox
                                label={`${product.title} - $${product.variants[0].price}`}
                                checked={selectedProducts.includes(product.handle)}
                                onChange={() => handleProductChange(product.handle)}
                            />
                        </div>
                    ))}
                    <Button onClick={proAddDatabase}>Add</Button>
                </Modal.Section>
            </Modal>

            {/* Design Options Popup */}
            <Modal
                open={designPopupVisible}
                onClose={closeDesignPopup}
                title="Select Design Options"
            >
                <Modal.Section>
                    <FormLayout>
                        {designInputs.map(design => (
                            <Checkbox
                                key={design.id}
                                label={design.name}
                                checked={selectedDesigns[currentProduct]?.includes(design.name) || false}
                                onChange={() => handleDesignChange(design.name, currentProduct)}
                            />
                        ))}
                    </FormLayout>

                    <Button onClick={() => saveProductDesign(currentProduct)}>Save</Button>
                </Modal.Section>
            </Modal>

            {/* Color Options Popup */}
            <Modal
                open={colorPopupVisible}
                onClose={closeColorPopup}
                title="Select Color Options"
            >
                <Modal.Section>
                    <FormLayout>
                        {colorInputs.map(color => (
                            <Checkbox
                                key={color.id}
                                label={color.name}
                                checked={selectedColors[currentProduct]?.includes(color.name) || false}
                                onChange={() => handleColorChange(color.name, currentProduct)}
                            />
                        ))}
                    </FormLayout>

                    <Button onClick={() => saveProductColors(currentProduct)}>Save</Button>
                </Modal.Section>
            </Modal>

            {/* Success Popup */}
            <Modal
                open={successPopupVisible}
                onClose={closeSuccessPopup}
                title="Success"
            >
                <Modal.Section>
                    <p>Product added successfully!</p>
                    <Button onClick={closeSuccessPopup}>Close</Button>
                </Modal.Section>
            </Modal>
            {/* Delete Confirmation Popup */}
            <Modal
                open={deletePopupVisible}
                onClose={() => setDeletePopupVisible(false)}
                title="Confirm Deletion"
            >
                <Modal.Section>
                    <p>Your Data Deleted successfully!</p>
                    <Button onClick={() => setDeletePopupVisible(false)}>Close</Button>

                </Modal.Section>
            </Modal>
            {/* Products Table */}
            <Card title="Added Products" sectioned>
                <DataTable
                    columnContentTypes={['text', 'text', 'text']}
                    headings={['Product', 'Design Group', 'Color Group', 'Action']}
                    rows={addedProducts.map(item => [
                        item.title,
                        <Button onClick={() => { setCurrentProduct(item.id); openDesignPopup(); }}>{item.designs ? 'Edit Design' : 'Add Design'}</Button>,
                        <Button onClick={() => { setCurrentProduct(item.id); openColorPopup(); }}>{item.colors ? 'Edit Colors' : 'Add Color'}</Button>,
                        <Button onClick={() => openDeletePopup(item.id)}>Delete</Button>
                    ])}
                />
            </Card>
        </Layout>
    );
};

export default ProductListing;
