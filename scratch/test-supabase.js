const fs = require('fs');
const path = require('path');

async function testSupabase() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error("❌ .env.local not found!");
      return;
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
    const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);

    if (!urlMatch || !keyMatch) {
      console.error("❌ NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local");
      return;
    }

    const url = urlMatch[1].trim();
    const key = keyMatch[1].trim();

    console.log(`Connecting to: ${url}`);

    // Attempt to fetch from 'leads' table via REST API
    const response = await fetch(`${url}/rest/v1/leads?select=id&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });

    if (response.ok) {
      console.log("✅ SUCCESS: Connected to Supabase and 'leads' table is accessible!");
      const data = await response.json();
      console.log("Data sample:", data);
    } else {
      const errorText = await response.text();
      console.error(`❌ FAILED: Supabase returned error ${response.status}: ${errorText}`);
      
      if (response.status === 404) {
        console.error("💡 HINT: The 'leads' table might not exist. Ensure you've run the schema.sql in your Supabase SQL Editor.");
      } else if (response.status === 401 || response.status === 403) {
        console.error("💡 HINT: Your Service Role or Anon Key might be incorrect, or RLS is blocking the request.");
      }
    }
  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err.message);
  }
}

testSupabase();
