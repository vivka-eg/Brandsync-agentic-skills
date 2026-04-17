# brandsync-agentic-skills

Framework adapter skills for [BrandSync MCP](https://brandsync.eg.dk).

Installs automatically into Claude Code when you run `npm install`. BrandSync MCP invokes these skills after generating UI code to catch framework-specific rendering failures silently missed by the design system.

## Install

```bash
npm install -g brandsync-agentic-skills
```

That's it. Skills are copied to `~/.claude/skills/` and Claude Code picks them up immediately.

## What's included

### `mudblazor-fix`

Runs after BrandSync MCP generates any MudBlazor UI. Catches two classes of silent failure:

- **Token drift** — BrandSync emits `var(--bs-surface-container)` but your deployed `tokens.css` only has `--bs-surface-base`. CSS `var()` fails silently: backgrounds go transparent, spacing collapses to 0. This skill reads your actual `tokens.css`, audits every `var(--bs-*)` reference, and replaces unverified tokens with scoped fallbacks.

- **MudIcon blowup** — `<MudIcon>` renders as `<span><svg /></span>`. An SVG with no explicit size in a flex container fills its container. This skill adds the `!important` size lock.

Invoked automatically by BrandSync MCP when it detects a MudBlazor project (`.csproj` with MudBlazor package reference).

## How it works

On install, `install.js` copies `skills/*.md` to `~/.claude/skills/`. Claude Code loads skills from that directory. BrandSync MCP's Pocket 3 pipeline detects your framework and invokes the matching skill after code generation.

If the skill is missing when BrandSync MCP tries to invoke it, you'll see:

```
Run `npm install -g brandsync-agentic-skills` to install BrandSync framework skills, then retry.
```

## Adding more skills

More framework adapters (React token fixer, Angular specificity helper) will be added as `skills/<name>.md`. They install automatically on the next `npm update -g brandsync-agentic-skills`.
