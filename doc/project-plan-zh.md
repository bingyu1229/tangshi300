# Tangshi300 项目计划

最后更新：2026-06-22

## 目标

Tangshi300 是一个本地优先的唐诗学习应用，界面气质安静、现代，并带有水墨感。v1 产品闭环如下：

1. 每天推荐一首诗用于学习。
2. 让学习者搜索和浏览诗库。
3. 打开诗词详情页，阅读正文、音频、注释、译文和赏析。
4. 通过根据上一句输入下一句来练习默写。
5. 将答对的诗移入复习册。
6. 复习已掌握诗词，或从复习册移除以重新学习。

## 当前状态

v1 核心闭环已经实现，主要页面已经完成视觉和功能打磨。

已实现：

- 完整语料 XML 转换和稳定的 50 首 v1 样本。
- 基于 `sql.js` 的本地 SQLite 持久化。
- 诗词、音频元数据、学习进度、每日推荐和加权搜索词数据库 schema。
- 每日推荐生成与持久化。
- 通过 `poem_search_terms` 支持 CJK/Latin 索引搜索，并保留 `LIKE` 兜底搜索。
- 已打磨的首页、搜索/诗库、诗词详情、默写测试和复习册页面。
- 诗词、每日推荐、详情、音频元数据、测试提交、复习册列表和复习册移除 API 路由。
- 浏览器语音/音频兜底。
- 基于 `ui/` 运行时图像资产的水墨视觉系统。

v1 剩余风险：

- 仍缺少自动化 smoke tests。
- 真实 Qwen3-TTS 生成需要完成最终端到端验证。
- 生成音频文件会被 git 忽略，完整媒体发布需要单独生成或打包。

## 产品工作流

### 每日学习

- `/` 调用 `getDailyPoem()` 并展示当前推荐。
- `/learn` 重定向到今日诗词测试。
- `/poems/[id]/test` 加载确定性的首句提示，并通过 `/api/poems/[id]/test` 提交答案。
- 答对时将诗标记为 `review_book`；答错时标记为 `learning`。

### 搜索与阅读

- `/search?q=...` 会用查询结果初始化诗库搜索页。
- `SearchClient` 支持客户端筛选、分页、高亮和基于 fetch 的搜索刷新。
- `/poems/[id]` 展示诗词、插图、元数据、音频、学习动作、注释、译文和赏析。

### 复习

- `/review-book` 读取学习状态为 `review_book` 的诗。
- `ReviewBookClient` 支持浏览、搜索/筛选和移除。
- `/api/review-book/[poemId]/remove` 将诗移回 `learning`。

## 系统架构

```text
tangshi300.xml
  -> scripts/convert-tangshi-xml.ts
  -> data/tangshi300.json + data/tangshi300-v1-sample.json
  -> scripts/seed-db.ts
  -> data/tangshi300.sqlite
  -> lib/db/poems.ts
  -> App Router pages + API routes
  -> client components for search, testing, audio, and review actions
```

关键实现边界：

- `lib/poems/import.ts` 负责 XML 解析和稳定采样。
- `lib/text.ts` 负责搜索词生成和答案归一化。
- `lib/db/sqlite.ts` 负责 schema 创建、查询辅助函数和数据库持久化。
- `lib/db/poems.ts` 负责诗词、推荐、进度、复习和音频访问。
- `app/api/**` 为客户端组件提供 JSON 查询/变更端点。
- `components/**` 负责交互式客户端行为。

可查看 `doc/system-architecture-zh.html` 中的中文可视化架构图。

## 运行时资产

运行时图像资产：

- `ui/page-backgroud-sm.jpg`
- `ui/poem-card-background-sm.png`
- `ui/thumbnail-sm.png`
- `ui/thumbnail-2-sm.jpg`
- `ui/stamp-logo-sm.png`
- `ui/cloud.png`

参考/设计资产：

- `ui/homepage.png`
- `ui/poem.png`
- `ui/search.png`
- `ui/review.png`
- `ui/test.png`
- `ui/visual-inkWash-preview.html`

保留大型参考图的原因是设计参考路由会导入这些截图用于 QA。

## 开发命令

```powershell
npm install
npm run prepare:v1
npm run dev
npm run build
```

Windows/Codex 重复 `PATH` 辅助命令：

```powershell
npm run dev:clean-env
```

## 验收标准

- `npm run build` 通过。
- 首页搜索能打开 `/search?q=...` 并显示匹配结果。
- 头部导航和移动端导航路由正确。
- `/learn` 打开今日默写流程。
- 今日推荐诗能打开详情页。
- 复习册链接能打开 `/review-book`。
- 最近学习展示真实的 `learning_progress` 记录。
- 当推荐数量足够时，推荐轮换能改变可见诗词。
- 复习册移除会将诗移回 `learning`。
- 桌面和移动布局保持间距、可读性和清晰操作入口。

## 下一步

1. 为每日推荐、搜索、详情、测试提交和复习册移除添加 smoke tests。
2. 针对 v1 样本验证 Qwen3-TTS 生成和播放。
3. 为缺失注释、译文和赏析的诗词添加数据质量报告。
4. 决定生成音频是作为发布资产分发，还是由本地生成。
