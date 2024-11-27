import React, { useState } from "react";
import Response from "./response";


export default function HiringForm() {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [roleDescription, setRoleDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [skillsRequired, setSkillsRequired] = useState('');
    const [workType, setWorkType] = useState('');
    const [location, setLocation] = useState('');

    const fetchOpenAiResponse = async () => {

        const customPrompt = `
          Based on the following details, please provide the outputs as a single JSON object in the specified format:

          Role Description: "${roleDescription}"
          Salary Range: "${salary}"
          Skills Required: "${skillsRequired}"
          Work Type: "${workType}"
          Work Location: "${location}"

          The response should be structured like a standard job description including job responsibilities and qualifications. Use this format:
          {
            "Summary": "string", // Brief overview of the role
            "Responsibilities": ["string"], // List of key responsibilities
            "Qualifications": ["string"], // List of required qualifications
            "Benefits": ["string"], // List of benefits offered
            "Salary Range": "string" // Optional
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
          <form
              onSubmit={(e) => {
                  e.preventDefault();
                  fetchOpenAiResponse();
              }}
              className="space-y-6"
          >
              <div className="border-b border-gray-900/10 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Role Description</h3>
                  <textarea
                      name="roleDescription"
                      placeholder="Describe the role you're hiring for, and any other relevant details."
                      rows="4"
                      className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                      onChange={(e) => setRoleDescription(e.target.value)}
                  ></textarea>
              </div>

              <div className="border-b border-gray-900/10 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Required Skills</h3>
                  <input
                      type="text"
                      name="skillsRequired"
                      placeholder="e.g., JavaScript, React, leadership"
                      className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                      onChange={(e) => setSkillsRequired(e.target.value)}
                  />
              </div>

              <div className="border-b border-gray-900/10 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Salary Range</h3>
                  <input
                      type="text"
                      name="salaryRange"
                      placeholder="e.g., $60,000-$80,000"
                      className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                      onChange={(e) => setSalary(e.target.value)}
                  />
              </div>

              <div className="border-b border-gray-900/10 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Work Type</h3>
                  <select
                      name="workType"
                      className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                      onChange={(e) => setWorkType(e.target.value)}
                  >
                      <option value="">Select work type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                  </select>
              </div>

              <div className="border-b border-gray-900/10 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Work Location</h3>
                  <select
                      name="workLocation"
                      className="mt-2 w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-600"
                      onChange={(e) => setLocation(e.target.value)}
                  >
                      <option value="">Select work location</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                  </select>
              </div>
  
            <button
                type="submit"
                className="mt-4 w-full bg-indigo-600 text-white rounded-md px-3 py-2 hover:bg-indigo-500"
                disabled={loading}
                >
                {loading ? "Loading..." : "Get Role"}
                </button>
            </form>

            {/* Display Role Description */}
            <Response response={response} loading={loading} />
            {console.log(response)}
        </div>            
      </div>
    );
  }
  