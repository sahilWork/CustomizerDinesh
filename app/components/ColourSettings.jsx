import React, { useEffect, useState } from 'react';
import { Button, TextField, Modal, FormLayout, Card } from '@shopify/polaris';

const ColourSettings = () => {
  const [inputs, setInputs] = useState([{ id: Date.now(), name: '' }]);
  const [group, setGroup] = useState('');
  const [popupVisible, setPopupVisible] = useState(false); // Popup state

  useEffect(() => {
    const fetchColorSettings = async () => {
      try {
        const response = await fetch('/api/getColorGroup');
        const data = await response.json();
        if (data.success) {
          const existingInputs = data.colorGroup.split(',').map((name, index) => ({
            id: Date.now() + index,
            name: name.trim(),
          }));
          setInputs(existingInputs);
          setGroup(data.colorGroup);
        }
      } catch (error) {
        console.error('Error fetching color settings:', error);
      }
    };

    fetchColorSettings();
  }, []);

  const handleAddInput = () => {
    setInputs([...inputs, { id: Date.now(), name: '' }]);
  };

  const handleInputChange = (id, value) => {
    setInputs(inputs.map(input =>
      input.id === id ? { ...input, name: value } : input
    ));
    setGroup(inputs.map(input => input.name).join(','));
  };

  const handleRemoveInput = (id) => {
    setInputs(inputs.filter(input => input.id !== id));
    setGroup(inputs.filter(input => input.id !== id).map(input => input.name).join(','));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const params = `shop=customizer-product-public-app.myshopify.com&colorGroup=${group}`;
      const response = await fetch('/api/saveColorGroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const result = await response.json();
      if (result.success) {
        setPopupVisible(true); // Show popup on success
      } else {
        console.error('Error saving color settings.');
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div>
      <Card title="Colour Groups" sectioned>
        <form onSubmit={handleSubmit}>
          <FormLayout>
            {inputs.map(input => (
              <div key={input.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <TextField
                  value={input.name}
                  onChange={(value) => handleInputChange(input.id, value)}
                  placeholder="Enter name"
                />
                <Button onClick={() => handleRemoveInput(input.id)} monochrome>Remove</Button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <Button primary submit>Save Settings</Button>
              <Button onClick={handleAddInput}>Add More</Button>
            </div>
          </FormLayout>
        </form>
      </Card>

      <Modal
        open={popupVisible}
        onClose={closePopup}
        title="Success"
        primaryAction={{
          content: 'OK',
          onAction: closePopup,
        }}
      >
        <Modal.Section>
          <p>Colour settings saved successfully!</p>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default ColourSettings;
