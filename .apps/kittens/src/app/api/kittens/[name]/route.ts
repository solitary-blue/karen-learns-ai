import { NextResponse } from 'next/server';
import fs from 'fs';
import { resolveKitten } from '@/lib/kitten-config';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;

  if (!/^[a-z0-9-]+$/.test(name)) {
    return new NextResponse('Invalid kitten name format', { status: 400 });
  }

  const kitten = resolveKitten(name);
  if (!kitten) {
    return new NextResponse('Kitten not found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(kitten.filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error reading kitten file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
