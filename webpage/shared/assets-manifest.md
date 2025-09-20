﻿# 公共素材清单

> 所有共享资产存放于 `frontend-build/public`（网页静态资源）与共享云盘（原图/源文件）。此清单作为指引，更新素材后请同步维护。

## Logo 与品牌
| 资产 | 路径/占位 | 格式 | 状态 | 维护人 | 交付时间 |
| --- | --- | --- | --- | --- | --- |
| 平台 Logo | `public/logo.svg`（待上传） | SVG/96×32 | 占位中 | shared 设计令牌轮值 | 2025-09-19（设计侧确认版本） |
| Favicon | `public/favicon.ico` | ICO 32×32 | 占位中 | frontend-build | 2025-09-20（随前端初始化） |
| 品牌渐变背景 | `public/gradients/hero-default.png` | PNG 1920×1080 | 已交付 v1.0（2025-09-18） | experience-design | 2025-09-18 |

## 图片与插画
| 模块 | 资产 | 建议规格 | 文件路径 | Owner | 交付时间 | 状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 案例区 | 3 张模板示意图 | 1200×800, JPG | `public/images/cases/case-{scene}-{date}.jpg` | content-ops | 2025-09-17 | 已交付（占位图，待替换正式素材） |
| 快速上手流程 | 3 步流程插画 | SVG | `public/illustrations/quickstart-step{1-3}.svg` | experience-design | 2025-09-18 | 已交付 v1.0 |
| 任务中心 | 状态图标（成功/警告/错误） | SVG 48×48 | `public/icons/task-status-{state}.svg` | operations-compliance × experience-design | 2025-09-18 | 已交付 v1.0 |
| 角色徽标 | Persona Badge (Visitor/Viewer/Creator) | SVG 96×32 | `public/icons/persona-{role}.svg` | experience-design | 2025-09-18 | 已交付 v1.0 |

## 字体资源
| 名称 | 用途 | 文件路径 | Owner | 备注 |
| --- | --- | --- | --- | --- |
| Source Han Sans / PingFang | 中文正文 | 系统字体（不落盘） | shared | 保持回退链 |
| Inter / Segoe UI | 英文正文 | 系统字体（不落盘） | shared | 浏览器默认提供 |
| 题头自定义字体 | 子标题/营销文案 | `public/fonts/nuwa-headline.woff2`（占位） | experience-design | 上线前确认 license |

## 视频与动效
| 资产 | 规格 | 文件路径 | Owner | 状态 | 交付时间 |
| --- | --- | --- | --- | --- | --- |
| 模板演示短视频 | MP4, 1920×1080, ≤ 15s | `public/videos/template-demo.mp4` | product-planning × experience-design | 待评估是否首屏展示 | TBC（产品规划确认后更新） |
| 任务中心动效 | Lottie JSON | `public/lottie/task-center-progress.json` | experience-design | 需求评估中 | 2025-09-22（如确认实施） |

## 交付与版本
1. 新素材上传至 `frontend-build/public` 后，在本文档更新路径/状态，并在 `shared/CHANGELOG.md` 留痕。
2. 原始 PSD/AI 等源文件存入共享云盘，命名规范：`模块_用途_版本_日期.ext`。
3. 若素材影响多语言或合规审查，请提前通知 content-ops 与 operations-compliance。

## 合规审核与风控素材
| 资产 | 目标路径 | 格式 | Owner | 状态 |
| --- | --- | --- | --- | --- |
| 审核状态图标（通过/驳回/复核/挂起） | frontend-build/public/admin/icons/review-status/ | SVG 48×48 | operations-compliance（Alice） | 正式版已交付（2025-09-18 00:40） |
| 举报处理状态图标（待处理/调查中/已结案） | frontend-build/public/admin/icons/report-status/ | SVG 48×48 | operations-compliance（Alice） | 正式版已交付（2025-09-18 00:40） |
| 风控 KPI 卡片背景 | frontend-build/public/illustrations/compliance/risk-kpi-bg.png | PNG 1200×400 | operations-compliance（Bob） | 已交付（2025-09-17 03:33，占位图待替换） |
| 预警等级图标（橙/红） | frontend-build/public/icons/compliance/alerts/ | SVG 32×32 | operations-compliance（Bob） | 已交付（2025-09-17 03:33） |






