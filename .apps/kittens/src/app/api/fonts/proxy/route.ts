import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Helper to get allowed paths from config
function getAllowedPaths(): Set<string> {
  try {
    const configPath = path.join(process.cwd(), 'local-fonts.yml');
    if (!fs.existsSync(configPath)) return new Set();
    
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const data = yaml.load(fileContents) as any;
    const paths = new Set<string>();

    const extractPaths = (fonts: any[]) => {
      if (!fonts) return;
      fonts.forEach(font => {
        if (font.fontFaces) {
          font.fontFaces.forEach((face: any) => {
            if (face.sources) {
              face.sources.forEach((src: string) => paths.add(src));
            }
          });
        }
      });
    };

    extractPaths(data.mainFonts);
    extractPaths(data.titleFonts);
    return paths;
  } catch (e) {
    console.error('Error reading font config:', e);
    return new Set();
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get('file');

  if (!filePath) {
    return new NextResponse('Missing file parameter', { status: 400 });
  }

  // Security check: Ensure the requested file is in our allowlist
  const allowedPaths = getAllowedPaths();
  if (!allowedPaths.has(filePath)) {
    return new NextResponse('Forbidden: Font not in configuration', { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Font file not found', { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type manually
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.ttf') contentType = 'font/ttf';
    if (ext === '.otf') contentType = 'font/otf';
    if (ext === '.woff') contentType = 'font/woff';
    if (ext === '.woff2') contentType = 'font/woff2';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('Error serving font:', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
