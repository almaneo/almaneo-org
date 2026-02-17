/**
 * Create Meetup Channel API
 *
 * POST /api/create-meetup-channel
 * Request: { meetupId, hostUserId, meetupTitle, meetupDate?, meetupLocation?, meetupDescription? }
 * Response: { success, channelId }
 *
 * Creates a Stream Chat channel for a meetup and adds the host as the first member.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isStreamConfigured, createMeetupChannel } from '../lib/stream-client.js';

export const config = {
  maxDuration: 10,
};

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isStreamConfigured()) {
    return res.status(503).json({ error: 'Stream Chat not configured' });
  }

  try {
    const {
      meetupId,
      hostUserId,
      meetupTitle,
      meetupDate,
      meetupLocation,
      meetupDescription,
    } = req.body as {
      meetupId: string;
      hostUserId: string;
      meetupTitle: string;
      meetupDate?: string;
      meetupLocation?: string;
      meetupDescription?: string;
    };

    if (!meetupId || !hostUserId || !meetupTitle) {
      return res.status(400).json({ error: 'meetupId, hostUserId, and meetupTitle are required' });
    }

    const result = await createMeetupChannel(
      meetupId,
      hostUserId,
      meetupTitle,
      meetupDate,
      meetupLocation,
      meetupDescription,
    );

    return res.status(200).json({
      success: true,
      channelId: result.channelId,
    });
  } catch (error) {
    console.error('[CreateMeetupChannel] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
