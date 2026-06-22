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

// 路由规则（白名单模式）
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
    {
      ...groupBaseOption,
      "name": "节点选择",
      "type": "select",
      "proxies": ["自动选择", "香港", "台湾", "日本", "新加坡", "美国", "英国", "其它地区", "全部节点", "直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg"
    },
    {
      ...groupBaseOption,
      "name": "自动选择",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "exclude-type": "direct",
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg"
    },
    {
      ...groupBaseOption,
      "name": "香港",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)港|hk|hongkong|hong kong",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/HK.png"
    },
    {
      ...groupBaseOption,
      "name": "台湾",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)台|tw|taiwan",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/TW.png"
    },
    {
      ...groupBaseOption,
      "name": "日本",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)日|jp|japan",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/JP.png"
    },
    {
      ...groupBaseOption,
      "name": "新加坡",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)新|sg|singapore",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/SG.png"
    },
    {
      ...groupBaseOption,
      "name": "美国",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)美|us|unitedstates|united states",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/US.png"
    },
    {
      ...groupBaseOption,
      "name": "英国",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)英|uk|united kingdom|great britain",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/UK.png"
    },
    {
      ...groupBaseOption,
      "name": "其它地区",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "filter": "(?i)^(?!.*(?:港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates|英|uk|united kingdom)).*",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/Available.png"
    },
    {
      ...groupBaseOption,
      "name": "全部节点",
      "type": "select",
      "include-all": true,
      "exclude-type": "direct",
      "icon": "https://fastly.jsdelivr.net/gh/Koolson/Qure/master/IconSet/mini/Global.png"
    },
    {
      ...groupBaseOption,
      "name": "电报消息",
      "type": "select",
      "proxies": ["节点选择", "自动选择", "直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg"
    },
    {
      ...groupBaseOption,
      "name": "谷歌服务",
      "type": "select",
      "proxies": ["节点选择", "自动选择", "直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg"
    },
    {
      ...groupBaseOption,
      "name": "微软服务",
      "type": "select",
      "proxies": ["直连", "节点选择", "自动选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg"
    },
    {
      ...groupBaseOption,
      "name": "苹果服务",
      "type": "select",
      "proxies": ["节点选择", "自动选择", "直连"],
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
      "proxies": ["DIRECT", "节点选择", "自动选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg"
    },
    {
      ...groupBaseOption,
      "name": "漏网之鱼",
      "type": "select",
      "proxies": ["节点选择", "自动选择", "直连"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg"
    }
  ];

  // 覆盖规则集和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  return config;
}
