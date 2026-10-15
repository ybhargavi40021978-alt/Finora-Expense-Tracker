const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== STARTING E2E VERIFICATION SUITE ===\n');

  // Register dedicated test user
  const email = `e2e.user.${Date.now()}@example.com`;
  const regRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'E2E Tester',
    email,
    password: 'Password123!'
  });

  if (regRes.status !== 201 || !regRes.data.token) {
    throw new Error(`Failed to register test user: ${JSON.stringify(regRes.data)}`);
  }
  const token = regRes.data.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Test 1: Empty initial state check
  console.log('1. Checking initial database state (should be empty, 0 records)...');
  const initTxns = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'GET',
    headers: authHeaders
  });
  console.log('GET /api/transactions status:', initTxns.status);
  console.log('Total transactions:', initTxns.data.pagination.total);
  if (initTxns.data.pagination.total !== 0) {
    console.error('FAIL: Expected 0 initial transactions!');
    process.exit(1);
  }

  const initMonthly = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: authHeaders
  });
  console.log('Monthly summary totalIncome:', initMonthly.data.summary.totalIncome, 'totalExpenses:', initMonthly.data.summary.totalExpenses, 'netBalance:', initMonthly.data.summary.netBalance);
  if (initMonthly.data.summary.totalIncome !== 0 || initMonthly.data.summary.totalExpenses !== 0 || initMonthly.data.summary.netBalance !== 0) {
    console.error('FAIL: Expected ₹0 monthly summary on initial state!');
    process.exit(1);
  }
  console.log('PASS: Initial zero state verified.\n');

  // Test 2: Validation check (reject invalid amount, reject negative, reject empty)
  console.log('2. Testing validation: rejection of invalid / negative amounts...');
  const invalidIncome = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/income',
    method: 'POST',
    headers: authHeaders
  }, { title: 'Invalid Test', amount: -500, category: 'Salary' });
  console.log('Negative amount status:', invalidIncome.status);
  if (invalidIncome.status !== 400) {
    console.error('FAIL: Expected 400 on negative amount!');
    process.exit(1);
  }

  const zeroExpense = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses',
    method: 'POST',
    headers: authHeaders
  }, { title: 'Zero Test', amount: 0, category: 'Food' });
  console.log('Zero amount status:', zeroExpense.status);
  if (zeroExpense.status !== 400) {
    console.error('FAIL: Expected 400 on zero amount!');
    process.exit(1);
  }
  console.log('PASS: Server validation properly rejected invalid inputs.\n');

  // Test 3: Create Income (Real User Entry)
  console.log('3. Submitting real income record (Salary: ₹50,000)...');
  const createIncomeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/income',
    method: 'POST',
    headers: authHeaders
  }, {
    title: 'Monthly Salary',
    amount: 50000,
    category: 'Salary',
    date: '2026-10-15',
    paymentMethod: 'Bank Transfer',
    depositAccount: 'HDFC Bank',
    notes: 'October tech lead salary'
  });
  console.log('Create Income status:', createIncomeRes.status);
  const incomeId = createIncomeRes.data.record._id;
  console.log('Created Income ID:', incomeId, 'Amount:', createIncomeRes.data.record.amount);
  if (createIncomeRes.status !== 201 || !incomeId) {
    console.error('FAIL: Could not create income!');
    process.exit(1);
  }
  console.log('PASS: Real income saved to MongoDB.\n');

  // Test 4: Create Expense (Real User Entry)
  console.log('4. Submitting real expense record (Groceries: ₹3,500)...');
  const createExpenseRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses',
    method: 'POST',
    headers: authHeaders
  }, {
    title: 'Supermarket Groceries',
    amount: 3500,
    category: 'Food',
    date: '2026-10-15',
    paymentMethod: 'UPI',
    merchant: 'Nature Basket',
    notes: 'Organic groceries and pantry stock'
  });
  console.log('Create Expense status:', createExpenseRes.status);
  const expenseId = createExpenseRes.data.record._id;
  console.log('Created Expense ID:', expenseId, 'Amount:', createExpenseRes.data.record.amount);
  if (createExpenseRes.status !== 201 || !expenseId) {
    console.error('FAIL: Could not create expense!');
    process.exit(1);
  }
  console.log('PASS: Real expense saved to MongoDB.\n');

  // Test 5: Verify Persistence & Aggregations
  console.log('5. Verifying persistence and aggregations in monthly/yearly endpoints...');
  const monthlyRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: authHeaders
  });
  const mSum = monthlyRes.data.summary;
  console.log('Monthly summary: Income = ₹' + mSum.totalIncome + ', Expenses = ₹' + mSum.totalExpenses + ', Net = ₹' + mSum.netBalance);
  if (mSum.totalIncome !== 50000 || mSum.totalExpenses !== 3500 || mSum.netBalance !== 46500) {
    console.error('FAIL: Aggregation mismatch in monthly summary!');
    process.exit(1);
  }

  const yearlyRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/yearly?year=2026',
    method: 'GET',
    headers: authHeaders
  });
  const ySum = yearlyRes.data.summary;
  console.log('Yearly summary: Total Income = ₹' + ySum.totalIncome + ', Total Expenses = ₹' + ySum.totalExpenses + ', Net = ₹' + ySum.netBalance);
  if (ySum.totalIncome !== 50000 || ySum.totalExpenses !== 3500 || ySum.netBalance !== 46500) {
    console.error('FAIL: Aggregation mismatch in yearly summary!');
    process.exit(1);
  }
  console.log('PASS: Monthly and yearly aggregations match stored MongoDB records.\n');

  // Test 6: Update Record
  console.log('6. Updating income record (adjusting amount to ₹55,000)...');
  const updateRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/income/${incomeId}`,
    method: 'PATCH',
    headers: authHeaders
  }, { amount: 55000, title: 'Monthly Salary (with bonus)' });
  console.log('Update status:', updateRes.status, 'Updated amount:', updateRes.data.record.amount);
  if (updateRes.status !== 200 || updateRes.data.record.amount !== 55000) {
    console.error('FAIL: Update failed!');
    process.exit(1);
  }

  const updatedMonthly = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: authHeaders
  });
  console.log('Updated Net Balance in summary: ₹' + updatedMonthly.data.summary.netBalance);
  if (updatedMonthly.data.summary.netBalance !== (55000 - 3500)) {
    console.error('FAIL: Summary did not reflect updated record!');
    process.exit(1);
  }
  console.log('PASS: Record updated and reflected in aggregations.\n');

  // Test 7: Delete Record
  console.log('7. Deleting test expense record...');
  const deleteRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/expenses/${expenseId}`,
    method: 'DELETE',
    headers: authHeaders
  });
  console.log('Delete status:', deleteRes.status);
  if (deleteRes.status !== 200) {
    console.error('FAIL: Delete failed!');
    process.exit(1);
  }

  const postDeleteMonthly = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: authHeaders
  });
  console.log('After delete: totalExpenses = ₹' + postDeleteMonthly.data.summary.totalExpenses + ', netBalance = ₹' + postDeleteMonthly.data.summary.netBalance);
  if (postDeleteMonthly.data.summary.totalExpenses !== 0 || postDeleteMonthly.data.summary.netBalance !== 55000) {
    console.error('FAIL: Deletion was not reflected in summaries!');
    process.exit(1);
  }
  console.log('PASS: Record successfully deleted and removed from aggregations.\n');

  // Clean up remaining test income
  await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/income/${incomeId}`,
    method: 'DELETE',
    headers: authHeaders
  });
  console.log('8. Cleaned up test income. Verifying final empty state...');
  const finalCheck = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'GET',
    headers: authHeaders
  });
  console.log('Final transactions count:', finalCheck.data.pagination.total);
  if (finalCheck.data.pagination.total !== 0) {
    console.error('FAIL: Expected 0 transactions after cleanup!');
    process.exit(1);
  }

  console.log('\n=== ALL E2E BACKEND INTEGRATION TESTS PASSED SUCCESSFULLY! ===\n');
}

runTests().catch(err => {
  console.error('E2E Test encountered unexpected error:', err);
  process.exit(1);
});
