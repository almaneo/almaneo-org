import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'package:stream_chat_flutter/stream_chat_flutter.dart';
import '../config/theme.dart';
import '../l10n/app_strings.dart';
import '../providers/language_provider.dart';
import '../services/partner_service.dart';
import 'partner_detail_screen.dart';
import 'partner_register_screen.dart';

class PartnerListScreen extends ConsumerStatefulWidget {
  const PartnerListScreen({super.key});

  @override
  ConsumerState<PartnerListScreen> createState() => _PartnerListScreenState();
}

class _PartnerListScreenState extends ConsumerState<PartnerListScreen> {
  bool _isMapView = false;
  bool _isLoading = true;
  int? _selectedCategory;
  String _searchQuery = '';
  final _searchController = TextEditingController();

  List<Map<String, dynamic>> _categories = [];
  List<Map<String, dynamic>> _partners = [];

  Position? _currentPosition;
  GoogleMapController? _mapController;
  Timer? _searchDebounce;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController.dispose();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final categories = await PartnerService.getCategories();
      final partners = await PartnerService.getPartners(
        categoryId: _selectedCategory,
        search: _searchQuery.isNotEmpty ? _searchQuery : null,
        lat: _currentPosition?.latitude,
        lng: _currentPosition?.longitude,
      );
      // Sort: verified partners (sbt_token_id not null) first
      partners.sort((a, b) {
        final aVerified = a['sbt_token_id'] != null ? 0 : 1;
        final bVerified = b['sbt_token_id'] != null ? 0 : 1;
        return aVerified.compareTo(bVerified);
      });
      if (mounted) {
        setState(() {
          _categories = categories;
          _partners = partners;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) return;

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) return;
      }
      if (permission == LocationPermission.deniedForever) return;

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.medium),
      );
      setState(() => _currentPosition = position);

      if (_mapController != null) {
        _mapController!.animateCamera(
          CameraUpdate.newLatLngZoom(
            LatLng(position.latitude, position.longitude),
            14,
          ),
        );
      }

      _loadData();
    } catch (e) {
      debugPrint('[PartnerList] Location error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(languageProvider).languageCode;
    final alma = context.alma;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          tr('partners.title', lang),
          style: TextStyle(
            fontWeight: FontWeight.w600,
            color: alma.textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _isMapView ? Icons.list : Icons.map,
              color: alma.textSecondary,
            ),
            tooltip: _isMapView
                ? tr('partners.listView', lang)
                : tr('partners.mapView', lang),
            onPressed: () => setState(() => _isMapView = !_isMapView),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              style: TextStyle(color: alma.textPrimary),
              decoration: InputDecoration(
                hintText: tr('partners.search', lang),
                prefixIcon: Icon(Icons.search, color: alma.textTertiary),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: Icon(Icons.clear, color: alma.textTertiary),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                          _loadData();
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                setState(() => _searchQuery = value);
                _searchDebounce?.cancel();
                _searchDebounce = Timer(const Duration(milliseconds: 400), () {
                  _loadData();
                });
              },
            ),
          ),

          // Category chips
          SizedBox(
            height: 42,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: [
                _categoryChip(null, tr('partners.categories.all', lang), lang),
                ..._categories.map((cat) => _categoryChip(
                  cat['id'] as int,
                  tr('partners.categories.${cat['name']}', lang),
                  lang,
                )),
              ],
            ),
          ),

          const SizedBox(height: 8),

          // Content
          Expanded(
            child: _isMapView ? _buildMapView(lang) : _buildListView(lang),
          ),
        ],
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton.small(
            heroTag: 'location',
            onPressed: _getCurrentLocation,
            backgroundColor: AlmaTheme.electricBlue,
            child: const Icon(Icons.my_location, color: Colors.white, size: 20),
          ),
          const SizedBox(height: 10),
          FloatingActionButton.small(
            heroTag: 'register',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => PartnerRegisterScreen(
                    userId: StreamChat.of(context).currentUser?.id,
                  ),
                ),
              ).then((result) {
                if (result == true) _loadData();
              });
            },
            backgroundColor: AlmaTheme.terracottaOrange,
            child: const Icon(Icons.add_business, color: Colors.white, size: 20),
          ),
        ],
      ),
    );
  }

  Widget _categoryChip(int? id, String label, String lang) {
    final isSelected = _selectedCategory == id;
    final alma = context.alma;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: FilterChip(
        selected: isSelected,
        label: Text(
          label,
          style: TextStyle(
            fontSize: 13,
            color: isSelected ? Colors.white : alma.textSecondary,
          ),
        ),
        backgroundColor: alma.chipBg,
        selectedColor: AlmaTheme.electricBlue,
        checkmarkColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected ? AlmaTheme.electricBlue : alma.borderDefault,
          ),
        ),
        onSelected: (_) {
          setState(() => _selectedCategory = isSelected ? null : id);
          _loadData();
        },
      ),
    );
  }

  Widget _buildListView(String lang) {
    final alma = context.alma;

    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: AlmaTheme.electricBlue));
    }

    if (_partners.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.storefront_outlined, size: 64, color: alma.textTertiary),
            const SizedBox(height: 16),
            Text(
              tr('partners.noResults', lang),
              style: TextStyle(color: alma.textSecondary, fontSize: 16),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadData,
      color: AlmaTheme.electricBlue,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _partners.length,
        itemBuilder: (context, index) => _partnerCard(_partners[index], lang),
      ),
    );
  }

  Widget _partnerCard(Map<String, dynamic> partner, String lang) {
    final alma = context.alma;
    final categoryData = partner['partner_categories'] as Map<String, dynamic>?;
    final categoryName = categoryData?['name'] as String? ?? 'other';
    final distance = partner['_distance_km'] as double?;
    final coverUrl = partner['cover_image_url'] as String?;
    final currentUserId = StreamChat.of(context).currentUser?.id;
    final isMine = currentUserId != null &&
        partner['owner_user_id'] == currentUserId;

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PartnerDetailScreen(
                      partnerId: partner['id'],
                      userId: currentUserId,
                    ),
          ),
        ).then((_) => _loadData());
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: alma.cardBg,
          borderRadius: BorderRadius.circular(12),
          border: alma.cardBorder != Colors.transparent
              ? Border.all(color: alma.cardBorder)
              : Border.all(color: Colors.white.withValues(alpha: 0.1)),
          boxShadow: alma.cardShadow,
        ),
        child: Row(
          children: [
            // Cover image / icon
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: alma.chipBg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: coverUrl != null
                  ? ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.network(
                        coverUrl,
                        width: 56,
                        height: 56,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) =>
                            Icon(Icons.storefront, color: alma.textTertiary),
                      ),
                    )
                  : Icon(Icons.storefront, color: alma.textTertiary),
            ),
            const SizedBox(width: 12),

            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          partner['business_name'] ?? '',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 15,
                            color: alma.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (partner['sbt_token_id'] != null)
                        Padding(
                          padding: const EdgeInsets.only(left: 4),
                          child: Icon(Icons.verified, size: 16, color: AlmaTheme.electricBlue),
                        ),
                      if (isMine)
                        Container(
                          margin: const EdgeInsets.only(left: 6),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                          decoration: BoxDecoration(
                            color: AlmaTheme.terracottaOrange.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            tr('partners.myBadge', lang),
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: AlmaTheme.terracottaOrange,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AlmaTheme.electricBlue.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          tr('partners.categories.$categoryName', lang),
                          style: const TextStyle(
                            fontSize: 11,
                            color: AlmaTheme.electricBlue,
                          ),
                        ),
                      ),
                      if (distance != null) ...[
                        const SizedBox(width: 8),
                        Icon(Icons.location_on, size: 14, color: alma.textTertiary),
                        const SizedBox(width: 2),
                        Text(
                          PartnerService.formatDistance(distance),
                          style: TextStyle(
                            fontSize: 12,
                            color: alma.textTertiary,
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (partner['address'] != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      partner['address'],
                      style: TextStyle(
                        fontSize: 12,
                        color: alma.textTertiary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),

            // Arrow
            Icon(Icons.chevron_right, color: alma.textTertiary),
          ],
        ),
      ),
    );
  }

  Widget _buildMapView(String lang) {
    final alma = context.alma;

    if (_isLoading && _partners.isEmpty) {
      return const Center(child: CircularProgressIndicator(color: AlmaTheme.electricBlue));
    }

    final markers = _partners
        .where((p) => p['latitude'] != null && p['longitude'] != null)
        .map((p) => Marker(
              markerId: MarkerId(p['id']),
              position: LatLng(
                (p['latitude'] as num).toDouble(),
                (p['longitude'] as num).toDouble(),
              ),
              infoWindow: InfoWindow(
                title: p['business_name'],
                snippet: p['address'],
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PartnerDetailScreen(
                        partnerId: p['id'],
                        userId: StreamChat.of(context).currentUser?.id,
                      ),
                    ),
                  ).then((_) => _loadData());
                },
              ),
            ))
        .toSet();

    final initialTarget = _currentPosition != null
        ? LatLng(_currentPosition!.latitude, _currentPosition!.longitude)
        : const LatLng(37.5665, 126.9780); // Seoul default

    return GoogleMap(
      initialCameraPosition: CameraPosition(
        target: initialTarget,
        zoom: 12,
      ),
      markers: markers,
      myLocationEnabled: _currentPosition != null,
      myLocationButtonEnabled: false,
      mapToolbarEnabled: false,
      zoomControlsEnabled: false,
      onMapCreated: (controller) => _mapController = controller,
      style: Theme.of(context).brightness == Brightness.dark
          ? _darkMapStyle
          : null,
    );
  }

  // Dark map style
  static const _darkMapStyle = '''[
    {"elementType": "geometry", "stylers": [{"color": "#1d2c4d"}]},
    {"elementType": "labels.text.fill", "stylers": [{"color": "#8ec3b9"}]},
    {"elementType": "labels.text.stroke", "stylers": [{"color": "#1a3646"}]},
    {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#0e1626"}]},
    {"featureType": "road", "elementType": "geometry", "stylers": [{"color": "#304a7d"}]},
    {"featureType": "road", "elementType": "geometry.stroke", "stylers": [{"color": "#255b89"}]}
  ]''';
}
