import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';
import './App2.css';

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

  const [brushWidth, setBrushWidth] = useState(2);
  const [selectedTool, setSelectedTool] = useState("pointer");
  const [selectedColor, setSelectedColor] = useState("black");
  const [isdrawing, setIsDrawing] = useState(false);

  const [prevMouseX, setPrevMouseX] = useState(null);
  const [prevMouseY, setPrevMouseY] = useState(null);

  const [currentMouseX, setCurrentMouseX] = useState(null);
  const [currentMouseY, setCurrentMouseY] = useState(null);

  useEffect(() => {

    if (!isDrawingEnabled || !canvasRef.current) {
      return; // Exit if drawing isn't enabled or canvas is not available
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let drawing = false;

    let btnTools = document.querySelectorAll(".tool");
    let sizeSlider = document.getElementById("size-slider")
    let colorBtns = document.querySelectorAll(".colors");
    let clearCanvas = document.querySelector(".clear-canvas")
    let savepdf = document.querySelector(".capture")
    let savepdf2 = document.querySelector(".capture2")

    savepdf.addEventListener('click',()=>{
      // console.log('print')
      window.print()
    })
    savepdf2.addEventListener('click',()=>{
      // console.log('print')
      window.print()
    })



    // const resizeCanvas = () => {
    //   canvas.width = window.innerWidth;
    //   canvas.height = window.innerHeight;
    //   canvas.style.width = `${window.innerWidth}px`;
    //   canvas.style.height = `${window.innerHeight}px`;

    // };


    clearCanvas.addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      // setCanvasBackground();
    })
    clearCanvas.addEventListener('touch', () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      // setCanvasBackground();
    })
    // window.addEventListener('load', () => {
    //   if (canvasRef.current) {
    //     canvasRef.current.width = canvasRef.current.offsetWidth;
    //     canvasRef.current.height = canvasRef.current.offsetHeight;
    //   }
    // });

    const Drawing = (e) => {
      // console.log(isdrawing)
      if (isdrawing && context) {
        setCurrentMouseX(e.offsetX);
        setCurrentMouseY(e.offsetY);
        // context?.putImageData(snapshot, 0, 0);//**** */
        context.strokeStyle = selectedColor;
        context.fillStyle = selectedColor;

        // console.log(context.strokeStyle, context.fillStyle)
        if (selectedTool === 'brush' || selectedTool === 'eraser') {
          context.strokeStyle = selectedTool === 'eraser' ? "white" : selectedColor;
          if (prevMouseX && prevMouseY)
            context.moveTo(prevMouseX, prevMouseY);
          if (currentMouseX && currentMouseY)
            context.lineTo(currentMouseX, currentMouseY);
          context.stroke();
          setPrevMouseX(currentMouseX);
          setPrevMouseY(currentMouseY);

          // console.log(currentMouseX, prevMouseX)
        }
        else {

        }

      }
    }
    const startdraw = (e) => {
      // setPrevMouseX(e.offsetX);
      // setPrevMouseY(e.offsetY);
      // console.log(selectedTool)
      if (selectedTool === 'pointer') return;
      setIsDrawing(true);
      // console.log(isdrawing)
      if (context && canvasRef.current) {
        setPrevMouseX(e.offsetX);
        setPrevMouseY(e.offsetY);
        setCurrentMouseX(e.offsetX);
        setCurrentMouseY(e.offsetY);
        context.beginPath();
        context.lineWidth = brushWidth;

      }

    }

    canvasRef.current?.addEventListener('mousemove', Drawing)
    canvasRef.current?.addEventListener('mousedown', startdraw)
    canvasRef.current?.addEventListener('mouseup', () => { setIsDrawing(false) })


    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas);


    btnTools?.forEach((btn) => {
      btn.addEventListener('click', () => {
        // console.log(btn.id)
        document.querySelector(".active")?.classList.remove('active');
        btn.classList.add('active');
        setSelectedTool(btn.id);
        // console.log(selectedTool);
      })

    })

    colorBtns?.forEach((btn) => {
      btn.addEventListener('click', () => {
        // console.log("clicked")
        document.querySelector(".selected")?.classList.remove('selected');
        btn.classList.add('selected');
        setSelectedColor(btn.id);
      })

    })
    sizeSlider?.addEventListener('change', () => {
      setBrushWidth(sizeSlider?.value);
    })

    const Drawingtouch = (e) => {
      // console.log(isdrawing)
      if (isdrawing && context) {
        setCurrentMouseX(e.touches[0].clientX);
        setCurrentMouseY(e.touches[0].clientY);
        // context?.putImageData(snapshot, 0, 0);//**** */
        context.strokeStyle = selectedColor;
        context.fillStyle = selectedColor;

        // console.log(context.strokeStyle, context.fillStyle)
        if (selectedTool === 'brush' || selectedTool === 'eraser') {
          context.strokeStyle = selectedTool === 'eraser' ? "white" : selectedColor;
          if (prevMouseX && prevMouseY)
            context.moveTo(prevMouseX, prevMouseY);
          if (currentMouseX && currentMouseY)
            context.lineTo(currentMouseX, currentMouseY);
          context.stroke();
          setPrevMouseX(currentMouseX);
          setPrevMouseY(currentMouseY);

          // console.log(currentMouseX, prevMouseX)
        }
        else {

        }

      }
    }
    const startdrawtouch = (e) => {
      // setPrevMouseX(e.offsetX);
      // setPrevMouseY(e.offsetY);
      // console.log(selectedTool)
      if (selectedTool === 'pointer') return;
      setIsDrawing(true);
      // console.log(isdrawing)
      if (context && canvasRef.current) {
        setPrevMouseX(e.touches[0].clientX);
        setPrevMouseY(e.touches[0].clientY);
        setCurrentMouseX(e.touches[0].clientX);
        setCurrentMouseY(e.touches[0].clientY);
        context.beginPath();
        context.lineWidth = brushWidth;

      }

    }

    canvasRef.current?.addEventListener('touchmove', Drawingtouch)
    canvasRef.current?.addEventListener('touchstart', startdrawtouch)
    canvasRef.current?.addEventListener('touchend', () => { setIsDrawing(false) })


    // resizeCanvas();
    // window.addEventListener('resize', resizeCanvas);


    btnTools?.forEach((btn) => {
      btn.addEventListener('touch', () => {
        // console.log(btn.id)
        document.querySelector(".active")?.classList.remove('active');
        btn.classList.add('active');
        setSelectedTool(btn.id);
        // console.log(selectedTool);
      })

    })

    colorBtns?.forEach((btn) => {
      btn.addEventListener('touch', () => {
        // console.log("clicked")
        document.querySelector(".selected")?.classList.remove('selected');
        btn.classList.add('selected');
        setSelectedColor(btn.id);
      })

    })
    sizeSlider?.addEventListener('change', () => {
      setBrushWidth(sizeSlider?.value);
    })

    return () => {
      canvasRef.current?.removeEventListener('touchmove', Drawingtouch)
      canvasRef.current?.removeEventListener('touchstart', startdrawtouch)
      canvasRef.current?.removeEventListener('touchend', () => { setIsDrawing(false) })
      // window.removeEventListener('resize', resizeCanvas);
      clearCanvas.removeEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        // setCanvasBackground();
      })
      clearCanvas.removeEventListener('touch', () => {
        context.clearRect(0, 0, canvas.width, canvas.height)
        // setCanvasBackground();
      })
      btnTools?.forEach((btn) => {
        btn.removeEventListener('touch', () => {
          document.querySelector(".active")?.classList.remove('active');
          btn.classList.add('active');
          setSelectedTool(btn.id);
        })

      })
      colorBtns?.forEach((btn) => {
        btn.removeEventListener('touch', () => {
          document.querySelector(".selected")?.classList.remove('selected');
          btn.classList.add('selected');
          setSelectedColor(btn.id);
        })

      })
      sizeSlider?.removeEventListener('touch', () => {
        setBrushWidth(sizeSlider?.value);
      })
      canvasRef.current?.removeEventListener('mousemove', Drawing)
      canvasRef.current?.removeEventListener('mousedown', startdraw)
      canvasRef.current?.removeEventListener('mouseup', () => { setIsDrawing(false) })
      // window.removeEventListener('resize', resizeCanvas);

      btnTools?.forEach((btn) => {
        btn.removeEventListener('click', () => {
          document.querySelector(".active")?.classList.remove('active');
          btn.classList.add('active');
          setSelectedTool(btn.id);
        })

      })
      colorBtns?.forEach((btn) => {
        btn.removeEventListener('click', () => {
          document.querySelector(".selected")?.classList.remove('selected');
          btn.classList.add('selected');
          setSelectedColor(btn.id);
        })

      })
      sizeSlider?.removeEventListener('change', () => {
        setBrushWidth(sizeSlider?.value);
      })
      savepdf.removeEventListener('click',()=>{
        // console.log('print')
        window.print()
      })
      savepdf2.removeEventListener('click',()=>{
        // console.log('print')
        window.print()
      })
  
    };
  }, [isDrawingEnabled, isdrawing, brushWidth, selectedTool, selectedColor, prevMouseX, prevMouseY, currentMouseX, currentMouseY]);

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
      {/* <div className='h-10 w-[100%] flex'></div> */}
      {isDrawingEnabled ?
        <div className='transition-all ease-in-out 1s w-[160px] h-[400px] bg-[rgb(31,31,32)] rounded-md flex flex-row justify-center border border-[rgb(54,54,54)] fixed top-[20%] left-2' >
          <div className='rounded-sm flex-row cursor-default p-2'>
            <div className='brushes w-[140px] h-[130px] rounded-sm flex-row cursor-default'>
              <div className='title text-white font-light h-5 flex ml-3'><img className='mt-[3px] mr-[3px]' src="/icons8-options-24.png" width={20}
                height={20} alt="[]" />Options</div>
              <div className='flex-row p-3'>
                <div className='pointer text-white font-thin h-6 m-2 flex hov cursor-pointer active tool option' id='pointer'><img className='m-[3px] mr-2' src="/icons8-cursor-30.png" width={18}
                  height={18} alt="[]" />Pointer</div>
                <div className='brush text-white font-thin h-6 m-2 flex hov cursor-pointer  tool option' id='brush'><img className='m-[3px] mr-2' src="/icons8-brush-64.png" width={18}
                  height={18} alt="[]" />Brush</div>
                <div className='Eraser text-white font-thin h-6 m-2 flex hov cursor-pointer tool option' id='eraser'><img className='m-[3px] mr-2' src="/icons8-eraser-24.png" width={18}
                  height={18} alt="[]" />Eraser</div>
              </div>
            </div>
            <div className='range w-[140px] h-[35px] rounded-sm flex-row cursor-default ml-3'>
              <input type='range' id='size-slider' className='size h-1' min="1" max="30" defaultValue={2} />
              <label htmlFor="size-slider" className='text-white font-thin'></label>
            </div>
            <div className='color w-[150px] h-[75px] rounded-sm flex-row cursor-default'>
              <label className='title text-white font-light h-6 flex ml-3'><img className='mt-[3px] mr-[3px]' src="/icons8-color-50.png" width={20}
                height={20} alt="[]" />Colors</label>
              <div className='flex justify-between p-3'>
                <div className='h-5 w-5 bg-black m-1 rounded-xl  colors selected cursor-pointer' id='rgb(0 0 0)'></div>
                <div className='h-5 w-5 bg-blue-600 m-1 rounded-xl colors cursor-pointer' id='rgb(37 99 235)'></div>
                <div className='h-5 w-5 bg-red-600 m-1 rounded-xl colors cursor-pointer' id='rgb(220 38 38)'></div>
                <div className='h-5 w-5 bg-green-600 m-1 rounded-xl colors cursor-pointer' id='rgb(22 163 74)'></div>
              </div>

            </div>
            <div className='w-[160px] h-[100px] rounded-sm grid cursor-default justify-center items-center'>
              <button className='title text-white h-6 flex bg-blue-700 rounded-md w-[110px] justify-center font-thin clear-canvas hover:bg-blue-800'>Clear Canvas</button>
              <button id='capture' className='title text-white h-6 flex bg-blue-700 rounded-md w-[110px] justify-center font-thin hover:bg-blue-800 capture'>Save as pdf</button>
            </div>
          </div>

        </div>
        : null}

        <div className='flex'>
          
      <button className='z-[2000]' onClick={() => setIsDrawingEnabled(!isDrawingEnabled)}>
        {isDrawingEnabled ? 'Disable Drawing Mode' : 'Enable Drawing Mode'}
      </button>
      <button id='capture' className='title text-white h-6 flex bg-blue-700 rounded-md w-[110px] justify-center font-thin hover:bg-blue-800 capture2'>Save as pdf</button>
        </div>
      <form onSubmit={handleSubmit} className={`${isDrawingEnabled ? 'ml-[200px] mt-[50px] w-[1000px] h-[1600px]' : 'w-[100vw] h-[100vh]'} `}>
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
        {
          !isDrawingEnabled ?
        <>
        <div className="all-sections-container">



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
              <div key={`diagnosis-${index}`} className='diagnosis-entry'>
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
              <div key={`prescription-${index}`} className='prescription-entry'>
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

        </div>
          </>:
          <>
          <div className='grid'>
            <div className='w-[100%] h-[300px] border border-gray-200'>
              <h1 className='font-semibold text-lg m-5'>Tests</h1>
            </div>
            <div className='w-[100%] h-[300px] border border-gray-200'>
              <h1 className='font-semibold text-lg m-5'>Reports</h1>
            </div>
            <div className='w-[100%] h-[300px] border border-gray-200'>
              <h1 className='font-semibold text-lg m-5'>Diagnosis</h1>
            </div>
            <div className='w-[100%] h-[300px] border border-gray-200'>
              <h1 className='font-semibold text-lg m-5'>Prescriptions</h1>
            </div>
            <div className='w-[100%] h-[300px] border border-gray-200'>
              <h1 className='font-semibold text-lg m-5'>Tests</h1>
            </div>

          </div>
            
          </>
  
          }
                    <div className="referral-chain-section">
            <h3>Referral Chain</h3>
            {formData.referralChain.map((referral, index) => (
              <input
              key={`referral-${index}`}
              className='referral-entry'
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
        <button className='text-lg font-bold hover:bg-slate-200' type="submit">Submit</button>
        {isDrawingEnabled && (
          <canvas
            ref={canvasRef}
            className='absolute top-16 canvastouch border rounded-lg border-gray-200'
          height='2600px' width='1000px'
          ></canvas>
        )}
      </form>
      {/* <button onClick={saveFormAsPDF}>Save as PDF</button> */}
    </div>
  );
}

export default App;
