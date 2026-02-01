/**
 * Supabase Edge Function: Delete File
 * Deletes files from Cloudflare R2
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { S3Client, DeleteObjectCommand } from 'npm:@aws-sdk/client-s3';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const r2Endpoint = Deno.env.get('R2_ENDPOINT');
    const r2AccessKeyId = Deno.env.get('R2_ACCESS_KEY_ID');
    const r2SecretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY');
    const bucketName = Deno.env.get('R2_BUCKET_NAME') || 'content-creator-media';

    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey) {
      return new Response(
        JSON.stringify({ error: 'Missing R2 configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { key } = await req.json();

    if (!key) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: key' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Deleting file:', key);

    // Initialize R2 client
    const r2 = new S3Client({
      region: 'auto',
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    });

    // Delete the file
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2.send(command);

    console.log('Successfully deleted:', key);

    return new Response(
      JSON.stringify({ success: true, key }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Error:', err.message);
    return new Response(
      JSON.stringify({ error: 'Failed to delete file', details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
