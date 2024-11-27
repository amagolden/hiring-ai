import React, { useState } from 'react';

const Response = ({ response, loading  }) => {  

  //function to download the response as CSV
  const downloadCSV = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No hiring plan available to download!");
      return;
    }
  
    const csvRows = [];
  
    csvRows.push("Section,Details"); // Header row

    // Process each key in the response object
    for (const [section, content] of Object.entries(response)) {
      if (Array.isArray(content)) {
        // If the value is an array (e.g., responsibilities, qualifications)
        content.forEach((item) => {
          csvRows.push(`${section},"${item}"`);
        });
      } else {
        // Handle direct string values (e.g., summary, salary_range)
        csvRows.push(`${section},"${content}"`);
      }
    }
  
    // Combine rows into CSV content
    const csvContent = csvRows.join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "role_description.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render individual sections based on their structure
  const renderSection = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5">
          {value.map((item, index) => (
            <li key={index} className="text-sm text-gray-800">
              {item}
            </li>
          ))}
        </ul>
      );
    } else if (typeof value === "string") {
      return <p className="text-sm text-gray-800">{value}</p>;
    }
    return null;
  };

  return (
    <div className="border-b border-gray-900/10 pb-6">
      <h3 className="text-lg font-semibold text-gray-900">Role Description</h3>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {response && typeof response === "object" ? (
            Object.entries(response).map(([key, value]) => (
              <div key={key} className="bg-gray-100 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-indigo-600">
                  {key.replace(/_/g, " ")} {/* Format key names */}
                </h3>
                {renderSection(key, value)}
              </div>
            ))
          ) : (
            <p>No response available. Please generate a role.</p>
          )}
          </div>
      )}
      <button
        onClick={downloadCSV}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Download as CSV
      </button>
    </div>
  );
};

export default Response;
