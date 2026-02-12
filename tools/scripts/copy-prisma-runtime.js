const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`[copy-prisma-runtime] Source not found: ${src}`);
    process.exit(1);
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  const repoRoot = process.cwd();

  const distRoot = path.join(repoRoot, 'passion-load-service', 'dist');

  const prismaRuntimeSrc = path.join(repoRoot, 'node_modules', '.prisma');
  const prismaClientSrc = path.join(
    repoRoot,
    'node_modules',
    '@prisma',
    'client'
  );

  const prismaRuntimeDest = path.join(distRoot, 'node_modules', '.prisma');
  const prismaClientDest = path.join(
    distRoot,
    'node_modules',
    '@prisma',
    'client'
  );

  console.log('[copy-prisma-runtime] Copying Prisma runtime...');
  copyDir(prismaRuntimeSrc, prismaRuntimeDest);
  copyDir(prismaClientSrc, prismaClientDest);
  console.log('[copy-prisma-runtime] Done.');
}

main();
