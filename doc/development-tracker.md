# Tangshi300 v1.0 Development Tracker

## 使用规则

本文件用于跟踪 v1.0 开发进度。每完成一步，应立即更新：

- 当前状态。
- 完成时间。
- 相关文件或 PR。
- 验证结果。
- 遇到的问题和后续处理。

状态枚举：

- `Todo`：尚未开始。
- `In Progress`：正在实现。
- `Blocked`：受阻，需要决策或外部条件。
- `Done`：实现并通过基础验证。

## 当前项目状态

| 项目 | 内容 |
| --- | --- |
| 当前阶段 | v1.0 首版实现 |
| 当前版本目标 | v1.0 |
| 最近更新时间 | 2026-06-16 |
| 已有文件 | Next.js 应用、数据转换脚本、SQLite 数据库、TTS 脚本入口、项目文档 |
| 当前结论 | v1.0 主流程已可构建并通过函数级烟测；Qwen3-TTS 真实音频生成待模型权重接入 |

## 总体进度

| 模块 | 状态 | 进度 | 备注 |
| --- | --- | --- | --- |
| 项目规划 | Done | 100% | 已创建 `doc/project-plan.md` |
| Python 环境 | Done | 100% | 已创建 conda env `tangshi300`，Python 3.12 |
| 工程初始化 | Done | 100% | Next.js + TypeScript 已初始化 |
| 数据转换 | Done | 100% | 已解析 321 首并抽样 50 首 |
| 数据库 | Done | 100% | SQLite schema、seed、repository 已实现 |
| 诗词浏览 | Done | 100% | 首页、搜索、详情已实现 |
| 默写测试 | Done | 100% | 上句到下句测试已实现 |
| 复习册 | Done | 100% | 加入、过滤、移除已实现 |
| 语音播放 | In Progress | 70% | 浏览器朗读可用；Qwen3-TTS 生成脚本改为 CPU-only |
| 移动端适配 | Done | 100% | 样式包含移动端断点 |
| 测试与验收 | In Progress | 80% | build 和函数级烟测通过；浏览器常驻预览受当前工具环境限制 |

## 详细待办

### 1. 工程初始化

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| INIT-000 | 创建 conda env `tangshi300`，Python 3.12 | Done | `conda run -n tangshi300 python --version` | 环境位置：`D:\anaconda3\envs\tangshi300` |
| INIT-001 | 初始化 Next.js + TypeScript 项目 | Todo | `npm run dev` 可启动 | 待确认包管理器 |
| INIT-002 | 建立推荐目录结构 | Todo | 文件结构符合 plan | `app`, `components`, `lib`, `scripts`, `services` |
| INIT-003 | 配置 lint、format、测试框架 | Todo | `npm run lint`, `npm test` | 以最小可用为准 |
| INIT-004 | 配置环境变量模板 | Todo | `.env.example` 完整 | DB 路径、音频目录、TTS 参数 |
| INIT-005 | 设置项目级默认 Python 解释器 | Done | `.vscode/settings.json` 指向 conda env | 避免修改全局 shell profile |
| INIT-006 | 安装 Next.js、React、sql.js 等依赖 | Done | `npm install` 完成 | 使用 npm |

### 2. 数据转换与抽样

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| DATA-001 | 检查 `tangshi300.xml` 编码与结构 | Done | 转换脚本可解析 | 解析 321 首 |
| DATA-002 | 实现 XML 转 JSON 脚本 | Done | 生成 `data/tangshi300.json` | 保留正文、注释、译文、赏析 |
| DATA-003 | 实现诗句切分逻辑 | Done | 每首诗生成 `lines_json` | 默写测试依赖 |
| DATA-004 | 随机抽取 50 首 v1.0 样本 | Done | 生成 `data/tangshi300-v1-sample.json` | 使用固定 seed 保证可复现 |
| DATA-005 | 生成数据质量报告 | Done | 控制台输出缺失统计 | 28 首缺少部分详情小节 |

### 3. SQLite 与数据访问

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| DB-001 | 建立 SQLite schema | Done | seed 可执行 | poems, poem_audio, learning_progress, daily_recommendations |
| DB-002 | 实现 seed 脚本 | Done | DB 中写入 50 首诗 | 可重复执行 |
| DB-003 | 实现 poems repository | Done | 烟测通过 | 查询详情、搜索、列表 |
| DB-004 | 实现 progress repository | Done | 烟测通过 | 状态更新与复习册 |
| DB-005 | 实现 audio repository | Done | 构建通过 | 音频状态读取 |

### 4. 内部 API

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| API-001 | `GET /api/poems/daily` | Done | 构建通过 | 返回未复习册诗词 |
| API-002 | `GET /api/poems/search` | Done | 构建通过 | v1.0 用 SQLite LIKE |
| API-003 | `GET /api/poems/:id` | Done | 构建通过 | 包含学习状态和音频状态 |
| API-004 | `POST /api/poems/:id/test` | Done | 烟测通过 | 正确后进入复习册 |
| API-005 | `GET /api/review-book` | Done | 烟测通过 | 返回复习册列表 |
| API-006 | `POST /api/review-book/:poemId/remove` | Done | 烟测通过 | 移除后回到 learning |
| API-007 | `GET /api/poems/:id/audio` | Done | 构建通过 | 音频缺失时返回 missing |

### 5. 前端页面

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| UI-000 | 确定简洁中国古典视觉风格 | Done | plan 中记录配色原则 | 宣纸、墨色、朱砂、青绿或黛蓝 |
| UI-001 | 首页每日推荐 | Done | build 通过 | 移动端首屏友好 |
| UI-002 | 搜索页 | Done | build 通过 | 支持空结果 |
| UI-003 | 诗词详情页 | Done | build 通过 | 题目、作者、体裁、正文、注释、译文、赏析 |
| UI-004 | 音频播放控件 | Done | build 通过 | 有缓存音频播放文件，无音频时浏览器朗读 |
| UI-005 | 默写测试页 | Done | 烟测通过 | 上句提示、下句输入 |
| UI-006 | 完成页状态反馈 | Done | 烟测通过 | 通过后进入复习册 |
| UI-007 | 复习册页 | Done | 烟测通过 | 可查看和移除 |

### 6. 学习逻辑

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| LEARN-001 | 答案标准化 | Done | 烟测通过 | 标点、空白处理 |
| LEARN-002 | 默写题目生成 | Done | 烟测通过 | 每题上句对应下句 |
| LEARN-003 | 学习状态机 | Done | 烟测通过 | new -> learning -> review_book |
| LEARN-004 | 推荐过滤复习册 | Done | 查询逻辑完成 | 复习册诗不被推荐 |
| LEARN-005 | 每日推荐保持一致 | Done | daily_recommendations 表 | 当天重复访问同一首 |

### 7. Qwen3-TTS 语音

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| TTS-001 | 建立 Python TTS 运行环境说明 | Done | `requirements.txt` 已创建 | 参考 Qwen3-TTS 官方文档 |
| TTS-002 | 实现单首诗音频生成脚本 | In Progress | 脚本入口已创建 | 等模型权重后补推理调用 |
| TTS-003 | 设置 speaker 为 Uncle_Fu | Done | 脚本常量已设置 | 写入 poem_audio 待补 |
| TTS-004 | 实现批量生成 50 首音频 | In Progress | `npm run audio:generate` 入口已创建 | 真实生成待接入 |
| TTS-005 | 前端接入音频播放 | Done | build 通过 | 优先静态文件，缺失时浏览器朗读 |

### 8. 测试与验收

| ID | 任务 | 状态 | 验证方式 | 备注 |
| --- | --- | --- | --- | --- |
| TEST-001 | 数据转换单元测试 | In Progress | `npm run prepare:v1` 通过 | 后续可补自动化断言 |
| TEST-002 | 推荐逻辑测试 | Done | 函数级烟测通过 | 排除复习册 |
| TEST-003 | 默写判定测试 | Done | 函数级烟测通过 | 正确答案进入复习册 |
| TEST-004 | API 集成测试 | In Progress | build 通过 | 后续补 HTTP 自动化 |
| TEST-005 | 移动端手动验证 | In Progress | CSS 断点已实现 | 当前工具环境未能保持浏览器预览 |
| TEST-006 | v1.0 验收清单 | In Progress | build 通过 | Qwen3-TTS 真实音频待接入 |

## 进度日志

### 2026-06-16

