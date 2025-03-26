import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { google } from 'npm:googleapis@128.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body safely
    const body = await req.json();
    const { name, email, contact, isBitsStudent, bitsId, slotPreference } = body;

    // Validate required fields
    if (!name || !email || !contact || !slotPreference || (isBitsStudent && !bitsId)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: Deno.env.get('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
        private_key: (Deno.env.get('GOOGLE_PRIVATE_KEY') || '').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = Deno.env.get('SPREADSHEET_ID') || '1y3-B3BhQkDAcI0yCLyJUQomZ3uZzEx1SLB14Vf68oLk';

    // Get current registrations to check slot availability
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:F',
    });

    const rows = response.data.values || [];
    const morningSlotCount = rows.filter(row => row[5] === '12:30 - 2:30 PM').length;
    const afternoonSlotCount = rows.filter(row => row[5] === '3:30 - 5:30 PM').length;

    const slotsFull = {
      morning: morningSlotCount >= 40,
      afternoon: afternoonSlotCount >= 40,
    };

    // Prevent overbooking full slots
    if ((slotPreference === '12:30 - 2:30 PM' && slotsFull.morning) ||
        (slotPreference === '3:30 - 5:30 PM' && slotsFull.afternoon)) {
      return new Response(
        JSON.stringify({ 
          error: 'Selected slot is full',
          slotsFull,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Append the new registration
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          name.trim(),
          email.trim(),
          contact.trim(),
          isBitsStudent ? 'Yes' : 'No',
          isBitsStudent ? bitsId.trim() : 'N/A',
          slotPreference,
        ]],
      },
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registration successful',
        slotsFull,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message || 'Unexpected error occurred',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
