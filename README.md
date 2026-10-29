# GitHub CI/CD 实战：角度实验室

[![CI / CD](https://github.com/zhengshengdong23-eng/github-cicd-demo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/zhengshengdong23-eng/github-cicd-demo/actions/workflows/ci-cd.yml)

一个零第三方依赖的角度 / 弧度转换器，用来亲手体验 GitHub Actions 的自动测试、构建与部署。

- [在线使用](https://zhengshengdong23-eng.github.io/github-cicd-demo/)
- [流水线运行记录](https://github.com/zhengshengdong23-eng/github-cicd-demo/actions)
- [工作流配置](.github/workflows/ci-cd.yml)

## 流程

```mermaid
flowchart LR
    A[提交 PR] --> B[Node 22 / 24 语法检查与单元测试]
    B --> C[构建验证]
    C --> D[通过检查后合并 main]
    D --> E[再次测试与构建]
    E --> F[上传 dist 制品]
    F --> G[部署 GitHub Pages]
```

**CI（持续集成）**：PR 和 main 提交都会检查语法、运行 9 个单元测试并验证构建。

**CD（这里是持续部署）**：仅 main 的成功构建会部署到 GitHub Pages。测试失败时，下游构建、部署不会执行；PR 不会部署到正式网站。也可以在 Actions 页面手动运行流水线。

## 本地运行

需要 Node.js 22 或 24；推荐使用 `.nvmrc` 中的 24。

```bash
npm ci
npm run check
npm test
npm run build
python3 -m http.server 8080 --directory dist --bind 127.0.0.1
```

打开 http://127.0.0.1:8080 。项目没有 npm 第三方依赖，`npm ci` 保留了常见项目的标准安装流程。

## 亲手体验红灯 → 绿灯 → 发布

1. 创建练习分支：`git switch -c practice/change-angle`。
2. 在 `src/converter.js` 把 `(degrees / 180) * Math.PI` 的 `180` 改成 `200`，提交并推送分支，然后向 main 发起 PR。
3. 打开 PR 的 Checks。测试会失败，例如 `180 degrees equals pi radians`；Build 和部署不会执行。
4. 把 `200` 改回 `180`，再修改 `src/index.html` 中的一句介绍文字，提交并推送到同一分支。
5. 等待两种 Node.js 版本的测试和 Build 全部通过，再合并 PR。
6. 打开 Actions，观察 main 上的测试 → 构建 → 部署，之后刷新在线页面。页脚的 Build 短提交号和 `version.json` 可用于确认部署版本。

## 文件与用途

| 文件 | 用途 |
| --- | --- |
| `src/converter.js` | 被测试的业务逻辑 |
| `test/converter.test.js` | 正常值、负数、小数、非法输入与溢出的测试 |
| `src/index.html` / `src/app.js` / `src/style.css` | 网页与交互 |
| `scripts/build.js` | 生成 dist，写入提交号和构建时间 |
| `.github/workflows/ci-cd.yml` | 触发条件、测试矩阵、任务依赖与部署 |

## 本次实操记录

- [演示 PR #1](https://github.com/zhengshengdong23-eng/github-cicd-demo/pull/1)：保留错误提交和后续修复过程。
- [故意失败的 CI](https://github.com/zhengshengdong23-eng/github-cicd-demo/actions/runs/40854209965)：分母从 180 改为 200，Node 22 与 24 各有 4 个测试失败，Build 和 Deploy 被跳过。
- 错误示例：180° 被算成 `2.827433388230814`，测试期待 `3.141592653589793`。错误版本的 PR 合并状态为 `BLOCKED`。
- 修复提交恢复公式，并将网页顶部文案改为“从测试通过，到自动上线”，方便部署后肉眼确认更新。
- 成功运行记录可以在 PR 的 Checks 与仓库 Actions 查看；部署后的短提交号显示在页面底部。

## GitHub 配置

仓库使用公开可见性；GitHub Free 支持公开仓库的 Pages。Settings → Pages → Build and deployment → Source 应为 **GitHub Actions**。

本仓库已为 `main` 启用分支保护：必须通过 PR 合并，`Test (Node 22)`、`Test (Node 24)` 和 `Build` 为必需检查，分支必须与 main 保持最新；规则也对管理员生效。不要求其他人审批，适合单人练习。请使用练习分支提交修改；直接 push main 会被拒绝。复制仓库时需要另行设置分支保护，它不是 YAML 文件的一部分。

工作流默认只有 `contents: read`；部署任务额外使用 `pages: write` 与 `id-token: write`。无需自己填写服务器密码或 Personal Access Token。所有 Actions 固定到具体提交，旁边注释对应主版本。

若复制到其他仓库，请调整本文件和页面中的仓库链接，并启用该仓库的 Pages。所有网页资源使用相对路径，支持仓库子路径部署。

## 官方参考

- [GitHub Actions 基础](https://docs.github.com/en/actions/get-started/understand-github-actions)
- [使用自定义工作流发布 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [actions/setup-node](https://github.com/actions/setup-node)
- [actions/deploy-pages](https://github.com/actions/deploy-pages)
