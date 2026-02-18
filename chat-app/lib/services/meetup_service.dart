import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:supabase_flutter/supabase_flutter.dart';
import '../config/env.dart';

class MeetupService {
  static final _supabase = Supabase.instance.client;

  /// Ensure user exists in the users table (required for foreign key constraints)
  static Future<void> _ensureUserExists(String userId) async {
    try {
      final existing = await _supabase
          .from('users')
          .select('wallet_address')
          .eq('wallet_address', userId)
          .maybeSingle();
      if (existing == null) {
        await _supabase.from('users').insert({
          'wallet_address': userId,
          'nickname': userId,
          'kindness_score': 0,
          'total_points': 0,
          'level': 1,
        });
        debugPrint('[MeetupService] Created user record for: $userId');
      }
    } catch (e) {
      debugPrint('[MeetupService] _ensureUserExists error: $e');
    }
  }

  // ---------------------------------------------------------------------------
  // Stream Chat Channel Helpers
  // ---------------------------------------------------------------------------

  /// Create a Stream Chat channel for a meetup
  static Future<String?> _createMeetupChannel({
    required String meetupId,
    required String hostUserId,
    required String meetupTitle,
    String? meetupDate,
    String? meetupLocation,
    String? meetupDescription,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/create-meetup-channel'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'meetupId': meetupId,
          'hostUserId': hostUserId,
          'meetupTitle': meetupTitle,
          if (meetupDate != null) 'meetupDate': meetupDate,
          if (meetupLocation != null) 'meetupLocation': meetupLocation,
          if (meetupDescription != null) 'meetupDescription': meetupDescription,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return data['channelId'] as String?;
      }
      debugPrint('[MeetupService] _createMeetupChannel server error: ${response.statusCode} ${response.body}');
      return null;
    } catch (e) {
      debugPrint('[MeetupService] _createMeetupChannel error: $e');
      return null;
    }
  }

  /// Add a user to the meetup's Stream Chat channel
  static Future<bool> _addUserToChannel(String channelId, String userId) async {
    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/join-channel'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'channelId': channelId,
          'channelType': 'messaging',
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('[MeetupService] _addUserToChannel error: $e');
      return false;
    }
  }

  /// Ensure a user is a member of the meetup's Stream Chat channel.
  /// Idempotent — safe to call even if already a member.
  static Future<bool> ensureChannelMember(String channelId, String userId) {
    return _addUserToChannel(channelId, userId);
  }

  /// Remove a user from the meetup's Stream Chat channel
  static Future<bool> _removeUserFromChannel(String channelId, String userId) async {
    try {
      final response = await http.post(
        Uri.parse('${Env.chatApiUrl}/api/leave-channel'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'userId': userId,
          'channelId': channelId,
          'channelType': 'messaging',
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      debugPrint('[MeetupService] _removeUserFromChannel error: $e');
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Meetup CRUD
  // ---------------------------------------------------------------------------

  /// Get upcoming and in-progress meetups
  static Future<List<Map<String, dynamic>>> getUpcomingMeetups({int limit = 20}) async {
    final response = await _supabase
        .from('meetups')
        .select()
        .inFilter('status', ['upcoming', 'in_progress'])
        .order('meeting_date', ascending: true)
        .limit(limit);
    return List<Map<String, dynamic>>.from(response);
  }

  /// Get all meetups (with optional status filter)
  static Future<List<Map<String, dynamic>>> getMeetups({
    String? status,
    int limit = 20,
    int offset = 0,
  }) async {
    var query = _supabase.from('meetups').select();
    if (status != null) {
      query = query.eq('status', status);
    }
    final response = await query
        .order('meeting_date', ascending: false)
        .range(offset, offset + limit - 1);
    return List<Map<String, dynamic>>.from(response);
  }

  /// Get meetup by ID with participant count
  static Future<Map<String, dynamic>?> getMeetupById(String meetupId) async {
    final response = await _supabase
        .from('meetups')
        .select()
        .eq('id', meetupId)
        .maybeSingle();
    if (response == null) return null;

    // Get participant count
    final participants = await _supabase
        .from('meetup_participants')
        .select('user_address')
        .eq('meetup_id', meetupId);
    response['participant_count'] = (participants as List).length;
    return response;
  }

  /// Get participant count for a meetup
  static Future<int> getParticipantCount(String meetupId) async {
    final response = await _supabase
        .from('meetup_participants')
        .select('user_address')
        .eq('meetup_id', meetupId);
    return (response as List).length;
  }

  /// Check if user is a participant
  static Future<bool> isParticipant(String meetupId, String userAddress) async {
    final response = await _supabase
        .from('meetup_participants')
        .select('user_address')
        .eq('meetup_id', meetupId)
        .eq('user_address', userAddress)
        .maybeSingle();
    return response != null;
  }

  /// Join a meetup (DB + Stream Chat channel)
  static Future<bool> joinMeetup(String meetupId, String userAddress) async {
    try {
      // Ensure user exists in users table (foreign key constraint)
      await _ensureUserExists(userAddress);

      await _supabase.from('meetup_participants').insert({
        'meetup_id': meetupId,
        'user_address': userAddress,
        'attended': false,
        'points_earned': 0,
      });

      // Add user to the meetup's chat channel (best-effort)
      final meetup = await getMeetupById(meetupId);
      final channelId = meetup?['channel_id'] as String?;
      if (channelId != null && channelId.isNotEmpty) {
        await _addUserToChannel(channelId, userAddress);
      }

      return true;
    } catch (e) {
      debugPrint('[MeetupService] joinMeetup error: $e');
      return false;
    }
  }

  /// Leave a meetup (DB + Stream Chat channel)
  static Future<bool> leaveMeetup(String meetupId, String userAddress) async {
    try {
      await _supabase
          .from('meetup_participants')
          .delete()
          .eq('meetup_id', meetupId)
          .eq('user_address', userAddress);

      // Remove user from the meetup's chat channel (best-effort)
      final meetup = await getMeetupById(meetupId);
      final channelId = meetup?['channel_id'] as String?;
      if (channelId != null && channelId.isNotEmpty) {
        await _removeUserFromChannel(channelId, userAddress);
      }

      return true;
    } catch (e) {
      debugPrint('[MeetupService] leaveMeetup error: $e');
      return false;
    }
  }

  /// Create a new meetup (DB + Stream Chat channel)
  static Future<Map<String, dynamic>?> createMeetup({
    required String title,
    String? description,
    required String hostAddress,
    required String location,
    required DateTime meetingDate,
    int maxParticipants = 20,
  }) async {
    try {
      // Ensure host exists in users table (foreign key constraint)
      await _ensureUserExists(hostAddress);

      final response = await _supabase.from('meetups').insert({
        'title': title,
        'description': description,
        'host_address': hostAddress,
        'location': location,
        'meeting_date': meetingDate.toIso8601String(),
        'max_participants': maxParticipants,
        'status': 'upcoming',
      }).select().single();

      final meetupId = response['id'] as String;
      debugPrint('[MeetupService] Created meetup: $meetupId');

      // Create a Stream Chat channel for this meetup
      final channelId = await _createMeetupChannel(
        meetupId: meetupId,
        hostUserId: hostAddress,
        meetupTitle: title,
        meetupDate: meetingDate.toIso8601String(),
        meetupLocation: location,
        meetupDescription: description,
      );

      if (channelId != null) {
        // Save the channel_id back to the meetup record
        await _supabase.from('meetups').update({
          'channel_id': channelId,
        }).eq('id', meetupId);
        response['channel_id'] = channelId;
        debugPrint('[MeetupService] Created chat channel: $channelId for meetup: $meetupId');
      }

      // Auto-join the host as participant
      await _ensureUserExists(hostAddress);
      try {
        await _supabase.from('meetup_participants').insert({
          'meetup_id': meetupId,
          'user_address': hostAddress,
          'attended': false,
          'points_earned': 0,
        });
      } catch (e) {
        debugPrint('[MeetupService] Host auto-join error (may already exist): $e');
      }

      return response;
    } catch (e) {
      debugPrint('[MeetupService] createMeetup error: $e');
      return null;
    }
  }

  /// Get meetups hosted by a user
  static Future<List<Map<String, dynamic>>> getMyHostedMeetups(String hostAddress) async {
    final response = await _supabase
        .from('meetups')
        .select()
        .eq('host_address', hostAddress)
        .order('meeting_date', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  /// Get meetups a user has joined
  static Future<List<Map<String, dynamic>>> getMyJoinedMeetups(String userAddress) async {
    final participations = await _supabase
        .from('meetup_participants')
        .select('meetup_id')
        .eq('user_address', userAddress);

    final meetupIds = (participations as List)
        .map((p) => p['meetup_id'] as String)
        .toList();

    if (meetupIds.isEmpty) return [];

    final response = await _supabase
        .from('meetups')
        .select()
        .inFilter('id', meetupIds)
        .order('meeting_date', ascending: false);
    return List<Map<String, dynamic>>.from(response);
  }

  // ---------------------------------------------------------------------------
  // Meetup Update / Cancel / Delete
  // ---------------------------------------------------------------------------

  /// Update meetup details (host only, before start)
  static Future<bool> updateMeetup({
    required String meetupId,
    String? title,
    String? description,
    String? location,
    DateTime? meetingDate,
    int? maxParticipants,
  }) async {
    try {
      final updates = <String, dynamic>{};
      if (title != null) updates['title'] = title;
      if (description != null) updates['description'] = description;
      if (location != null) updates['location'] = location;
      if (meetingDate != null) updates['meeting_date'] = meetingDate.toIso8601String();
      if (maxParticipants != null) updates['max_participants'] = maxParticipants;
      if (updates.isEmpty) return true;

      await _supabase.from('meetups').update(updates).eq('id', meetupId);
      return true;
    } catch (e) {
      debugPrint('[MeetupService] updateMeetup error: $e');
      return false;
    }
  }

  /// Cancel a meetup: any pre-completed status → cancelled
  static Future<bool> cancelMeetup(String meetupId) async {
    try {
      await _supabase.from('meetups').update({
        'status': 'cancelled',
      }).eq('id', meetupId);
      return true;
    } catch (e) {
      debugPrint('[MeetupService] cancelMeetup error: $e');
      return false;
    }
  }

  /// Delete a meetup and clean up associated Stream Chat channel
  static Future<bool> deleteMeetup(String meetupId) async {
    try {
      // Get channel_id before deleting (for Stream cleanup)
      final meetup = await getMeetupById(meetupId);
      final channelId = meetup?['channel_id'] as String?;

      // DB delete (CASCADE will remove participants & recordings)
      await _supabase.from('meetups').delete().eq('id', meetupId);

      // Clean up Stream Chat channel (best-effort)
      if (channelId != null && channelId.isNotEmpty) {
        try {
          final response = await http.post(
            Uri.parse('${Env.chatApiUrl}/api/delete-channel'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'channelId': channelId,
              'channelType': 'messaging',
            }),
          );
          debugPrint('[MeetupService] Delete channel result: ${response.statusCode}');
        } catch (e) {
          debugPrint('[MeetupService] Delete channel error (non-fatal): $e');
        }
      }

      return true;
    } catch (e) {
      debugPrint('[MeetupService] deleteMeetup error: $e');
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Participant Details
  // ---------------------------------------------------------------------------

  /// Get participant list with display names from users table
  static Future<List<Map<String, dynamic>>> getParticipantDetails(String meetupId) async {
    try {
      final participants = await _supabase
          .from('meetup_participants')
          .select('user_address, joined_at')
          .eq('meetup_id', meetupId)
          .order('joined_at', ascending: true);

      final list = List<Map<String, dynamic>>.from(participants);
      if (list.isEmpty) return list;

      // Batch-fetch user info (nickname) and chat_profiles (avatar)
      final addresses = list.map((p) => p['user_address'] as String).toList();

      final users = await _supabase
          .from('users')
          .select('wallet_address, nickname')
          .inFilter('wallet_address', addresses);
      final userMap = <String, String>{};
      for (final u in users) {
        userMap[u['wallet_address'] as String] = u['nickname'] as String? ?? '';
      }

      final profiles = await _supabase
          .from('chat_profiles')
          .select('user_id, profile_image_url')
          .inFilter('user_id', addresses);
      final avatarMap = <String, String>{};
      for (final p in profiles) {
        final url = p['profile_image_url'] as String?;
        if (url != null && url.isNotEmpty) {
          avatarMap[p['user_id'] as String] = url;
        }
      }

      // Merge
      for (final p in list) {
        final addr = p['user_address'] as String;
        p['nickname'] = userMap[addr] ?? addr;
        p['avatar_url'] = avatarMap[addr];
      }

      return list;
    } catch (e) {
      debugPrint('[MeetupService] getParticipantDetails error: $e');
      return [];
    }
  }

  /// Remove a participant from a meetup (host action)
  static Future<bool> removeParticipant(String meetupId, String userAddress) async {
    try {
      await _supabase
          .from('meetup_participants')
          .delete()
          .eq('meetup_id', meetupId)
          .eq('user_address', userAddress);

      // Remove from Stream Chat channel (best-effort)
      final meetup = await getMeetupById(meetupId);
      final channelId = meetup?['channel_id'] as String?;
      if (channelId != null && channelId.isNotEmpty) {
        await _removeUserFromChannel(channelId, userAddress);
      }

      return true;
    } catch (e) {
      debugPrint('[MeetupService] removeParticipant error: $e');
      return false;
    }
  }

  /// Get user display name (nickname or truncated address)
  static Future<String> getUserDisplayName(String userAddress) async {
    try {
      final user = await _supabase
          .from('users')
          .select('nickname')
          .eq('wallet_address', userAddress)
          .maybeSingle();
      final nickname = user?['nickname'] as String?;
      if (nickname != null && nickname.isNotEmpty && nickname != userAddress) {
        return nickname;
      }
    } catch (e) {
      debugPrint('[MeetupService] getUserDisplayName error: $e');
    }
    // Fallback: truncated address
    if (userAddress.length > 12) {
      return '${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}';
    }
    return userAddress;
  }

  // ---------------------------------------------------------------------------
  // Meetup Lifecycle (V0.3 Phase 3)
  // upcoming → in_progress → ended → completed (or cancelled)
  // ---------------------------------------------------------------------------

  /// Start a meetup: upcoming → in_progress
  static Future<bool> startMeetup(String meetupId) async {
    try {
      await _supabase.from('meetups').update({
        'status': 'in_progress',
        'started_at': DateTime.now().toIso8601String(),
      }).eq('id', meetupId);
      return true;
    } catch (e) {
      debugPrint('[MeetupService] startMeetup error: $e');
      return false;
    }
  }

  /// End a meetup: in_progress → ended
  static Future<bool> endMeetup(String meetupId) async {
    try {
      await _supabase.from('meetups').update({
        'status': 'ended',
        'ended_at': DateTime.now().toIso8601String(),
      }).eq('id', meetupId);
      return true;
    } catch (e) {
      debugPrint('[MeetupService] endMeetup error: $e');
      return false;
    }
  }

  /// Complete a meetup: ended → completed
  static Future<bool> completeMeetup(String meetupId) async {
    try {
      await _supabase.from('meetups').update({
        'status': 'completed',
      }).eq('id', meetupId);
      return true;
    } catch (e) {
      debugPrint('[MeetupService] completeMeetup error: $e');
      return false;
    }
  }
}
