# Tangshi300

Tangshi300 是一个本地优先的 Next.js 唐诗学习应用。它将 `tangshi300.xml` 转换为可复现的 50 首 v1 学习样本，通过 `sql.js` 将学习进度持久化到 SQLite，并提供从每日推荐、搜索、阅读、默写练习到复习和音频播放的完整学习闭环。

## 当前状态

v1 已准备进入产品评审：

- XML 管线可解析 321 首诗，并生成稳定的 JSON 输出。
- `npm run prepare:v1` 会将 50 首 SQLite 样本和加权搜索词写入本地数据库。
- 应用已包含经过打磨的首页、搜索/诗库、诗词详情、默写测试和复习册页面。
- API 路由覆盖诗词列表/搜索、每日推荐、诗词详情、测试提交、复习册列表/移除和音频元数据。
- 在生成的 Qwen3-TTS 音频尚未作为发布资产时，浏览器语音合成可作为默认音频兜底。
- 主应用视觉方向保持一致：温润宣纸、水墨意象、朱砂动作、青玉搜索控件和易读的中文衬线字体。

## 本地开发

```powershell
conda activate tangshi300
npm install
npm run prepare:v1
npm run dev
```

如果 Windows 或 Codex 会话遇到重复 `PATH` 条目，可使用：

```powershell
npm run dev:clean-env
```

常用命令：

```powershell
npm run convert:data
npm run seed
npm run prepare:v1
npm run build
npm run audio:generate
```

## 项目结构

```text
app/                 Next.js App Router 页面和 API 路由
components/          客户端组件和可复用 UI 行为
data/                生成的 JSON 数据；本地 SQLite 文件会被忽略
doc/                 产品、开发、设计和架构文档
lib/                 数据访问、导入、文本、类型和路径工具
scripts/             Node/TypeScript 数据与音频命令封装
services/tts/        Python Qwen3-TTS 生成入口
types/               本地 TypeScript 声明
ui/                  运行时和参考用水墨图像资产
```

## 系统架构

应用分为四个主要层次：

1. 数据准备：`scripts/convert-tangshi-xml.ts` 将 `tangshi300.xml` 解析为完整 JSON 和 v1 样本 JSON。
2. 本地持久化：`scripts/seed-db.ts` 将诗词、搜索词和已存在音频元数据写入 `data/tangshi300.sqlite`。
3. 应用运行时：App Router 页面从 `lib/db/poems.ts` 读取数据；客户端组件通过 API 路由完成搜索、测试和复习册状态更新。
4. 媒体兜底：当 `/public/audio/*.wav|mp3` 文件存在时优先使用生成音频，否则浏览器音频客户端可进行语音合成。

可打开 `doc/system-architecture-zh.html` 查看中文可视化架构图。

## 文档

- `doc/project-plan-zh.md`：产品目标、当前范围、工作流、架构摘要和验收标准。
- `doc/development-tracker-zh.md`：实现状态、验证记录、剩余风险和发布检查表。
- `doc/ui-design-doc-zh.md`：设计方向、视觉 token、页面指导和 QA 要求。
- `doc/system-architecture-zh.html`：用于项目交接和 PR 评审的中文可视化架构页。
- `doc/pr-description-zh.md`：中文 PR 标题和描述草稿。

## 发布优先级

1. 为导入、种子、每日推荐、搜索、答题检查和复习册状态变更补充自动化 smoke tests。
2. 对 50 首 v1 样本完成真实 Qwen3-TTS 生成和播放的端到端验证。
3. 为缺失注释、译文和赏析的诗词添加结构化数据质量报告。
4. 除非是明确的发布资产，否则持续避免将生成产物纳入 git：SQLite 文件、`.next`、日志、`node_modules` 和生成音频都应保持忽略。
