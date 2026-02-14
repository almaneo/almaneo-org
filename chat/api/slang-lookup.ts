/**
 * Slang Dictionary Lookup API
 *
 * GET /api/slang-lookup?lang=ko&q=ㅋㅋ
 * POST /api/slang-lookup (add new entry)
 *
 * GET: Look up slang terms by language and query
 * POST: Submit a new slang term (pending verification)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export const config = {
  maxDuration: 10,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Database not configured');
  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return handleGet(req, res);
    }
    if (req.method === 'POST') {
      return handlePost(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[SlangLookup] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}

/**
 * GET: Look up slang terms
 */
async function handleGet(req: VercelRequest, res: VercelResponse) {
  const lang = req.query.lang as string | undefined;
  const query = req.query.q as string | undefined;
  const category = req.query.category as string | undefined;

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
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ entries: data || [], count: data?.length || 0 });
}

/**
 * POST: Submit a new slang term
 */
async function handlePost(req: VercelRequest, res: VercelResponse) {
  const { term, lang, meaning, category, equivalent, examples, addedBy } = req.body as {
    term: string;
    lang: string;
    meaning: string;
    category: 'slang' | 'trend' | 'culture' | 'abbreviation';
    equivalent?: Record<string, string>;
    examples?: string[];
    addedBy?: string;
  };

  if (!term || !lang || !meaning || !category) {
    return res.status(400).json({ error: 'term, lang, meaning, and category are required' });
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
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ status: 'submitted', term, lang, verified: false });
}
