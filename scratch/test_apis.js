const axios = require('axios');

async function testAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('Testing Staff Onboarding...');
  try {
    const res = await axios.post(`${baseUrl}/api/staff`, {
      name: 'Dr. Test',
      email: `test_${Date.now()}@bn.com`,
      designation: 'Surgeon',
      contact: '1234567890',
      salary: '100000'
    });
    console.log('Staff OK:', res.data);
  } catch (e) {
    console.error('Staff FAILED:', e.response?.data || e.message);
  }

  console.log('Testing Pharmacy Restock...');
  try {
    // Get first medicine
    const meds = await axios.get(`${baseUrl}/api/pharmacy`);
    if (meds.data.length > 0) {
      const id = meds.data[0].id;
      const res = await axios.patch(`${baseUrl}/api/pharmacy/${id}`, {
        stock: 50
      });
      console.log('Pharmacy OK:', res.data);
    } else {
      console.log('No medicine to restock');
    }
  } catch (e) {
    console.error('Pharmacy FAILED:', e.response?.data || e.message);
  }

  console.log('Testing Reports...');
  try {
    const res = await axios.get(`${baseUrl}/api/reports`);
    console.log('Reports OK:', Object.keys(res.data));
  } catch (e) {
    console.error('Reports FAILED:', e.response?.data || e.message);
  }
}

testAPIs();
