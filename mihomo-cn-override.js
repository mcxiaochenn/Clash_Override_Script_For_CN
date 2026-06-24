// ============================================================================
// Clash Override Script For CN
// 基于 Loyalsoldier/clash-rules 的覆写脚本
// 适用于 mihomo (Clash Meta) 内核 + Clash Verge Rev
//
// 版本：v2026.06.24.r2
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

// kelee.one 规则集通用配置（YAML 格式）
const keleeRuleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "behavior": "classical",
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
  },

  // ---- kelee.one 规则集 ----
  // AI 服务规则
  "kelee-ai": {
    ...keleeRuleProviderCommon,
    "url": "https://kelee.one/Tool/Clash/Rule/AI.yaml",
    "path": "./ruleset/kelee-ai.yaml"
  },
  // TikTok 规则
  "kelee-tiktok": {
    ...keleeRuleProviderCommon,
    "url": "https://kelee.one/Tool/Clash/Rule/TikTok.yaml",
    "path": "./ruleset/kelee-tiktok.yaml"
  },
  // Speedtest 国际版规则
  "kelee-speedtest": {
    ...keleeRuleProviderCommon,
    "url": "https://kelee.one/Tool/Clash/Rule/SpeedtestInternational.yaml",
    "path": "./ruleset/kelee-speedtest.yaml"
  },
  // 游戏规则
  "kelee-game": {
    ...keleeRuleProviderCommon,
    "url": "https://kelee.one/Tool/Clash/Rule/Game.yaml",
    "path": "./ruleset/kelee-game.yaml"
  },
  // Netflix 规则
  "kelee-netflix": {
    ...keleeRuleProviderCommon,
    "url": "https://rule.kelee.one/Clash/Netflix.yaml",
    "path": "./ruleset/kelee-netflix.yaml"
  },
  // ESET 中国规则
  "kelee-eset": {
    ...keleeRuleProviderCommon,
    "url": "https://kelee.one/Tool/Clash/Rule/ESET_China.yaml",
    "path": "./ruleset/kelee-eset.yaml"
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

  // ===== Apple 证书验证（OCSP）=====
  "DOMAIN,developer.apple.com,节点选择",
  "DOMAIN-SUFFIX,digicert.com,节点选择",
  "DOMAIN,ocsp.apple.com,节点选择",
  "DOMAIN,ocsp.comodoca.com,节点选择",
  "DOMAIN,ocsp.usertrust.com,节点选择",
  "DOMAIN,ocsp.sectigo.com,节点选择",
  "DOMAIN,ocsp.verisign.net,节点选择",

  // ===== Apple 服务（需要代理）=====
  "DOMAIN-SUFFIX,apple-dns.net,节点选择",
  "DOMAIN,testflight.apple.com,节点选择",
  "DOMAIN,sandbox.itunes.apple.com,节点选择",
  "DOMAIN,itunes.apple.com,节点选择",
  "DOMAIN-SUFFIX,apps.apple.com,节点选择",
  "DOMAIN-SUFFIX,blobstore.apple.com,节点选择",
  "DOMAIN,cvws.icloud-content.com,节点选择",

  // ===== Apple CDN 直连 =====
  "DOMAIN-SUFFIX,mzstatic.com,苹果服务",
  "DOMAIN-SUFFIX,icloud.com,苹果服务",
  "DOMAIN-SUFFIX,icloud-content.com,苹果服务",
  "DOMAIN-SUFFIX,me.com,苹果服务",
  "DOMAIN-SUFFIX,aaplimg.com,苹果服务",
  "DOMAIN-SUFFIX,cdn20.com,苹果服务",
  "DOMAIN-SUFFIX,cdn-apple.com,苹果服务",
  "DOMAIN-SUFFIX,akadns.net,苹果服务",
  "DOMAIN-SUFFIX,akamaiedge.net,苹果服务",
  "DOMAIN-SUFFIX,edgekey.net,苹果服务",
  "DOMAIN-SUFFIX,mwcloudcdn.com,苹果服务",
  "DOMAIN-SUFFIX,mwcname.com,苹果服务",
  "DOMAIN-SUFFIX,apple.com,苹果服务",
  "DOMAIN-SUFFIX,apple-cloudkit.com,苹果服务",
  "DOMAIN-SUFFIX,apple-mapkit.com,苹果服务",

  // ===== Google CN 服务 =====
  "DOMAIN-SUFFIX,googleapis.cn,节点选择",
  "DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择",
  "DOMAIN-SUFFIX,gstatic.com,节点选择",

  // ===== 安全浏览直连 =====
  "DOMAIN,safebrowsing.urlsec.qq.com,全局直连",
  "DOMAIN,safebrowsing.googleapis.com,全局直连",

  // ===== Microsoft 服务 =====
  "DOMAIN,cn.bing.com,全局直连",
  "DOMAIN-SUFFIX,microsoft.com,微软服务",
  "DOMAIN-SUFFIX,microsoftonline.com,微软服务",
  "DOMAIN-SUFFIX,office.com,微软服务",
  "DOMAIN-SUFFIX,office365.com,微软服务",
  "DOMAIN-KEYWORD,officecdn,微软服务",
  "DOMAIN-SUFFIX,live.com,微软服务",
  "DOMAIN-SUFFIX,live.net,微软服务",
  "DOMAIN-SUFFIX,hotmail.com,微软服务",
  "DOMAIN-SUFFIX,bing.com,微软服务",
  "DOMAIN-SUFFIX,outlook.com,微软服务",
  "DOMAIN-SUFFIX,onedrive.com,微软服务",
  "DOMAIN-SUFFIX,onenote.com,微软服务",
  "DOMAIN-SUFFIX,msedge.net,微软服务",

  // ===== 国内域名直连 =====
  "DOMAIN-SUFFIX,126.com,DIRECT",
  "DOMAIN-SUFFIX,126.net,DIRECT",
  "DOMAIN-SUFFIX,127.net,DIRECT",
  "DOMAIN-SUFFIX,163.com,DIRECT",
  "DOMAIN-SUFFIX,360buyimg.com,DIRECT",
  "DOMAIN-SUFFIX,36kr.com,DIRECT",
  "DOMAIN-SUFFIX,acfun.tv,DIRECT",
  "DOMAIN-SUFFIX,air-matters.com,DIRECT",
  "DOMAIN-SUFFIX,aixifan.com,DIRECT",
  "DOMAIN-KEYWORD,alicdn,DIRECT",
  "DOMAIN-KEYWORD,alipay,DIRECT",
  "DOMAIN-KEYWORD,taobao,DIRECT",
  "DOMAIN-SUFFIX,amap.com,DIRECT",
  "DOMAIN-SUFFIX,autonavi.com,DIRECT",
  "DOMAIN-KEYWORD,baidu,DIRECT",
  "DOMAIN-SUFFIX,bdimg.com,DIRECT",
  "DOMAIN-SUFFIX,bdstatic.com,DIRECT",
  "DOMAIN-SUFFIX,bilibili.com,DIRECT",
  "DOMAIN-SUFFIX,bilivideo.com,DIRECT",
  "DOMAIN-SUFFIX,caiyunapp.com,DIRECT",
  "DOMAIN-SUFFIX,clouddn.com,DIRECT",
  "DOMAIN-SUFFIX,cnbeta.com,DIRECT",
  "DOMAIN-SUFFIX,cnbetacdn.com,DIRECT",
  "DOMAIN-SUFFIX,cootekservice.com,DIRECT",
  "DOMAIN-SUFFIX,csdn.net,DIRECT",
  "DOMAIN-SUFFIX,ctrip.com,DIRECT",
  "DOMAIN-SUFFIX,dgtle.com,DIRECT",
  "DOMAIN-SUFFIX,dianping.com,DIRECT",
  "DOMAIN-SUFFIX,douban.com,DIRECT",
  "DOMAIN-SUFFIX,doubanio.com,DIRECT",
  "DOMAIN-SUFFIX,duokan.com,DIRECT",
  "DOMAIN-SUFFIX,easou.com,DIRECT",
  "DOMAIN-SUFFIX,ele.me,DIRECT",
  "DOMAIN-SUFFIX,feng.com,DIRECT",
  "DOMAIN-SUFFIX,fir.im,DIRECT",
  "DOMAIN-SUFFIX,frdic.com,DIRECT",
  "DOMAIN-SUFFIX,g-cores.com,DIRECT",
  "DOMAIN-SUFFIX,godic.net,DIRECT",
  "DOMAIN-SUFFIX,gtimg.com,DIRECT",
  "DOMAIN,cdn.hockeyapp.net,DIRECT",
  "DOMAIN-SUFFIX,hongxiu.com,DIRECT",
  "DOMAIN-SUFFIX,hxcdn.net,DIRECT",
  "DOMAIN-SUFFIX,iciba.com,DIRECT",
  "DOMAIN-SUFFIX,ifeng.com,DIRECT",
  "DOMAIN-SUFFIX,ifengimg.com,DIRECT",
  "DOMAIN-SUFFIX,ipip.net,DIRECT",
  "DOMAIN-SUFFIX,iqiyi.com,DIRECT",
  "DOMAIN-SUFFIX,jd.com,DIRECT",
  "DOMAIN-SUFFIX,jianshu.com,DIRECT",
  "DOMAIN-SUFFIX,knewone.com,DIRECT",
  "DOMAIN-SUFFIX,le.com,DIRECT",
  "DOMAIN-SUFFIX,lecloud.com,DIRECT",
  "DOMAIN-SUFFIX,lemicp.com,DIRECT",
  "DOMAIN-SUFFIX,licdn.com,DIRECT",
  "DOMAIN-SUFFIX,luoo.net,DIRECT",
  "DOMAIN-SUFFIX,meituan.com,DIRECT",
  "DOMAIN-SUFFIX,meituan.net,DIRECT",
  "DOMAIN-SUFFIX,mi.com,DIRECT",
  "DOMAIN-SUFFIX,miaopai.com,DIRECT",
  "DOMAIN-SUFFIX,miui.com,DIRECT",
  "DOMAIN-SUFFIX,miwifi.com,DIRECT",
  "DOMAIN-SUFFIX,mob.com,DIRECT",
  "DOMAIN-SUFFIX,netease.com,DIRECT",
  "DOMAIN-SUFFIX,oschina.net,DIRECT",
  "DOMAIN-SUFFIX,ppsimg.com,DIRECT",
  "DOMAIN-SUFFIX,pstatp.com,DIRECT",
  "DOMAIN-SUFFIX,qcloud.com,DIRECT",
  "DOMAIN-SUFFIX,qdaily.com,DIRECT",
  "DOMAIN-SUFFIX,qdmm.com,DIRECT",
  "DOMAIN-SUFFIX,qhimg.com,DIRECT",
  "DOMAIN-SUFFIX,qhres.com,DIRECT",
  "DOMAIN-SUFFIX,qidian.com,DIRECT",
  "DOMAIN-SUFFIX,qihucdn.com,DIRECT",
  "DOMAIN-SUFFIX,qiniu.com,DIRECT",
  "DOMAIN-SUFFIX,qiniucdn.com,DIRECT",
  "DOMAIN-SUFFIX,qiyipic.com,DIRECT",
  "DOMAIN-SUFFIX,qq.com,DIRECT",
  "DOMAIN-SUFFIX,qqurl.com,DIRECT",
  "DOMAIN-SUFFIX,ruguoapp.com,DIRECT",
  "DOMAIN-SUFFIX,segmentfault.com,DIRECT",
  "DOMAIN-SUFFIX,sinaapp.com,DIRECT",
  "DOMAIN-SUFFIX,smzdm.com,DIRECT",
  "DOMAIN-SUFFIX,snapdrop.net,DIRECT",
  "DOMAIN-SUFFIX,sogou.com,DIRECT",
  "DOMAIN-SUFFIX,sogoucdn.com,DIRECT",
  "DOMAIN-SUFFIX,sohu.com,DIRECT",
  "DOMAIN-SUFFIX,soku.com,DIRECT",
  "DOMAIN-SUFFIX,speedtest.net,DIRECT",
  "DOMAIN-SUFFIX,sspai.com,DIRECT",
  "DOMAIN-SUFFIX,suning.com,DIRECT",
  "DOMAIN-SUFFIX,taobao.com,DIRECT",
  "DOMAIN-SUFFIX,tencent.com,DIRECT",
  "DOMAIN-SUFFIX,tenpay.com,DIRECT",
  "DOMAIN-SUFFIX,tianyancha.com,DIRECT",
  "DOMAIN-SUFFIX,tmall.com,DIRECT",
  "DOMAIN-SUFFIX,tudou.com,DIRECT",
  "DOMAIN-SUFFIX,umetrip.com,DIRECT",
  "DOMAIN-SUFFIX,upaiyun.com,DIRECT",
  "DOMAIN-SUFFIX,upyun.com,DIRECT",
  "DOMAIN-SUFFIX,veryzhun.com,DIRECT",
  "DOMAIN-SUFFIX,weather.com,DIRECT",
  "DOMAIN-SUFFIX,weibo.com,DIRECT",
  "DOMAIN-SUFFIX,xiami.com,DIRECT",
  "DOMAIN-SUFFIX,xiami.net,DIRECT",
  "DOMAIN-SUFFIX,xiaomicp.com,DIRECT",
  "DOMAIN-SUFFIX,ximalaya.com,DIRECT",
  "DOMAIN-SUFFIX,xmcdn.com,DIRECT",
  "DOMAIN-SUFFIX,xunlei.com,DIRECT",
  "DOMAIN-SUFFIX,yhd.com,DIRECT",
  "DOMAIN-SUFFIX,yihaodianimg.com,DIRECT",
  "DOMAIN-SUFFIX,yinxiang.com,DIRECT",
  "DOMAIN-SUFFIX,ykimg.com,DIRECT",
  "DOMAIN-SUFFIX,youdao.com,DIRECT",
  "DOMAIN-SUFFIX,youku.com,DIRECT",
  "DOMAIN-SUFFIX,zealer.com,DIRECT",
  "DOMAIN-SUFFIX,zhihu.com,DIRECT",
  "DOMAIN-SUFFIX,zhimg.com,DIRECT",
  "DOMAIN-SUFFIX,zimuzu.tv,DIRECT",
  "DOMAIN-SUFFIX,zoho.com,DIRECT",

  // ===== Loyalsoldier 规则集 =====
  "RULE-SET,applications,全局直连",
  "RULE-SET,private,全局直连",
  "RULE-SET,reject,广告过滤",
  "RULE-SET,proxy,节点选择",
  "RULE-SET,gfw,节点选择",
  "RULE-SET,direct,全局直连",
  "RULE-SET,lancidr,全局直连,no-resolve",
  "RULE-SET,cncidr,全局直连,no-resolve",
  "RULE-SET,telegramcidr,电报消息,no-resolve",

  // ===== AI 服务 =====
  "RULE-SET,kelee-ai,AI",

  // ===== TikTok =====
  "RULE-SET,kelee-tiktok,TikTok",

  // ===== Netflix =====
  "RULE-SET,kelee-netflix,Netflix",

  // ===== Speedtest 国际版 =====
  "RULE-SET,kelee-speedtest,Speedtest国际",

  // ===== 游戏 =====
  "RULE-SET,kelee-game,游戏选择",

  // ===== ESET 中国 =====
  "RULE-SET,kelee-eset,全局直连",

  // ===== 广告过滤关键字 =====
  "DOMAIN-KEYWORD,admarvel,广告过滤",
  "DOMAIN-KEYWORD,admaster,广告过滤",
  "DOMAIN-KEYWORD,adsage,广告过滤",
  "DOMAIN-KEYWORD,adsmogo,广告过滤",
  "DOMAIN-KEYWORD,adsrvmedia,广告过滤",
  "DOMAIN-KEYWORD,adwords,广告过滤",
  "DOMAIN-KEYWORD,adservice,广告过滤",
  "DOMAIN-SUFFIX,appsflyer.com,广告过滤",
  "DOMAIN-KEYWORD,domob,广告过滤",
  "DOMAIN-SUFFIX,doubleclick.net,广告过滤",
  "DOMAIN-KEYWORD,duomeng,广告过滤",
  "DOMAIN-KEYWORD,dwtrack,广告过滤",
  "DOMAIN-KEYWORD,guanggao,广告过滤",
  "DOMAIN-KEYWORD,lianmeng,广告过滤",
  "DOMAIN-SUFFIX,mmstat.com,广告过滤",
  "DOMAIN-KEYWORD,mopub,广告过滤",
  "DOMAIN-KEYWORD,omgmta,广告过滤",
  "DOMAIN-KEYWORD,openx,广告过滤",
  "DOMAIN-KEYWORD,partnerad,广告过滤",
  "DOMAIN-KEYWORD,pingfore,广告过滤",
  "DOMAIN-KEYWORD,supersonicads,广告过滤",
  "DOMAIN-KEYWORD,uedas,广告过滤",
  "DOMAIN-KEYWORD,umeng,广告过滤",
  "DOMAIN-KEYWORD,usage,广告过滤",
  "DOMAIN-SUFFIX,vungle.com,广告过滤",
  "DOMAIN-KEYWORD,wlmonitor,广告过滤",
  "DOMAIN-KEYWORD,zjtoolbar,广告过滤",

  // ===== DOMAIN-KEYWORD 代理规则（补充 Loyalsoldier）=====
  "DOMAIN-KEYWORD,amazon,节点选择",
  "DOMAIN-KEYWORD,google,节点选择",
  "DOMAIN-KEYWORD,gmail,节点选择",
  "DOMAIN-KEYWORD,youtube,节点选择",
  "DOMAIN-KEYWORD,facebook,节点选择",
  "DOMAIN-SUFFIX,fb.me,节点选择",
  "DOMAIN-SUFFIX,fbcdn.net,节点选择",
  "DOMAIN-KEYWORD,twitter,节点选择",
  "DOMAIN-KEYWORD,instagram,节点选择",
  "DOMAIN-KEYWORD,dropbox,节点选择",
  "DOMAIN-SUFFIX,twimg.com,节点选择",
  "DOMAIN-KEYWORD,blogspot,节点选择",
  "DOMAIN-SUFFIX,youtu.be,节点选择",
  "DOMAIN-KEYWORD,whatsapp,节点选择",

  // ===== Google CN IP 直连 =====
  "IP-CIDR,120.232.181.162/32,全局直连,no-resolve",
  "IP-CIDR,120.241.147.226/32,全局直连,no-resolve",
  "IP-CIDR,120.253.253.226/32,全局直连,no-resolve",
  "IP-CIDR,120.253.255.162/32,全局直连,no-resolve",
  "IP-CIDR,120.253.255.34/32,全局直连,no-resolve",
  "IP-CIDR,120.253.255.98/32,全局直连,no-resolve",
  "IP-CIDR,180.163.150.162/32,全局直连,no-resolve",
  "IP-CIDR,180.163.150.34/32,全局直连,no-resolve",
  "IP-CIDR,180.163.151.162/32,全局直连,no-resolve",
  "IP-CIDR,180.163.151.34/32,全局直连,no-resolve",
  "IP-CIDR,203.208.39.0/24,全局直连,no-resolve",
  "IP-CIDR,203.208.40.0/24,全局直连,no-resolve",
  "IP-CIDR,203.208.41.0/24,全局直连,no-resolve",
  "IP-CIDR,203.208.43.0/24,全局直连,no-resolve",
  "IP-CIDR,203.208.50.0/24,全局直连,no-resolve",
  "IP-CIDR,220.181.174.162/32,全局直连,no-resolve",
  "IP-CIDR,220.181.174.226/32,全局直连,no-resolve",
  "IP-CIDR,220.181.174.34/32,全局直连,no-resolve",

  // ===== 其他规则 =====
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
    },
    {
      ...groupBaseOption,
      "name": "TikTok",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/tiktok.svg"
    },
    {
      ...groupBaseOption,
      "name": "Netflix",
      "type": "select",
      "proxies": ["🇺🇸 美国", "🇭🇰 香港", "🇯🇵 日本", "🇸🇬 新加坡", "节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/netflix.svg"
    },
    {
      ...groupBaseOption,
      "name": "Speedtest国际",
      "type": "select",
      "proxies": ["节点选择", "DIRECT"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speedtest.svg"
    },
    {
      ...groupBaseOption,
      "name": "游戏选择",
      "type": "select",
      "proxies": ["DIRECT", "节点选择"],
      "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/game.svg"
    }
  ];

  // 覆盖规则集和规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  return config;
}
