# AGENTS.md

## What this is

Single-file mihomo (Clash Meta) override script (`mihomo-cn-override.js`) for Clash Verge Rev. Uses Loyalsoldier/clash-rules via jsdelivr CDN. No build system, no tests, no dependencies.

## Key constraints

- **This is a Clash Verge Rev `main(config)` script, NOT a standalone YAML config.** The entrypoint is `function main(config)` that receives the user's subscription config and returns a modified version.
- **mihomo built-in proxy is `DIRECT`, not `直连`.** Using `直连` in `proxies` arrays causes "not found" errors on import.
- **`exclude-type` filters by adapter protocol (Shadowsocks, Http, etc.), NOT by proxy name.** To exclude direct nodes from `include-all` groups, use `exclude-filter: "直连|DIRECT"` instead.
- **Regional proxy group names include flag emoji prefixes** (e.g. `🇭🇰 香港`). All references in `proxies` arrays and `rules` must match exactly.
- **Every regional group needs `empty-fallback: "DIRECT"`** so empty groups fall back to direct instead of erroring.
- **Regional groups use `hidden: true`** so they don't show in the UI sidebar; only `节点选择` is visible.

## Architecture

- `ruleProviders` — rule-set definitions (Loyalsoldier/clash-rules via CDN)
- `groupBaseOption` — shared proxy group defaults (health check URL, interval, timeout)
- `rules` — routing rules array (applications, private, reject, proxy, direct, gfw, telegramcidr, AI domains, GEOIP)
- `main(config)` — entrypoint: validates proxies exist, then overwrites `proxy-groups`, `rule-providers`, `rules`

## Adding a new country

1. Add regex pattern entry in the "地区自动选择组" section with flag emoji name, `url-test` type, `hidden: true`, `empty-fallback: "DIRECT"`
2. Add flag+name to the `proxies` array in the "节点选择" group
3. Add the country pattern to the `filter` regex in "其它地区" so it's excluded from the catch-all group

## Common pitfalls

- Proxy group names with emoji must be referenced consistently everywhere — a mismatch silently fails
- `filter` regex is case-insensitive via `(?i)` prefix
- Rules reference group names by exact string match, not index
- CDN URLs use `cdn.jsdelivr.net` (with 12h cache delay); `fastly.jsdelivr.net` or `testingcf.jsdelivr.net` are alternatives if blocked

## 项目规范

### 语言（铁律）
- **必须使用中文** — 所有交流、回复、解释一律使用中文
- 代码注释优先中文

### Git 操作（铁律）
- **默认只 commit，绝对不要 push** — 完成修改后执行 `git commit` 即可，不要自行 `git push`
- **只有用户明确说了「推送」或「push」时，才执行 `git push`**
- Commit Message 使用 Conventional Commits 格式：`feat:`、`fix:`、`docs:` 等

### 沟通原则
- **不确定就问，不要猜** — 任何不确定的事情先问用户
- **保持简洁** — 回答直接，避免冗余废话
