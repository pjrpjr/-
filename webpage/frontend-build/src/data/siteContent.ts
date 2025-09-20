import type { LandingPageContent } from "../lib/types";

export const landingPageContent: LandingPageContent = {
  hero: {
    eyebrow: "模卡即刻平台",
    title: "3 步开启 AI 模板变现",
    subtitle: "训练自有模特模型，一键复刻、批量授权，让模卡作品在合规框架下持续带来积分收入。",
    steps: [
      {
        id: "upload",
        title: "上传训练成果",
        description: "拖拽 30 张模卡成片，填写模型亮点与授权范围。"
      },
      {
        id: "review",
        title: "提交模板审核",
        description: "AI 预检 + 人工复核，平均 4 小时给出结果。"
      },
      {
        id: "launch",
        title: "上线赚积分",
        description: "模板上线即加入复刻池，实时查看收益和复刻热度。"
      }
    ],
    ctas: [
      {
        label: "立即上传素材",
        href: "#creator-onboarding",
        tone: "primary"
      },
      {
        label: "查看收益案例",
        href: "#case-studies",
        tone: "secondary"
      }
    ],
    metrics: [
      {
        label: "创作者累计收益",
        value: "¥2.3M",
        tooltip: "含复刻分成 + 授权收入"
      },
      {
        label: "模板月度复刻数",
        value: "12.5K",
        tooltip: "过去 30 日全平台复刻量"
      },
      {
        label: "平均审核时长",
        value: "3.8 小时",
        tooltip: "含 AI 初筛与人工复核"
      }
    ],
    carousel: [
      {
        id: "account-a",
        account: "@模卡小吴",
        avatarUrl: "https://dummyimage.com/72x72/2563eb/ffffff.png&text=W",
        earning: "¥18,460 / 周",
        replicas: 724,
        authorizations: 52,
        trend: "up",
        templatePreview: "https://dummyimage.com/280x160/f1f5f9/94a3b8.png&text=Look+Book",
        workflowLink: "#"
      },
      {
        id: "account-b",
        account: "@星河制片",
        avatarUrl: "https://dummyimage.com/72x72/14b8a6/ffffff.png&text=S",
        earning: "¥12,320 / 周",
        replicas: 506,
        authorizations: 34,
        trend: "steady",
        templatePreview: "https://dummyimage.com/280x160/f8fafc/cbd5f5.png&text=Studio",
        workflowLink: "#"
      },
      {
        id: "account-c",
        account: "@FutureMuse",
        avatarUrl: "https://dummyimage.com/72x72/f97316/ffffff.png&text=F",
        earning: "¥9,870 / 周",
        replicas: 388,
        authorizations: 27,
        trend: "up",
        templatePreview: "https://dummyimage.com/280x160/ede9fe/c4b5fd.png&text=Cyber+Set",
        workflowLink: "#"
      }
    ]
  },
  monetization: {
    title: "多渠道积分增收路径",
    description: "从模卡复刻到企业授权，全流程都有标准化工具和清晰收益结算。",
    stages: [
      {
        id: "replica",
        title: "复刻出图",
        description: "用户消耗积分一键复刻，创作者按阶梯抽成即时入账。",
        highlight: "Top 模板月均复刻 1,200+ 次",
        nextAction: "查看积分分成计算"
      },
      {
        id: "license",
        title: "授权许可",
        description: "企业按场景获取授权，支持批量导入合作账号与到期提醒。",
        highlight: "授权有效期支持 1-12 个月自定义",
        nextAction: "配置授权协议"
      },
      {
        id: "training",
        title: "定制训练",
        description: "按需付费训练升级模型，任务中心实时查看 GPU 占用与进度。",
        highlight: "系统自动产出训练复盘与素材诊断",
        nextAction: "预约训练档期"
      }
    ]
  },
  caseStudies: [
    {
      id: "case-1",
      name: "南城模特工坊",
      avatarUrl: "https://dummyimage.com/56x56/6366f1/ffffff.png&text=N",
      coverUrl: "/images/cases/case-douyin-20250917.jpg",
      industry: "线下模特机构",
      summary: "3 个月上线 12 套模板，打造“周更”复刻专栏，会员复购率提升 46%。",
      metrics: [
        { label: "复刻转化", value: "+58%", trend: "同比" },
        { label: "授权满意度", value: "4.8/5" },
        { label: "任务完成率", value: "99%" }
      ],
      testimonial: {
        author: "运营负责人 林芷",
        role: "运营负责人",
        quote: "任务中心能实时看到复刻消耗，授权到期前会提醒续签，运营负担下降了一半。"
      }
    },
    {
      id: "case-2",
      name: "Muse Collective",
      avatarUrl: "https://dummyimage.com/56x56/0ea5e9/ffffff.png&text=M",
      coverUrl: "/images/cases/case-livestream-20250917.jpg",
      industry: "独立创作者团队",
      summary: "通过加速套餐曝光位配合直播活动，模板周转率提升 3.2 倍。",
      metrics: [
        { label: "积分收入", value: "¥86K", trend: "同比" },
        { label: "复刻数", value: "4,620" },
        { label: "授权续签率", value: "92%" }
      ],
      testimonial: {
        author: "主理人 Liya",
        role: "创作者",
        quote: "合规模板提示做得很细，团队新人也能快速上手上线模板。"
      }
    },
    {
      id: "case-3",
      name: "星河互动",
      avatarUrl: "https://dummyimage.com/56x56/f97316/ffffff.png&text=G",
      coverUrl: "/images/cases/case-xiaohongshu-20250917.jpg",
      industry: "MCN",
      summary: "接入企业模板授权后，B 端签约模卡贡献了 40% 新增积分。",
      metrics: [
        { label: "企业授权数", value: "38" },
        { label: "积分退款率", value: "<1%" },
        { label: "复刻满意度", value: "4.9/5" }
      ],
      testimonial: {
        author: "商务经理 郁晨",
        role: "商务经理",
        quote: "授权合同模板和日志都在后台，法务审阅成本极低。"
      }
    }
  ],
  templates: [
    {
      id: "tpl-aurora",
      title: "极光都会街拍",
      category: "城市街景",
      coverUrl: "https://dummyimage.com/320x200/bae6fd/0f172a.png&text=Aurora",
      creator: "@模卡小吴",
      score: 4.9,
      price: 1,
      favorite: true,
      status: "available",
      tags: ["精选", "热卖"],
      parameters: {
        requirement: "35 张模卡 JPG",
        assets: "含 4 套造型说明",
        duration: "约 36 分钟"
      }
    },
    {
      id: "tpl-atelier",
      title: "法式工作室写意",
      category: "棚拍",
      coverUrl: "https://dummyimage.com/320x200/fce7f3/831843.png&text=Atelier",
      creator: "@星河制片",
      score: 4.8,
      price: 2,
      status: "available",
      tags: ["授权优选"],
      parameters: {
        requirement: "40 张高清 PNG",
        assets: "含灯光布置指南",
        duration: "约 52 分钟"
      }
    },
    {
      id: "tpl-cyber",
      title: "赛博夜幕",
      category: "概念",
      coverUrl: "https://dummyimage.com/320x200/f3e8ff/5b21b6.png&text=Cyber",
      creator: "@FutureMuse",
      score: 4.7,
      price: 3,
      status: "cooldown",
      tags: ["排队", "高分"],
      parameters: {
        requirement: "50 张训练素材",
        assets: "含材质包下载",
        duration: "约 1 小时"
      }
    },
    {
      id: "tpl-campus",
      title: "青春校园日记",
      category: "校园",
      coverUrl: "https://dummyimage.com/320x200/fee2e2/b91c1c.png&text=Campus",
      creator: "@ChillGirl",
      score: 4.6,
      price: 1,
      status: "pending",
      tags: ["审核中"],
      parameters: {
        requirement: "30 张模特写",
        assets: "含授权协议",
        duration: "待审核"
      }
    },
    {
      id: "tpl-heritage",
      title: "东方礼服艺术",
      category: "礼服",
      coverUrl: "https://dummyimage.com/320x200/fef3c7/92400e.png&text=Heritage",
      creator: "@锦衣社",
      score: 4.9,
      price: 4,
      status: "available",
      tags: ["高端授权"],
      parameters: {
        requirement: "60 张高清 RAW",
        assets: "含授权模板",
        duration: "约 2 小时"
      }
    },
    {
      id: "tpl-sport",
      title: "动感运动棚拍",
      category: "运动",
      coverUrl: "https://dummyimage.com/320x200/ccfbf1/0f766e.png&text=Sport",
      creator: "@动力基因",
      score: 4.5,
      price: 2,
      status: "available",
      tags: ["热卖"],
      parameters: {
        requirement: "28 张动作素材",
        assets: "含动态捕捉指南",
        duration: "约 45 分钟"
      }
    },
    {
      id: "tpl-fantasy",
      title: "奇幻古堡",
      category: "奇幻",
      coverUrl: "https://dummyimage.com/320x200/ede9fe/7c3aed.png&text=Fantasy",
      creator: "@空境工作室",
      score: 4.4,
      price: 3,
      status: "locked",
      tags: ["需授权"],
      parameters: {
        requirement: "45 张故事向素材",
        assets: "附授权流程",
        duration: "待授权"
      }
    },
    {
      id: "tpl-metro",
      title: "地铁日常纪实",
      category: "纪实",
      coverUrl: "https://dummyimage.com/320x200/e2e8f0/1e293b.png&text=Metro",
      creator: "@CityFrame",
      score: 4.3,
      price: 1,
      status: "available",
      tags: ["新上架"],
      parameters: {
        requirement: "32 张街拍素材",
        assets: "含取景建议",
        duration: "约 28 分钟"
      }
    }
  ],
  compliance: {
    title: "合规提示",
    description: "提交和复刻流程遵循平台审查规范，关键节点会自动触发提醒。",
    highlights: [
      {
        label: "资料完整性检测",
        detail: "系统校验人像权属、拍摄授权与肖像证明。",
        tone: "info"
      },
      {
        label: "AI 风险预警",
        detail: "自动识别 NSFW/敏感元素，提供替换建议。",
        tone: "warning"
      },
      {
        label: "违规整改流程",
        detail: "驳回附带整改建议与提交截止时间，支持一键更新。",
        tone: "danger"
      }
    ],
    helpLinks: [
      { label: "查看审核标准", href: "#" },
      { label: "下载授权模板", href: "#" },
      { label: "了解退款政策", href: "#" }
    ]
  },
  quickStart: {
    title: "快速上手任务清单",
    subtitle: "完成以下步骤即可上线首批模板，任务中心会记录每次提交。",
    checklist: [
      { id: "1", label: "导入模卡素材，确认版权文件", status: "done" },
      { id: "2", label: "填写模板说明与预估收益", status: "pending" },
      { id: "3", label: "提交审核并等待结果", status: "pending" },
      { id: "4", label: "发布模板并开启复刻", status: "locked" }
    ],
    actions: [
      { label: "创建训练任务", href: "#tasks" },
      { label: "预约合规顾问", href: "#support", tone: "secondary" }
    ]
  },
  personas: [
    {
      role: "viewer",
      title: "创作者收益面板",
      icon: "/icons/persona-viewer.svg",
      description: "查看模板热度、复刻动向与积分入账状态。",
      shortcuts: [
        { label: "打开任务中心", href: "#tasks" },
        { label: "充值积分", href: "#topup" }
      ]
    },
    {
      role: "creator",
      title: "创作者工作台",
      icon: "/icons/persona-creator.svg",
      description: "管理模板、处理授权、监控训练进度。",
      shortcuts: [
        { label: "提交新模板", href: "#creator-onboarding" },
        { label: "查看授权请求", href: "#license" }
      ]
    }
  ],
  initialEvents: [
    {
      id: "evt-1",
      type: "render",
      status: "running",
      label: "地铁日常纪实 - 出图 x24",
      timestamp: "2025-09-16T11:20:00+08:00",
      progress: 68,
      context: "GPU A2-4 实例",
      impact: "本次扣除 24 积分",
      stage: "processing",
      nextEta: "2025-09-16T11:45:00+08:00",
      queuePosition: 1,
      policyTag: null,
      actionRequired: null,
      riskLevel: "medium",
      escalationLevel: "none",
      creditBalance: 864,
      personaTag: "creator_studio"
    },
    {
      id: "evt-2",
      type: "license",
      status: "queued",
      label: "星河互动企业授权续签",
      timestamp: "2025-09-16T10:50:00+08:00",
      context: "待创作者确认授权范围",
      impact: "预计达成 ¥12,000 积分",
      stage: "ingest",
      nextEta: "2025-09-16T11:10:00+08:00",
      queuePosition: 3,
      policyTag: null,
      actionRequired: null,
      riskLevel: "low",
      escalationLevel: "none",
      creditBalance: 910,
      personaTag: "operator_contractor"
    },
    {
      id: "evt-3",
      type: "training",
      status: "success",
      label: "极光都会街拍 - 模型增量训练",
      timestamp: "2025-09-16T09:10:00+08:00",
      context: "耗时 42 分钟，已生成复盘报告",
      impact: "消耗 80 积分",
      stage: "delivery",
      nextEta: null,
      queuePosition: null,
      policyTag: null,
      actionRequired: null,
      riskLevel: "low",
      escalationLevel: "none",
      creditBalance: 932,
      personaTag: "creator_studio"
    }
  ]
};


