import React, { useState } from 'react';

const InputForm = () => {
  // State to hold input data
  const [name, setName] = useState('');
  
  // Handle input changes
  const handleNameChange = (e) => setName(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    // Prepare the data to be sent to the backend
    const data = {name};

    try {
      // Send data to the backend
      const response = await fetch('https://your-backend-api.com/submit', {
        method: 'POST', // POST method for sending data
        headers: {
          'Content-Type': 'application/json', // Send data as JSON
        },
        body: JSON.stringify(data), // Convert JavaScript object to JSON string
      });

      // Handle response
      if (response.ok) {
        console.log('Data successfully sent to the backend!');
        // You can reset the input fields if needed
        setName('');
        setEmail('');
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Submit Data</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </label>
        <br />

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputForm;