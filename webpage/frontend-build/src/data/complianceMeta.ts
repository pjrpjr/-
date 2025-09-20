import type { ReviewRejectionReason, ReportActionDefinition, RefundLedgerField } from "../lib/types";

export const reviewRejectionReasons: ReviewRejectionReason[] = [
  {
    code: "missing_materials",
    label: "资料缺失",
    description: "缺少授权证明、落地页截图或必要附件",
    requiresFollowUp: true
  },
  {
    code: "metadata_invalid",
    label: "元数据异常",
    description: "模板描述或 JSON 元数据无法解析、字段缺失",
    requiresFollowUp: true
  },
  {
    code: "compliance_violation",
    label: "违反平台规范",
    description: "涉及敏感内容、侵权或政策限制",
    requiresFollowUp: true
  },
  {
    code: "inconsistent_style",
    label: "风格表现不一致",
    description: "样张与历史表现不符，需再次打磨",
    requiresFollowUp: false
  },
  {
    code: "monetization_unverified",
    label: "变现资质未核实",
    description: "结算信息或授权主体待确认",
    requiresFollowUp: true
  },
  {
    code: "duplicate_template",
    label: "模板重复提交",
    description: "与历史模板高度重复，需合并归档",
    requiresFollowUp: false
  }
];

export const reportActionDefinitions: ReportActionDefinition[] = [
  {
    action: "takedown",
    label: "下架模板",
    description: "立即暂停模板曝光，冻结复刻和授权入口"
  },
  {
    action: "notify_creator",
    label: "通知创作者",
    description: "发送整改通知，要求在 SLA 内提交补充材料"
  },
  {
    action: "refund_credit",
    label: "退款积分",
    description: "触发积分回滚，调用 /credits/release 按 reason_code 记录"
  },
  {
    action: "escalate",
    label: "升级处理",
    description: "提交到合规委员会或法务团队进一步跟进"
  },
  {
    action: "penalize",
    label: "处罚账号",
    description: "对模板作者执行扣分、限制上传或封禁"
  }
];

export const refundLedgerFields: RefundLedgerField[] = [
  {
    field: "transaction_id",
    label: "原交易号",
    description: "对应的积分扣费或结算流水编号"
  },
  {
    field: "refund_id",
    label: "退款编号",
    description: "本次回滚生成的唯一标识"
  },
  {
    field: "reason_code",
    label: "退款原因",
    description: "task_failed、manual_adjust、report_penalty 等枚举"
  },
  {
    field: "operator_id",
    label: "操作人",
    description: "执行回滚的账号 ID"
  },
  {
    field: "operator_role",
    label: "角色",
    description: "reviewer / compliance / admin"
  },
  {
    field: "amount",
    label: "金额",
    description: "本次回滚的积分数量，正数代表返还"
  },
  {
    field: "occurred_at",
    label: "发生时间",
    description: "ISO8601 时间戳，便于审计追踪"
  },
  {
    field: "memo",
    label: "备注",
    description: "补充说明或参考链接"
  }
];
