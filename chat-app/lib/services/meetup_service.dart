import 'package:supabase_flutter/supabase_flutter.dart';

class MeetupService {
  static final _supabase = Supabase.instance.client;

  /// Get upcoming meetups
  static Future<List<Map<String, dynamic>>> getUpcomingMeetups({int limit = 20}) async {
    final response = await _supabase
        .from('meetups')
        .select()
        .eq('status', 'upcoming')
        .gte('meeting_date', DateTime.now().toIso8601String())
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

  /// Join a meetup
  static Future<bool> joinMeetup(String meetupId, String userAddress) async {
    try {
      await _supabase.from('meetup_participants').insert({
        'meetup_id': meetupId,
        'user_address': userAddress,
        'attended': false,
        'points_earned': 0,
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Leave a meetup
  static Future<bool> leaveMeetup(String meetupId, String userAddress) async {
    try {
      await _supabase
          .from('meetup_participants')
          .delete()
          .eq('meetup_id', meetupId)
          .eq('user_address', userAddress);
      return true;
    } catch (_) {
      return false;
    }
  }

  /// Create a new meetup
  static Future<Map<String, dynamic>?> createMeetup({
    required String title,
    String? description,
    required String hostAddress,
    required String location,
    required DateTime meetingDate,
    int maxParticipants = 20,
  }) async {
    try {
      final response = await _supabase.from('meetups').insert({
        'title': title,
        'description': description,
        'host_address': hostAddress,
        'location': location,
        'meeting_date': meetingDate.toIso8601String(),
        'max_participants': maxParticipants,
        'status': 'upcoming',
      }).select().single();
      return response;
    } catch (_) {
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
}
