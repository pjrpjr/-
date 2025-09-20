# Phase 1 基线（Persona / MVP / 指标）

## Persona & JTBD Brief

### Persona A：账号孵化型创作者（Douyin/小红书工作室）
- **画像**：2-5 人小团队，主营“帅哥美女”账号代运营，熟悉短视频/图文平台热点，具备基础修图能力但缺乏稳定内容生产流水线。
- **待完成的工作（JTBD）**：
  - 快速找到可复刻的模板与 LoRA 组合，验证能否 1-2 天内上线新账号；
  - 控制单账号启动成本（≤ ¥1500）并缩短出图调试时间到 2 小时以内；
  - 向买家证明模板可持续变现，提供真实案例和参数复刻路径；
  - 在出现违规或风格偏差时能迅速回滚或切换方案。
- **核心痛点**：站外买教程投入高、效果无法复现；缺少合规边界指引；授权与账号管理流程琐碎。
- **关键触发事件**：接到新账号孵化需求、原模板失效或被限流、买家要求提供真实收益数据。

### Persona B：账号运营执行者（自由职业/兼职）
- **画像**：个人或兼职执行人，负责批量出图、维护素材库，与创作者合作拿到授权后执行。
- **待完成的工作（JTBD）**：
  - 通过平台一键复刻模板并获得授权，按照脚本批量出图；
  - 监控算力消耗与产出比，确保任务成功率 >85%；
  - 在违规提醒出现时，快速调整提示词或参数，保证账号安全；
  - 与创作者同步模板更新，避免版本错配。
- **核心痛点**：不了解各模版本差异导致出图失败；算力成本不可预估；缺乏统一的进度/风险提示。
- **关键触发事件**：接收到创作者派发的出图任务、需要在 24 小时内提交批量成片、算力余额告急。

## MVP Landing 首屏范围（v0.1）
- **核心叙事模块**：
  - Hero 区：一句话价值主张（账号变现路径 + 可复刻 DEMO）；双 CTA（立即复刻 / 看案例）。
  - 案例滑块：展示 3 个“帅哥美女”账号变现案例，包含投入/产出、成功率、出图示例。
  - 算力与授权流程卡片：以 3 步图示“选模板→授权→充值算力→出图”。
  - 合规与边界提示：列出禁止内容、授权范围、违规处理说明。
  - 实时热度榜：引用平台侧“热门模板 TOP5”与近期评价摘要。
  - Visitor→Viewer 引导提示：在 CTA 区提醒“完成注册可领取 30 分钟免费算力”，引用 `content-ops/role-messaging-guide.md`。
  - 违规警示语：展示 `平台红线清单` 与 `compliance.alert` 文案（见 content-ops/notification-remediation-template-v1.md），在 StepHighlight 下方标出。
- **关键功能点**：
  - 模板卡片跳转模板详情（参数预览、一键复刻入口）；
  - 授权状态提示（已授权/待授权），支持登录后展示个性化状态；
  - 算力余额与估算器组件（输入任务规格，显示预估消耗范围）；
  - 快速开始引导（FAQ、客服/社群入口、创作者入驻通道）。
- **边界与未纳入项**：社区互动、训练系统、管理后台深度功能暂不进入首屏；保留链接入口但不展示完整功能。

## 指标口径初稿（v0.1）
| 指标 | 定义 | 计算方式 | 目标 | 数据来源与采集 | 备注 |
| ---- | ---- | -------- | ---- | ---------------- | ---- |
| 首次授权转化率 | 首屏访问用户中完成任一模板授权的比例 | 授权成功 UV ÷ 首屏 UV | ≥ 18% | Web 埋点（授权成功事件）、platform-integration 授权 API | 需要区分老用户与新用户 |
| CTA 点击率 | 首屏访问用户点击任一 CTA 的比例 | CTA 点击 UV ÷ 首屏 UV | ≥ 35% | Web 埋点（`cta_click` 事件） | 结合 CTA A/B 文案评估 |
| 模板复刻成功率 | 通过首屏进入并发起任务的成功率 | 成功任务数 ÷ 首屏触发任务总数 | ≥ 85% | 任务队列日志 + 前端埋点 | 失败原因按模板、算力、合规分类 |
| 平均算力消耗/任务 | 首屏来源任务的算力平均消耗 | Σ任务算力消耗 ÷ 任务数 | ≤ 220 积分 | 计费系统日志 | 异常高值需触发预警 |
| 7 日留存（首屏来源） | 首屏引导的新增授权账号在 7 日内复用模板的比例 | 7 日内二次任务账号数 ÷ 首屏新增授权账号数 | ≥ 40% | 授权日志 + 任务日志 | 需脱敏处理账号 ID |
| 合规风险率 | 首屏来源任务触发告警/拦截的比例 | 告警任务数 ÷ 首屏任务数 | ≤ 2% | operations-compliance 风控事件 | 异常同步产品规划复盘 |
  - �¶����ֶ�：`policy_tag` ��־��Ϲ����ǩ，�� platform-integration �� operations-compliance ��ͬ������ֵ��

