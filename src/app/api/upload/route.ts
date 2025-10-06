import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image', 'audio', or 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || !['image', 'audio', 'video'].includes(type)) {
      return NextResponse.json({ error: 'Invalid file type specified' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB` }, { status: 400 });
    }

    // Validate file MIME type
    let allowedTypes: string[] = [];
    let bucketName = '';
    
    if (type === 'image') {
      allowedTypes = ALLOWED_IMAGE_TYPES;
      bucketName = 'media-images';
    } else if (type === 'audio') {
      allowedTypes = ALLOWED_AUDIO_TYPES;
      bucketName = 'media-audio';
    } else if (type === 'video') {
      allowedTypes = ALLOWED_VIDEO_TYPES;
      bucketName = 'media-videos';
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      bucket: bucketName,
      type: file.type,
      size: file.size,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: `Upload failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    const bucket = searchParams.get('bucket');

    if (!path || !bucket) {
      return NextResponse.json({ error: 'Missing path or bucket parameter' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not available' }, { status: 500 });
    }

    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      console.error('Supabase storage delete error:', error);
      return NextResponse.json({ error: `Delete failed: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: `Delete failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
