import React, { useState } from "react";
import Response from "./response";


export default function HiringForm() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [roleDescription, setRoleDescription] = useState('');

    const fetchOpenAiResponse = async () => {

        const customPrompt = `
          Based on the description of the role: "${roleDescription}", please provide the following outputs as a single JSON object. 
          
          The response should be structured like a standard job description including job responsiblities and qualifications. Use this format:
          {
            "summary": "string", // Brief overview of the role
            "responsibilities": ["string"], // List of key responsibilities
            "qualifications": ["string"], // List of required qualifications
            "preferred_qualifications": ["string"], // List of preferred qualifications (optional)
            "benefits": ["string"], // List of benefits offered
            "salary_range": "string" // Optional
          }`;
          

        setLoading(true);

        try {
        const result = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "user", content: customPrompt }
            ],
            max_tokens: 1000,
            }),
        });

        const data = await result.json();

        // Log the response for debugging
        console.log("API response:", data);

        if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error("Unexpected API response format.", data);
          setResponse("Invalid response from API.");
          return;
        }

        const rawContent = data.choices[0].message.content;
        console.log("Raw content:", rawContent);
       
        // Try to parse the content as JSON
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(rawContent);
        } catch (parseError) {
          console.warn("Failed to parse JSON response. Falling back to raw content.");
          parsedResponse = rawContent;
        }        

        console.log("Final Parsed Response:", parsedResponse);
        setResponse(parsedResponse);

        } catch (error) {
          console.error("Error in fetchOpenAiResponse:", error);
          setResponse("Error communicating with OpenAI API.");
        } finally {
          setLoading(false);
        }
    };
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="border-b border-gray-900/10 pb-6">
          <h2 className="text-center text-xl font-semibold text-gray-900">
            Welcome to our Hiring Co-Pilot
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            We create custom job descriptions, interview questions, and onboarding documents for your team based on your needs. We save you time so you can focus on getting things done.
          </p>
        </div>
  
        {/* Form and Output Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Form Column */}
          <form 
            onSubmit={(e) => {
                e.preventDefault();
                fetchOpenAiResponse();
              }}   
            className="space-y-6">

            {/* Role Description Section */}
            <div className="border-b border-gray-900/10 pb-6">
              <h3 className="text-lg font-semibold text-gray-900">Role Description</h3>
              <textarea
                name="teamDescription"
                placeholder="Describe the role you're hiring for, and any other relevant details."
                rows="4"
                className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                onChange={(e) => setRoleDescription(e.target.value)}
              ></textarea>
            </div>
  
            <button
                type="submit"
                className="mt-4 w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
                disabled={loading}
                >
                {loading ? "Loading..." : "Get Plan"}
                </button>
            </form>

            {/* Display Role Description */}
            <Response response={response} loading={loading} />
            {console.log(response)}
        </div>            
      </div>
    );
  }
  