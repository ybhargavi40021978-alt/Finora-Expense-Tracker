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

async function runTwoAccountTests() {
  console.log('======================================================================');
  console.log('       FINORA EXPENSE TRACKER — TWO ACCOUNT ISOLATION TEST SUITE      ');
  console.log('======================================================================\n');

  const timestamp = Date.now();
  const priyaEmail = `priya.test.${timestamp}@example.com`;
  const sitaEmail = `sita.test.${timestamp}@example.com`;
  const password = 'SecurePassword123!';

  let priyaToken = null;
  let priyaUser = null;
  let sitaToken = null;
  let sitaUser = null;

  // STEP 1: Register Account A (Priya)
  console.log('--- STEP 1: Registering Account A (Priya) ---');
  const regPriyaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Priya Sharma',
    email: priyaEmail,
    password: password
  });

  if (regPriyaRes.status !== 201 || !regPriyaRes.data.token) {
    throw new Error(`Failed to register Priya: ${JSON.stringify(regPriyaRes.data)}`);
  }
  priyaToken = regPriyaRes.data.token;
  priyaUser = regPriyaRes.data.user;
  console.log(`✓ Priya registered successfully (ID: ${priyaUser.id}, Name: ${priyaUser.name})`);

  // Log in as Priya and verify profile
  const loginPriyaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: priyaEmail,
    password: password
  });
  if (loginPriyaRes.status !== 200) throw new Error('Failed to log in as Priya');
  priyaToken = loginPriyaRes.data.token;

  // Fetch Priya's Dashboard endpoint
  const priyaDashRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${priyaToken}` }
  });
  if (priyaDashRes.status !== 200 || priyaDashRes.data.user.name !== 'Priya Sharma') {
    throw new Error(`Priya dashboard returned wrong user name: ${priyaDashRes.data.user?.name}`);
  }
  console.log(`✓ Priya Dashboard greeting: "${priyaDashRes.data.greeting}" (User: ${priyaDashRes.data.user.name})`);

  // Add Income and Expense for Priya
  console.log('\n--- Creating Financial Records for Priya ---');
  const priyaIncomeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/income',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${priyaToken}`
    }
  }, {
    title: 'Priya Senior Developer Salary',
    amount: 85000,
    category: 'Salary',
    date: '2026-10-10'
  });
  if (priyaIncomeRes.status !== 201) throw new Error('Failed to add income for Priya');
  const priyaIncomeId = priyaIncomeRes.data.record._id;

  const priyaExpenseRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${priyaToken}`
    }
  }, {
    title: 'Priya Apartment Rent',
    amount: 25000,
    category: 'Housing',
    date: '2026-10-12'
  });
  if (priyaExpenseRes.status !== 201) throw new Error('Failed to add expense for Priya');

  // Verify Priya's totals
  const priyaSummaryRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${priyaToken}` }
  });
  const pSum = priyaSummaryRes.data.summary;
  console.log(`✓ Priya Financial Summary: Income=₹${pSum.totalIncome}, Expense=₹${pSum.totalExpenses}, Net=₹${pSum.netBalance}`);
  if (pSum.totalIncome !== 85000 || pSum.totalExpenses !== 25000 || pSum.netBalance !== 60000) {
    throw new Error('Priya financial summary values do not match!');
  }

  // STEP 2: Log out completely (simulate client clearing session)
  console.log('\n--- STEP 2: Logging Out Completely ---');
  let currentSessionToken = null;
  console.log('✓ Token removed from client session.');

  // STEP 3: Register and Log In as Account B (Sita)
  console.log('\n--- STEP 3: Registering and Logging In as Account B (Sita) ---');
  const regSitaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Sita',
    email: sitaEmail,
    password: password
  });

  if (regSitaRes.status !== 201 || !regSitaRes.data.token) {
    throw new Error(`Failed to register Sita: ${JSON.stringify(regSitaRes.data)}`);
  }
  sitaToken = regSitaRes.data.token;
  sitaUser = regSitaRes.data.user;
  console.log(`✓ Sita registered successfully (ID: ${sitaUser.id}, Name: ${sitaUser.name})`);

  // Verify Sita's profile from GET /api/users/me
  const sitaProfileRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  if (sitaProfileRes.status !== 200 || sitaProfileRes.data.user.name !== 'Sita') {
    throw new Error(`Expected Sita profile, got: ${JSON.stringify(sitaProfileRes.data)}`);
  }
  console.log(`✓ Sita GET /api/users/me returned: Name="${sitaProfileRes.data.user.name}", Email="${sitaProfileRes.data.user.email}"`);

  // Verify Sita's Dashboard Greeting
  const sitaDashRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  console.log(`✓ Sita Dashboard greeting: "${sitaDashRes.data.greeting}"`);
  if (!sitaDashRes.data.greeting.includes('Sita') || sitaDashRes.data.greeting.includes('Priya')) {
    throw new Error(`Sita greeting is invalid: ${sitaDashRes.data.greeting}`);
  }

  // STEP 4: Confirm that Sita sees ONLY her own income, expenses, summaries, and transactions
  console.log('\n--- STEP 4: Verifying Complete Data Isolation for Sita (Brand New Account) ---');
  const sitaInitSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  const sInit = sitaInitSummary.data.summary;
  console.log(`✓ Sita Initial Financials: Income=₹${sInit.totalIncome}, Expense=₹${sInit.totalExpenses}, Net=₹${sInit.netBalance}`);
  if (sInit.totalIncome !== 0 || sInit.totalExpenses !== 0 || sInit.netBalance !== 0) {
    throw new Error(`LEAK DETECTED! Sita should have ₹0 records, but got Income=${sInit.totalIncome}, Expense=${sInit.totalExpenses}`);
  }

  const sitaInitTxns = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  console.log(`✓ Sita Initial Transactions count: ${sitaInitTxns.data.transactions.length}`);
  if (sitaInitTxns.data.transactions.length !== 0) {
    throw new Error(`LEAK DETECTED! Sita sees ${sitaInitTxns.data.transactions.length} transactions from another user!`);
  }

  // Add Sita's OWN distinct records
  console.log('\n--- Adding Sita Distinct Records ---');
  const sitaIncomeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/income',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    title: 'Sita Graphic Design Freelance',
    amount: 42000,
    category: 'Freelance',
    date: '2026-10-14'
  });
  if (sitaIncomeRes.status !== 201) throw new Error('Failed to create Sita income');

  const sitaExpenseRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/expenses',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    title: 'Sita Art Supplies & Software',
    amount: 6000,
    category: 'Shopping',
    date: '2026-10-15'
  });
  if (sitaExpenseRes.status !== 201) throw new Error('Failed to create Sita expense');

  // Verify Sita's updated summary
  const sitaUpdatedSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  const sUp = sitaUpdatedSummary.data.summary;
  console.log(`✓ Sita Updated Financials: Income=₹${sUp.totalIncome}, Expense=₹${sUp.totalExpenses}, Net=₹${sUp.netBalance}`);
  if (sUp.totalIncome !== 42000 || sUp.totalExpenses !== 6000 || sUp.netBalance !== 36000) {
    throw new Error('Sita summary does not match her own recorded transactions!');
  }

  // STEP 5 & 6: Update Sita's Name through Profile and verify Dashboard Greeting
  console.log('\n--- STEP 5 & 6: Updating Sita Name through Profile ---');
  const patchSitaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/me',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    name: 'Anita Sharma'
  });
  if (patchSitaRes.status !== 200 || patchSitaRes.data.user.name !== 'Anita Sharma') {
    throw new Error(`Profile update failed: ${JSON.stringify(patchSitaRes.data)}`);
  }
  console.log(`✓ Sita profile name updated in MongoDB to: "${patchSitaRes.data.user.name}"`);

  // Verify immediate dashboard greeting update
  const sitaDeviDashRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  console.log(`✓ Updated Dashboard greeting: "${sitaDeviDashRes.data.greeting}"`);
  if (!sitaDeviDashRes.data.greeting.includes('Anita')) {
    throw new Error(`Greeting did not immediately reflect updated name! Got: ${sitaDeviDashRes.data.greeting}`);
  }

  // STEP 7 & 8: Verify persistence across simulated refresh and relogin
  console.log('\n--- STEP 7 & 8: Verifying Name Persistence Across Relogin ---');
  const reloginSitaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: sitaEmail,
    password: password
  });
  if (reloginSitaRes.status !== 200 || reloginSitaRes.data.user.name !== 'Anita Sharma') {
    throw new Error(`Relogin did not return updated name! Got: ${reloginSitaRes.data.user?.name}`);
  }
  sitaToken = reloginSitaRes.data.token;
  console.log(`✓ Relogin successful: User name remains "${reloginSitaRes.data.user.name}"`);

  // STEP 9: Update Account Settings and verify persistence in MongoDB
  console.log('\n--- STEP 9: Updating Account Settings for Anita Sharma ---');
  const patchSettingsRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/settings',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'system',
    twoFactorAuth: false
  });
  if (patchSettingsRes.status !== 200 || patchSettingsRes.data.settings.dateFormat !== 'DD/MM/YYYY') {
    throw new Error(`Settings update failed: ${JSON.stringify(patchSettingsRes.data)}`);
  }
  console.log(`✓ Sita settings updated: dateFormat="${patchSettingsRes.data.settings.dateFormat}", currency="${patchSettingsRes.data.settings.currency}"`);

  // Verify password change
  const changePasswordRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/change-password',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    currentPassword: password,
    newPassword: 'NewSecurePassword456!'
  });
  if (changePasswordRes.status !== 200) {
    throw new Error(`Password change failed: ${JSON.stringify(changePasswordRes.data)}`);
  }
  console.log(`✓ Sita password changed securely`);

  // Verify login with new password
  const newLoginSitaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: sitaEmail,
    password: 'NewSecurePassword456!'
  });
  if (newLoginSitaRes.status !== 200) {
    throw new Error('Could not log in with Sita newly changed password');
  }
  sitaToken = newLoginSitaRes.data.token;
  console.log(`✓ Successfully authenticated with new password`);

  // STEP 10: Log in as Priya again and verify data remains intact and unchanged
  console.log('\n--- STEP 10: Logging In as Priya Again to Verify Isolation & Integrity ---');
  const reloginPriyaRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    email: priyaEmail,
    password: password
  });
  if (reloginPriyaRes.status !== 200) throw new Error('Failed to relogin as Priya');
  priyaToken = reloginPriyaRes.data.token;

  const priyaMeRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/me',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${priyaToken}` }
  });
  if (priyaMeRes.data.user.name !== 'Priya Sharma') {
    throw new Error(`Priya name was altered! Got: ${priyaMeRes.data.user.name}`);
  }
  console.log(`✓ Priya profile intact: Name="${priyaMeRes.data.user.name}"`);

  const priyaRecheckSummary = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/summary/monthly?year=2026&month=10',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${priyaToken}` }
  });
  const pRecheck = priyaRecheckSummary.data.summary;
  console.log(`✓ Priya Summary Intact: Income=₹${pRecheck.totalIncome}, Expense=₹${pRecheck.totalExpenses}, Net=₹${pRecheck.netBalance}`);
  if (pRecheck.totalIncome !== 85000 || pRecheck.totalExpenses !== 25000 || pRecheck.netBalance !== 60000) {
    throw new Error('Priya financial data was altered by Sita activity!');
  }

  // STEP 11: Confirm unauthenticated requests CANNOT access private user data
  console.log('\n--- STEP 11: Testing Unauthenticated Access Rejection (401) ---');
  const unauthMe = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/me',
    method: 'GET'
  });
  console.log(`GET /api/users/me without token -> Status: ${unauthMe.status}`);
  if (unauthMe.status !== 401) throw new Error('Expected 401 on unauthenticated /api/users/me');

  const unauthTxns = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/transactions',
    method: 'GET'
  });
  console.log(`GET /api/transactions without token -> Status: ${unauthTxns.status}`);
  if (unauthTxns.status !== 401) throw new Error('Expected 401 on unauthenticated /api/transactions');
  console.log('✓ All unauthenticated private data requests correctly rejected with 401');

  // STEP 12: Confirm IDOR Prevention (Manually changing a user ID in request)
  console.log('\n--- STEP 12: Testing IDOR Prevention (Tampering with User ID) ---');
  // Attempt to delete Priya's income record using Sita's token
  const idorDeleteRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/income/${priyaIncomeId}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });
  console.log(`Sita attempting DELETE /api/income/${priyaIncomeId} -> Status: ${idorDeleteRes.status}`);
  if (idorDeleteRes.status !== 404 && idorDeleteRes.status !== 403) {
    throw new Error(`SECURITY VULNERABILITY! Sita was able to delete Priya record (Status: ${idorDeleteRes.status})`);
  }
  console.log('✓ Cross-user modification rejected (404/403: record not found under Sita account)');

  // Attempt to create income injecting Priya's userId into body while authenticated as Sita
  const idorInjectRes = await request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/income',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sitaToken}`
    }
  }, {
    title: 'Spoofed Income Attempt',
    amount: 99999,
    category: 'Other',
    userId: priyaUser.id // Spoofed target
  });
  if (idorInjectRes.status !== 201) throw new Error('Failed to create injection test income');
  
  // Verify that the record was assigned to Sita (from token), NOT Priya
  if (String(idorInjectRes.data.record.userId) !== String(sitaUser.id)) {
    throw new Error(`SECURITY VULNERABILITY! Injected userId was honored by server! Record userId: ${idorInjectRes.data.record.userId}`);
  }
  console.log('✓ Server correctly derived userId from validated JWT token, ignoring body spoof');

  // Clean up spoofed test record
  await request({
    hostname: 'localhost',
    port: 3000,
    path: `/api/income/${idorInjectRes.data.record._id}`,
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${sitaToken}` }
  });

  console.log('\n======================================================================');
  console.log('       ALL 12 TWO-ACCOUNT VERIFICATION TESTS PASSED FLAWLESSLY!       ');
  console.log('======================================================================\n');
}

runTwoAccountTests().catch(err => {
  console.error('\n❌ TWO-ACCOUNT TEST FAILED:', err);
  process.exit(1);
});
