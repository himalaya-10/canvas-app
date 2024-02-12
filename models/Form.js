const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  bio: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, required: true },
    id: { type: String, required: true },
    paid: { type: Boolean, required: true },
  },
  pastSummary: { type: String, required: true },
  history: {
    recent: { type: String, required: true },
    chronic: { type: String, required: true },
    acuteAndRecent: { type: String, required: true },
    surgeries: { type: String, required: true },
  },
  story: { type: String, required: true },
  signsAndSymptoms: {
    symptoms: [{ type: String, required: true }],
    signs: [{ type: String, required: true }]
  },
  tests: [{
    testName: { type: String },
    result: { type: String }
  }],
  reports: [{
    reportName: { type: String },
    date: { type: Date },
    findings: { type: String }
  }],
  diagnosis: [{
    condition: { type: String, required: true },
    date: { type: Date, required: true }
  }],
  
  prescription: [{
    medication: { type: String, required: true },
    dosage: { type: String, required: true },
    duration: { type: String, required: true }
  }],
  referralChain: [{ type: String }],
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
