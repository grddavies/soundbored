import { Base64Binary } from './Base64Binary';

export async function getGitHubFile(owner: string, repo: string, path: string) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
  )
    .then((d) => d.json())
    .then((d) =>
      fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs/${d.sha}`),
    )
    .then((d) => d.json())
    .catch((e) => console.error(e));
  return res;
}

export async function getDirtSample(path: string) {
  const owner = 'tidalcycles';
  const repo = 'Dirt-Samples';
  const res = await getGitHubFile(owner, repo, path);
  const decoded = Base64Binary.decodeArrayBuffer(res.content);
  return new Blob([decoded], { type: 'audio/wav' });
}
