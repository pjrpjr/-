import { OperationsLayout } from "../../../src/components/operations/OperationsLayout";
import { ReviewDashboard } from "../../../src/components/operations/ReviewDashboard";

export const metadata = {
  title: "审核后台占位",
  description: "供 operations-compliance 联调的审核列表与详情框架"
};

export default function ReviewPage() {
  return (
    <OperationsLayout
      title="审核面板占位"
      description="预留列表、详情、操作区结构，等待 operations-compliance 与 platform-integration 联调数据。"
    >
      <ReviewDashboard />
    </OperationsLayout>
  );
}
