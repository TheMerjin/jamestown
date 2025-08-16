import React, { useState, useEffect } from 'react';

const InputForm = ({ time }) => {
  // State to hold input data
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleNameChange = (e) => setName(e.target.value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const score = 100;
    // Prepare the data to be sent to the backend
    const data = { name, time, score };

    try {
      // Send data to the backend
      const response = await fetch(`https://jamestownapush.vercel.app/api/post_leaderboard`, {
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
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setSubmitted(true);
  };
  if (submitted) {
    return (
      <div>
        <h1>Submission Successful!</h1>
        <p>Thank you for your submission, {name}!</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1>Submit to Leaderboard</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
          <p>time : {time} </p>
        </label>
        <br />

        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputForm;