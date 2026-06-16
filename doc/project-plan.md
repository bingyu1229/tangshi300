# Tangshi300 v1.0 Project Plan

Status note, 2026-06-16: the v1.0 core app has been implemented and validated with `npm run prepare:v1` and `npm run build`. See `doc/development-tracker.md` for progress history and `doc/project-overview.md` for the current optimization review.

## 1. 项目目的

Tangshi300 是一个帮助用户学习唐诗的响应式 Web 应用。v1.0 的目标是提供一个轻量、可维护、可扩展的学习闭环：

1. 每日推荐一首未掌握的唐诗。
2. 支持用户按标题、作者、关键词、词语或诗句搜索唐诗。
3. 用户学习后通过默写测试巩固记忆。
4. 默写通过后，诗词进入“复习册”，后续不再出现在每日推荐中。
5. 用户可从复习册移除诗词，使其重新进入推荐候选池。
6. 诗词详情页提供题目、作者、体裁、正文、注释、译文、赏析等信息。
7. 诗词支持语音播放，语音文件预生成并缓存。

v1.0 只从 `tangshi300.xml` 中抽取 50 首诗作为首批内容，优先保证学习流程完整、移动端可用、数据结构清晰。

## 2. 范围

### 2.1 v1.0 包含

- XML 数据清洗、转换为 JSON，并抽样 50 首。
- SQLite 初始化与迁移。
- 唐诗浏览、搜索、详情页。
- 每日推荐逻辑。
- 默写测试：给上句，用户输入下句。
- 学习状态管理：未学习、学习中、已掌握、复习册。
- 复习册管理：查看、移除。
- Qwen3-TTS 生成语音文件并在前端播放。
- 手机端适配，首屏以学习任务为中心。

### 2.2 v1.0 暂不包含

- 用户登录与多账户同步。
- 云端部署、支付、社交分享。
- 间隔重复算法的完整实现。
- AI 讲解、问答、个性化学习计划。
- 全量唐诗库上线。

## 3. 推荐技术栈

### 3.1 主语言

- TypeScript：前端、服务端 API、数据导入脚本主体。
- Python：Qwen3-TTS 语音生成服务或离线批处理脚本。
- Python 运行环境：conda env `tangshi300`，Python 版本固定为 `3.12`。

### 3.2 Web 应用

- Next.js + React + TypeScript。
- App Router 用于页面组织。
- API Routes 用于内部 REST API。
- CSS Modules 或 Tailwind CSS 用于响应式 UI。

选择 Next.js 的原因是前后端可以在一个 TypeScript 项目中维护，SQLite 查询和页面渲染边界清晰，后续部署也比较直接。

### 3.3 数据库

- SQLite：本地单文件数据库，适合 v1.0 内容规模。
- Drizzle ORM 或 Prisma：建议使用 Drizzle，迁移轻量，SQL 可控。

### 3.4 语音模型

- 模型：`Qwen3-TTS-12Hz-0.6B-CustomVoice`
- Speaker：`Uncle_Fu`
- 官方文档：<https://github.com/QwenLM/Qwen3-TTS>
- 集成方式：Python 脚本调用模型生成音频文件，Node API 只负责读取音频元数据并提供静态播放地址。

语音文件建议离线或按需生成后缓存，避免每次播放实时推理。

### 3.5 本地开发环境

- conda 环境名：`tangshi300`
- Python：`3.12`
- 环境定义文件：`environment.yml`
- 项目级默认解释器：`.vscode/settings.json` 指向 `D:\anaconda3\envs\tangshi300\python.exe`

说明：不建议在项目初始化阶段修改用户全局 shell profile 来强制自动激活环境。v1.0 采用项目级默认解释器配置；需要手动终端激活时使用 `conda activate tangshi300`。

## 4. 代码结构建议

```text
tangshi300/
  app/
    api/
      poems/
      review-book/
      progress/
    poems/
    review-book/
    page.tsx
  components/
    poem/
    review/
    search/
    layout/
  lib/
    db/
    poems/
    progress/
    recommendation/
    audio/
  scripts/
    convert-tangshi-xml.ts
    seed-db.ts
    generate-audio.ts
  services/
    tts/
      generate_audio.py
      requirements.txt
  data/
    tangshi300.json
    tangshi300-v1-sample.json
  public/
    audio/
  doc/
    project-plan.md
    development-tracker.md
```

## 5. 数据处理方案

### 5.1 输入文件

- 源文件：`tangshi300.xml`
- 字段来源：
  - `title`：题目
  - `auth`：作者
  - `type`：体裁
  - `content`：正文
  - `desc`：注释、译文、赏析等 HTML 片段

### 5.2 转换步骤

1. 读取 XML 并验证编码。
2. 解析每个 `node`。
3. 清洗字段：
   - HTML 标签标准化。
   - 将 `<br />` 转为诗句分行。
   - 提取注释、译文、赏析小节。
   - 移除多余空白和不可见字符。
4. 生成稳定 `poemId`，推荐使用 slug 或内容 hash。
5. 从全量数据中随机抽样 50 首。
6. 输出：
   - `data/tangshi300.json`
   - `data/tangshi300-v1-sample.json`
7. 将 50 首写入 SQLite。

### 5.3 数据质量检查

- 每首诗必须有题目、作者、正文。
- 正文至少可切分为 2 句。
- 详情页字段缺失时允许降级显示，但需记录导入警告。
- 如果 XML 内容出现乱码，需要先确认文件真实编码，再决定是否执行转码修复。

## 6. SQLite 表设计

### 6.1 poems

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | text primary key | 稳定诗词 ID |
| title | text | 题目 |
| author | text | 作者 |
| genre | text | 体裁 |
| content | text | 正文，保留换行 |
| lines_json | text | 诗句数组 JSON |
| notes | text | 注释 |
| translation | text | 译文 |
| appreciation | text | 赏析 |
| source | text | 来源文件 |
| created_at | text | 创建时间 |
| updated_at | text | 更新时间 |

### 6.2 poem_audio

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | text primary key | 音频记录 ID |
| poem_id | text | 关联 poems.id |
| speaker | text | 固定为 Uncle_Fu |
| model | text | Qwen3-TTS-12Hz-0.6B-CustomVoice |
| file_path | text | public/audio 下的相对路径 |
| duration_ms | integer | 音频长度 |
| status | text | pending, ready, failed |
| error_message | text | 失败原因 |
| created_at | text | 创建时间 |

### 6.3 learning_progress

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | text primary key | 进度记录 ID |
| poem_id | text | 关联 poems.id |
| status | text | new, learning, mastered, review_book |
| mastered_at | text | 首次默写通过时间 |
| last_tested_at | text | 最近测试时间 |
| correct_count | integer | 正确次数 |
| wrong_count | integer | 错误次数 |
| created_at | text | 创建时间 |
| updated_at | text | 更新时间 |

v1.0 无登录时，进度默认存储在本地 SQLite 中。后续如增加用户系统，需要把 `learning_progress` 扩展为 `user_learning_progress`。

## 7. 内部 API 设计

### 7.1 诗词

- `GET /api/poems/daily`
  - 返回一首未在复习册中的每日推荐诗。
  - 如果当日已有推荐，返回同一首。

- `GET /api/poems/search?q=...`
  - 按标题、作者、正文、注释、译文、赏析搜索。
  - 返回摘要列表。

- `GET /api/poems/:id`
  - 返回诗词完整详情、学习状态、音频状态。

### 7.2 默写测试

- `POST /api/poems/:id/test`
  - 入参：`promptLineIndex`, `answer`
  - 逻辑：根据上句匹配下一句。
  - 正确后更新学习状态；全部测试通过后进入复习册。

### 7.3 复习册

- `GET /api/review-book`
  - 返回所有复习册诗词。

- `POST /api/review-book/:poemId/remove`
  - 将诗词从复习册移除，状态回到 `learning` 或 `new`。

### 7.4 音频

- `GET /api/poems/:id/audio`
  - 返回音频 URL、模型、speaker、生成状态。

- `POST /api/poems/:id/audio/generate`
  - v1.0 可仅内部使用。
  - 触发 Python TTS 生成任务。

## 8. 核心业务流程

### 8.1 每日推荐

1. 查询今日是否已有推荐记录。
2. 如有，返回该诗。
3. 如无，从不在复习册、未掌握的 50 首中随机选择。
4. 如果所有诗都已进入复习册，返回复习册入口和完成状态。

### 8.2 搜索

1. 用户输入关键词。
2. 后端对标题、作者、正文和解释字段做模糊匹配。
3. 返回高亮摘要。
4. 点击进入详情页。

v1.0 可使用 SQLite `LIKE` 查询；如后续内容扩容，迁移到 SQLite FTS5。

### 8.3 默写测试

1. 页面选择一组连续诗句。
2. 展示上句，用户输入下句。
3. 后端做答案标准化：
   - 移除空格。
   - 统一中文标点。
   - 可忽略句末标点。
4. 答案正确后进入下一题。
5. 全部通过后，状态更新为 `review_book`。

### 8.4 复习册

1. 默写通过的诗自动加入复习册。
2. 复习册中的诗不再进入每日推荐候选。
3. 用户点击移除后，该诗重新进入推荐候选。

### 8.5 语音播放

1. 生成音频文本：题目、作者、正文。
2. Python 调用 Qwen3-TTS 生成音频。
3. 保存到 `public/audio/{poemId}.wav` 或 `.mp3`。
4. 写入 `poem_audio` 表。
5. 前端使用 HTMLAudioElement 播放。
6. 在 Qwen3-TTS 音频尚未生成时，前端使用浏览器中文朗读作为 v1.0 预览兜底。

## 9. Qwen3-TTS 集成方案

### 9.1 运行方式

推荐 v1.0 使用离线批处理：

```text
scripts/generate-audio.ts
  -> 调用 services/tts/generate_audio.py
  -> 读取 data/tangshi300-v1-sample.json
  -> 为 50 首诗逐首生成音频
  -> 写入 public/audio
  -> 更新 SQLite poem_audio
```

当前实现已保留 `services/tts/generate_audio.py` 和 `npm run audio:generate` 入口。模型权重可用后，在该脚本内补齐 Qwen3-TTS 官方推理调用即可批量生成文件。

### 9.2 模型参数

- Model：`Qwen3-TTS-12Hz-0.6B-CustomVoice`
- Speaker：`Uncle_Fu`
- 文本格式建议：

```text
《{title}》，{author}。
{content}
```

### 9.3 失败处理

- 单首生成失败不阻塞全量任务。
- 写入 `poem_audio.status = failed` 和错误原因。
- 前端在音频缺失时隐藏播放按钮或显示生成中状态。

## 10. 前端页面设计

### 10.0 视觉风格原则

- 整体保持简洁、克制，优先服务阅读、搜索和默写。
- 参考中国古典风格，但避免堆砌装饰元素。
- 推荐配色：
  - 宣纸底色：温润米白或浅纸色，用于页面背景。
  - 墨色：深灰黑，用于正文和主标题。
  - 朱砂红：用于主操作、正确反馈和重点标记。
  - 青绿或黛蓝：用于次级按钮、分区标题和链接。
  - 淡金或浅褐：用于边框、分隔线和卡片阴影。
- 字体层级清晰，正文阅读优先；诗词正文可使用更具古典气质的中文衬线字体栈。
- 移动端避免复杂装饰，保证按钮、输入框和音频控件易触达。

### 10.1 首页

- 今日推荐诗卡片。
- 学习状态提示。
- 搜索入口。
- 继续默写按钮。
- 复习册入口。

### 10.2 搜索页

- 搜索框固定在顶部。
- 结果列表显示题目、作者、命中片段。
- 移动端使用单列布局。

### 10.3 诗词详情页

- 题目、作者、体裁。
- 正文。
- 播放按钮。
- 注释、译文、赏析分区。
- 开始默写按钮。

### 10.4 默写页

- 展示上句。
- 输入框输入下句。
- 提交后即时反馈。
- 正确后推进下一题。
- 完成后显示加入复习册结果。

### 10.5 复习册页

- 已掌握诗词列表。
- 可重新学习。
- 可从复习册移除。

## 11. 测试策略

### 11.1 单元测试

- XML 转 JSON。
- 诗句切分。
- 搜索查询。
- 答案标准化与判定。
- 推荐候选过滤。

### 11.2 集成测试

- 数据库初始化和 seed。
- 默写通过后状态更新。
- 从复习册移除后重新进入推荐池。
- 音频元数据读取。

### 11.3 前端验证

- 桌面端和手机端布局。
- 首页推荐、搜索、详情、默写、复习册完整路径。
- 音频播放按钮在有音频和无音频时的表现。

## 12. 里程碑

| 阶段 | 目标 | 交付物 |
| --- | --- | --- |
| M1 | 项目基础设施 | Next.js 项目、SQLite、目录结构 |
| M2 | 数据导入 | XML 转 JSON、50 首样本、seed |
| M3 | 诗词浏览 | 首页、搜索、详情 API 与页面 |
| M4 | 学习闭环 | 默写测试、状态更新、复习册 |
| M5 | 语音播放 | TTS 生成脚本、音频缓存、播放 |
| M6 | 体验收尾 | 移动端适配、测试、文档更新 |

## 13. 风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| XML 编码或内容结构不稳定 | 导入后文本乱码或字段缺失 | 先做编码检测和导入报告 |
| TTS 模型本地运行资源不足 | 音频生成慢或失败 | 使用离线批处理；允许音频缺失降级 |
| 无用户系统导致进度只适合单用户 | 难以多端同步 | v1.0 明确单用户本地模式，后续扩展 user_id |
| 搜索性能随数据量增长下降 | 全量上线后查询慢 | v1.0 用 LIKE，v1.1 迁移 FTS5 |
| 诗句切分不准确 | 默写测试题目错误 | 导入时生成 lines_json 并人工抽检 |

## 14. 验收标准

- 应用可在桌面和手机宽度下正常使用。
- 数据库中有 50 首可学习唐诗。
- 每日推荐不会推荐复习册中的诗。
- 用户可搜索并进入诗词详情页。
- 默写测试答对后学习状态正确更新。
- 复习册可查看、可移除诗词。
- 至少一首诗可成功播放语音；完整 50 首音频生成作为 v1.0 发布前目标。
- 项目文档和开发跟踪文档保持更新。
