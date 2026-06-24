// Clash Override Script For CN
// 基于 Loyalsoldier/clash-rules 的覆写脚本
// 适用于 mihomo (Clash Meta) 内核 + Clash Verge Rev

// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "text",
  "interval": 86400
};

// 规则集
const ruleProviders = {
  "reject": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "path": "./ruleset/reject.yaml"
  },
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/private.yaml"
  },
  "direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/direct.yaml"
  },
  "proxy": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/proxy.yaml"
  },
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/gfw.yaml"
  },
  "telegramcidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/telegramcidr.yaml"
  },
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/cncidr.yaml"
  },
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/lancidr.yaml"
  },
  "applications": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt",
    "path": "./ruleset/applications.yaml"
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
  // 自定义规则
  "DOMAIN-SUFFIX,googleapis.cn,节点选择",
  "DOMAIN-SUFFIX,gstatic.com,节点选择",
  // Loyalsoldier 规则集
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,proxy,节点选择",
  "RULE-SET,gfw,节点选择",
  "RULE-SET,direct,全局直连",
  "RULE-SET,lancidr,全局直连,no-resolve",
  "RULE-SET,cncidr,全局直连,no-resolve",
  "RULE-SET,telegramcidr,电报消息,no-resolve",
  // AI 服务
  "DOMAIN-SUFFIX,openai.com,AI",
  "DOMAIN-SUFFIX,ai.com,AI",
  "DOMAIN-SUFFIX,anthropic.com,AI",
  "DOMAIN-SUFFIX,claude.ai,AI",
  "DOMAIN-SUFFIX,gemini.google.com,AI",
  "DOMAIN-SUFFIX,bard.google.com,AI",
  "DOMAIN-SUFFIX,copilot.microsoft.com,AI",
  "DOMAIN-SUFFIX,perplexity.ai,AI",
  "DOMAIN-SUFFIX,midjourney.com,AI",
  "DOMAIN-SUFFIX,stability.ai,AI",
  "DOMAIN-SUFFIX,huggingface.co,AI",
  "DOMAIN-SUFFIX,replicate.com,AI",
  "DOMAIN-SUFFIX,together.ai,AI",
  "DOMAIN-SUFFIX,cohere.com,AI",
  "DOMAIN-SUFFIX,mistral.ai,AI",
  // 其他规则
  "GEOIP,LAN,全局直连,no-resolve",
  "GEOIP,CN,全局直连,no-resolve",
  "GEOIP,google,谷歌服务,no-resolve",
  "GEOIP,telegram,电报消息,no-resolve",
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
      "proxies": ["香港", "日本", "美国", "韩国", "台湾", "新加坡", "英国", "其它地区", "全部节点", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    // 地区自动选择组（URLTest，隐藏）
    {
      ...groupBaseOption,
      "name": "香港",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)港|hk|hongkong|hong kong",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/HK.png"
    },
    {
      ...groupBaseOption,
      "name": "日本",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)日|jp|japan",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/JP.png"
    },
    {
      ...groupBaseOption,
      "name": "美国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)美|us|unitedstates|united states",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/US.png"
    },
    {
      ...groupBaseOption,
      "name": "韩国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)韩|kr|korea",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/KR.png"
    },
    {
      ...groupBaseOption,
      "name": "台湾",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)台|tw|taiwan",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/TW.png"
    },
    {
      ...groupBaseOption,
      "name": "新加坡",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)新|sg|singapore",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/SG.png"
    },
    {
      ...groupBaseOption,
      "name": "英国",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)英|uk|united kingdom|great britain",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/UK.png"
    },
    {
      ...groupBaseOption,
      "name": "其它地区",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "filter": "(?i)^(?!.*(?:港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates|韩|kr|korea|英|uk|united kingdom)).*",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/Available.png"
    },
    {
      ...groupBaseOption,
      "name": "全部节点",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-filter": "直连|DIRECT",
      "hidden": true,
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/Global.png"
    },
    // 服务分组
    {
      ...groupBaseOption,
      "name": "AI",
      "type": "select",
      "proxies": ["美国", "节点选择", "香港", "日本", "新加坡", "DIRECT"],
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
      "name": "谷歌服务",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg"
    },
    {
      ...groupBaseOption,
      "name": "广告过滤",
      "type": "select",
      "proxies": ["DIRECT", "REJECT"],
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

  // 覆盖规则集和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  return config;
}
