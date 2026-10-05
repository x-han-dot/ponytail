const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const sourceDir = path.join(root, 'skills');
const targetDir = path.join(root, '.agents', 'skills');
const names = fs.readdirSync(sourceDir).filter((name) =>
  fs.existsSync(path.join(sourceDir, name, 'SKILL.md')),
);

test('VS Code Copilot skills mirror the canonical portable skills', () => {
  assert.ok(names.length > 0, 'expected canonical skills');

  for (const name of names) {
    const source = fs.readFileSync(path.join(sourceDir, name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
    const targetPath = path.join(targetDir, name, 'SKILL.md');
    assert.ok(fs.existsSync(targetPath), `missing .agents/skills/${name}/SKILL.md`);

    const target = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');
    assert.equal(target, source, `.agents/skills/${name}/SKILL.md is stale`);

    const frontmatter = target.match(/^---\n([\s\S]*?)\n---\n/);
    assert.ok(frontmatter, `${name}: missing YAML frontmatter`);
    assert.match(frontmatter[1], new RegExp(`^name: ${name}$`, 'm'));
    assert.match(frontmatter[1], /^description:\s*\S/m);
  }
});
