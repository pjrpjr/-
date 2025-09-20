import { OperationsLayout } from "../../../src/components/operations/OperationsLayout";
import { ReportPanel } from "../../../src/components/operations/ReportPanel";

export const metadata = {
  title: "举报面板占位",
  description: "面向 operations-compliance 的举报处理、积分回滚流程骨架"
};

export default function ReportsPage() {
  return (
    <OperationsLayout
      title="举报处理面板占位"
      description="列出举报工单与详情占位，等待接口接入后填充。"
    >
      <ReportPanel />
    </OperationsLayout>
  );
}
