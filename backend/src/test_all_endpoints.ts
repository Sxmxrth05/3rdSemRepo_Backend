import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const BASE_URL = 'http://localhost:5000';

interface TestResult {
  category: string;
  endpoint: string;
  method: string;
  status: number;
  expectedStatus: number[];
  passed: boolean;
  notes?: string;
}

const results: TestResult[] = [];

function logResult(res: TestResult) {
  results.push(res);
  const icon = res.passed ? '✅' : '❌';
  console.log(`${icon} [${res.category}] ${res.method} ${res.endpoint} -> Status: ${res.status} (Expected: ${res.expectedStatus.join('/')}) ${res.notes ? `- ${res.notes}` : ''}`);
}

async function runAllTests() {
  console.log('====================================================');
  console.log('🚀 BILLORA API COMPREHENSIVE ENDPOINT TEST SUITE');
  console.log('====================================================\n');

  let accessToken = '';
  let resetToken = '';
  let clientId = '';
  let invoiceId = '';
  let shareToken = '';

  const testEmail = `audit_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  // ==========================================
  // CATEGORY 7: SYSTEM & HEALTH
  // ==========================================
  console.log('--- 1. Testing System & Health Endpoints ---');
  try {
    const resRoot = await fetch(`${BASE_URL}/`);
    logResult({ category: 'System', endpoint: '/', method: 'GET', status: resRoot.status, expectedStatus: [200], passed: resRoot.status === 200 });

    const resHealth = await fetch(`${BASE_URL}/health`);
    logResult({ category: 'System', endpoint: '/health', method: 'GET', status: resHealth.status, expectedStatus: [200], passed: resHealth.status === 200 });

    const resApiIndex = await fetch(`${BASE_URL}/api/v1`);
    logResult({ category: 'System', endpoint: '/api/v1', method: 'GET', status: resApiIndex.status, expectedStatus: [200], passed: resApiIndex.status === 200 });
  } catch (err: any) {
    console.error('Error testing system endpoints:', err.message);
  }

  // ==========================================
  // CATEGORY 1: AUTHENTICATION
  // ==========================================
  console.log('\n--- 2. Testing Authentication Endpoints ---');
  try {
    // 1.1 Register
    const regRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Audit User', email: testEmail, password: testPassword }),
    });
    const regData = await regRes.json();
    logResult({ category: 'Auth', endpoint: '/api/v1/auth/register', method: 'POST', status: regRes.status, expectedStatus: [201], passed: regRes.status === 201 });

    // 1.1b Register Duplicate Email (Negative Test)
    const regDupRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Audit User', email: testEmail, password: testPassword }),
    });
    logResult({ category: 'Auth', endpoint: '/api/v1/auth/register (duplicate)', method: 'POST', status: regDupRes.status, expectedStatus: [409], passed: regDupRes.status === 409, notes: 'Duplicate email rejection' });

    // 1.2 Login Valid Credentials
    const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    const loginData = await loginRes.json();
    accessToken = loginData.data?.accessToken || '';
    logResult({ category: 'Auth', endpoint: '/api/v1/auth/login', method: 'POST', status: loginRes.status, expectedStatus: [200], passed: loginRes.status === 200 && !!accessToken, notes: accessToken ? 'Token obtained' : 'No token' });

    // 1.2b Login Invalid Password (Negative Test)
    const loginBadRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'WrongPassword' }),
    });
    logResult({ category: 'Auth', endpoint: '/api/v1/auth/login (bad password)', method: 'POST', status: loginBadRes.status, expectedStatus: [401], passed: loginBadRes.status === 401 });

    // 1.3 Forgot Password
    const forgotRes = await fetch(`${BASE_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail }),
    });
    const forgotData = await forgotRes.json();
    resetToken = forgotData.data?.resetToken || '';
    logResult({ category: 'Auth', endpoint: '/api/v1/auth/forgot-password', method: 'POST', status: forgotRes.status, expectedStatus: [200], passed: forgotRes.status === 200 });

    // 1.4 Reset Password
    if (resetToken) {
      const resetRes = await fetch(`${BASE_URL}/api/v1/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword: 'NewPassword123!' }),
      });
      logResult({ category: 'Auth', endpoint: '/api/v1/auth/reset-password', method: 'POST', status: resetRes.status, expectedStatus: [200], passed: resetRes.status === 200 });

      // Re-login with new password
      const relogin = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, password: 'NewPassword123!' }),
      });
      const reloginData = await relogin.json();
      accessToken = reloginData.data?.accessToken || accessToken;
    }
  } catch (err: any) {
    console.error('Error testing auth endpoints:', err.message);
  }

  const authHeader = { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

  // ==========================================
  // CATEGORY 2: USERS & BUSINESS PROFILE
  // ==========================================
  console.log('\n--- 3. Testing Users & Business Profile Endpoints ---');
  try {
    const meRes = await fetch(`${BASE_URL}/api/v1/users/me`, { headers: authHeader });
    logResult({ category: 'Users', endpoint: '/api/v1/users/me', method: 'GET', status: meRes.status, expectedStatus: [200], passed: meRes.status === 200 });

    const updateMeRes = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify({ name: 'Audit User Updated' }),
    });
    logResult({ category: 'Users', endpoint: '/api/v1/users/me', method: 'PATCH', status: updateMeRes.status, expectedStatus: [200], passed: updateMeRes.status === 200 });

    const changePwdRes = await fetch(`${BASE_URL}/api/v1/users/change-password`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ currentPassword: 'NewPassword123!', newPassword: testPassword }),
    });
    logResult({ category: 'Users', endpoint: '/api/v1/users/change-password', method: 'POST', status: changePwdRes.status, expectedStatus: [200], passed: changePwdRes.status === 200 });

    const getProfileRes = await fetch(`${BASE_URL}/api/v1/business-profile`, { headers: authHeader });
    logResult({ category: 'BusinessProfile', endpoint: '/api/v1/business-profile', method: 'GET', status: getProfileRes.status, expectedStatus: [200], passed: getProfileRes.status === 200 });

    const patchProfileRes = await fetch(`${BASE_URL}/api/v1/business-profile`, {
      method: 'PATCH',
      headers: authHeader,
      body: JSON.stringify({ businessName: 'Audit Corp LLC', address: '789 Innovation Way', phone: '+15559998888' }),
    });
    logResult({ category: 'BusinessProfile', endpoint: '/api/v1/business-profile', method: 'PATCH', status: patchProfileRes.status, expectedStatus: [200], passed: patchProfileRes.status === 200 });

    const sigRes = await fetch(`${BASE_URL}/api/v1/business-profile/signature`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ type: 'font', value: 'Audit Signer' }),
    });
    logResult({ category: 'BusinessProfile', endpoint: '/api/v1/business-profile/signature', method: 'POST', status: sigRes.status, expectedStatus: [200], passed: sigRes.status === 200 });
  } catch (err: any) {
    console.error('Error testing users/business profile endpoints:', err.message);
  }

  // ==========================================
  // CATEGORY 3: CLIENTS
  // ==========================================
  console.log('\n--- 4. Testing Client Endpoints ---');
  try {
    const createClientRes = await fetch(`${BASE_URL}/api/v1/clients`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ name: 'Audit Test Client', email: 'client.audit@example.com', address: '100 Corporate Plaza' }),
    });
    const createClientData = await createClientRes.json();
    clientId = createClientData.data?._id || '';
    logResult({ category: 'Clients', endpoint: '/api/v1/clients', method: 'POST', status: createClientRes.status, expectedStatus: [201], passed: createClientRes.status === 201 && !!clientId });

    const listClientsRes = await fetch(`${BASE_URL}/api/v1/clients`, { headers: authHeader });
    logResult({ category: 'Clients', endpoint: '/api/v1/clients', method: 'GET', status: listClientsRes.status, expectedStatus: [200], passed: listClientsRes.status === 200 });

    if (clientId) {
      const getClientRes = await fetch(`${BASE_URL}/api/v1/clients/${clientId}`, { headers: authHeader });
      logResult({ category: 'Clients', endpoint: '/api/v1/clients/:id', method: 'GET', status: getClientRes.status, expectedStatus: [200], passed: getClientRes.status === 200 });

      const patchClientRes = await fetch(`${BASE_URL}/api/v1/clients/${clientId}`, {
        method: 'PATCH',
        headers: authHeader,
        body: JSON.stringify({ name: 'Audit Test Client Updated' }),
      });
      logResult({ category: 'Clients', endpoint: '/api/v1/clients/:id', method: 'PATCH', status: patchClientRes.status, expectedStatus: [200], passed: patchClientRes.status === 200 });

      const clientInvoicesRes = await fetch(`${BASE_URL}/api/v1/clients/${clientId}/invoices`, { headers: authHeader });
      logResult({ category: 'Clients', endpoint: '/api/v1/clients/:id/invoices', method: 'GET', status: clientInvoicesRes.status, expectedStatus: [200], passed: clientInvoicesRes.status === 200 });

      const archiveClientRes = await fetch(`${BASE_URL}/api/v1/clients/${clientId}`, { method: 'DELETE', headers: authHeader });
      logResult({ category: 'Clients', endpoint: '/api/v1/clients/:id (archive)', method: 'DELETE', status: archiveClientRes.status, expectedStatus: [200], passed: archiveClientRes.status === 200 });

      const unarchiveClientRes = await fetch(`${BASE_URL}/api/v1/clients/${clientId}/unarchive`, { method: 'POST', headers: authHeader });
      logResult({ category: 'Clients', endpoint: '/api/v1/clients/:id/unarchive', method: 'POST', status: unarchiveClientRes.status, expectedStatus: [200], passed: unarchiveClientRes.status === 200 });
    }
  } catch (err: any) {
    console.error('Error testing client endpoints:', err.message);
  }

  // ==========================================
  // CATEGORY 4: INVOICES
  // ==========================================
  console.log('\n--- 5. Testing Invoice Endpoints ---');
  try {
    const createInvoiceRes = await fetch(`${BASE_URL}/api/v1/invoices`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({
        clientId: clientId || undefined,
        client: { name: 'Audit Test Client', email: 'client.audit@example.com', address: '100 Corporate Plaza' },
        lineItems: [
          { description: 'Security Audit & Code Hardening', quantity: 1, unitPrice: 3500 },
          { description: 'API Documentation & Postman Sync', quantity: 2, unitPrice: 250 },
        ],
        currency: 'USD',
        taxRate: 10,
        template: 'modern',
        colorScheme: '#2196F3',
        font: 'Inter',
      }),
    });
    const createInvoiceData = await createInvoiceRes.json();
    invoiceId = createInvoiceData.data?._id || '';
    shareToken = createInvoiceData.data?.shareToken || '';
    logResult({ category: 'Invoices', endpoint: '/api/v1/invoices', method: 'POST', status: createInvoiceRes.status, expectedStatus: [201], passed: createInvoiceRes.status === 201 && !!invoiceId });

    const listInvoicesRes = await fetch(`${BASE_URL}/api/v1/invoices`, { headers: authHeader });
    logResult({ category: 'Invoices', endpoint: '/api/v1/invoices', method: 'GET', status: listInvoicesRes.status, expectedStatus: [200], passed: listInvoicesRes.status === 200 });

    if (invoiceId) {
      const getInvoiceRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}`, { headers: authHeader });
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id', method: 'GET', status: getInvoiceRes.status, expectedStatus: [200], passed: getInvoiceRes.status === 200 });

      // Patch invoice with 'issued' alias
      const patchInvoiceRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}`, {
        method: 'PATCH',
        headers: authHeader,
        body: JSON.stringify({ documentStatus: 'issued', paymentStatus: 'paid', taxRate: 15 }),
      });
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id', method: 'PATCH', status: patchInvoiceRes.status, expectedStatus: [200], passed: patchInvoiceRes.status === 200, notes: 'documentStatus: issued alias' });

      const patchStatusRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: authHeader,
        body: JSON.stringify({ paymentStatus: 'paid', documentStatus: 'sent' }),
      });
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/status', method: 'PATCH', status: patchStatusRes.status, expectedStatus: [200], passed: patchStatusRes.status === 200 });

      const dupRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}/duplicate`, { method: 'POST', headers: authHeader });
      const dupData = await dupRes.json();
      const dupInvoiceId = dupData.data?._id;
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/duplicate', method: 'POST', status: dupRes.status, expectedStatus: [201], passed: dupRes.status === 201 });

      const downloadPdfRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}/download`, { headers: { Authorization: `Bearer ${accessToken}` } });
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/download', method: 'GET', status: downloadPdfRes.status, expectedStatus: [200], passed: downloadPdfRes.status === 200, notes: downloadPdfRes.headers.get('content-type') || '' });

      const sendEmailRes = await fetch(`${BASE_URL}/api/v1/invoices/${invoiceId}/send`, { method: 'POST', headers: authHeader });
      logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/send', method: 'POST', status: sendEmailRes.status, expectedStatus: [200], passed: sendEmailRes.status === 200 });

      // Soft delete duplicated invoice
      if (dupInvoiceId) {
        const softDeleteRes = await fetch(`${BASE_URL}/api/v1/invoices/${dupInvoiceId}`, { method: 'DELETE', headers: authHeader });
        logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id (soft delete)', method: 'DELETE', status: softDeleteRes.status, expectedStatus: [200], passed: softDeleteRes.status === 200 });

        const listTrashRes = await fetch(`${BASE_URL}/api/v1/invoices/trash`, { headers: authHeader });
        logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/trash', method: 'GET', status: listTrashRes.status, expectedStatus: [200], passed: listTrashRes.status === 200 });

        const restoreRes = await fetch(`${BASE_URL}/api/v1/invoices/${dupInvoiceId}/restore`, { method: 'POST', headers: authHeader });
        logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/restore', method: 'POST', status: restoreRes.status, expectedStatus: [200], passed: restoreRes.status === 200 });

        // Soft delete again before permanent deletion
        await fetch(`${BASE_URL}/api/v1/invoices/${dupInvoiceId}`, { method: 'DELETE', headers: authHeader });

        const permDeleteRes = await fetch(`${BASE_URL}/api/v1/invoices/${dupInvoiceId}/permanent`, { method: 'DELETE', headers: authHeader });
        logResult({ category: 'Invoices', endpoint: '/api/v1/invoices/:id/permanent', method: 'DELETE', status: permDeleteRes.status, expectedStatus: [200], passed: permDeleteRes.status === 200 });
      }
    }
  } catch (err: any) {
    console.error('Error testing invoice endpoints:', err.message);
  }

  // ==========================================
  // CATEGORY 5: TEMPLATES
  // ==========================================
  console.log('\n--- 6. Testing Template Endpoints ---');
  try {
    const listTemplatesRes = await fetch(`${BASE_URL}/api/v1/templates`);
    logResult({ category: 'Templates', endpoint: '/api/v1/templates', method: 'GET', status: listTemplatesRes.status, expectedStatus: [200], passed: listTemplatesRes.status === 200 });

    const getTemplateRes = await fetch(`${BASE_URL}/api/v1/templates/modern`);
    logResult({ category: 'Templates', endpoint: '/api/v1/templates/:slug', method: 'GET', status: getTemplateRes.status, expectedStatus: [200], passed: getTemplateRes.status === 200 });
  } catch (err: any) {
    console.error('Error testing template endpoints:', err.message);
  }

  // ==========================================
  // CATEGORY 6: BILLING & SUBSCRIPTIONS
  // ==========================================
  console.log('\n--- 7. Testing Billing & Subscription Endpoints ---');
  try {
    const subRes = await fetch(`${BASE_URL}/api/v1/billing/subscription`, { headers: authHeader });
    logResult({ category: 'Billing', endpoint: '/api/v1/billing/subscription', method: 'GET', status: subRes.status, expectedStatus: [200], passed: subRes.status === 200 });

    const checkoutRes = await fetch(`${BASE_URL}/api/v1/billing/checkout`, { method: 'POST', headers: authHeader });
    logResult({ category: 'Billing', endpoint: '/api/v1/billing/checkout', method: 'POST', status: checkoutRes.status, expectedStatus: [200], passed: checkoutRes.status === 200 });

    const portalRes = await fetch(`${BASE_URL}/api/v1/billing/portal`, { headers: authHeader });
    logResult({ category: 'Billing', endpoint: '/api/v1/billing/portal', method: 'GET', status: portalRes.status, expectedStatus: [200], passed: portalRes.status === 200 });
  } catch (err: any) {
    console.error('Error testing billing endpoints:', err.message);
  }

  // ==========================================
  // FINAL SUMMARY
  // ==========================================
  console.log('\n====================================================');
  console.log('📊 AUDIT SUMMARY RESULTS');
  console.log('====================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total Endpoints Tested: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n❌ FAILED ENDPOINTS:');
    results.filter((r) => !r.passed).forEach((r) => console.log(` - [${r.category}] ${r.method} ${r.endpoint} (Status: ${r.status})`));
  } else {
    console.log('\n✨ ALL ENDPOINTS PASSED WITH 100% SUCCESS RATE! ✨');
  }
}

runAllTests();
