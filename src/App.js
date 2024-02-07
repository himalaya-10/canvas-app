import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

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
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const canvasRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!isDrawingEnabled || !canvasRef.current) {
      return; // Exit if drawing isn't enabled or canvas is not available
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const startDrawing = (e) => {
      drawing = true;
      context.beginPath();
      context.moveTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
    };

    const draw = (e) => {
      if (!drawing) return;
      context.lineTo(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop
      );
      context.stroke();
    };

    const stopDrawing = () => {
      drawing = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isDrawingEnabled]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      const newState = { ...prevState };
      const keys = name.split('.');
      let current = newState;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (type === 'checkbox') {
            current[key] = checked;
          } else {
            current[key] = value;
          }
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      });

      return newState;
    });
  };

  const handleAddField = (fieldPath) => {
    setFormData((prevState) => {
      const newState = { ...prevState };
      const keys = fieldPath.split('.');
      let current = newState;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          if (!current[key]) current[key] = [];
          current[key].push('');
        } else {
          if (!current[key]) current[key] = {};
          current = current[key];
        }
      });

      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/form', formData);
      alert('Form submitted successfully!');
    } catch (error) {
      alert('Error in form submission. Check console for more details.');
      console.error('Error while submitting form:', error);
    }
  };


  const saveFormAsPDF = () => {
    html2canvas(formRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      const pdfOutput = pdf.output('blob');
      const fileName = 'form.pdf'; // Example file name
      const fileLocation = `/path/to/save/${fileName}`; // Adjust based on your save mechanism
  
      // Example: save PDF blob to server or cloud storage here and get the actual file location
  
      // After saving the file, send its location to the MongoDB through the Express API
      axios.post('http://localhost:5000/saveFile', { filePath: fileLocation })
        .then(response => console.log(response.data))
        .catch(error => console.error('Error saving file location:', error));
    });
  };

  return (
    <div className='App' ref={formRef}>
      <button onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}>
        {isDrawingEnabled ? 'Disable Drawing Mode' : 'Enable Drawing Mode'}
      </button>
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
          <div className="sex-selection">
    <label htmlFor="bio.sex">Sex:</label>
    <select name="bio.sex" value={formData.bio.sex} onChange={handleChange} required>
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>
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

        <div className="summary-story-wrapper">

        {/* Past Summary Section */}
        <div className="section-container past-summary-section">
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

          {/* Story Section */}
          <div className="section-container story-section">
        <div className="story-tab">Story</div>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleChange}
            placeholder="Everything in the patient's own words without any interruption"
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

        <div className="all-sections-container">

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

</div>
<div className="diagnosis-prescription-container">

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
      </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
      <button onClick={saveFormAsPDF}>Save as PDF</button>
      {isDrawingEnabled && (
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000, border: '1px solid black' }}
        ></canvas>
      )}
    </div>
  );
}

export default App;