- **数据采集要求**：
  - `platform-integration` 需提供授权成功、任务启动、算力结算事件的埋点/回传；
  - `frontend-build` 实现首屏曝光、按钮点击、估算器互动埋点；
  - `operations-compliance` 输出合规告警事件字段（类型、级别、处理结果）；
  - 统一沉淀在 `shared/metrics` README，采用 UTC+8 日切与周切。

## 后续动作
- 与 `experience-design` 对齐首屏线框与文案，准备 v0.1 评审；
- 收集 `content-ops` 创作者访谈补充案例细节，形成人物故事；
- 与 `platform-integration` 确认授权与算力事件可用字段，定义埋点 schema；
- 在下一次跨组例会上复盘指标可行性与风控约束。
## 模板授权与资产策略 PRD（v0.1）
### 背景与目标
- 确保模板仅在站内授权范围内使用，满足“仅售算力、授权不外流”的商业约束。
- 为创作者与执行账号提供可追溯的授权流程，并在违规或纠纷时支持快速撤销与审计。

### 范围与边界
- **涵盖**：模板授权申请、审批（创作者确认）、站内授权校验、授权留痕、撤销与异常处理、LoRA 资产绑定与引用限制。
- **不涵盖**：模板交易金额结算（由创作者私域处理）、站外授权工具、社区模板分享机制（规划阶段）。

### 角色与触发
- 创作者：发布模板、配置授权规则、审批授权、查看授权日志。
- 执行账号（买家）：发起授权申请、查看授权状态、使用模板出图。
- 平台运营：管理异常与违规、执行冻结/撤销、调阅审计日志。

### 端到端流程（文本版）
1. 执行账号在模板详情页点击“一键复刻/申请授权”。
2. 平台校验账号实名状态与风险标签，生成授权申请（待创作者确认）。
3. 创作者在“授权中心”确认/拒绝，或通过自动规则（白名单/公开授权）自动批准。
4. 授权成功后，平台签发 license（账号 ID + 模板 ID + 有效期/次数），写入授权日志，并将状态回传给前端。
5. 执行账号发起出图任务时，platform-integration 在任务入队前调用授权校验 API。
6. 若创作者或运营在后台发起撤销，license 标记为 `revoked` 并写入原因；下次校验时阻断任务并给予提示。
7. 异常（违规、超额调用、算力欠费）触发运营介入，必要时冻结模板或账号。

### 授权状态机
| 状态 | 描述 | 进入条件 | 可迁移状态 |
| ---- | ---- | -------- | -------- |
| pending | 等待创作者确认或自动审批 | 执行账号提交申请 | approved / rejected / expired |
| approved | 授权生效，可调用模板 | 创作者同意或命中自动放行规则 | revoked / expired |
| rejected | 授权被拒绝 | 创作者拒绝或风险策略拦截 | （重新申请）pending |
| expired | 授权超出有效期或次数 | 计数器归零或到期定时任务 | （续期）pending |
| revoked | 被创作者或运营主动撤销 | 后台撤销操作、违规处理 | （复权）pending |

### 数据字段与日志
- 授权 license：`license_id`、`template_id`、`creator_id`、`account_id`、`status`、`effective_at`、`expire_at`、`max_runs`、`runs_used`、`risk_flags`、`revoke_reason`。
- 审计日志：创建、审批、撤销、自动到期、异常阻断、二次审批记录（字段：操作人、时间、渠道、备注）。
- 埋点需求：授权申请点击、审批完成、校验失败、撤销确认、出图阻断原因。

### 平台集成约束（与 platform-integration 协作）
- 提供 `POST /licenses`（创作者确认后由后台调用）与 `GET /licenses/check`（任务入队实时校验）接口。
- 授权校验返回需包含：`status`、剩余次数/有效期、需要提示的风险标签、撤销/拒绝原因。
- 任务侧计数：每次任务成功后回调 `PATCH /licenses/{id}/consume` 扣减使用次数。
- 支持批量导出授权日志，供运营与合规复核。

