# 多语言占位与翻译计划

## 目标
- 为 FAQ、通知模版、首屏文案等核心内容预留多语言占位，确保海外投放时快速上线。
- 与市场团队确认优先语种（预计：英文 en-US、日文 ja-JP、韩文 ko-KR），建立翻译与复核流程。

## 内容范围
| 模块 | 文件 | 负责人 | 备注 |
| ---- | ---- | ------ | ---- |
| 首屏文案 | `landing-hero.md` | content-ops | 提供 en/ja/ko 占位文案块。 |
| 案例合集 | `creator-success-stories.md` | content-ops × BD | 指标需按地区换算币种。 |
| 快速上手指引 | `quickstart-guide.md` | content-ops | 补充术语词汇表。 |
| 合规声明/FAQ | `content-safety-statement.md`、`faq.md` | operations-compliance 复核 | 涉及法律条款需法务复核。 |
| 通知模版 | `notification-templates.md`、`notification-remediation-template-v1.md` | content-ops × platform-integration | 保持字段占位符一致。 |

## 流程安排
1. **准备阶段（D0-D1）**：
   - content-ops 输出英文初稿；市场团队确定翻译供应商或内部译者。
   - 建立术语表：算力、积分、授权、整改等关键词汇，放入 `shared/TERMS_GLOSSARY.md`。
2. **翻译阶段（D2-D4）**：
   - 采用表格模板（Google Sheet 或 Confluence）列出 `key`, `zh-CN`, `en-US`, `ja-JP`, `ko-KR` 列。
   - 译者提交后，由 content-ops 进行初审，集中反馈给译者修订。
3. **合规复核（D4-D5）**：
   - operations-compliance 与法务确认多语言版本的法律表述；必要时调整本地政策链接。
   - platform-integration 校对通知字段占位符未被翻译或更改。
4. **上线准备（D5-D6）**：
   - frontend-build 根据语言包接入 i18n 方案（推荐 JSON key-value）。
   - content-ops 提供示例截图，验证布局适配。
5. **回归检查（上线后 D+2）**：
   - 监测多语言通知发送正确性；收集用户反馈，安排迭代。

## 文件结构建议
```
content-ops/
  i18n/
    landing-hero.i18n.json
    faq.i18n.json
    notifications.i18n.json
```
- key 规范：`module.section.element`（示例：`hero.cta.openAccount`）。
- 所有 JSON 文件 UTF-8 without BOM，值保留 `{placeholder}` 占位。

## 依赖与协作
- 市场团队：确认目标语种、交付时限、品牌口径。
- operations-compliance：核对法律条款翻译是否合规。
- platform-integration：提供通知 payload 字段，避免译文误改。
- frontend-build：落地 i18n 加载、回退逻辑。

## 验收标准
- 每个目标语言至少完成首屏、FAQ、通知三类内容翻译，并通过合规审核。
- 占位符 `{task_id}`, `{balance_after}` 等在各语言中保持英文字符。
- 发布前完成一次多语言通知实机演练，确保渠道推送不乱码。
