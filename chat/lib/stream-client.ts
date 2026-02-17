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
 * Token expires in 24 hours — the client's tokenProvider will auto-refresh
 */
export function generateUserToken(userId: string): string {
  const sc = getStreamClient();
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24h
  return sc.createToken(userId, exp);
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

  // Build user data — only include fields that are explicitly provided
  // so that undefined fields don't overwrite existing server values (e.g. profile image)
  const userData: Record<string, unknown> = {
    id: user.id,
    name: user.name || user.id,
    preferred_language: user.preferred_language || 'en',
  };

  if (user.image !== undefined) userData.image = user.image;
  if (user.wallet_address !== undefined) userData.wallet_address = user.wallet_address;
  if (user.kindness_score !== undefined) userData.kindness_score = user.kindness_score;
  if (user.ambassador_tier !== undefined) userData.ambassador_tier = user.ambassador_tier;

  await sc.upsertUser(userData as { id: string } & Record<string, unknown>);
}

/**
 * Update message metadata with translations
 * Uses partialUpdateMessage with userId for server-side auth
 */
export async function updateMessageTranslations(
  messageId: string,
  originalLang: string,
  translations: Record<string, string>,
  modelUsed: string,
  slangDetected: boolean,
  userId?: string,
): Promise<void> {
  const sc = getStreamClient();
  await sc.partialUpdateMessage(
    messageId,
    {
      set: {
        original_lang: originalLang,
        translations,
        translation_status: 'completed',
        translation_model: modelUsed,
        slang_detected: slangDetected,
      },
    },
    userId,
  );
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
 * Create a meetup channel with host as first member and meetup metadata
 */
export async function createMeetupChannel(
  meetupId: string,
  hostUserId: string,
  meetupTitle: string,
  meetupDate?: string,
  meetupLocation?: string,
  meetupDescription?: string,
): Promise<{ channelId: string }> {
  const sc = getStreamClient();
  const channelId = `meetup-${meetupId}`;

  const extraData: Record<string, unknown> = {
    name: meetupTitle,
    created_by_id: hostUserId,
    meetup_id: meetupId,
    channel_type: 'meetup',
  };

  if (meetupDate) extraData.meetup_date = meetupDate;
  if (meetupLocation) extraData.meetup_location = meetupLocation;
  if (meetupDescription) extraData.meetup_description = meetupDescription;

  const channel = sc.channel('messaging', channelId, extraData);
  await channel.create();
  await channel.addMembers([hostUserId]);

  return { channelId };
}
