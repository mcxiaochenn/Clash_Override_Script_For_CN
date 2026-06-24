# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

mihomo (Clash Meta) 覆写脚本，用于 Clash Verge Rev。基于 mcxiaochenn/clash-rules-cn 规则集，通过 jsdelivr CDN 加速。无构建系统、无测试、无依赖。

## 语言规范（铁律）

- **必须使用中文** — 所有交流、回复、解释一律使用中文
- 代码注释优先中文

## Git 规范（铁律）

- **默认只 commit，绝对不要 push** — 完成修改后执行 `git commit` 即可，不要自行 `git push`
- **只有用户明确说了「推送」或「push」时，才执行 `git push`**
- Commit Message 使用 Conventional Commits 格式：`feat:`、`fix:`、`docs:` 等

## 沟通原则

- **不确定就问，不要猜** — 任何不确定的事情先问用户
- **保持简洁** — 回答直接，避免冗余废话

## 架构

单文件项目 `mihomo-cn-override.js`，是一个 Clash Verge Rev 的 `main(config)` 覆写脚本，不是独立 YAML 配置。

核心结构：
- **用户自定义区域**（文件顶部）— `directIPs` 和 `directDomains` 数组，用户添加需要直连的 IP/域名
- **`ruleProviders`** — 规则集定义，来源为 mcxiaochenn/clash-rules-cn（yaml 格式）
- **`groupBaseOption`** — 代理组共享默认配置（健康检查 URL、间隔、超时）
- **`rules`** — 路由规则数组，顺序决定优先级
- **`main(config)`** — 入口函数：校验 proxies 存在后，覆写 `proxy-groups`、`rule-providers`、`rules`

`build/` 目录由 CI 自动维护：
- `build/daily/mihomo-cn-override-daily.js` — 每日版构建产物
- `build/latest/mihomo-cn-override-latest.js` — 稳定版构建产物

## CI/CD

- **每日版**：`.github/workflows/daily-release.yml`，每日 UTC 0:00 或 push 到 main 时自动触发，版本格式 `vYYYY.MM.DD.dN`
- **稳定版**：`.github/workflows/stable-release.yml`，手动触发，版本格式 `vYYYY.MM.DD.rN`
- 两个 workflow 都会：更新脚本版本号 → `node --check` 验证语法 → commit → 创建 GitHub Release → 更新 build/ 目录

## 关键约束

- **mihomo 内置代理名是 `DIRECT`，不是 `直连`** — 在 `proxies` 数组中使用 `直连` 会导致导入报错
- **`exclude-filter` 过滤的是代理名称匹配**，不是协议类型 — 用 `exclude-filter: "直连|DIRECT"` 排除直连节点
- **地区代理组名称带 flag emoji 前缀**（如 `🇭🇰 香港`）— `proxies` 数组和 `rules` 中的引用必须完全一致
- **每个地区组需要 `empty-fallback: "DIRECT"`** — 空组回退直连而非报错
- **地区组使用 `hidden: true`** — UI 侧边栏只显示 `节点选择`
- **`filter` 正则用 `(?i)` 前缀做大小写不敏感匹配**
- **CDN URL 使用 `cdn.jsdelivr.net`**，有约 12 小时缓存延迟；备选 `fastly.jsdelivr.net` 或 `testingcf.jsdelivr.net`

## 添加新地区的步骤

1. 在「地区自动选择组」区域添加正则模式条目，使用 flag emoji 命名，`type: "url-test"`，`hidden: true`，`empty-fallback: "DIRECT"`
2. 在「节点选择」组的 `proxies` 数组中添加 flag+名称
3. 在「其它地区」组的 `filter` 正则中添加该国关键词，使其从兜底组中排除

## 代理组层级

```
节点选择（手动选择）
├── 🇭🇰 香港 / 🇯🇵 日本 / 🇺🇸 美国 / ... （url-test，隐藏）
├── 其它地区（url-test，隐藏）
├── 全部节点（url-test，隐藏）
└── DIRECT

AI / 电报消息 / 苹果服务 / 广告过滤 / 全局直连 / 漏网之鱼（select 类型服务分组）
```

## 规则来源

- **mcxiaochenn/clash-rules-cn**（cdn.jsdelivr.net）— 聚合多个上游源的规则集
  - domain 类：direct-domain、proxy-domain、reject-domain、private-domain、apple-direct、icloud-domain、gfwlist-domain、non-china-tld、common-software、ai-domain
  - ipcidr 类：telegram-ip、lan-reserved-ip、china-ip
