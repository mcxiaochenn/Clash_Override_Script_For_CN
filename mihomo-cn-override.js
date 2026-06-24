// ============================================================================
// Clash Override Script For CN
// 基于 Loyalsoldier/clash-rules 的覆写脚本
// 适用于 mihomo (Clash Meta) 内核 + Clash Verge Rev
//
// 版本：v2026.06.24.d1
// 作者：辰渊尘(ChenDusk) — https://blog.mcxiaochen.top
// 辅助：OpenCode + MiMo V2.5 Pro
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
  "format": "text",
  "interval": 86400
};

// 规则集
const ruleProviders = {
  // 广告域名拦截
  "reject": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt",
    "path": "./ruleset/reject.yaml"
  },
  // 私有网络域名（局域网、路由器等）
  "private": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt",
    "path": "./ruleset/private.yaml"
  },
  // 国内可直连域名
  "direct": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt",
    "path": "./ruleset/direct.yaml"
  },
  // 需要代理的域名（GFW 列表补充）
  "proxy": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt",
    "path": "./ruleset/proxy.yaml"
  },
  // GFW 封锁域名
  "gfw": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
    "path": "./ruleset/gfw.yaml"
  },
  // Telegram IP 地址段
  "telegramcidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt",
    "path": "./ruleset/telegramcidr.yaml"
  },
  // 中国大陆 IP 地址段
  "cncidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt",
    "path": "./ruleset/cncidr.yaml"
  },
  // 局域网及保留 IP 地址段
  "lancidr": {
    ...ruleProviderCommon,
    "behavior": "ipcidr",
    "url": "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt",
    "path": "./ruleset/lancidr.yaml"
  },
  // 常见应用程序直连规则（如 Windows Update、iCloud 等）
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
  // ---- 用户自定义直连规则（来自上方的 directIPs 和 directDomains）----
  // 注意：这些规则放在最前面，确保自定义的直连地址优先匹配
  ...directDomains.map(domain => `DOMAIN-SUFFIX,${domain},DIRECT`),
  ...directIPs.map(ip => `IP-CIDR,${ip},DIRECT,no-resolve`),

  // ---- 国内大厂服务直连（Loyalsoldier direct 规则集不包含商业域名）----
  "DOMAIN-SUFFIX,baidu.com,DIRECT",
  "DOMAIN-SUFFIX,baidubce.com,DIRECT",
  "DOMAIN-SUFFIX,baidupcs.com,DIRECT",
  "DOMAIN-SUFFIX,bdstatic.com,DIRECT",
  "DOMAIN-SUFFIX,bdimg.com,DIRECT",
  "DOMAIN-SUFFIX,qq.com,DIRECT",
  "DOMAIN-SUFFIX,weixin.qq.com,DIRECT",
  "DOMAIN-SUFFIX,wx.qq.com,DIRECT",
  "DOMAIN-SUFFIX,wechat.com,DIRECT",
  "DOMAIN-SUFFIX,gtimg.com,DIRECT",
  "DOMAIN-SUFFIX,qpic.cn,DIRECT",
  "DOMAIN-SUFFIX,qcloud.com,DIRECT",
  "DOMAIN-SUFFIX,myqcloud.com,DIRECT",
  "DOMAIN-SUFFIX,tencent.com,DIRECT",
  "DOMAIN-SUFFIX,servicewechat.com,DIRECT",
  "DOMAIN-SUFFIX,alipay.com,DIRECT",
  "DOMAIN-SUFFIX,alibaba.com,DIRECT",
  "DOMAIN-SUFFIX,alicdn.com,DIRECT",
  "DOMAIN-SUFFIX,alibabacloud.com,DIRECT",
  "DOMAIN-SUFFIX,taobao.com,DIRECT",
  "DOMAIN-SUFFIX,tmall.com,DIRECT",
  "DOMAIN-SUFFIX,aliyun.com,DIRECT",
  "DOMAIN-SUFFIX,dingtalk.com,DIRECT",
  "DOMAIN-SUFFIX,amap.com,DIRECT",
  "DOMAIN-SUFFIX,cainiao.com,DIRECT",
  "DOMAIN-SUFFIX,163.com,DIRECT",
  "DOMAIN-SUFFIX,126.net,DIRECT",
  "DOMAIN-SUFFIX,127.net,DIRECT",
  "DOMAIN-SUFFIX,netease.com,DIRECT",
  "DOMAIN-SUFFIX,youdao.com,DIRECT",
  "DOMAIN-SUFFIX,wsdvs.com,DIRECT",
  "DOMAIN-SUFFIX,jd.com,DIRECT",
  "DOMAIN-SUFFIX,jd.hk,DIRECT",
  "DOMAIN-SUFFIX,360buyimg.com,DIRECT",
  "DOMAIN-SUFFIX,jdpay.com,DIRECT",
  "DOMAIN-SUFFIX,bilibili.com,DIRECT",
  "DOMAIN-SUFFIX,bilivideo.com,DIRECT",
  "DOMAIN-SUFFIX,bilivideo.cn,DIRECT",
  "DOMAIN-SUFFIX,bilicdn.com,DIRECT",
  "DOMAIN-SUFFIX,bstarstatic.com,DIRECT",
  "DOMAIN-SUFFIX,zhihu.com,DIRECT",
  "DOMAIN-SUFFIX,zhimg.com,DIRECT",
  "DOMAIN-SUFFIX,weibo.com,DIRECT",
  "DOMAIN-SUFFIX,weibo.cn,DIRECT",
  "DOMAIN-SUFFIX,wbimg.com,DIRECT",
  "DOMAIN-SUFFIX,douyin.com,DIRECT",
  "DOMAIN-SUFFIX,douyinpic.com,DIRECT",
  "DOMAIN-SUFFIX,douyincdn.com,DIRECT",
  "DOMAIN-SUFFIX,douyinstatic.com,DIRECT",
  "DOMAIN-SUFFIX,tiktokv.com,DIRECT",
  "DOMAIN-SUFFIX,toutiao.com,DIRECT",
  "DOMAIN-SUFFIX,toutiaoimg.com,DIRECT",
  "DOMAIN-SUFFIX,bytedance.com,DIRECT",
  "DOMAIN-SUFFIX,bdurl.net,DIRECT",
  "DOMAIN-SUFFIX,feishu.cn,DIRECT",
  "DOMAIN-SUFFIX,feishucdn.com,DIRECT",
  "DOMAIN-SUFFIX,larkoffice.com,DIRECT",
  "DOMAIN-SUFFIX,meituan.com,DIRECT",
  "DOMAIN-SUFFIX,meituan.net,DIRECT",
  "DOMAIN-SUFFIX,dianping.com,DIRECT",
  "DOMAIN-SUFFIX,dpfile.com,DIRECT",
  "DOMAIN-SUFFIX,kuaishou.com,DIRECT",
  "DOMAIN-SUFFIX,gifshow.com,DIRECT",
  "DOMAIN-SUFFIX,ks-cdn.com,DIRECT",
  "DOMAIN-SUFFIX,pinduoduo.com,DIRECT",
  "DOMAIN-SUFFIX,pddpic.com,DIRECT",
  "DOMAIN-SUFFIX,yangkeduo.com,DIRECT",
  "DOMAIN-SUFFIX,xiaomi.com,DIRECT",
  "DOMAIN-SUFFIX,mi.com,DIRECT",
  "DOMAIN-SUFFIX,miui.com,DIRECT",
  "DOMAIN-SUFFIX,mifile.cn,DIRECT",
  "DOMAIN-SUFFIX,huawei.com,DIRECT",
  "DOMAIN-SUFFIX,dbankcdn.com,DIRECT",
  "DOMAIN-SUFFIX,hicloud.com,DIRECT",
  "DOMAIN-SUFFIX,vivo.com.cn,DIRECT",
  "DOMAIN-SUFFIX,oppo.com,DIRECT",
  "DOMAIN-SUFFIX,oppomobile.com,DIRECT",
  "DOMAIN-SUFFIX,realme.com,DIRECT",
  "DOMAIN-SUFFIX,steamcontent.com,DIRECT",
  "DOMAIN-SUFFIX,steamstatic.com,DIRECT",
  "DOMAIN-SUFFIX,steam-chat.com,DIRECT",
  "DOMAIN-SUFFIX,xboxlive.com,DIRECT",
  "DOMAIN-SUFFIX,xiaohongshu.com,DIRECT",
  "DOMAIN-SUFFIX,xhscdn.com,DIRECT",
  "DOMAIN-SUFFIX,xhslink.com,DIRECT",
  "DOMAIN-SUFFIX,snssdk.com,DIRECT",
  "DOMAIN-SUFFIX,amemv.com,DIRECT",
  "DOMAIN-SUFFIX,bdstatic.com,DIRECT",
  "DOMAIN-SUFFIX,sina.com,DIRECT",
  "DOMAIN-SUFFIX,sinaimg.cn,DIRECT",
  "DOMAIN-SUFFIX,weibocdn.com,DIRECT",
  "DOMAIN-SUFFIX,sohu.com,DIRECT",
  "DOMAIN-SUFFIX,sohucs.com,DIRECT",
  "DOMAIN-SUFFIX,cctv.com,DIRECT",
  "DOMAIN-SUFFIX,cntv.cn,DIRECT",
  "DOMAIN-SUFFIX,wasu.cn,DIRECT",
  "DOMAIN-SUFFIX,iqiyi.com,DIRECT",
  "DOMAIN-SUFFIX,qiyi.com,DIRECT",
  "DOMAIN-SUFFIX,qy.net,DIRECT",
  "DOMAIN-SUFFIX,youku.com,DIRECT",
  "DOMAIN-SUFFIX,le.com,DIRECT",
  "DOMAIN-SUFFIX,letv.com,DIRECT",
  "DOMAIN-SUFFIX,mgtv.com,DIRECT",
  "DOMAIN-SUFFIX,51.la,DIRECT",
  "DOMAIN-SUFFIX,cnzz.com,DIRECT",
  "DOMAIN-SUFFIX,zoho.com,DIRECT",
  "DOMAIN-SUFFIX,zohocreatorstatic.com,DIRECT",
  "DOMAIN-SUFFIX,duokan.com,DIRECT",
  "DOMAIN-SUFFIX,douyu.com,DIRECT",
  "DOMAIN-SUFFIX,douyusen.com,DIRECT",
  "DOMAIN-SUFFIX,huya.com,DIRECT",
  "DOMAIN-SUFFIX,wangyuan.com,DIRECT",
  "DOMAIN-SUFFIX,58.com,DIRECT",
  "DOMAIN-SUFFIX,58cdn.com,DIRECT",
  "DOMAIN-SUFFIX,ganji.com,DIRECT",
  "DOMAIN-SUFFIX,ctrip.com,DIRECT",
  "DOMAIN-SUFFIX,ctrip.cn,DIRECT",
  "DOMAIN-SUFFIX,ly.com,DIRECT",
  "DOMAIN-SUFFIX,tongcheng.com,DIRECT",
  "DOMAIN-SUFFIX,piao.com,DIRECT",
  "DOMAIN-SUFFIX,mafengwo.cn,DIRECT",
  "DOMAIN-SUFFIX,suning.com,DIRECT",
  "DOMAIN-SUFFIX,suning.cn,DIRECT",
  "DOMAIN-SUFFIX,vip.com,DIRECT",
  "DOMAIN-SUFFIX,dangdang.com,DIRECT",
  "DOMAIN-SUFFIX,koudai.com,DIRECT",
  "DOMAIN-SUFFIX,kaola.com,DIRECT",
  "DOMAIN-SUFFIX,elemecdn.com,DIRECT",
  "DOMAIN-SUFFIX,ele.me,DIRECT",
  "DOMAIN-SUFFIX,kkmh.com,DIRECT",
  "DOMAIN-SUFFIX,dianping.com,DIRECT",
  "DOMAIN-SUFFIX,msstatic.com,DIRECT",
  "DOMAIN-SUFFIX,duowan.com,DIRECT",
  "DOMAIN-SUFFIX,nvidia.com,DIRECT",
  "DOMAIN-SUFFIX,cdnhwc1.com,DIRECT",
  "DOMAIN-SUFFIX,cdnhwc2.com,DIRECT",
  "DOMAIN-SUFFIX,cdnhwc3.com,DIRECT",
  "DOMAIN-SUFFIX,githubusercontent.com,DIRECT",

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
      "filter": "(?i)港|hk|hongkong|hong kong",
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
      "filter": "(?i)日|jp|japan",
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
      "filter": "(?i)美|us|unitedstates|united states",
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
      "filter": "(?i)韩|kr|korea",
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
      "filter": "(?i)台|tw|taiwan",
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
      "filter": "(?i)新|sg|singapore",
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
      "filter": "(?i)英|uk|united kingdom|great britain",
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
      "filter": "(?i)德|de|germany",
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
      "filter": "(?i)法|fr|france",
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
      "filter": "(?i)印|in|india",
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
      "filter": "(?i)澳|mo|macau",
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
      "filter": "(?i)马来|my|malaysia",
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
      "filter": "(?i)荷|nl|netherlands",
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
      "filter": "(?i)立陶宛|lt|lithuania",
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
      "filter": "(?i)^(?!.*(?:港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates|韩|kr|korea|英|uk|united kingdom|德|de|germany|法|fr|france|印|in|india|澳|mo|macau|马来|my|malaysia|荷|nl|netherlands|立陶宛|lt|lithuania)).*",
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
      "proxies": ["DIRECT", "节点选择"],
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
