/**
 * Appeal Service - Direct Supabase client for content correction appeals
 *
 * Replaces the old /api/appeal API routes with direct client-side calls.
 * Compatible with Next.js output: 'export' (static export).
 */

import { supabase } from './supabase';

// --- Types ---

export interface Appeal {
  id: string;
  content_type: string;
  content_id: string;
  language: string;
  field_path: string;
  current_value: string | null;
  suggested_value: string;
  reason: string;
  source_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  kindness_points_rewarded: number | null;
  game_points_rewarded: number | null;
  reviewer_note: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export interface SubmitAppealParams {
  user_address: string;
  content_type: 'region' | 'country' | 'quest';
  content_id: string;
  language?: string;
  field_path: string;
  current_value?: string;
  suggested_value: string;
  reason: string;
  source_url?: string;
}

// --- Service Functions ---

/**
 * Submit a new content correction appeal.
 * Validates input and checks for duplicate pending appeals.
 */
export async function submitAppeal(
  params: SubmitAppealParams
): Promise<{ success: boolean; appeal?: Appeal; error?: string }> {
  const {
    user_address,
    content_type,
    content_id,
    language = 'en',
    field_path,
    current_value,
    suggested_value,
    reason,
    source_url,
  } = params;

  // Validation
  if (!user_address || !content_type || !content_id || !field_path || !suggested_value || !reason) {
    return {
      success: false,
      error: 'Missing required fields: user_address, content_type, content_id, field_path, suggested_value, reason',
    };
  }

  if (!['region', 'country', 'quest'].includes(content_type)) {
    return {
      success: false,
      error: 'Invalid content_type. Must be: region, country, or quest',
    };
  }

  try {
    // Check for duplicate pending appeal
    const { data: existing } = await supabase
      .from('content_appeals')
      .select('id')
      .eq('user_address', user_address)
      .eq('content_type', content_type)
      .eq('content_id', content_id)
      .eq('field_path', field_path)
      .eq('status', 'pending')
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: 'You already have a pending appeal for this content field',
      };
    }

    // Insert appeal
    const { data, error } = await supabase
      .from('content_appeals')
      .insert({
        user_address,
        content_type,
        content_id,
        language,
        field_path,
        current_value: current_value || null,
        suggested_value,
        reason,
        source_url: source_url || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Appeal insert error:', error);
      return { success: false, error: 'Failed to submit appeal' };
    }

    return { success: true, appeal: data as Appeal };
  } catch (err) {
    console.error('Appeal submit error:', err);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Fetch user's appeal history.
 */
export async function getUserAppeals(
  userAddress: string,
  options?: { status?: string; limit?: number }
): Promise<{ appeals: Appeal[]; error?: string }> {
  const limit = options?.limit || 50;

  try {
    let query = supabase
      .from('content_appeals')
      .select('*')
      .eq('user_address', userAddress)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Appeal query error:', error);
      return { appeals: [], error: 'Failed to load appeals' };
    }

    return { appeals: (data || []) as Appeal[] };
  } catch (err) {
    console.error('Appeal fetch error:', err);
    return { appeals: [], error: 'Failed to load appeals' };
  }
}
