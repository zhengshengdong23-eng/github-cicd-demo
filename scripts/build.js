import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
const source = new URL('../src/', import.meta.url);
const sha = process.env.GITHUB_SHA?.slice(0, 7) || 'local';
if (!/^(local|[a-f0-9]{7})$/.test(sha)) throw new Error('Invalid build SHA');
const builtAt = new Date().toISOString();

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Only these public assets enter the deployment artifact.
for (const file of ['app.js', 'converter.js', 'style.css']) {
  await cp(new URL(file, source), new URL(file, output));
}
const html = (await readFile(new URL('index.html', source), 'utf8'))
  .replace('__BUILD_SHA__', sha)
  .replace('__BUILD_TIME__', builtAt);
await writeFile(new URL('index.html', output), html);
await writeFile(new URL('.nojekyll', output), '');
await writeFile(new URL('version.json', output), JSON.stringify({ sha, builtAt }) + '\n');
console.log(`Built dist/ (${sha})`);
