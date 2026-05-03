fetch('http://localhost:3000/api/pharmacy/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: 50 })
}).then(res => res.text()).then(console.log).catch(console.error);

fetch('http://localhost:3000/api/reports').then(res => res.text()).then(console.log).catch(console.error);

fetch('http://localhost:3000/api/staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test', email: 'test@example.com', designation: 'Nurse' })
}).then(res => res.text()).then(console.log).catch(console.error);
