/**
 * Stream Chat Server Client
 *
 * Server-side SDK for:
 * - Generating user tokens
 * - Creating/managing channels
 * - Updating message metadata (translations)
 *
 * Requires STREAM_API_KEY and STREAM_API_SECRET env vars.
 */

import { StreamChat } from 'stream-chat';

let client: StreamChat | null = null;

/**
 * Get the Stream Chat server client (singleton)
 */
export function getStreamClient(): StreamChat {
  if (!client) {
    const apiKey = process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('STREAM_API_KEY and STREAM_API_SECRET are required');
    }

    client = StreamChat.getInstance(apiKey, apiSecret);
  }
  return client;
}

/**
 * Check if Stream Chat is configured
 */
export function isStreamConfigured(): boolean {
  return !!(process.env.STREAM_API_KEY && process.env.STREAM_API_SECRET);
}

/**
 * Generate a user token for Stream Chat
 */
export function generateUserToken(userId: string): string {
  const sc = getStreamClient();
  return sc.createToken(userId);
}

/**
 * Upsert a user in Stream Chat
 */
export async function upsertStreamUser(user: {
  id: string;
  name?: string;
  image?: string;
  preferred_language?: string;
  wallet_address?: string;
  kindness_score?: number;
  ambassador_tier?: string;
}): Promise<void> {
  const sc = getStreamClient();
  await sc.upsertUser({
    id: user.id,
    name: user.name || user.id,
    image: user.image,
    preferred_language: user.preferred_language || 'en',
    wallet_address: user.wallet_address,
    kindness_score: user.kindness_score || 0,
    ambassador_tier: user.ambassador_tier || 'none',
  });
}

/**
 * Update message metadata with translations
 */
export async function updateMessageTranslations(
  messageId: string,
  originalLang: string,
  translations: Record<string, string>,
  modelUsed: string,
  slangDetected: boolean,
): Promise<void> {
  const sc = getStreamClient();
  await sc.updateMessage({
    id: messageId,
    set: {
      original_lang: originalLang,
      translations,
      translation_status: 'completed',
      translation_model: modelUsed,
      slang_detected: slangDetected,
    },
  });
}

/**
 * Get the active languages in a channel
 * (from members' preferred_language)
 */
export async function getChannelActiveLanguages(
  channelId: string,
  channelType: string = 'messaging',
): Promise<string[]> {
  const sc = getStreamClient();
  const channel = sc.channel(channelType, channelId);
  const response = await channel.query({ members: { limit: 100 } });

  const languages = new Set<string>();
  for (const member of response.members || []) {
    const lang =
      (member.user?.preferred_language as string) ||
      (member.user as Record<string, unknown>)?.preferred_language as string ||
      'en';
    languages.add(lang);
  }

  return Array.from(languages);
}

/**
 * Create a meetup channel
 */
export async function createMeetupChannel(
  meetupId: string,
  hostUserId: string,
  meetupTitle: string,
): Promise<{ channelId: string }> {
  const sc = getStreamClient();
  const channelId = `meetup-${meetupId}`;
  const channel = sc.channel('messaging', channelId, {
    name: meetupTitle,
    created_by_id: hostUserId,
    meetup_id: meetupId,
    channel_type: 'meetup',
  });

  await channel.create();
  return { channelId };
}
