# lxai-user-plugins-tab

DSH Web 设置里的「用户插件」独立标签页 —— 只列出**你自己**装进当前 profile 的插件。

## 它解决什么问题

DSH 内置的插件页按官方口径分组：**只有带 `dsh.bundle` 的插件**会进「已安装」列表。
而通过 `cordis.patch.yml` 的 `insert` 挂进来的插件（不带 `dsh.bundle`，例如
`lxai-app-bridge`）在那里**根本看不到**。这个标签页就是给它们一个可见的地方。

## 安装

```powershell
# 本地目录安装（开发 / 自用）
dsh plugin --profile web add link:<本目录绝对路径>

# 或直接从仓库装
dsh plugin --profile web add github:lx00924-lx/lxai-user-plugins-tab
```

装完**重启 DSH**，到「设置 → 插件 → 用户插件」查看。

## ⚠️ 包名不要改

`package.json` 的 `name` 是 `dsh-client-ui-user-plugins`，**必须保持不变**。

DSH 用 `link:` 协议挂载插件，要求**依赖键名 / 安装目录名 / `package.json` 的 `name`
三者完全一致**。改了 `name`（比如为了和仓库名对上），插件会**静默不加载**，界面上
不会报任何错，只是那个标签页凭空消失。

（这一点和 `lxai-app-bridge` 不同 —— 那个仓库的 `name` 是 `lxai-app-bridge`、
本地是 `dsh-app-bridge`，两边刻意不同；本插件则两边必须相同。）

## 它列出什么

判断依据只有**两条确定性声明**，刻意不做"解析路径在安装目录外"这种按位置推断的兜底
（那个判据会随插件装在哪里变化，容易把官方行误判成用户插件）：

1. 该 Loader 行（或其任一父分组行）的 id 出现在 `profiles/<name>/cordis.patch.yml` 里；
2. 模块名出现在 profile `package.json` 的 `dependencies` 里。

官方组装的行两边都不沾，因此天然落在"非用户"一侧。插件**自身的行会被跳过**
（这个标签页的价值是看别的插件，把自己也列出来只会让人以为多装了一个）。

## 界面显示什么

每个插件一张卡片：

| 位置 | 内容 |
| :--- | :--- |
| 第一行 | 短名（去掉 scope 与 `dsh` 前缀）+ 状态标签（已启用 / 已停用 / 加载失败…） |
| 第二行 | **描述** —— 读该插件 `package.json` 的 `description`，最多两行、超出截断 |
| 第三行 | package 名（等宽字体） |
| 展开后 | 完整名称 / Loader 行 id / 配置状态 |

描述是**拼路径直读** `profile目录/node_modules/<包名>/package.json`，
不走 `require.resolve('<包>/package.json')` —— 后者会被包的 `exports` 映射挡住
（没显式导出 `./package.json` 就解析失败）。读不到描述时该行自动不渲染，
不会因为某个插件没写描述就让整个列表失败。

## 它不做什么

- **不 import 任何 `@deepseek-ai` 官方包**，也不改写它们任何文件；
- 用到的只有 `loader`（公开服务）与 profile 目录里的两个文件
  （`package.json` 的 `dependencies`、你自己写的 `cordis.patch.yml`）；
- 没有 `connection` 服务时（非 Web 部署）静默跳过挂路由，只写一条日志。

## 许可

Apache License 2.0，全文见 [`LICENSE`](./LICENSE)，第三方名称与商标说明见 [`NOTICE`](./NOTICE)。