import test from 'node:test';
import assert from 'node:assert/strict';

const originalFetch = global.fetch;
const originalUrl = process.env.BREACH_API_URL;
const originalKey = process.env.BREACH_API_KEY;

test('checkEmailAgainstBreachApi supports XposedOrNot email-breach responses', async () => {
  process.env.BREACH_API_URL = 'https://api.xposedornot.com';
  process.env.BREACH_API_KEY = '';

  global.fetch = async (url, options) => {
    assert.equal(url, 'https://api.xposedornot.com/v1/check-email/test%40example.com?details=true');
    assert.equal(options.method, 'GET');
    assert.ok(!options.headers['hibp-api-key']);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        status: 'success',
        email: 'test@example.com',
        breaches: ['Adobe', 'Dropbox'],
      }),
    };
  };

  const { checkEmailAgainstBreachApi } = await import('../services/breachApiService.js');
  const result = await checkEmailAgainstBreachApi('test@example.com');

  assert.deepEqual(result, {
    found: true,
    breachCount: 2,
    breaches: [
      { name: 'Adobe', title: 'Adobe', domain: '', date: null, description: '', pwnCount: 0, dataTypes: [] },
      { name: 'Dropbox', title: 'Dropbox', domain: '', date: null, description: '', pwnCount: 0, dataTypes: [] },
    ],
  });

  global.fetch = originalFetch;
  process.env.BREACH_API_URL = originalUrl;
  process.env.BREACH_API_KEY = originalKey;
});

test.after(() => {
  global.fetch = originalFetch;
  process.env.BREACH_API_URL = originalUrl;
  process.env.BREACH_API_KEY = originalKey;
});
