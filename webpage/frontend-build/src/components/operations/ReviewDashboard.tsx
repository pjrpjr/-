"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type {
  ReviewSubmission,
  ReviewActionOption,
  ReviewRejectionReason,
  ReviewRejectionReasonCode
} from "../../lib/types";
import { reviewRejectionReasons } from "../../data/complianceMeta";

const statusLabels: Record<string, string> = {
  pending: "待审核",
  recheck: "需复查",
  blocked: "已拦截",
  approved: "已通过",
  paused: "已搁置"
};

const priorityLabels: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低"
};

const OPERATOR_ID = "ops-frontend";

const reasonByCode = new Map<ReviewRejectionReasonCode, ReviewRejectionReason>(
  reviewRejectionReasons.map((reason) => [reason.code, reason])
);

const fallbackReason = reviewRejectionReasons[0];

function getPriorityLabel(priority: string) {
  return priorityLabels[priority] ?? priority;
}

type Feedback = {
  type: "success" | "error";
  message: string;
};

export function ReviewDashboard() {
  const [submissions, setSubmissions] = useState<ReviewSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedReasonCode, setSelectedReasonCode] =
    useState<ReviewRejectionReasonCode>(fallbackReason.code);
  const [selectedActionCode, setSelectedActionCode] =
    useState<ReviewActionOption["action"] | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDecision, setIsSavingDecision] = useState(false);
  const [decisionFeedback, setDecisionFeedback] = useState<Feedback | null>(null);

  const inferReason = useCallback(
    (submission: ReviewSubmission): ReviewRejectionReason => {
      const violations = new Set(submission.violations.map((item) => item.code));
      if (violations.has("missing-license") || violations.has("missing_materials")) {
        return reasonByCode.get("missing_materials") ?? fallbackReason;
      }
      if (
        violations.has("nsfw-risk") ||
        violations.has("policy_violation") ||
        submission.riskScore >= 0.8
      ) {
        return reasonByCode.get("compliance_violation") ?? fallbackReason;
      }
      if (submission.status === "recheck" && submission.licenses.length === 0) {
        return reasonByCode.get("monetization_unverified") ?? fallbackReason;
      }
      if (submission.status === "recheck") {
        return reasonByCode.get("metadata_invalid") ?? fallbackReason;
      }
      if (submission.violations.some((item) => item.code.includes("duplicate"))) {
        return reasonByCode.get("duplicate_template") ?? fallbackReason;
      }
      return reasonByCode.get("inconsistent_style") ?? fallbackReason;
    },
    []
  );

  const refreshQueue = useCallback(async (preferredId?: string) => {
    try {
      const data = await api.fetchReviewQueue();
      setSubmissions(data);
      if (data.length === 0) {
        setSelectedId(null);
        return;
      }
      setSelectedId((current) => {
        if (preferredId && data.some((item) => item.id === preferredId)) {
          return preferredId;
        }
        if (current && data.some((item) => item.id === current)) {
          return current;
        }
        return data[0].id;
      });
    } catch (error) {
      console.error("[ReviewDashboard] failed to fetch review queue", error);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    refreshQueue()
      .catch(() => {
        // already logged inside refreshQueue
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [refreshQueue]);

  const selected = useMemo(() => {
    if (!selectedId) {
      return undefined;
    }
    return submissions.find((item) => item.id === selectedId);
  }, [selectedId, submissions]);

  const recommendedReason = useMemo(() => {
    if (!selected) {
      return fallbackReason;
    }
    return inferReason(selected);
  }, [inferReason, selected]);

  useEffect(() => {
    if (!selected) {
      setSelectedReasonCode(fallbackReason.code);
      setSelectedActionCode(null);
      setDecisionNote("");
      setDecisionFeedback(null);
      return;
    }
    const recommended = inferReason(selected);
    setSelectedReasonCode(recommended.code);
    setSelectedActionCode(selected.actions[0]?.action ?? null);
    setDecisionNote("");
    setDecisionFeedback(null);
  }, [inferReason, selected?.id, selected?.actions]);

  const selectedReason = useMemo(
    () => reasonByCode.get(selectedReasonCode) ?? fallbackReason,
    [selectedReasonCode]
  );

  const selectedAction: ReviewActionOption | null = useMemo(() => {
    if (!selected || !selectedActionCode) {
      return selected?.actions[0] ?? null;
    }
    return (
      selected.actions.find((item) => item.action === selectedActionCode) ??
      selected.actions[0] ??
      null
    );
  }, [selected, selectedActionCode]);

  const followUpMessage = selectedReason.requiresFollowUp
    ? "需要联系创作者补充材料后再给出结论"
    : "可直接出具结论，无需额外材料";

  const handleSubmitDecision = async () => {
    if (!selected || !selectedAction) {
      setDecisionFeedback({
        type: "error",
        message: "请选择审核动作"
      });
      return;
    }

    setIsSavingDecision(true);
    setDecisionFeedback(null);

    try {
      await api.submitReviewDecision({
        submissionId: selected.id,
        templateId: selected.templateId,
        tenantId: selected.creatorId ?? "tenant-mock",
        operatorId: OPERATOR_ID,
        action: selectedAction.action,
        reasonCode: selectedReason.code,
        note: decisionNote.trim() || undefined
      });
      setDecisionFeedback({
        type: "success",
        message: "审核决策已提交"
      });
      await refreshQueue(selected.id);
    } catch (error) {
      console.error("[ReviewDashboard] submitReviewDecision failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "提交审核决策时出现异常";
      setDecisionFeedback({
        type: "error",
        message
      });
    } finally {
      setIsSavingDecision(false);
    }
  };

  return (
    <div className="review-dashboard">
      <section aria-labelledby="review-queue-heading" className="review-dashboard__queue">
        <header>
          <h2 id="review-queue-heading">审核排队</h2>
          <p>展示近 24 小时提交的模板，支持按优先级与风险筛选。</p>
        </header>
        {isLoading ? (
          <p>加载审核队列中…</p>
        ) : submissions.length === 0 ? (
          <p>暂无待审模板，等待 operations-compliance 回填数据。</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">模板</th>
                <th scope="col">创作者</th>
                <th scope="col">提交时间</th>
                <th scope="col">状态</th>
                <th scope="col">优先级</th>
                <th scope="col">风险</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item) => {
                const isActive = item.id === selectedId;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={isActive ? "is-active" : undefined}
                  >
                    <td>{item.templateName}</td>
                    <td>{item.creatorHandle}</td>
                    <td>{new Date(item.submittedAt).toLocaleString("zh-CN", { hour12: false })}</td>
                    <td>{statusLabels[item.status] ?? item.status}</td>
                    <td>{getPriorityLabel(item.priority)}</td>
                    <td>{item.riskScore.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
      <section aria-labelledby="review-detail-heading" className="review-dashboard__detail">
        <header>
          <h2 id="review-detail-heading">审核处理</h2>
          <p>结合驳回原因枚举、SLA 与补件要求，记录并提交审核决策。</p>
        </header>
        {selected ? (
          <div className="review-detail__grid">
            <article className="review-detail__card">
              <h3>提交概览</h3>
              <ul>
                <li>模板名称：{selected.templateName}</li>
                <li>创作者：{selected.creatorHandle}</li>
                <li>提交编号：{selected.id}</li>
                <li>当前状态：{statusLabels[selected.status] ?? selected.status}</li>
                <li>优先级：{getPriorityLabel(selected.priority)}</li>
                <li>风险评分：{selected.riskScore.toFixed(2)}</li>
              </ul>
            </article>
            <article className="review-detail__card">
              <h3>驳回原因</h3>
              <p className="review-detail__hint">推荐理由：{recommendedReason.label}</p>
              <fieldset className="review-reasons" aria-label="驳回原因">
                {reviewRejectionReasons.map((reason) => {
                  const isChecked = reason.code === selectedReasonCode;
                  const reasonClassName = isChecked ? "review-reason is-active" : "review-reason";
                  return (
                    <label key={reason.code} className={reasonClassName}>
                      <input
                        type="radio"
                        name="review-reason"
                        value={reason.code}
                        checked={isChecked}
                        onChange={() => setSelectedReasonCode(reason.code)}
                      />
                      <span>
                        <strong>{reason.label}</strong>
                        <em>{reason.description}</em>
                        {reason.requiresFollowUp ? <small>需补件</small> : null}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <div className="review-reason__note" role="status" aria-live="polite">
                {followUpMessage}
              </div>
            </article>
            <article className="review-detail__card">
              <h3>动作与备注</h3>
              <div className="review-actions">
                {selected.actions.map((action) => {
                  const isActive = selectedAction ? selectedAction.action === action.action : false;
                  const actionClassName = isActive ? "review-action__chip is-active" : "review-action__chip";
                  const slaLabel =
                    typeof action.slaMinutes === "number"
                      ? `SLA ${action.slaMinutes} 分钟`
                      : null;
                  return (
                    <button
                      type="button"
                      key={action.action}
                      className={actionClassName}
                      onClick={() => setSelectedActionCode(action.action)}
                    >
                      {action.label}
                      {slaLabel ? <span className="review-action__sla">{slaLabel}</span> : null}
                    </button>
                  );
                })}
              </div>
              <label className="review-note">
                <span>审核备注</span>
                <textarea
                  value={decisionNote}
                  onChange={(event) => setDecisionNote(event.target.value)}
                  rows={3}
                  placeholder="记录需要补充的材料或处理结果"
                />
              </label>
              {selectedAction ? (
                <p className="review-action__summary">
                  选择动作：{selectedAction.label}
                  {typeof selectedAction.slaMinutes === "number"
                    ? ` · 需要在 ${selectedAction.slaMinutes} 分钟内完成`
                    : ""}
                </p>
              ) : null}
              <div className="review-actions__footer">
                <button
                  type="button"
                  onClick={handleSubmitDecision}
                  disabled={isSavingDecision || !selectedAction}
                >
                  {isSavingDecision ? "提交中…" : "保存决策"}
                </button>
                {decisionFeedback ? (
                  <p
                    className={`review-feedback review-feedback--${decisionFeedback.type}`}
                    role="status"
                  >
                    {decisionFeedback.message}
                  </p>
                ) : null}
              </div>
            </article>
          </div>
        ) : (
          <p>请选择左侧列表中的模板以查看详细信息。</p>
        )}
      </section>
    </div>
  );
}
