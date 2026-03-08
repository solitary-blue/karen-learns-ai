import { redirect } from 'next/navigation';
import LessonLoader from '@/components/LessonLoader';
import { resolveRootFromPath, getCurriculumRootsForClient, getDefaultRootId } from '@/lib/curriculum-roots';

interface PageProps {
  params: Promise<{ rootKey?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { rootKey } = await params;
  const pathSegment = rootKey?.[0] || '';
  
  const root = resolveRootFromPath(pathSegment);
  
  if (!root) {
    const defaultRoot = resolveRootFromPath('');
    if (defaultRoot && pathSegment) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-destructive mb-4">Curriculum Not Found</h1>
            <p className="text-foreground/60">Unknown curriculum root: {pathSegment}</p>
          </div>
        </div>
      );
    }
  }

  const rootId = root?.id || getDefaultRootId();
  const curriculumRoots = getCurriculumRootsForClient();

  return <LessonLoader rootId={rootId} curriculumRoots={curriculumRoots} />;
}

export function generateStaticParams() {
  const roots = getCurriculumRootsForClient();
  const params: { rootKey: string[] }[] = [];
  
  for (const root of roots) {
    for (const segment of root.pathSegments) {
      if (segment === '') {
        params.push({ rootKey: [] });
      } else {
        params.push({ rootKey: [segment] });
      }
    }
  }
  
  return params;
}
