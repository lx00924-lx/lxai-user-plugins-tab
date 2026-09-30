/**
 * dsh-client-ui-user-plugins —— 宿主半侧
 *
 * 职责只有一件：判断「当前 profile 里哪些 Loader 行是用户自己装进来的」，
 * 并通过自己的 HTTP 路由 `/api/user-plugins.json` 交给浏览器半侧渲染。
 *
 * 完全不碰 @deepseek-ai 官方包：不 import 官方 host 包，也不改写它们的文件。
 * 用到的一切都来自 loader（公开服务）与 profile 目录里的两个文件：
 *   - profiles/<name>/package.json      的 dependencies（dsh plugin add 装进来的）
 *   - profiles/<name>/cordis.patch.yml  你自己写的行
 */

import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** 插件名（Cordis 行 id 用）。 */
export const name = 'user-plugins-list'

/** 需要的服务：loader 读树，connection 挂路由（缺 connection 时不挂，仅日志提示）。 */
export const inject = ['loader']

/** 路由路径：与浏览器半侧的 fetch 目标必须一致。 */
const ROUTE = '/api/user-plugins.json'

const requireFromHere = createRequire(import.meta.url)

/** 解析 YAML 用 js-yaml（dsh 自带依赖，解析 profile 的用户层）。 */
function yamlModule() {
  try {
    return requireFromHere('js-yaml')
  } catch {
    return undefined
  }
}

/** 一个行 specifier 指向的包名（`@scope/name` 或 `name`）。 */
function packageNames(specifier) {
  if (typeof specifier !== 'string' || specifier.length === 0) return []
  const segments = specifier.split('/')
  if (specifier.startsWith('@')) return segments.length < 2 ? [] : [segments.slice(0, 2).join('/')]
  return [segments[0]]
}

/** 一行是否算「用户插件」——只看确定性的声明：
 *   1. 这一行（或它的任一父分组行）的 id 出现在 profile 的 cordis.patch.yml 里；
 *   2. 模块名是 profile 里列出的依赖（`dsh plugin --profile web add <包>` 写进去的）。
 * 官方组装的行既不在用户 patch 层、也不在 profile 依赖里，因此必然落在「非用户」一侧。
 * 刻意不做「解析路径是否在安装目录外」这种按目录位置推断的兜底 —— 那个判据会随插件
 * 装在哪里而变化，容易把官方行误判成用户插件。
 */
function isUserInstalled(entry) {
  const userPlan = planFor(baseUrlOf(entry))

  for (let node = entry; node !== undefined && node !== null; node = node.parent) {
    if (userPlan.rowIds.has(bareId(node.options?.id))) return true
  }
  for (const n of packageNames(entry.options?.name)) if (userPlan.packages.has(n)) return true
  return false
}

/** 读 profile 自己的那一层：依赖名 + 你写的行 id。 */
let planKey
let plan = { packages: new Set(), rowIds: new Set() }
function planFor(baseUrl) {
  if (baseUrl === undefined) return plan
  if (planKey === baseUrl) return plan
  const packages = new Set()
  const rowIds = new Set()
  try {
    const dir = fileURLToPath(baseUrl)
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    for (const dependency of Object.keys(manifest?.dependencies ?? {})) packages.add(dependency)
    const patchPath = join(dir, 'cordis.patch.yml')
    const yaml = existsSync(patchPath) ? yamlModule() : undefined
    if (yaml !== undefined) {
      for (const document of yaml.loadAll(readFileSync(patchPath, 'utf8'))) {
        const rows = Array.isArray(document) ? document : [document]
        for (const row of rows) {
          if (row === null || typeof row !== 'object') continue
          if (typeof row.id === 'string') rowIds.add(row.id)
          if (typeof row.name === 'string') for (const n of packageNames(row.name)) packages.add(n)
          for (const nested of Array.isArray(row.insert) ? row.insert : []) {
            if (nested === null || typeof nested !== 'object') continue
            if (typeof nested.id === 'string') rowIds.add(nested.id)
            if (typeof nested.name === 'string') for (const n of packageNames(nested.name)) packages.add(n)
          }
        }
      }
    }
  } catch {
    /* profile 层读不到 = 没有用户插件，绝不因此让路由失败 */
  }
  planKey = baseUrl
  plan = { packages, rowIds }
  return plan
}

