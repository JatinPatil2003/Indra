import React, { useState, useEffect } from "react";
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Set your roll number as the document title
  useEffect(() => {
    document.title = "21BCE0456"; // Replace with your actual roll number
  }, []);

  const handleJsonSubmit = async (event) => {
    event.preventDefault();
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);
      console.log(parsedData)

      // Clear error message
      setError(null);

      // Call the REST API with the JSON input
      const response = await fetch("https://dry-harbor-41160-3a63e2d35cae.herokuapp.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const data = await response.json();
      console.log(data)
      setResponseData(data);

      // Display multi-select dropdown after valid submission
      setDropdownOptions([
        { value: "alphabets", label: "Alphabets" },
        { value: "numbers", label: "Numbers" },
        { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
      ]);
    } catch (err) {
      // Display error for invalid JSON
      setError("Invalid JSON format. Please enter valid JSON.");
      setResponseData(null);
      setDropdownOptions([]);
    }
  };

  const handleDropdownChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const renderFilteredResponse = () => {
    if (!responseData || selectedOptions.length === 0) return null;

    // Filter the response data based on selected dropdown options
    const filteredData = {};
    selectedOptions.forEach(option => {
      if (option.value === "alphabets") {
        filteredData.alphabets = responseData.alphabets;
      } else if (option.value === "numbers") {
        filteredData.numbers = responseData.numbers;
      } else if (option.value === "highest_lowercase_alphabet") {
        filteredData.highest_lowercase_alphabet = responseData.highest_lowercase_alphabet;
      }
    });

    return (
      <pre>{JSON.stringify(filteredData, null, 2)}</pre>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>JSON Validator and Processor</h1>
      <form onSubmit={handleJsonSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter valid JSON"
          rows="5"
          style={{ width: "100%" }}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {dropdownOptions.length > 0 && (
        <div>
          <h2>Select Options</h2>
          <Select
            isMulti
            options={dropdownOptions}
            onChange={handleDropdownChange}
          />
        </div>
      )}

      {renderFilteredResponse()}
    </div>
  );
}

export default App;
