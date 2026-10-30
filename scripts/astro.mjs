import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Keep builds and previews independent of a writable user configuration directory.
const executable = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const child = spawn(process.execPath, [executable, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0); });
