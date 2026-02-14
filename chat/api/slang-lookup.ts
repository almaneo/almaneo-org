/**
 * Slang Dictionary Lookup API
 *
 * GET /api/slang-lookup?lang=ko&q=ㅋㅋ
 * POST /api/slang-lookup (add new entry)
 *
 * GET: Look up slang terms by language and query
 * POST: Submit a new slang term (pending verification)
 */

import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const config = {
  runtime: 'nodejs',
  maxDuration: 10,
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Database not configured');
  return createClient(url, key);
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      return handleGet(request);
    }
    if (request.method === 'POST') {
      return handlePost(request);
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[SlangLookup] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET: Look up slang terms
 */
async function handleGet(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang');
  const query = url.searchParams.get('q');
  const category = url.searchParams.get('category');

  const supabase = getSupabase();

  let queryBuilder = supabase
    .from('slang_dictionary')
    .select('term, lang, meaning, category, equivalent, examples, verified');

  if (lang) {
    queryBuilder = queryBuilder.eq('lang', lang);
  }
  if (query) {
    queryBuilder = queryBuilder.ilike('term', `%${query}%`);
  }
  if (category) {
    queryBuilder = queryBuilder.eq('category', category);
  }

  const { data, error } = await queryBuilder
    .order('term', { ascending: true })
    .limit(50);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ entries: data || [], count: data?.length || 0 }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}

/**
 * POST: Submit a new slang term
 */
async function handlePost(request: Request): Promise<Response> {
  const body = await request.json();
  const { term, lang, meaning, category, equivalent, examples, addedBy } = body as {
    term: string;
    lang: string;
    meaning: string;
    category: 'slang' | 'trend' | 'culture' | 'abbreviation';
    equivalent?: Record<string, string>;
    examples?: string[];
    addedBy?: string;
  };

  if (!term || !lang || !meaning || !category) {
    return new Response(
      JSON.stringify({ error: 'term, lang, meaning, and category are required' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  const supabase = getSupabase();

  const { error } = await supabase.from('slang_dictionary').upsert(
    {
      term: term.toLowerCase(),
      lang,
      meaning,
      category,
      equivalent: equivalent || {},
      examples: examples || [],
      added_by: addedBy || 'anonymous',
      verified: false,
    },
    {
      onConflict: 'term,lang',
    },
  );

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({ status: 'submitted', term, lang, verified: false }),
    {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  );
}
