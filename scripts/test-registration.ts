import fetch from 'node-fetch';

async function testRegistration() {
    const baseUrl = 'http://localhost:3000/api/auth';

    console.log('--- Testing Registration API ---');

    // 1. Test short password
    console.log('\n1. Testing short password (5 chars)...');
    const res1 = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'test_short@example.com',
            password: '12345',
            name: 'Test Short',
            roleName: 'stagiaire'
        })
    });
    const data1 = await res1.json();
    console.log('Status:', res1.status);
    console.log('Response:', data1);

    // 2. Test valid registration
    console.log('\n2. Testing valid registration...');
    const res2 = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: `test_valid_${Date.now()}@example.com`,
            password: 'password123',
            name: 'Test Valid',
            roleName: 'tuteur'
        })
    });
    const data2 = await res2.json();
    console.log('Status:', res2.status);
    console.log('Response:', data2);

    // 3. Test duplicate email
    console.log('\n3. Testing duplicate email (admin@portal.com)...');
    const res3 = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@portal.com',
            password: 'password123',
            name: 'Test Admin',
            roleName: 'admin'
        })
    });
    const data3 = await res3.json();
    console.log('Status:', res3.status);
    console.log('Response:', data3);
}

testRegistration();
