"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type { ReportTicket, ReportActionCode } from "../../lib/types";
import { reportActionDefinitions, refundLedgerFields } from "../../data/complianceMeta";

const statusMap: Record<string, string> = {
  open: "待处理",
  investigating: "调查中",
  resolved: "已解决",
  suspended: "已下线"
};

const severityMap: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低"
};

const channelMap: Record<string, string> = {
  "in-app": "站内举报",
  email: "邮件",
  manual: "人工导入"
};

const actionDefinitionMap = new Map<ReportActionCode, typeof reportActionDefinitions[number]>(
  reportActionDefinitions.map((item) => [item.action, item])
);

export function ReportPanel() {
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .fetchReportTickets()
      .then((data) => {
        if (active) {
          setReports(data);
          if (data.length > 0) {
            setSelectedId((current) => current ?? data[0].id);
          }
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const selected = useMemo(() => {
    if (!selectedId) {
      return undefined;
    }
    return reports.find((item) => item.id === selectedId);
  }, [reports, selectedId]);

  return (
    <div className="report-panel">
      <section aria-labelledby="report-list-heading" className="report-panel__list">
        <header>
          <h2 id="report-list-heading">举报工单</h2>
          <p>跟踪近期举报，展示处理动作、积分回滚与责任人。</p>
        </header>
        {isLoading ? (
          <p>加载举报数据中...</p>
        ) : reports.length === 0 ? (
          <p>暂无举报记录，等待 ops 补充数据。</p>
        ) : (
          <ul>
            {reports.map((item) => {
              const isActive = item.id === selectedId;
              const itemClassName = isActive ? "report-item is-active" : "report-item";
              return (
                <li key={item.id} className={itemClassName} onClick={() => setSelectedId(item.id)}>
                  <div className="report-item__header">
                    <strong>{item.templateName}</strong>
                    <span className={"severity severity--" + item.severity}>{severityMap[item.severity] ?? item.severity}</span>
                  </div>
                  <div className="report-item__meta">
                    <span>举报人：{item.reporterId}</span>
                    <span>渠道：{channelMap[item.channel] ?? item.channel}</span>
                  </div>
                  <div className="report-item__meta">
                    <span>时间：{new Date(item.reportedAt).toLocaleString("zh-CN", { hour12: false })}</span>
                    <span>状态：{statusMap[item.status] ?? item.status}</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="report-item__actions" aria-label="可执行动作">
                    {item.actions.map((action) => {
                      const meta = actionDefinitionMap.get(action.action);
                      const label = meta ? meta.label : action.label;
                      const actionClassName = "action-chip" + (meta ? " action-chip--known" : "");
                      const description = meta ? meta.description : undefined;
                      return (
                        <span key={action.action} className={actionClassName} title={description}>
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section aria-labelledby="report-detail-heading" className="report-panel__detail">
        <header>
          <h2 id="report-detail-heading">处理详情</h2>
          <p>查看举报对应的动作说明、处理人以及积分回滚流水。</p>
        </header>
        {selected ? (
          <div className="report-detail__grid">
            <article className="report-detail__card">
              <h3>举报摘要</h3>
              <ul>
                <li>模板：{selected.templateName}</li>
                <li>举报人：{selected.reporterId}</li>
                <li>渠道：{channelMap[selected.channel] ?? selected.channel}</li>
                <li>状态：{statusMap[selected.status] ?? selected.status}</li>
                <li>严重程度：{severityMap[selected.severity] ?? selected.severity}</li>
                <li>冻结积分：{selected.creditImpact.frozen}</li>
                <li>已退款积分：{selected.creditImpact.refunded}</li>
              </ul>
            </article>
            <article className="report-detail__card">
              <h3>动作说明</h3>
              <ul className="report-actions__definitions">
                {reportActionDefinitions.map((definition) => {
                  const enabled = selected.actions.some((action) => action.action === definition.action);
                  const definitionClass = enabled ? "definition is-enabled" : "definition";
                  return (
                    <li key={definition.action} className={definitionClass}>
                      <strong>{definition.label}</strong>
                      <span>{definition.description}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
            <article className="report-detail__card">
              <h3>积分回滚流水</h3>
              {selected.refundLedger.length > 0 ? (
                <div className="ledger-wrapper">
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th scope="col">交易号</th>
                        <th scope="col">退款号</th>
                        <th scope="col">原因</th>
                        <th scope="col">操作人</th>
                        <th scope="col">金额</th>
                        <th scope="col">时间</th>
                        <th scope="col">备注</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.refundLedger.map((entry) => (
                        <tr key={entry.refundId}>
                          <td>{entry.transactionId}</td>
                          <td>{entry.refundId}</td>
                          <td>{entry.reasonCode}</td>
                          <td>{entry.operatorId}（{entry.operatorRole}）</td>
                          <td>{entry.amount}</td>
                          <td>{new Date(entry.occurredAt).toLocaleString("zh-CN", { hour12: false })}</td>
                          <td>{entry.memo ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <details className="ledger-fields">
                    <summary>字段说明</summary>
                    <ul>
                      {refundLedgerFields.map((field) => (
                        <li key={field.field}>
                          <strong>{field.label}</strong>
                          <span>{field.description}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ) : (
                <p>暂无退款流水记录。</p>
              )}
            </article>
          </div>
        ) : (
          <p>请选择左侧举报记录查看详情。</p>
        )}
      </section>
    </div>
  );
}