### 合规与运营要求（operations-compliance 提供细则）
- 违规内容触发撤销时，需保留生成内容、提示词与时间戳；撤销通知需同步发送给创作者与执行账号。
- 对涉及擦边内容的模板，需配置强制审阅或限期授权，默认有效期≤30天。
- 建立“申诉→复核→恢复/维持”流程，要求 48 小时内给出结论。

### 异常与边界场景
- 创作者停更/离场：平台可接管授权审批，或将模板设为下架并冻结现有授权。
- 算力欠费：授权保持有效但任务提交前提示充值；连续欠费 7 天触发运营跟进。
- 多账号共享：同一执行团队可申请“团队授权”（多账号绑定同一 license），需额外身份验证。

### 开放问题
- 白名单自动授权的阈值（关注账号数或历史交易额）需 content-ops 提供建议。
- 授权计数与算力套餐组合的折扣策略需后续与商业团队评估。

## Phase 1 路线图与里程碑
| 时间窗口（UTC+8） | 关键输出 | 负责人 | 协作小组 | 依赖/备注 |
| ---------------- | -------- | ------ | -------- | -------- |
| 9/16 - 9/20 | Persona & JTBD Brief、MVP 首屏范围、指标口径 v0.1（本稿） | 产品规划 | content-ops、experience-design、platform-integration、operations-compliance | 已进入评审准备 |
| 9/19 - 9/24 | 授权策略 PRD 定稿、首屏线框 v1、埋点 Schema 评审 | 产品规划 | platform-integration、experience-design、frontend-build、operations-compliance | 需创作者访谈补充案例 |
| 9/24 - 9/30 | MVP 需求清单冻结、技术方案评审（平台 + 前端）、风控策略确认 | 产品规划/平台集成/前端 | operations-compliance、content-ops | 明确算力计费方案与告警阈值 |
| 10/1 - 10/7 | 开发冲刺 #1：授权校验、首屏骨架、指标埋点基础 | platform-integration、frontend-build | 产品规划、operations-compliance | 国庆排期需确认人力；预留联调窗口 |
| 10/8 - 10/15 | 开发冲刺 #2：案例模块、算力估算器、风险提示、SOP 联调 | frontend-build、operations-compliance | platform-integration、content-ops | 同步首轮内测用户 |
| 10/16 - 10/18 | 内测复盘 + 上线评审，确认 go/no-go | 产品规划 | 全组 | 输出复盘纪要与上线清单 |

## 同步机制与责任划分
- **例会节奏**：
  - 周一 17:00（线上）Phase 1 站会：更新路线图进度、阻塞项与跨组需求；产品规划主持，记录归档至 `shared/CHANGELOG.md`。
  - 周四 15:00 跨组专题（按需）：针对授权策略、风控、体验议题设专题会，由议题发起组召集。
- **异步同步**：
  - `TODO.md` 作为任务与留言唯一入口；完成项须在 24 小时内勾选并备注结论/后续动作。
  - `shared/CHANGELOG.md` 由本组轮值（按周）更新，包含新交付物、影响范围与待确认事项。
  - 使用共享云盘文件夹（待 content-ops 创建）存放访谈纪要、案例素材，保持版本号。
- **责任人**：
  - 轮值更新：第 1 周（9/16-9/22）由产品规划 A；第 2 周（9/23-9/29）由产品规划 B；名单会前更新。
  - 会议纪要：主持人当日完成并发送至群组 + `shared/CHANGELOG` 链接。
  - 决策通知：任何影响跨组交付的变更须在 4 小时内同步至 IM 群并在当日 `shared/CHANGELOG` 留痕。
- **风险应对**：
  - 例会缺席需提前指派代理并补充异步更新。
  - 如遇阻塞（>2 天未解），产品规划负责升级至项目群并协调资源。

## 跨组评审计划（截至 9/20）
- 会议时间：9/19（周五）17:00-18:00，线上会议（Teams），产品规划主持。
- 参会小组：experience-design、frontend-build、platform-integration、operations-compliance、content-ops。
- 会前准备：各组需在 9/19 中午前将评审意见汇总至 `phase1-baseline.md`“反馈汇总”表，并补充附件/链接；若无意见请留空并确认。
- 议程结构：
  1. 产品规划回顾 Persona、MVP 范围与指标口径核心结论（10 分钟）。
  2. 各组依次反馈风险与资源评估（每组 10 分钟）。
  3. 确认改动清单、责任人与时间节点（10 分钟）。
- 输出：更新后的《Phase1 基线》、会后纪要（含问题清单、责任人、预计完成时间）并同步 `shared/CHANGELOG.md`。

