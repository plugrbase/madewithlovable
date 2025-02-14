
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, projectTitle } = await req.json();

    if (!email || !projectTitle) {
      return new Response(
        JSON.stringify({ error: 'Email and project title are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Email service configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Projects <projects@yourdomain.com>',
        to: email,
        subject: `Project Submission Received: ${projectTitle}`,
        html: `
          <h1>Thank you for submitting your project!</h1>
          <p>We have received your project submission: <strong>${projectTitle}</strong></p>
          <p>Our team will review your submission shortly. We'll notify you once the review is complete.</p>
          <p>In the meantime, if you have any questions, feel free to reach out to us.</p>
          <br>
          <p>Best regards,</p>
          <p>The Projects Team</p>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to send email:', result);
      return new Response(
        JSON.stringify({ error: 'Failed to send confirmation email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Confirmation email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
