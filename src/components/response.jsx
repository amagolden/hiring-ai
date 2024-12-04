import React, { useState } from 'react';
import jsPDF from 'jspdf';

const Response = ({ response, loading  }) => {  

  // Function to download the response as PDF
  const downloadPDF = () => {
    if (!response || Object.keys(response).length === 0) {
      alert("No hiring plan available to download!");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10; // Margin for left and right
    const maxWidth = pageWidth - margin * 2; // Max width for text
    let y = 10; // Starting vertical offset
  
    // Title
    doc.setFontSize(16);
    doc.text("Role Description", margin, y);
    y += 10; // Add space after title
  
    // Add each section to the PDF
    for (const [section, content] of Object.entries(response)) {
      doc.setFontSize(14);
      doc.setTextColor(100, 149, 237); // Indigo color for section headers
      doc.text(section.replace(/_/g, " "), margin, y);
      y += 10;
  
      doc.setFontSize(12);
      doc.setTextColor(0); // Black for content
  
      if (Array.isArray(content)) {
        content.forEach((item) => {
          const lines = doc.splitTextToSize(`- ${item}`, maxWidth); // Split text to fit
          lines.forEach((line) => {
            doc.text(line, margin + 5, y); // Add slight indent for list items
            y += 7; // Line spacing
          });
        });
      } else if (typeof content === "string") {
        const lines = doc.splitTextToSize(content, maxWidth); // Split text to fit
        lines.forEach((line) => {
          doc.text(line, margin, y);
          y += 7; // Line spacing
        });
      }
  
      y += 5; // Add some space between sections
  
      // Check if the content will go off the page
      if (y > doc.internal.pageSize.height - margin) {
        doc.addPage(); // Add a new page
        y = margin; // Reset vertical offset
      }
    }
  
    // Save the PDF
    doc.save("role_description.pdf");
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
        onClick={downloadPDF}
        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Response;