### 反馈汇总（9/19）
| 小组 | 核心关注点 | 当前状态 | 后续动作 |
| ---- | ---------- | -------- | -------- |
| experience-design | 线框结构、主视觉叙事、CTA 配置 | 已完成 | Hero 区改为“双 CTA + 合规提示”展示，线框链接：experience-design/landing-wireframe-v1.fig |
| frontend-build | 组件实现复杂度、实时数据需求、埋点实现 | 已确认 | WebSocket 为主通道 + REST 兜底方案，9/25 前提交实现计划 |
| platform-integration | 授权校验接口、算力估算器数据、任务队列埋点 | 可实现 | `/licenses/check`、`/credits/estimate` 草案输出，字段锁定见 shared/metrics/README.md |
| operations-compliance | 风控提示语、撤销/申诉流程、敏感数据处理 | 已完成 | SOP 增补“高风险模板” 24 小时复核与 policy_tag 字段要求 |
| content-ops | 案例素材、创作者访谈、转化文案 | 已完成 | 提供 3 个案例与素材库链接：content-ops/case-library.md |

### 评审结论（9/19）
- 首屏 Hero 区强调“双 CTA + 合规提示”，优化案例滑块文案，采用 experience-design 提供的 wireframe v1。
- frontend-build 确认实时通道策略：主通道 WebSocket + REST 降级，并与平台组共建 SSE 兼容测试计划。
- platform-integration 明确授权校验与算力估算接口，新增 `policy_tag`、`expected_credits_range` 字段，已同步至 shared/metrics/README.md。
- operations-compliance 更新撤销/申诉 SOP，规定高风险模板 24 小时内复核并双向通知。
- content-ops 提供案例素材支持 Persona 叙事，并准备上线转化文案。
- 指标体系新增 CTA 点击率，合规风险率目标调为 ≤2%，需各组在 9/21 前确认实现计划。
## 指标埋点 Schema 对齐
- 交付物：《Phase1 Landing 指标 & 埋点 Schema》详见 webpage/shared/metrics/README.md。
- 包含事件：首屏曝光、模板授权申请/批准、任务成功/失败、算力估算器互动、风险提示触发。
- 同步节奏：由 platform-integration、frontend-build 在 9/19 17:00 评审会上确认字段落地；评审后 24 小时内固化到各自 backlog。
- 数据治理：operations-compliance 负责审批敏感字段采集，content-ops 协助校验案例指标呈现方式。
- 联调安排：参考 shared/metrics/implementation-plan.md，包含负责人、环境依赖、测试策略、联调步骤。
- 会议准备：9/21 指标对齐会模板见 shared/metrics/meetings/2025-09-21-metrics-sync.md。
- 数据校验：联调结束后执行 shared/metrics/artifacts/2025-09-21/verify_phase1_events.sql 验证 policy_tag/action_required/escalation_level 字段。
- 体验标注：详见 experience-design/tracking-handshake-plan.md，确保埋点标签与 UI 一致。



### 9/25 交付跟进
| 交付物 | 责任小组 | 输出内容 | 截止时间 | 依赖 |
| ------ | -------- | -------- | -------- | ---- |
| 首屏 wireframe v1 文案合入 | experience-design | 更新线框 + 文案版本（v1.1），同步至设计仓库 | 9/25 | 内容运营提供 A/B 文案审核 |
| 实时通道实现方案 | frontend-build | WebSocket + REST 降级方案、SSE 兼容测试计划 | 9/25 | 平台组提供接口性能数据 |
| 授权/算力接口草案 v0.2 | platform-integration | `/licenses/check`、`/credits/estimate` 详细参数、错误码 | 9/25 | operations-compliance policy_tag 枚举 |
| 风控/撤销 SOP 更新 | operations-compliance | “高风险模板” SOP v1.1（含 24h 复核流程） | 9/25 | 产品规划审核、平台实现 |
| 案例素材 & 转化文案 | content-ops | 3 份案例 Story + CTA 文案包 | 9/25 | 设计/前端引用模板 |


