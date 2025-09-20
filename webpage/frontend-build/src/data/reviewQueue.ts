import type { ReviewSubmission } from "../lib/types";

export const reviewQueueMock: ReviewSubmission[] = [
  {
    id: "submission-1001",
    templateId: "tpl-aurora",
    templateName: "极光都会街拍",
    creatorId: "creator-001",
    creatorHandle: "@模卡小吴",
    submittedAt: "2025-09-16T20:25:00+08:00",
    status: "pending",
    priority: "high",
    riskScore: 0.28,
    assets: [
      {
        id: "asset-aurora-thumb",
        type: "image",
        label: "缩略图",
        thumbnailUrl: "https://dummyimage.com/160x100/f1f5f9/1f2937.png&text=Aurora",
        downloadUrl: "https://dummyimage.com/1024x640/0f172a/ffffff.png&text=Aurora+RAW"
      }
    ],
    licenses: [
      {
        id: "license-202509",
        holder: "星光模特经纪",
        expiresAt: "2026-03-01T00:00:00+08:00",
        scope: "线上广告"
      }
    ],
    aiFindings: [
      {
        label: "人像检测通过",
        confidence: 0.96
      }
    ],
    history: [
      {
        actor: "system",
        action: "submitted",
        timestamp: "2025-09-16T20:25:02+08:00",
        note: "训练成果自动同步"
      }
    ],
    violations: [],
    actions: [
      { action: "approve", label: "通过审核", slaMinutes: 30 },
      { action: "reject", label: "驳回", confirmation: true },
      { action: "hold", label: "暂缓", slaMinutes: 120 }
    ]
  },
  {
    id: "submission-1002",
    templateId: "tpl-atelier",
    templateName: "法式工作室写意",
    creatorId: "creator-017",
    creatorHandle: "@星河制片",
    submittedAt: "2025-09-16T19:40:00+08:00",
    status: "recheck",
    priority: "medium",
    riskScore: 0.62,
    assets: [
      {
        id: "asset-atelier-thumb",
        type: "image",
        label: "缩略图",
        thumbnailUrl: "https://dummyimage.com/160x100/fce7f3/831843.png&text=Atelier",
        downloadUrl: "https://dummyimage.com/1024x640/831843/ffffff.png&text=Atelier+RAW"
      }
    ],
    licenses: [
      {
        id: "license-202508",
        holder: "星河制片",
        expiresAt: "2025-12-31T00:00:00+08:00",
        scope: "线下宣传"
      }
    ],
    aiFindings: [
      {
        label: "背景 AI 合成疑似",
        confidence: 0.52,
        previewUrl: "https://dummyimage.com/360x220/fee2f2/9f1239.png&text=AI+Flag"
      }
    ],
    history: [
      {
        actor: "auditor-lu",
        action: "hold",
        timestamp: "2025-09-16T19:55:00+08:00",
        note: "等待补充授权"
      }
    ],
    violations: [
      {
        code: "missing-license",
        label: "授权文件待补充",
        resolved: false
      }
    ],
    actions: [
      { action: "approve", label: "通过审核" },
      { action: "reject", label: "驳回", confirmation: true },
      { action: "hold", label: "继续暂缓" },
      { action: "escalate", label: "指派二次复核" }
    ]
  },
  {
    id: "submission-1003",
    templateId: "tpl-campus",
    templateName: "青春校园日记",
    creatorId: "creator-034",
    creatorHandle: "@ChillGirl",
    submittedAt: "2025-09-16T18:05:00+08:00",
    status: "blocked",
    priority: "high",
    riskScore: 0.83,
    assets: [
      {
        id: "asset-campus-thumb",
        type: "image",
        label: "缩略图",
        thumbnailUrl: "https://dummyimage.com/160x100/fee2e2/b91c1c.png&text=Campus",
        downloadUrl: "https://dummyimage.com/1024x640/b91c1c/ffffff.png&text=Campus+RAW"
      }
    ],
    licenses: [],
    aiFindings: [
      {
        label: "疑似敏感姿势",
        confidence: 0.78,
        previewUrl: "https://dummyimage.com/360x220/fee2e2/b91c1c.png&text=NSFW"
      }
    ],
    history: [
      {
        actor: "auditor-han",
        action: "reject",
        timestamp: "2025-09-16T18:20:00+08:00",
        note: "需要替换第 4 张素材"
      }
    ],
    violations: [
      {
        code: "nsfw-risk",
        label: "NSFW 风险",
        resolved: false,
        note: "等待创作者更新素材"
      }
    ],
    actions: [
      { action: "hold", label: "等待补充" },
      { action: "escalate", label: "指派合规经理" }
    ]
  }
];
