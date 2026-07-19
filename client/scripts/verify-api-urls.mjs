import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const clientRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requestChecks = [
  ['app/api/complaints/route.ts', "const backendUrl = apiUrl('/complaints')", 'fetch(backendUrl'],
  ['app/dashboard/page.tsx', "fetch(apiUrl('/complaints/dashboard')"],
  ['app/heatmap/page.tsx', "fetch(apiUrl('/safety/heatmap')"],
  ['app/route-recommendation/page.tsx', "fetch(apiUrl('/complaints/route-recommendation')"],
  ['app/tracking/page.tsx', "fetch(apiUrl('/complaints')"],
  ['hooks/useComplaintForm.ts', "fetch(apiUrl('/complaints')"],
];
const sourceDirectories = ['app', 'components', 'hooks', 'lib', 'utils'];
const forbiddenPatterns = [
  { pattern: /\baxios\b/, description: 'Axios request' },
  { pattern: /\bXMLHttpRequest\b/, description: 'XMLHttpRequest request' },
  { pattern: /https?:\/\//, description: 'hardcoded URL' },
  { pattern: /process\.env\.NEXT_PUBLIC_API_URL\s*\|\|/, description: 'API URL fallback' },
];

function getSourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? getSourceFiles(entryPath)
      : /\.(?:ts|tsx|js|jsx)$/.test(entry.name)
        ? [entryPath]
        : [];
  });
}

const failures = [];
const expectedFetchCounts = new Map(
  requestChecks.map(([relativePath]) => [relativePath, 1])
);

for (const [relativePath, ...requiredSnippets] of requestChecks) {
  const contents = fs.readFileSync(path.join(clientRoot, relativePath), 'utf8');
  for (const snippet of requiredSnippets) {
    if (!contents.includes(snippet)) {
      failures.push(`${relativePath} must contain ${snippet}`);
    }
  }
}

for (const directory of sourceDirectories) {
  for (const sourceFile of getSourceFiles(path.join(clientRoot, directory))) {
    const contents = fs.readFileSync(sourceFile, 'utf8');
    const relativePath = path.relative(clientRoot, sourceFile).split(path.sep).join('/');
    const fetchCount = (contents.match(/\bfetch\s*\(/g) || []).length;

    if (fetchCount !== (expectedFetchCounts.get(relativePath) || 0)) {
      failures.push(`${relativePath} has an unverified fetch() call`);
    }

    for (const { pattern, description } of forbiddenPatterns) {
      if (pattern.test(contents)) {
        failures.push(`${relativePath} contains a forbidden ${description}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('API URL verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('API URL verification passed: every network request uses apiUrl().');