## 设计令牌与素材依赖
> 2025-09-18 更新：体验设计与内容运营已交付占位素材（Hero 背景、Quickstart 插画、Persona 徽标、任务状态图标），路径详情见 `shared/assets-manifest.md`。平台集成将在最终稿交付后更新 CDN 策略。
- 颜色与字体：首屏 Hero、CTA、合规提示统一使用 shared/design-tokens.md 中 --color-accent/--color-accent-soft，Creator 模块采用 Creator 专属 accent；标题 32/44、正文 16/24 的字号排版与 globals.css 保持一致。
- 圆角与阴影：卡片沿用 --radius-lg、--shadow-soft，CTA 按钮遵循平台按钮 hover/shadow 规范，避免新增 bespoke 样式。
- 素材交付：
  - Hero 渐变背景（experience-design）、案例示意图（content-ops）按 shared/assets-manifest.md 路径落盘。
  - 快速上手插画、任务状态图标需在 9/18 前交付，产品规划负责确认文案说明与图形一致。
  - 模板 DEMO 视频（product-planning & experience-design 共建）需输出 15s storyboard + 文本提示，写入 public/videos/template-demo.mp4。
- 调用策略：与 frontend-build 对齐素材命名（case-{scene}-{date}.jpg），并在文案中标注 Creator/Viewer token 切换逻辑。

## 角色映射与流程更新
- 角色对应：Visitor → Landing 浏览/CTA 提示；Viewer → 授权前体验与余额校验；Creator → 模板管理与授权审批；Reviewer/Compliance Ops → 举报与撤销流程；Admin → 系统配置。
- 流程补充：
  - 首屏及授权流程文案需增加 Visitor→Viewer 注册提示，与 shared/role-matrix.md 一致。

### Risk Review 草稿
- 详见 `phase1-risk-review.md`，目前覆盖算力估算偏差、授权撤销延迟、policy_tag 告警、角色指引、素材交付等风险。
- 9/21 根据埋点落地反馈更新状态；9/25 交付评审时输出最终复盘。
  - 授权撤销、举报操作需记录 operatorId 并复用 policy_tag，支撑 Reviewer/Compliance Ops 留痕。
  - 产品规划需在 PRD/SOP 中补充 Creator 预览、Reviewer 审核节奏等角色场景。
- 输出：在 Persona & JTBD、授权策略章节引用角色映射表，并确保后续流程文档引用 shared/role-matrix.md。



## 埋点落地计划跟踪（2025-09-18 更新）
| 团队 | 责任人 | 计划日期 | 当前状态 | 备注 |
| ---- | ------ | -------- | -------- | ---- |
| platform-integration | Leon | 2025-09-21 | 进行中 | D2 联调完成后更新 `/credits/estimate` 埋点字段，等待 content-ops 确认 CTA 事件 ID。 |
| frontend-build | Ivy | 2025-09-21 | 进行中 | 埋点标签已在 `experience-design/tracking-handshake-plan.md` 记录，等待设计确认 CTA variant。 |
| operations-compliance | Alice | 2025-09-21 | 计划 | 将在 `operations-compliance/compliance-tracking-inputs.md` 输出 policy_tag 枚举与违规事件。 |
| content-ops | Rui | 2025-09-20 | 已完成 | `content-ops/role-messaging-guide.md` 提供事件 ID/字段；等待平台余额告警事件确认。 |
| shared | PMO | 2025-09-21 | 计划 | 安排 9/21 埋点评审会议，更新 `shared/metrics/README.md`。 |

## 9/25 交付节点跟踪（2025-09-18 更新）
| 交付物 | 所属团队 | 目标日期 | 状态 | 下一步 |
| ------ | -------- | -------- | ---- | ---- |
| Wireframe v1.1 + 文案合入 | experience-design | 2025-09-25 | 进行中 | 等待占位素材替换为正式稿后更新 Figma。 |
| 实时通道实现方案 | frontend-build | 2025-09-25 | 计划 | 依赖 platform-integration SSE 性能数据。 |
| `/licenses/check` `/credits/estimate` 接口草案 v0.2 | platform-integration | 2025-09-25 | 进行中 | docs/api-credit-authorization-push.md 拟于 9/22 更新字段。 |
| “高风险模板” SOP v1.1 | operations-compliance | 2025-09-25 | 计划 | 待 9/19 权限评审结论后更新。 |
| 案例素材包 & 转化文案 | content-ops | 2025-09-25 | 进行中 | 占位素材已交付，需补充真实截图与 ROI 佐证。 |

## 任务排队与加速体验
### 补扣与加速体验对齐
- 接口：`/api/v1/credits/estimate` 返回标准/加速试算；`/api/v1/credits/charge` 执行补扣；`/api/v1/credits/ledger` 提供补扣流水。
- 前端弹窗：展示 `options` 中标准/加速成本、倒计时；当加速选项被选择时调用 `charge`。
- 推送节奏：任务事件通过 `stage`/`progress`/`next_eta` 通知，供补扣弹窗与加速横幅同步状态。
- 风险提示：若 `suggest_topup > 0`，需引导充值或降档。

