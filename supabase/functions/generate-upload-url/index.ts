/**
 * Supabase Edge Function: Generate Upload URL
 * Creates presigned URLs for direct uploads to Cloudflare R2
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3';
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log all env vars (for debugging)
    const r2Endpoint = Deno.env.get('R2_ENDPOINT');
    const r2AccessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
    const r2SecretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('R2_BUCKET_NAME') || 'content-creator-media';
    const mediaBaseUrl = Deno.env.get('MEDIA_BASE_URL') || 'https://pub-4b48864be5f4453abccc035a3e8b4235.r2.dev';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('ENV CHECK:', {
      hasR2Endpoint: !!r2Endpoint,
      hasR2AccessKeyId: !!r2AccessKeyId,
      hasR2SecretAccessKey: !!r2SecretAccessKey,
      hasBucketName: !!bucketName,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
    });

    // Check required R2 env vars
    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
      const missing = [];
      if (!r2Endpoint) missing.push('R2_ENDPOINT');
      if (!r2AccessKeyId) missing.push('R2_ACCESS_KEY_ID');
      if (!r2SecretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
      
      return new Response(
        JSON.stringify({ error: `Missing R2 secrets: ${missing.join(', ')}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { key, contentType, clientId } = await req.json();
    console.log('Request body:', { key, contentType, clientId });

    if (!key || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: key, contentType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize R2 client
    console.log('Initializing R2 client...');
    const r2 = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });

    // Generate presigned URL
    console.log('Generating presigned URL for key:', key);
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });
    const publicUrl = `${mediaBaseUrl}/${key}`;

    console.log('Success! Generated URL for:', key);

    return new Response(
      JSON.stringify({ uploadUrl, publicUrl, key }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
