#!/usr/bin/env node

/**
 * Seed script — populates the Partner entries in Strapi from partners.json.
 * Usage: node seed-partners.mjs <admin-email> <admin-password>
 */

import fs from 'fs';

const BASE = 'http://localhost:1337';
const [,, email, password] = process.argv;

if (!email || !password) {
  console.error('Usage: node seed-partners.mjs <admin-email> <admin-password>');
  process.exit(1);
}

// Load JSON safely
const partnersData = JSON.parse(
  fs.readFileSync(new URL('../dasa-frontend/app/assets/data/partners.json', import.meta.url))
);

async function request(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

(async () => {
  // ── 1. Login via admin endpoint → get admin JWT ──────────────────────────
  console.log('🔐 Logging in...');
  const login = await request('POST', '/admin/login', { email, password });
  if (!login.ok) { console.error('❌ Login failed:', JSON.stringify(login.data, null, 2)); process.exit(1); }
  const token = login.data?.data?.token;
  console.log('✅ Logged in.\n');

  // ── 2. Create missing partners via Content Manager ────────────────────────
  const CM = '/content-manager/collection-types/api::partner.partner';

  for (const group of partnersData.partners) {
    const categoryName = group.category;
    console.log(`\n📂 Category: ${categoryName}`);
    
    for (const p of group.items) {
      console.log(`➕ Creating "${p.name}"...`);
      const result = await request('POST', CM, {
        name: p.name,
        category: categoryName,
        url: p.url,
        logo: p.logo,
        publishedAt: new Date().toISOString(), // automatically publish
      }, token);

      if (result.ok) {
        console.log(`   ✅ Created `);
      } else {
        console.error(`   ❌ Failed:`, JSON.stringify(result.data, null, 2));
      }
    }
  }

  console.log('\n🎉 Done! Grant public find + findOne on Partner in Strapi Admin → Settings → Roles → Public.');
})();
