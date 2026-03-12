#!/usr/bin/env node
/**
 * L7 发布脚本
 * 自动化版本发布流程
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface PackageInfo {
  name: string;
  version: string;
  dir: string;
}

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const PACKAGE_NAMES = [
  'utils',
  'core',
  'source',
  'map',
  'maps',
  'renderer',
  'layers',
  'scene',
  'component',
  'three',
  'l7',
];

/**
 * 读取包信息
 */
function getPackageInfo(pkgDir: string): PackageInfo | null {
  const pkgPath = path.join(PACKAGES_DIR, pkgDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return {
    name: pkg.name,
    version: pkg.version,
    dir: pkgDir,
  };
}

/**
 * 更新包的版本号
 */
function updatePackageVersion(pkgDir: string, newVersion: string): void {
  const pkgPath = path.join(PACKAGES_DIR, pkgDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

/**
 * 执行命令
 */
function run(cmd: string, cwd?: string): void {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

/**
 * 获取当前版本
 */
function getCurrentVersion(): string {
  const mainPkg = JSON.parse(
    fs.readFileSync(path.join(PACKAGES_DIR, 'l7', 'package.json'), 'utf-8'),
  );
  return mainPkg.version;
}

/**
 * 验证版本格式
 */
function validateVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+/.test(version);
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
Usage: claude-code-release-l7 <command> [options]

Commands:
  version <x.y.z>    更新所有包版本号到指定版本
  build              构建所有包
  publish            发布到 npm
  release <x.y.z>    完整发布流程：更新版本 + 构建 + 发布 + 标签

Examples:
  claude-code-release-l7 version 2.25.2
  claude-code-release-l7 release 2.25.2
    `);
    return;
  }

  switch (command) {
    case 'version': {
      const newVersion = args[1];
      if (!newVersion || !validateVersion(newVersion)) {
        console.error('Error: 请提供有效的版本号，例如 2.25.2');
        process.exit(1);
      }

      console.log(`📦 更新版本号到 ${newVersion}...`);

      for (const pkgName of PACKAGE_NAMES) {
        const pkgPath = path.join(PACKAGES_DIR, pkgName, 'package.json');
        if (fs.existsSync(pkgPath)) {
          updatePackageVersion(pkgName, newVersion);
          console.log(`  ✓ @antv/l7${pkgName === 'l7' ? '' : `-${pkgName}`}@${newVersion}`);
        }
      }

      // 提交版本更新
      run('git add packages/*/package.json');
      run(`git commit -m "chore: release v${newVersion}"`);

      console.log(`✅ 版本号已更新到 ${newVersion}`);
      break;
    }

    case 'build': {
      console.log('🔨 构建所有包...');
      run('pnpm run build');
      console.log('✅ 构建完成');
      break;
    }

    case 'publish': {
      console.log('📤 发布到 npm...');
      console.log('注意：需要在 .npmrc 中配置 authToken 或先执行 npm login');
      run('pnpm exec changeset publish');
      console.log('✅ 发布完成');
      break;
    }

    case 'release': {
      const newVersion = args[1];
      if (!newVersion || !validateVersion(newVersion)) {
        console.error('Error: 请提供有效的版本号，例如 2.25.2');
        process.exit(1);
      }

      const currentVersion = getCurrentVersion();
      console.log(`🚀 开始发布流程...`);
      console.log(`   当前版本: ${currentVersion}`);
      console.log(`   目标版本: ${newVersion}`);
      console.log('');

      // 1. 更新版本号
      console.log('📦 步骤 1/5: 更新版本号...');
      for (const pkgName of PACKAGE_NAMES) {
        const pkgPath = path.join(PACKAGES_DIR, pkgName, 'package.json');
        if (fs.existsSync(pkgPath)) {
          updatePackageVersion(pkgName, newVersion);
          console.log(`  ✓ @antv/l7${pkgName === 'l7' ? '' : `-${pkgName}`}@${newVersion}`);
        }
      }

      // 2. 提交版本更新
      console.log('');
      console.log('💾 步骤 2/5: 提交版本更新...');
      run('git add packages/*/package.json');
      run(`git commit -m "chore: release v${newVersion}"`);
      console.log('  ✓ 已提交');

      // 3. 创建标签
      console.log('');
      console.log('🏷️  步骤 3/5: 创建标签...');
      run(`git tag v${newVersion}`);
      console.log(`  ✓ 标签 v${newVersion} 已创建`);

      // 4. 构建
      console.log('');
      console.log('🔨 步骤 4/5: 构建...');
      run('pnpm run build');
      console.log('  ✓ 构建完成');

      // 5. 发布
      console.log('');
      console.log('📤 步骤 5/5: 发布到 npm...');
      console.log('   注意：如果启用了 2FA，需要提供 OTP 码');
      try {
        run('pnpm exec changeset publish');
        console.log('  ✓ 发布完成');
      } catch (e) {
        console.error('  ✗ 发布失败，请手动执行: pnpm exec changeset publish');
        process.exit(1);
      }

      // 6. 推送
      console.log('');
      console.log('☁️  推送代码和标签...');
      run('git push origin master');
      run(`git push origin v${newVersion}`);

      console.log('');
      console.log('🎉 发布完成!');
      console.log(`   版本: v${newVersion}`);
      console.log(`   提交: ${execSync('git rev-parse --short HEAD').toString().trim()}`);
      console.log(`   标签: v${newVersion}`);
      break;
    }

    default:
      console.error(`Error: 未知命令 "${command}"`);
      console.log('运行 claude-code-release-l7 查看帮助');
      process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