- Done: 创建 `doc/project-plan.md`。
- Done: 创建 `doc/development-tracker.md`。
- Done: 初步确认项目当前只有 `README.md` 与 `tangshi300.xml`。
- Done: 创建 conda env `tangshi300`，Python 版本为 3.12。
- Done: 创建 `environment.yml` 用于记录 Python 环境。
- Done: 创建 `.vscode/settings.json`，将项目级默认 Python 解释器指向 `D:\anaconda3\envs\tangshi300\python.exe`。
- Done: 将前端设计原则更新为简洁、中国古典风格和配色。
- Done: 初始化 Next.js + TypeScript 应用。
- Done: 安装 npm 依赖。
- Done: 实现 XML 转 JSON、固定抽样 50 首和 SQLite seed。
- Done: 实现每日推荐、搜索、详情、默写测试、复习册 API。
- Done: 实现首页、搜索页、详情页、默写页、复习册页。
- Done: 实现简洁中国古典风格响应式样式。
- Done: 实现浏览器朗读兜底和 Qwen3-TTS 脚本入口。
- Done: `npm run prepare:v1` 通过，解析 321 首，seed 50 首。
- Done: `npm run build` 通过。
- Done: 函数级烟测通过：50 首列表、每日推荐、搜索、默写进入复习册、移出复习册。
- Note: 当前命令沙箱会回收后台 dev server，无法保持常驻预览进程；用户本机可直接运行 `npm run dev`。
- Note: GPU 生成路径已废弃。当前 `services/tts/generate_audio.py` 按 Qwen3-TTS 官方 Python API 使用 CPU 生成，并支持 `--start` / `--count` 分批续跑。
- Note: 后续实现前需要重点检查 `tangshi300.xml` 编码和内容清洗质量。

## 阻塞项

当前无阻塞项。

## 2026-06-16 Codex Review Update

Scope reviewed:

- Source tree, package scripts, data import flow, sql.js persistence, API routes, UI pages, TTS script entry point, and documentation.

Validation run:

- `npm run prepare:v1` passed.
- `npm run build` passed.

Current conclusion:

- v1.0 core learning loop is implemented and buildable.
- The project is still local-first and single-user.
- Real Qwen3-TTS audio generation is the main remaining release task.
- Search and data-quality reporting are the most important optimization areas before expanding beyond the 50-poem sample.

Optimization backlog:

| Priority | Area | Recommendation | Status |
| --- | --- | --- | --- |
| P1 | Search | Replace multi-column live `LIKE` scan with indexed `poem_search_terms` CJK n-gram lookup. | Done |
| P1 | TTS | Generate and validate one real Qwen3-TTS audio file, then batch the 50-poem sample. | In Progress |
| P2 | Tests | Add automated smoke/unit tests for import, answer normalization, daily recommendation, and review-book state. | Todo |
| P2 | Data quality | Write a report listing poems with missing notes, translation, or appreciation. | Todo |
| P3 | Persistence | Keep sql.js for local v1; revisit native SQLite or hosted DB before multi-user deployment. | Todo |

## 待确认决策

| 决策 | 推荐方案 | 状态 |
| --- | --- | --- |
| Web 框架 | Next.js + TypeScript | 待审阅 |
| ORM | Drizzle ORM | 待审阅 |
| 包管理器 | npm 或 pnpm | 待审阅 |
| 语音生成策略 | 离线批量生成并缓存 | 待审阅 |
| v1.0 进度存储 | 单用户本地 SQLite | 待审阅 |
| 前端视觉风格 | 简洁、中国古典配色：宣纸、墨色、朱砂、青绿或黛蓝 | 已记录 |

### 2026-06-17

- Done: Improved search scalability by adding `poem_search_terms`, an indexed inverted search table populated during seed.
- Done: Added CJK single-character, bigram, trigram, and Latin/number search-term extraction in `lib/text.ts`.
- Done: Updated `searchPoems` to prefer indexed term lookup with weighted ranking and retain the old `LIKE` query as a fallback.
- Done: `npm run prepare:v1` passed and indexed 48,848 search-term rows for the 50-poem sample.
- Done: Direct SQLite checks returned ranked results for author, phrase, and poem-line searches.
- Done: `npm run build` passed.

## 下一步

1. Review `doc/project-overview.md` and confirm the remaining optimization priorities.
2. Generate one Qwen3-TTS audio file end to end and verify playback from a poem detail page.
3. Add automated smoke tests for import, seed, daily recommendation, answer checking, review-book removal, and indexed search.
4. Add a data-quality report for the 28 poems currently missing one or more detail sections.
5. Load-test indexed search with the full parsed corpus before increasing the visible app sample.
