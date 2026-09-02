'use client';

import { useEffect, useState } from 'react';

const actionsUrl = 'https://github.com/Nesbitt-bot/resume/actions';
const latestCommitUrl = 'https://api.github.com/repos/Nesbitt-bot/resume/commits/main';

export function DeploymentAlert({ deployedVersion }: { deployedVersion?: string }) {
  const [updatePending, setUpdatePending] = useState(false);

  useEffect(() => {
    if (!deployedVersion || deployedVersion === 'development') return;
    const controller = new AbortController();
    fetch(latestCommitUrl, { cache: 'no-store', signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('commit lookup failed')))
      .then((commit: { sha?: string }) => setUpdatePending(Boolean(commit.sha && commit.sha !== deployedVersion)))
      .catch(() => setUpdatePending(false));
    return () => controller.abort();
  }, [deployedVersion]);

  if (!updatePending) return null;
  return <a className="deployment-alert" href={actionsUrl} target="_blank" rel="noreferrer">A new version is on the way — follow the deployment</a>;
}