/** 行 id 去掉 `include:` 前缀。 */
function bareId(id) {
  return typeof id === 'string' && id.startsWith('include:') ? id.slice(8) : id
}

/**
 * 插件自己的 `package.json` 里的 description（给列表当一行中文说明用）。
 *
 * 直接按 `profile 目录 / node_modules / 包名 / package.json` 拼路径，不走
 * `require.resolve('<包>/package.json')` —— 后者会被包的 `exports` 映射挡住
 * （没显式导出 `./package.json` 就解析失败），而这里只是读一个文件。
 * 读不到就返回 undefined，界面那一行自动不渲染，绝不让路由因此失败。
 */
function descriptionOf(moduleName, baseUrl) {
  try {
    if (baseUrl === undefined) return undefined
    const bare = packageNames(moduleName)[0]
    if (bare === undefined) return undefined
    const manifest = JSON.parse(
      readFileSync(join(fileURLToPath(baseUrl), 'node_modules', bare, 'package.json'), 'utf8'),
    )
    const text = manifest?.description
    return typeof text === 'string' && text.trim().length > 0 ? text.trim() : undefined
  } catch {
    return undefined
  }
}

/** 沿父分组向上找第一个可用的解析基准 URL。 */
function baseUrlOf(entry) {
  for (let node = entry; node !== undefined && node !== null; node = node.parent) {
    const baseUrl = node.tree?.ctx?.baseUrl
    if (typeof baseUrl === 'string' && baseUrl.length > 0) return baseUrl
  }
  return undefined
}

/**
 * 本插件自身的模块名（含主入口导出子路径）。
 * 这些行在列表里跳过：这个标签页的价值是「看别的用户插件」，把自己的行也列出来
 * 只会让人以为多装了一个插件。它坏没坏，看标签页还能不能打开就知道了。
 */
const SELF_MODULES = new Set([
  'dsh-client-ui-user-plugins',
  'dsh-client-ui-user-plugins/lib/index.js',
  'dsh-client-ui-user-plugins/lib/client.js',
])

/** 快照：把用户插件行整理成浏览器半侧直接渲染的形状。 */
let cache
function snapshot(loader) {
  const now = Date.now()
  if (cache !== undefined && now - cache.at < 1000) return cache.value

  const rows = []
  for (const entry of loader.entries()) {
    if (entry.options?.group) continue
    if (SELF_MODULES.has(entry.options?.name)) continue
    if (!isUserInstalled(entry)) continue
    const phase = entry.fiber === undefined
      ? null
      : ['pending', 'loading', 'active', 'failed', null, 'unloading'][entry.fiber.state] ?? null
    rows.push({
      entryId: entry.id,
      moduleName: entry.options.name,
      enabled: !entry.disabled,
      phase,
      description: descriptionOf(entry.options.name, baseUrlOf(entry)),
    })
  }
  const value = { rows, count: rows.length, at: new Date().toISOString() }
  cache = { at: now, value }
  return value
}

/** 给外部（测试用）：直接算一次快照，不走 HTTP。 */
export function userPluginSnapshot(ctx) {
  return snapshot(ctx.loader)
}

/** 给外部（测试用）：判定过程的中间量，便于定位为什么某行没被认出来。 */
export function userPluginsDebug(ctx) {
  const rows = []
  for (const entry of ctx.loader.entries()) {
    const baseUrl = baseUrlOf(entry)
    rows.push({
      entryId: entry.id,
      moduleName: entry.options?.name,
      disabled: entry.disabled === true,
      baseUrl,
      names: packageNames(entry.options?.name),
      planPackages: [...planFor(baseUrl).packages],
      planRowIds: [...planFor(baseUrl).rowIds],
      isUser: isUserInstalled(entry),
    })
  }
  return rows
}

/**
 * 挂上路由。没有 connection 服务（非 Web 部署）时静默跳过，只写一条日志。
 * @param ctx - 宿主上下文。
 */
export function apply(ctx) {
  ctx.inject(['connection'], (scope) => {
    const connection = scope.connection
    if (connection?.fetch?.register === undefined) return
    scope.effect(() => connection.fetch.register({
      path: ROUTE,
      methods: ['GET'],
      requestBody: 'buffered',
      fetch: async () => new Response(JSON.stringify(snapshot(scope.loader)), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      }),
    }), 'user-plugins-list: route')
  })
}
