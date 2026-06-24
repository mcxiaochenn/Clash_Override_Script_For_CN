# Clash Override Script For CN

基于 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 的 mihomo (Clash Meta) 覆写脚本，适用于 [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev)。

## 功能特性

- 基于 Loyalsoldier/clash-rules 规则集（CDN 加速）
- 按地区自动分组：香港、日本、美国、韩国、台湾、新加坡、英国、德国、法国、印度、澳门、马来西亚、荷兰、立陶宛
- AI 服务单独分组（OpenAI、Anthropic、Google Gemini 等，默认走美国节点）
- 广告过滤默认关闭（可手动开启）
- 支持用户自定义直连 IP/域名（Tailscale、WireGuard 等）
- 空节点组自动回退 DIRECT，不会报错

## 版本说明

| 类型 | 版本格式 | 说明 | 更新频率 |
|------|----------|------|----------|
| 稳定版 | `vYYYY.MM.DD.rN` | 经过验证的正式版本 | 手动发布 |
| 每日版 | `vYYYY.MM.DD.dN` | 包含最新功能的自动构建版 | 每日 UTC 0:00 |

> `N` 为当日第几次发布，从 1 开始递增。

## 使用方式

### 方式一：自动更新（推荐）

在 Clash Verge Rev 的覆写脚本配置中使用以下 URL，可自动获取最新版本，无需手动更新：

**GitHub 直连：**

```
https://github.com/mcxiaochenn/Clash_Override_Script_For_CN/releases/latest/download/mihomo-cn-override.js
```

**CDN 加速（国内推荐）：**

```
https://cdn.jsdelivr.net/gh/mcxiaochenn/Clash_Override_Script_For_CN@latest/build/latest/mihomo-cn-override-latest.js
```

> GitHub URL 始终指向 Latest 标记的稳定版；CDN URL 指向最新 commit，有缓存延迟。

### 方式二：手动下载

前往 [Releases](https://github.com/mcxiaochenn/Clash_Override_Script_For_CN/releases) 页面下载对应版本：

- **稳定版**（Latest 标记）：经过验证的正式版本
- **每日版**（Pre-release 标记）：每日自动构建，包含最新功能

### 方式三：手动导入

1. 下载 `mihomo-cn-override.js` 文件
2. 打开 Clash Verge Rev → 设置 → 覆写脚本
3. 导入下载的脚本文件

## 自定义配置

编辑 `mihomo-cn-override.js` 顶部的用户自定义区域：

### 添加直连 IP

```javascript
const directIPs = [
  "192.168.1.0/24",          // 局域网段
  "100.64.0.0/10",           // Tailscale 虚拟网络
  // 在这里添加你的 IP...
];
```

### 添加直连域名

```javascript
const directDomains = [
  "+.local",                 // mDNS 本地域名
  "+.lan",                   // 局域网域名
  // 在这里添加你的域名...
];
```

### CIDR 格式速查

| 格式 | 覆盖范围 | 适用场景 |
|------|----------|----------|
| `192.168.1.1/32` | 仅 1 个 IP | 单台设备 |
| `192.168.1.0/24` | 256 个 IP | 一个子网 |
| `10.0.0.0/8` | 1677 万个 IP | 整个 A 类内网 |

## 代理组结构

```
节点选择（手动选择）
├── 🇭🇰 香港（自动选择，隐藏）
├── 🇯🇵 日本（自动选择，隐藏）
├── 🇺🇸 美国（自动选择，隐藏）
├── 🇰🇷 韩国（自动选择，隐藏）
├── 🇹🇼 台湾（自动选择，隐藏）
├── 🇸🇬 新加坡（自动选择，隐藏）
├── 🇬🇧 英国（自动选择，隐藏）
├── 🇩🇪 德国（自动选择，隐藏）
├── 🇫🇷 法国（自动选择，隐藏）
├── 🇮🇳 印度（自动选择，隐藏）
├── 🇲🇴 澳门（自动选择，隐藏）
├── 🇲🇾 马来西亚（自动选择，隐藏）
├── 🇳🇱 荷兰（自动选择，隐藏）
├── 🇱🇹 立陶宛（自动选择，隐藏）
├── 其它地区（自动选择，隐藏）
└── 全部节点（自动选择，隐藏）

AI（默认美国）
电报消息
谷歌服务
微软服务
苹果服务
广告过滤（默认关闭）
全局直连
漏网之鱼
```

## 许可证

[MIT](LICENSE) © [辰渊尘(ChenDusk)](https://blog.mcxiaochen.top)
