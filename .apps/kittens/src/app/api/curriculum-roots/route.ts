import { NextResponse } from 'next/server';
import { getCurriculumRootsForClient } from '@/lib/curriculum-roots';

export async function GET() {
  const roots = getCurriculumRootsForClient();
  return NextResponse.json({ roots });
}
