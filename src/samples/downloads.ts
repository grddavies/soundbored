/**
 * Gets a base64 encoded file from a GitHub Repo
 * @param owner - Repo owner name
 * @param repo - Repo name
 * @param path - Path to file
 *
 * @returns b64 encoded string
 */
export async function getGitHubFile(
  owner: string,
  repo: string,
  path: string,
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        'Content-Type': 'application/vnd.github.raw',
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Error fetching file:'${path}'\n${await res.text()}`);
  }
  const resJson = await res.json();
  return resJson.content;
}
