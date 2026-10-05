// Compiles + runs every content/**/code/*.kt and *.java, compares stdout with the file's "// Output:" block.
// Usage: npm run check:code [-- <chapter>/<topic>] [-- --force]
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseCode } from '../src/lib/codefile';

const ROOT = process.cwd();
const WIN = process.platform === 'win32';
const args = process.argv.slice(2);
const force = args.includes('--force');
const filter = args.find((a) => !a.startsWith('--'));

function findJavaHome(): string {
  const candidates = [
    process.env.DSA_JAVA_HOME,
    path.join(os.homedir(), '.jdks', 'jbr-21.0.11'),
    process.env.JAVA_HOME,
    'C:\\Program Files\\Android\\Android Studio\\jbr',
  ].filter((p): p is string => !!p);
  const ok = candidates.find((p) => fs.existsSync(path.join(p, 'bin', WIN ? 'java.exe' : 'java')));
  if (!ok) {
    console.error('JDK nahi mila. DSA_JAVA_HOME set karo.');
    process.exit(1);
  }
  return ok;
}

const JAVA_HOME = findJavaHome();
const JAVA = path.join(JAVA_HOME, 'bin', WIN ? 'java.exe' : 'java');
const KOTLINC = path.join(ROOT, 'tools', 'kotlinc', 'bin', WIN ? 'kotlinc.bat' : 'kotlinc');
const CACHE_FILE = path.join(ROOT, '.cache', 'code-check.json');
const env = { ...process.env, JAVA_HOME, JAVA_TOOL_OPTIONS: '-Dfile.encoding=UTF-8 -Dstdout.encoding=UTF-8' };

function run(cmd: string, argv: string[], shell = false): Promise<{ code: number; out: string; err: string }> {
  return new Promise((resolve) => {
    // .bat files need a shell on Windows; quote everything ourselves (paths come from this repo only)
    const p = shell
      ? spawn([cmd, ...argv].map((a) => `"${a}"`).join(' '), { env, shell: true, windowsHide: true })
      : spawn(cmd, argv, { env, windowsHide: true });
    let out = '';
    let errText = '';
    const timer = setTimeout(() => p.kill(), 120_000);
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (errText += d));
    p.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1, out, err: errText.replace(/^Picked up JAVA_TOOL_OPTIONS.*\r?\n/gm, '') });
    });
  });
}

const norm = (s: string) => {
  const lines = s.replace(/\r\n?/g, '\n').split('\n').map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines;
};

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /[\\/]code[\\/][^\\/]+\.(kt|java)$/.test(p) ? [p] : [];
  });
}

async function check(file: string): Promise<string | null> {
  const src = fs.readFileSync(file, 'utf8');
  const parsed = parseCode(src);
  if (parsed.errors.length) return parsed.errors.join('; ');
  let res;
  if (file.endsWith('.java')) {
    res = await run(JAVA, [file]);
    if (res.code !== 0) return `run fail:\n${res.err}`;
  } else {
    const hash = crypto.createHash('sha1').update(file).digest('hex').slice(0, 10);
    const jar = path.join(ROOT, '.cache', 'kt', `${hash}.jar`);
    fs.mkdirSync(path.dirname(jar), { recursive: true });
    const comp = await run(KOTLINC, [file, '-include-runtime', '-nowarn', '-d', jar], WIN);
    if (comp.code !== 0) return `kotlinc fail:\n${comp.err}`;
    res = await run(JAVA, ['-jar', jar]);
    if (res.code !== 0) return `run fail:\n${res.err}`;
  }
  const got = norm(res.out);
  const want = parsed.output;
  if (got.join('\n') !== want.join('\n')) {
    return `output mismatch\n  expected:\n    ${want.join('\n    ')}\n  got:\n    ${got.join('\n    ')}`;
  }
  return null;
}

async function main() {
  const files = walk(path.join(ROOT, 'content'))
    .filter((f) => !filter || f.replace(/\\/g, '/').includes(`content/${filter}/`))
    .sort();
  const cache: Record<string, string> = fs.existsSync(CACHE_FILE) ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')) : {};
  const digest = (f: string) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  const todo = files.filter((f) => force || cache[path.relative(ROOT, f)] !== digest(f));
  console.log(`check:code: ${files.length} files, ${todo.length} to check (JDK: ${JAVA_HOME})`);

  const failures: string[] = [];
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      const f = todo[i++];
      const rel = path.relative(ROOT, f);
      const problem = await check(f);
      if (problem) {
        failures.push(`✗ ${rel}: ${problem}`);
        console.log(`✗ ${rel}`);
      } else {
        cache[rel] = digest(f);
        console.log(`✓ ${rel}`);
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(3, todo.length) }, worker));
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  if (failures.length) {
    console.error('\n' + failures.join('\n\n'));
    process.exit(1);
  }
  console.log('check:code: sab sahi ✓');
}

main();
