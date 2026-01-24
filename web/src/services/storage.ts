/**
 * Storage Service
 * Supabase Storage를 사용한 이미지 업로드/관리
 */

import { supabase } from '../supabase';

const MEETUP_PHOTOS_BUCKET = 'meetup-photos';

/**
 * 밋업 사진 Storage 업로드 (저수준 유틸리티)
 * @param file 업로드할 파일
 * @param meetupId 밋업 ID
 * @returns 업로드된 파일의 공개 URL
 */
export async function uploadPhotoToStorage(
  file: File,
  meetupId: string
): Promise<string> {
  // 파일 확장자 추출
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  // 고유 파일명 생성 (meetupId_timestamp.ext)
  const fileName = `${meetupId}/${Date.now()}.${ext}`;

  // 파일 업로드
  const { data, error } = await supabase.storage
    .from(MEETUP_PHOTOS_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`이미지 업로드 실패: ${error.message}`);
  }

  // 공개 URL 가져오기
  const { data: urlData } = supabase.storage
    .from(MEETUP_PHOTOS_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * 밋업 사진 삭제
 * @param photoUrl 삭제할 사진 URL
 */
export async function deleteMeetupPhoto(photoUrl: string): Promise<void> {
  // URL에서 파일 경로 추출
  const urlParts = photoUrl.split(`${MEETUP_PHOTOS_BUCKET}/`);
  if (urlParts.length < 2) {
    throw new Error('잘못된 사진 URL입니다.');
  }

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from(MEETUP_PHOTOS_BUCKET)
    .remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`이미지 삭제 실패: ${error.message}`);
  }
}

/**
 * 밋업의 모든 사진 목록 가져오기
 * @param meetupId 밋업 ID
 * @returns 사진 URL 배열
 */
export async function getMeetupPhotos(meetupId: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(MEETUP_PHOTOS_BUCKET)
    .list(meetupId, {
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('List error:', error);
    throw new Error(`사진 목록 조회 실패: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // 공개 URL로 변환
  return data.map((file) => {
    const { data: urlData } = supabase.storage
      .from(MEETUP_PHOTOS_BUCKET)
      .getPublicUrl(`${meetupId}/${file.name}`);
    return urlData.publicUrl;
  });
}

/**
 * 이미지 파일 유효성 검사
 * @param file 검사할 파일
 * @returns 유효성 검사 결과
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: '파일 크기가 5MB를 초과합니다.',
    };
  }

  return { valid: true };
}

/**
 * 이미지 미리보기 URL 생성
 * @param file 파일 객체
 * @returns Blob URL
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 미리보기 URL 해제 (메모리 누수 방지)
 * @param url Blob URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
