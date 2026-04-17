#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');
const SOURCE_DIR = path.join(__dirname, 'skills');

function install() {
  // Create ~/.claude/skills if it doesn't exist
  if (!fs.existsSync(SKILLS_DIR)) {
    fs.mkdirSync(SKILLS_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.log('brandsync-agentic-skills: no skills found to install');
    return;
  }

  let installed = 0;
  let updated = 0;

  files.forEach(file => {
    const src = path.join(SOURCE_DIR, file);
    const dest = path.join(SKILLS_DIR, file);
    const exists = fs.existsSync(dest);
    fs.copyFileSync(src, dest);
    exists ? updated++ : installed++;
    console.log(`  ${exists ? 'updated' : 'installed'} ${file} → ${dest}`);
  });

  console.log(`\nbrandsync-agentic-skills: ${installed} installed, ${updated} updated`);
  console.log('Skills are now available in Claude Code. BrandSync MCP will invoke them automatically.\n');
}

try {
  install();
} catch (err) {
  // Non-fatal — don't block npm install if Claude Code isn't set up
  console.warn(`brandsync-agentic-skills: could not install skills (${err.message})`);
  console.warn('To install manually: copy skills/*.md to ~/.claude/skills/\n');
}
