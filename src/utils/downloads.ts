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
  const b64_data = res.content;
  const decoded = Uint16Array.from(atob(b64_data), (s) => s.charCodeAt(0));
  return decoded;
}
