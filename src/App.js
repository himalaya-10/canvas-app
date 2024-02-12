import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import PatientDashboard from './PatientDashboard'; // Adjust the path if necessary



function App() {
  const [formData, setFormData] = useState({
    bio: { name: '', age: '', sex: 'Other', id: '', paid: false },
    pastSummary: '',
    story: '',
    history: { recent: '', chronic: '', acuteAndRecent: '', surgeries: '' },
    signsAndSymptoms: { symptoms: [''], signs: [''] },
    tests: [{ testName: '', result: '' }],
    reports: [{ reportName: '', date: '', findings: '' }],
    diagnosis: [{ condition: '', date: '' }],
    prescription: [{ medication: '', dosage: '', duration: '' }],
    referralChain: ['']
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    setFormData(prevState => {
      const newState = JSON.parse(JSON.stringify(prevState)); // Deep copy of state
      const nameParts = name.split('.');
  
      let currentLevel = newState;
      for (let i = 0; i < nameParts.length; i++) {
        const part = nameParts[i];
        if (part.includes('[')) {
          // Handle array fields
          const [arrayName, arrayIndex] = part.match(/(\w+)\[(\d+)\]/).slice(1);
          if (i === nameParts.length - 1) {
            currentLevel[arrayName][parseInt(arrayIndex)] = type === 'checkbox' ? checked : value;
          } else {
            if (!currentLevel[arrayName]) {
              currentLevel[arrayName] = [];
            }
            currentLevel = currentLevel[arrayName][parseInt(arrayIndex)];
          }
        } else {
          // Handle non-array fields
          if (i === nameParts.length - 1) {
            currentLevel[part] = type === 'checkbox' ? checked : value;
          } else {
            if (!currentLevel[part]) {
              currentLevel[part] = {};
            }
            currentLevel = currentLevel[part];
          }
        }
      }
  
      return newState;
    });
  };

  const handleAddField = (fieldPath) => {
    setFormData(prevState => {
      // Clone the current state to avoid direct mutation
      const newState = JSON.parse(JSON.stringify(prevState));
  
      switch (fieldPath) {
        case 'signsAndSymptoms.symptoms':
          newState.signsAndSymptoms.symptoms.push('');
          break;
        case 'signsAndSymptoms.signs':
          newState.signsAndSymptoms.signs.push('');
          break;
        case 'tests':
          newState.tests.push({ testName: '', result: '' });
          break;
        case 'reports':
          newState.reports.push({ reportName: '', date: '', findings: '' });
          break;
        case 'diagnosis':
          newState.diagnosis.push({ condition: '', date: '' });
          break;
        case 'prescription':
          newState.prescription.push({ medication: '', dosage: '', duration: '' });
          break;
        case 'referralChain':
          newState.referralChain.push('');
          break;
        default:
          break;
      }
  
      return newState;
    });
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/form', formData);
      console.log('Response:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error while submitting form:', error.response ? error.response.data : error);
      alert('Error in form submission. Check console for more details.');
    }
  };
  return (
    <div>
      <h1>Medical Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Bio Section */}
        <div className="bio-section">
        <div className="bio-tab">Bio</div>
  <div className="bio-content">
          <input 
            type="text" 
            name="bio.name" 
            value={formData.bio.name} 
            onChange={handleChange} 
            placeholder="Name" 
            required 
          />
          <input 
            type="number" 
            name="bio.age" 
            value={formData.bio.age} 
            onChange={handleChange} 
            placeholder="Age" 
            required 
          />
          {/* Sex Radio Buttons */}
          <div>
            Sex:
            <label>
              <input 
                type="radio" 
                name="bio.sex" 
                value="Male" 
                checked={formData.bio.sex === 'Male'} 
                onChange={handleChange} 
              />
              Male
            </label>
            <label>
              <input 
                type="radio" 
                name="bio.sex" 
                value="Female" 
                checked={formData.bio.sex === 'Female'} 
                onChange={handleChange} 
              />
              Female
            </label>
            <label>
              <input 
                type="radio" 
                name="bio.sex" 
                value="Other" 
                checked={formData.bio.sex === 'Other'} 
                onChange={handleChange} 
              />
              Other
            </label>
          </div>
          <input 
            type="text" 
            name="bio.id" 
            value={formData.bio.id} 
            onChange={handleChange} 
            placeholder="ID" 
            required 
          />
          <label>
            Paid
            <input 
              type="checkbox" 
              name="bio.paid" 
              checked={formData.bio.paid} 
              onChange={handleChange} 
            />
          </label>
        </div>
        </div>

        {/* Past Summary Section */}
        <div className="past-summary-section">
        <div className="past-summary-tab">Past Summary</div>
        <div className="past-summary-content">
          <textarea
            name="pastSummary"
            value={formData.pastSummary}
            onChange={handleChange}
            placeholder="Summary paragraph. GPT generated or handwritten"
            required 
          />
        </div>
        </div>

        {/* History Section */}
        <div className="history-section">
        <div className="history-tab">History</div>
  <div className="history-content">
          <label>
            Recent History
            <textarea
              name="history.recent"
              value={formData.history.recent}
              onChange={handleChange}
              placeholder="Recent history"
            />
          </label>
          <label>
            Chronic History
            <textarea
              name="history.chronic"
              value={formData.history.chronic}
              onChange={handleChange}
              placeholder="Chronic history"
            />
          </label>
          <label>
            Acute and Recent History
            <textarea
              name="history.acuteAndRecent"
              value={formData.history.acuteAndRecent}
              onChange={handleChange}
              placeholder="Acute and recent history"
            />
          </label>
          <label>
            Surgeries
            <textarea
              name="history.surgeries"
              value={formData.history.surgeries}
              onChange={handleChange}
              placeholder="Surgeries"
            />
          </label>
        </div>
        </div>

        {/* Story Section */}
        <div className="story-section">
        <div className="story-tab">Story</div>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleChange}
            placeholder="Everything in the patient's own words without any interruption"
            required 
          />
        </div>

        <div className="signs-symptoms-section">
  <div className="symptoms-section">
    <div className="symptoms-tab">Symptoms</div>
    {formData.signsAndSymptoms.symptoms.map((symptom, index) => (
      <input 
        key={`symptom-${index}`}
        type="text"
        className="symptoms-input"
        name={`signsAndSymptoms.symptoms[${index}]`}
        value={symptom}
        onChange={handleChange}
        placeholder={`Symptom #${index + 1}`}
      />
    ))}
    <button type="button" className="add-button" onClick={() => handleAddField('signsAndSymptoms.symptoms')}>+</button>
  </div>

  <div className="signs-section">
    <div className="signs-tab">Signs</div>
    {formData.signsAndSymptoms.signs.map((sign, index) => (
      <input 
        key={`sign-${index}`}
        type="text"
        className="signs-input"
        name={`signsAndSymptoms.signs[${index}]`}
        value={sign}
        onChange={handleChange}
        placeholder={`Sign #${index + 1}`}
      />
    ))}
    <button type="button" className="add-button" onClick={() => handleAddField('signsAndSymptoms.signs')}>+</button>
  </div>
