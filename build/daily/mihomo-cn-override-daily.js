// ============================================================================
// Clash Override Script For CN
// 基于 mcxiaochenn/clash-rules-cn 的覆写脚本
// 适用于 mihomo (Clash Meta) 内核 + Clash Verge Rev
//
// 版本：v2026.07.02.01
// 规则来源：mcxiaochenn/clash-rules-cn
// 作者：辰渊尘(ChenDusk) — https://blog.mcxiaochen.top
// 辅助：ClaudeCode
// ============================================================================

// ============================================================================
// ██     ██  用户自定义区域  ██     ██
// ============================================================================
//
// ▶ 什么是「用户自定义区域」？
//   这里是你可以根据自己的网络环境手动修改的地方。
//   如果你有特殊的服务（如 Tailscale、WireGuard、内网穿透等）需要直连，
//   请在这里添加对应的 IP 地址或域名，脚本会自动将它们加入直连规则。
//
// ▶ 我不会写代码怎么办？
//   不用担心！你只需要按照下面的格式，在数组里添加 IP 或域名即可。
//   每一行用英文引号包裹，末尾加逗号，照着示例抄就行。
//
// ▶ IP 地址格式说明（CIDR 表示法）：
//   - 单个 IP：  "192.168.1.1"        → 只匹配这一个地址
//   - IP 段：    "192.168.1.0/24"     → 匹配 192.168.1.0 ~ 192.168.1.255（共 256 个）
//   - 大段：     "10.0.0.0/8"         → 匹配 10.0.0.0 ~ 10.255.255.255（整个 10 开头）
//   - 中等段：   "172.16.0.0/12"      → 匹配 172.16.0.0 ~ 172.31.255.255
//
//   斜杠后面的数字越小，覆盖的范围越大：
//   /32 = 1 个 IP    /24 = 256 个 IP    /16 = 65536 个 IP    /8 = 1677 万个 IP
//
// ▶ 域名格式说明：
//   - 完整域名：  "example.com"        → 只匹配 example.com
//   - 带子域名：  "+.example.com"      → 匹配 example.com 及所有子域名（如 a.example.com）
//
// ============================================================================

// ★★★ 在这里添加需要直连的 IP 地址（CIDR 格式）★★★
//
// 常见场景说明：
//   - Tailscale 组网用的 IP 段是 100.64.0.0/10，被代理会导致连接异常
//   - WireGuard 默认使用 10.0.0.0/8 段
//   - 局域网设备管理页面通常是 192.168.x.1
//   - 如果你不确定，保持下面的默认值就好，不会影响正常使用
const directIPs = [
  // ---- 局域网地址 ----
  "192.168.1.0/24",          // 常见路由器局域网段（如 192.168.1.1）
  "192.168.0.0/16",          // 所有 192.168.x.x 地址（更大的局域网范围）

  // ---- Tailscale 虚拟网络 ----
  "100.64.0.0/10",           // Tailscale 默认 IP 段（重要！被代理会导致断连）

  // ---- 其他常见内网段 ----
  "10.0.0.0/8",              // A 类私有地址（WireGuard、Docker 等常用）
  "172.16.0.0/12",           // B 类私有地址（Docker 默认网段等）

  // ---- 在下面添加你的自定义 IP ----
  // 示例：
  // "100.100.100.100",       // 单个 IP
  // "10.10.0.0/16",          // 某个网段
];

// ★★★ 在这里添加需要直连的域名 ★★★
//
// 如果你有内网服务（如 NAS、自建服务等）被代理导致无法访问，在这里添加域名
const directDomains = [
  // ---- 常见内网域名 ----
  "+.local",                 // mDNS 本地域名
  "+.lan",                   // 常见局域网域名后缀

  // ---- 在下面添加你的自定义域名 ----
  // 示例：
  // "+.myservice.com",       // 你的某个服务域名
  // "nas.home",              // 你的 NAS 域名
];

// ============================================================================
// ██     ██  以下为脚本核心逻辑，普通用户无需修改  ██     ██
// ============================================================================

// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};

// 规则集（来源：mcxiaochenn/clash-rules-cn）
const ruleProviders = {
  // 中国大陆直连域名
  "direct-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/direct-domain.yaml",
    "path": "./ruleset/direct-domain.yaml"
  },
  // 需要代理的域名
  "proxy-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/proxy-domain.yaml",
    "path": "./ruleset/proxy-domain.yaml"
  },
  // 广告及恶意域名
  "reject-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/reject-domain.yaml",
    "path": "./ruleset/reject-domain.yaml"
  },
  // 私有网络专用域名
  "private-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/private-domain.yaml",
    "path": "./ruleset/private-domain.yaml"
  },
  // Apple 在中国大陆可直连的域名
  "apple-direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/apple-direct.yaml",
    "path": "./ruleset/apple-direct.yaml"
  },
  // iCloud 域名列表
  "icloud-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/icloud-domain.yaml",
    "path": "./ruleset/icloud-domain.yaml"
  },
  // GFWList 域名列表
  "gfwlist-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/gfwlist-domain.yaml",
    "path": "./ruleset/gfwlist-domain.yaml"
  },
  // 非中国大陆使用的顶级域名
  "non-china-tld": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/non-china-tld.yaml",
    "path": "./ruleset/non-china-tld.yaml"
  },
  // 需要直连的常见软件列表
  "common-software": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/common-software.yaml",
    "path": "./ruleset/common-software.yaml"
  },
  // Telegram 使用的 IP 地址
  "telegram-ip": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/telegram-ip.yaml",
    "path": "./ruleset/telegram-ip.yaml"
  },
  // 局域网 IP 及保留 IP 地址
  "lan-reserved-ip": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/lan-reserved-ip.yaml",
    "path": "./ruleset/lan-reserved-ip.yaml"
  },
  // 中国大陆 IP 地址
  "china-ip": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/china-ip.yaml",
    "path": "./ruleset/china-ip.yaml"
  },
  // AI 服务相关域名
  "ai-domain": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/ai-domain.yaml",
    "path": "./ruleset/ai-domain.yaml"
  }
};

// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.gstatic.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 路由规则
const rules = [
  // ===== 用户自定义直连规则 =====
  ...directDomains.map(domain => `DOMAIN-SUFFIX,${domain},DIRECT`),
  ...directIPs.map(ip => `IP-CIDR,${ip},DIRECT,no-resolve`),

  // ===== 黑名单模式 — 直连优先，仅命中代理规则走代理 =====
  // 广告拦截
  "RULE-SET,reject-domain,广告过滤",
  // 特定服务分流
  "RULE-SET,icloud-domain,苹果服务",
  "RULE-SET,apple-direct,苹果服务",
  "RULE-SET,ai-domain,AI",
  "RULE-SET,telegram-ip,电报消息,no-resolve",
  // 直连（优先匹配，放在代理前面）
  "RULE-SET,common-software,全局直连",
  "RULE-SET,private-domain,全局直连",
  "RULE-SET,direct-domain,全局直连",
  "RULE-SET,lan-reserved-ip,全局直连,no-resolve",
  "RULE-SET,china-ip,全局直连,no-resolve",
  // 代理
  "RULE-SET,proxy-domain,节点选择",
  "RULE-SET,gfwlist-domain,节点选择",
  "RULE-SET,non-china-tld,节点选择",

  // ===== 兜底规则 =====
  "GEOIP,LAN,全局直连,no-resolve",
  "GEOIP,CN,全局直连,no-resolve",
  "MATCH,漏网之鱼"
];

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆盖代理组
  config["proxy-groups"] = [
    // 主选择组
    {
      ...groupBaseOption,
      "name": "节点选择",
      "type": "select",
      "proxies": ["🇭🇰 香港", "🇯🇵 日本", "🇺🇸 美国", "🇰🇷 韩国", "🇨🇳 台湾", "🇸🇬 新加坡", "🇬🇧 英国", "🇩🇪 德国", "🇫🇷 法国", "🇮🇳 印度", "🇲🇴 澳门", "🇲🇾 马来西亚", "🇳🇱 荷兰", "🇱🇹 立陶宛", "其它地区", "全部节点", "DIRECT"],
    },
    // 地区自动选择组（URLTest，隐藏）
    {
      ...groupBaseOption,
      "name": "🇭🇰 香港",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:港|hk|hongkong|hong kong))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇯🇵 日本",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:日|jp|japan))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇺🇸 美国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:美|us|unitedstates|united states))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇰🇷 韩国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:韩|kr|korea))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇨🇳 台湾",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:台|tw|taiwan))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇸🇬 新加坡",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:新|sg|singapore))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇬🇧 英国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:英|uk|united kingdom|great britain))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇩🇪 德国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:德|de|germany))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇫🇷 法国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:法|fr|france))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇮🇳 印度",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:印|in|india))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇲🇴 澳门",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:澳|mo|macau))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇲🇾 马来西亚",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:马来|my|malaysia))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇳🇱 荷兰",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:荷|nl|netherlands))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "🇱🇹 立陶宛",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)(?=.*(?:立陶宛|lt|lithuania))(?!.*(?:回国|校园|游戏|🎮|GAME))",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "其它地区",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)^(?!.*(?:港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates|韩|kr|korea|英|uk|united kingdom|德|de|germany|法|fr|france|印|in|india|澳|mo|macau|马来|my|malaysia|荷|nl|netherlands|立陶宛|lt|lithuania|回国|校园|游戏|🎮|GAME)).*",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    {
      ...groupBaseOption,
      "name": "全部节点",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "hidden": true,
      "empty-fallback": "DIRECT",
    },
    // 服务分组
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "proxies": ["🇺🇸 美国", "🇭🇰 香港", "🇯🇵 日本", "🇸🇬 新加坡", "节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg"
    },
    {
      ...groupBaseOption,
      "name": "电报消息",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
    },
    {
      ...groupBaseOption,
      "name": "广告过滤",
      "type": "select",
      "proxies": ["REJECT", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg"
    },
    {
      ...groupBaseOption,
      "name": "全局直连",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
    },
    {
      ...groupBaseOption,
      "name": "漏网之鱼",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
    }
  ];

  // 覆盖 GeoIP 数据源（统一使用 clash-rules-cn）
  config["geox-url"] = {
    "geoip": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/Country.mmdb",
    "mmdb": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/Country.mmdb",
    "asn": "https://cdn.jsdelivr.net/gh/mcxiaochenn/clash-rules-cn@rules/Country-asn.mmdb"
  };

  // 覆盖规则集和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  return config;
}
