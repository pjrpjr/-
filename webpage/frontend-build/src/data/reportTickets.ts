import type { ReportTicket } from "../lib/types";

export const reportTicketsMock: ReportTicket[] = [
  {
    id: "report-9001",
    templateId: "tpl-cyber",
    templateName: "霓虹夜巡",
    reporterId: "user_8891",
    channel: "in-app",
    reportedAt: "2025-09-16T17:50:00+08:00",
    status: "investigating",
    severity: "high",
    description: "举报模板涉嫌侵权，截图与签约资料不匹配。",
    evidence: [
      {
        id: "evidence-1",
        type: "image",
        label: "对比截图",
        url: "https://dummyimage.com/320x200/f97316/ffffff.png&text=Evidence",
        thumbnailUrl: "https://dummyimage.com/160x100/f97316/ffffff.png&text=E1"
      }
    ],
    relatedTasks: [
      {
        taskId: "task-7781",
        type: "render",
        status: "running",
        creditImpact: -6
      }
    ],
    creditImpact: {
      currency: "积分",
      frozen: 18,
      refunded: 0
    },
    handlers: [
      {
        actor: "ops-lin",
        action: "acknowledged",
        timestamp: "2025-09-16T17:55:00+08:00",
        note: "已通知创作者提交合同补件"
      }
    ],
    actions: [
      { action: "takedown", label: "下架模板" },
      { action: "notify_creator", label: "通知创作者补材料" },
      { action: "escalate", label: "升级复核" },
      { action: "penalize", label: "处罚账号" }
    ],
    refundLedger: [
      {
        transactionId: "txn-7781-accel",
        refundId: "refund-9901",
        reasonCode: "report_penalty",
        operatorId: "ops-lin",
        operatorRole: "compliance",
        amount: 12,
        occurredAt: "2025-09-16T18:10:00+08:00",
        memo: "冻结待分成积分，待整改后释放"
      }
    ]
  },
  {
    id: "report-9002",
    templateId: "tpl-heritage",
    templateName: "经典文化巡礼",
    reporterId: "studio_alpha",
    channel: "email",
    reportedAt: "2025-09-16T14:12:00+08:00",
    status: "resolved",
    severity: "medium",
    description: "使用授权素材未标注来源，已补充版权说明。",
    evidence: [
      {
        id: "evidence-2",
        type: "pdf",
        label: "授权补充",
        url: "https://dummyimage.com/800x600/7c3aed/ffffff.png&text=PDF",
        thumbnailUrl: "https://dummyimage.com/120x140/7c3aed/ffffff.png&text=PDF"
      }
    ],
    relatedTasks: [
      {
        taskId: "task-6603",
        type: "license",
        status: "success",
        creditImpact: -24
      }
    ],
    creditImpact: {
      currency: "积分",
      frozen: 0,
      refunded: 12
    },
    handlers: [
      {
        actor: "ops-ye",
        action: "refund",
        timestamp: "2025-09-16T15:02:00+08:00",
        note: "部分返还积分"
      },
      {
        actor: "ops-ye",
        action: "resolved",
        timestamp: "2025-09-16T15:40:00+08:00",
        note: "资料补全，解除冻结"
      }
    ],
    actions: [
      { action: "notify_creator", label: "通知创作者" },
      { action: "refund_credit", label: "退款积分" },
      { action: "takedown", label: "下架模板" },
      { action: "escalate", label: "升级处理" }
    ],
    refundLedger: [
      {
        transactionId: "txn-6603-lic",
        refundId: "refund-9820",
        reasonCode: "manual_adjust",
        operatorId: "ops-ye",
        operatorRole: "reviewer",
        amount: 12,
        occurredAt: "2025-09-16T15:05:00+08:00",
        memo: "版权说明补齐后按 SLA 返还"
      }
    ]
  }
];
