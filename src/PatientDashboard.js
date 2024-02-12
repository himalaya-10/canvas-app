import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
const response = await axios.get(`http://localhost:5000/api/form/$`);


function PatientDashboard() {
  const [patientData, setPatientData] = useState(null);
  const qrRef = useRef(null);

  useEffect(() => {
    const html5QrCode = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      /* verbose= */ false
    );
    
    const onScanSuccess = async (decodedText, decodedResult) => {
      // Handle on success condition with the decoded text or result.
      console.log(`Code matched = ${decodedText}`, decodedResult);
      try {
        const response = await axios.get(`http://localhost:5000/api/form/${decodedText}`);
        setPatientData(response.data);
        html5QrCode.stop();
      } catch (error) {
        console.error('Error fetching patient data:', error);
        alert('Error fetching patient data.');
      }
    };
    
    const onScanFailure = (error) => {
      // Handle on scan failure condition.
      console.warn(`Code scan error = ${error}`);
    };

    html5QrCode.start({ facingMode: "environment" }, onScanSuccess, onScanFailure);
    
    return () => {
      html5QrCode.stop().then(ignore => {
        // QR Code scanning is stopped.
      }).catch(err => {
        // Stop failed, handle it.
      });
    };
  }, []);

  return (
    <div>
      <div id="qr-reader" ref={qrRef} style={{ width: '100%' }}></div>
      {patientData && (
        <div>
          {/* Display patient data here */}
          <p>Name: {patientData.bio.name}</p>
          <p>Age: {patientData.bio.age}</p>
          {/* ... display other patient data ... */}
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
