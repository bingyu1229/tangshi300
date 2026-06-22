# [codex] 完善项目文档与架构交接

## 变更内容

- 重写 README、项目计划、开发跟踪和 UI 设计说明，使其反映当前 v1 页面已经完成打磨的状态。
- 新增 `doc/system-architecture.html`，作为自包含的可视化系统架构交接页。
- 新增中文文档副本：
  - `README-zh.md`
  - `doc/project-plan-zh.md`
  - `doc/development-tracker-zh.md`
  - `doc/ui-design-doc-zh.md`
  - `doc/system-architecture-zh.html`
- 新增本文件作为中文 PR 描述草稿。

## 变更原因

项目的主要页面已经完成视觉和功能打磨，原有文档仍停留在“下一页待优化”的阶段。此次更新将文档调整为最终交接状态，并补充系统架构图，方便评审者快速理解数据管线、运行时层次、SQLite schema、API/组件边界和剩余发布风险。

## 用户与开发影响

- 新贡献者可以从 README 和架构页快速理解项目如何从 XML 语料进入本地 SQLite，再进入 Next.js 页面和客户端交互。
- 评审者可以通过英文和中文两套文档完成项目审查。
- 发布前剩余事项更清晰：补齐 smoke tests、验证 Qwen3-TTS、确认生成音频的分发方式。

## 验证

- `npm run build` 已通过。

## 注意事项

- PR 不包含生成的 SQLite、`.next`、音频或日志产物。
- 本地仍可能存在未跟踪的 `%USERP~1/.../system-commandline-sentinel-files/` 临时目录；该目录未纳入提交。
