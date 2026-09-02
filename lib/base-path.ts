const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ?? (process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}` : '');

export function withBasePath(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${basePath}${path}`;
}