</div>


 {/* Tests and Reports Section */}
<div className="tests-reports-section">

{/* Tests */}
<div className="tests-container">
  <div className="tests-tab">Tests</div>
  {formData.tests.map((test, index) => (
    <div key={`test-${index}`} className="test-entry">
      <input 
        type="text"
        name={`tests[${index}].testName`}
        value={test.testName}
        onChange={handleChange}
        placeholder="Test Name"
      />
      <input 
        type="text"
        name={`tests[${index}].result`}
        value={test.result}
        onChange={handleChange}
        placeholder="Result"
      />
    </div>
  ))}
  <button type="button" onClick={() => handleAddField('tests')}>Add Test</button>
</div>

{/* Reports */}
<div className="reports-container">
  <div className="reports-tab">Reports</div>
  {formData.reports.map((report, index) => (
    <div key={`report-${index}`} className="report-entry">
      <input 
        type="text"
        name={`reports[${index}].reportName`}
        value={report.reportName}
        onChange={handleChange}
        placeholder="Report Name"
      />
      <input 
        type="date"
        name={`reports[${index}].date`}
        value={report.date}
        onChange={handleChange}
      />
      <textarea
        name={`reports[${index}].findings`}
        value={report.findings}
        onChange={handleChange}
        placeholder="Findings"
      />
    </div>
  ))}
  <button type="button" onClick={() => handleAddField('reports')}>Add Report</button>
</div>

</div>
̥

         {/* Diagnosis Section */}
         <div className="diagnosis-section">
          <h3>Diagnosis</h3>
          {formData.diagnosis.map((diag, index) => (
            <div key={`diagnosis-${index}`}>
              <input
                type="text"
                name={`diagnosis[${index}].condition`}
                value={diag.condition}
                onChange={handleChange}
                placeholder="Condition"
              />
              <input
                type="date"
                name={`diagnosis[${index}].date`}
                value={diag.date}
                onChange={handleChange}
                placeholder="Date of Diagnosis"
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('diagnosis')}>Add Diagnosis</button>
        </div>

        {/* Prescription Section */}
        <div className="prescription-section">
          <h3>Prescription</h3>
          {formData.prescription.map((pres, index) => (
            <div key={`prescription-${index}`}>
              <input
                type="text"
                name={`prescription[${index}].medication`}
                value={pres.medication}
                onChange={handleChange}
                placeholder="Medication"
              />
              <input
                type="text"
                name={`prescription[${index}].dosage`}
                value={pres.dosage}
                onChange={handleChange}
                placeholder="Dosage"
              />
              <input
                type="text"
                name={`prescription[${index}].duration`}
                value={pres.duration}
                onChange={handleChange}
                placeholder="Duration"
              />
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('prescription')}>Add Prescription</button>
        </div>
         {/* Referral Chain Section */}
         <div className="referral-chain-section">
          <h3>Referral Chain</h3>
          {formData.referralChain.map((referral, index) => (
            <input
              key={`referral-${index}`}
              type="text"
              name={`referralChain[${index}]`}
              value={referral}
              onChange={handleChange}
              placeholder={`Referral #${index + 1}`}
            />
            ))}
        <button type="button" onClick={() => handleAddField('referralChain')}>Add Referral</button>
      </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
      <PatientDashboard />
    </div>
  );
}


export default App;
