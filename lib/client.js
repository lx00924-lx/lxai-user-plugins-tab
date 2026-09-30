window.__ModuleLoader__.load({
	id: "dsh-client-ui-user-plugins",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");

		//#region styles
		const CSS = `
.dupl-section{width:100%;max-width:760px;display:flex;flex-direction:column;gap:14px;color:var(--dsw-alias-label-primary)}
.dupl-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.dupl-title{font-size:14px;font-weight:600;line-height:22px;margin:0}
.dupl-count{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.dupl-sub{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dupl-search{position:relative;display:flex;align-items:center;width:100%;color:var(--dsw-alias-label-tertiary)}
.dupl-search>svg{position:absolute;left:12px;pointer-events:none}
.dupl-search input{width:100%;height:36px;padding:0 12px 0 36px;border-radius:10px;font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:.5px solid var(--dsw-alias-border-l4);outline:none}
.dupl-search input::placeholder{color:var(--dsw-alias-label-tertiary)}
.dupl-search input:focus-visible{border-color:var(--dsw-alias-state-business-primary);box-shadow:0 0 0 2px color-mix(in srgb, var(--dsw-alias-state-business-primary) 18%, transparent)}
.dupl-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:start}
.dupl-card{min-width:0;border:0;border-radius:14px;overflow:hidden;background:var(--dsw-alias-bg-layer-3);box-shadow:var(--dsw-elevation-stroke)}
.dupl-cardMain{width:100%;display:flex;flex-direction:column;gap:2px;padding:10px 12px;background:0 0;border:0;font:inherit;color:inherit;text-align:left;cursor:pointer}
.dupl-cardTop{display:flex;align-items:center;gap:8px;justify-content:space-between}
.dupl-cardName{font-size:13px;font-weight:600;line-height:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dupl-cardId{font-size:11px;line-height:16px;color:var(--dsw-alias-label-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dupl-cardDesc{font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dupl-tag{flex:none;font-size:11px;line-height:16px;padding:1px 7px;border-radius:999px;border:.5px solid var(--dsw-alias-border-l3);color:var(--dsw-alias-label-secondary);white-space:nowrap}
.dupl-tag[data-state="ok"]{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary) 40%, transparent)}
.dupl-tag[data-state="bad"]{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent)}
.dupl-facts{margin:0;padding:0 12px 12px;display:grid;gap:6px}
.dupl-facts>div{display:grid;grid-template-columns:96px 1fr;gap:8px;align-items:start}
.dupl-facts dt{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dupl-facts dd{margin:0;font-size:12px;line-height:18px;word-break:break-all}
.dupl-empty{margin:0;color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px}
.dupl-fail{display:flex;align-items:center;gap:10px;color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:20px}
.dupl-fail p{margin:0}
.dupl-fail button,.dupl-more{font:inherit;font-size:12px;cursor:pointer;border-radius:6px;padding:3px 10px;color:var(--dsw-alias-label-primary);background:0 0;border:.5px solid var(--dsw-alias-border-l3)}
.dupl-more{align-self:start}
`;
		const styleId = "dsh-client-ui-user-plugins/styles.css";
		if (typeof document !== "undefined" && document.querySelector(`style[data-plugin-css="${styleId}"]`) === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-client-ui-user-plugins";
			tag.dataset.pluginCss = styleId;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}
		//#endregion

		//#region 小工具
		/** 短名：去掉 scope 与 dsh 前缀，和官方列表的显示口径一致。 */
		function shortName(moduleName) {
			const withoutScope = moduleName.startsWith("@") ? moduleName.slice(moduleName.indexOf("/") + 1) : moduleName;
			return withoutScope.replace(/^cordis:/, "").replace(/^cordis-plugin-/, "").replace(/^dsh-(?:host-|client-)?/, "");
		}
		/** 行 id 去掉组合器加的 include: 前缀。 */
		function bareId(entryId) {
			return String(entryId).replace(/^include:/, "");
		}
		function IconSearch() {
			return (0, react_jsx_runtime.jsxs)("svg", {
				width: 14,
				height: 14,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [(0, react_jsx_runtime.jsx)("circle", { cx: 7, cy: 7, r: 4.6, stroke: "currentColor", strokeWidth: 1.3 }), (0, react_jsx_runtime.jsx)("path", { d: "M10.6 10.6 14 14", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" })]
			});
		}
		function IconChevron({ open }) {
			return (0, react_jsx_runtime.jsx)("svg", {
				width: 11,
				height: 11,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				style: { transform: open ? "rotate(90deg)" : "none", transition: "transform .12s ease", color: "var(--dsw-alias-label-tertiary)" },
				children: (0, react_jsx_runtime.jsx)("path", { d: "M6 3.5 10.5 8 6 12.5", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" })
			});
		}
		/** 每页渲染上限，避免一次塞几百张卡片。 */
		const PAGE = 24;
		//#endregion

		//#region 组件
		/** 一张插件卡片：模块名 + 行 id + 状态，展开看完整信息。 */
		function UserPluginCard({ row, open, onToggle, t }) {
			const failed = row.phase === "failed";
			const stateText = failed
				? t("failedTag")
				: row.enabled === false
					? t("disabledTag")
					: row.phase === "active"
						? t("runningTag")
						: row.phase === null
							? t("notRunningTag")
							: t("loadingTag");
			const stateKind = failed ? "bad" : row.enabled === false ? "off" : "ok";
			return (0, react_jsx_runtime.jsxs)("li", {
				className: "dupl-card",
				children: [
					(0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dupl-cardMain",
						"aria-expanded": open,
						onClick: () => onToggle(row.entryId),
						children: [
							(0, react_jsx_runtime.jsxs)("span", {
								className: "dupl-cardTop",
								children: [
									(0, react_jsx_runtime.jsxs)("span", {
										style: { display: "flex", alignItems: "center", gap: 6, minWidth: 0 },
										children: [(0, react_jsx_runtime.jsx)(IconChevron, { open }), (0, react_jsx_runtime.jsx)("span", { className: "dupl-cardName", title: row.moduleName, children: shortName(row.moduleName) })]
									}),
									(0, react_jsx_runtime.jsx)("span", { className: "dupl-tag", "data-state": stateKind, children: stateText })
								]
							}),
							row.description ? (0, react_jsx_runtime.jsx)("span", { className: "dupl-cardDesc", title: row.description, children: row.description }) : null,
							(0, react_jsx_runtime.jsx)("code", { className: "dupl-cardId", title: row.entryId, children: bareId(row.entryId) })
						]
					}),
					open ? (0, react_jsx_runtime.jsxs)("dl", {
						className: "dupl-facts",
						children: [
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("moduleLabel") }), (0, react_jsx_runtime.jsx)("dd", { children: row.moduleName })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("entryLabel") }), (0, react_jsx_runtime.jsx)("dd", { children: row.entryId })] }),
							(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("stateLabel") }), (0, react_jsx_runtime.jsx)("dd", { children: stateText })] })
						]
					}) : null
				]
			});
		}

		/** 整个标签页。 */
		function UserPluginsTab({ list, t }) {
			const [state, setState] = (0, react.useState)({ status: "loading" });
			const [attempt, setAttempt] = (0, react.useState)(0);
			const [query, setQuery] = (0, react.useState)("");
			const [open, setOpen] = (0, react.useState)(null);
			const [limit, setLimit] = (0, react.useState)(PAGE);

			(0, react.useEffect)(() => {
				let current = true;
				setState({ status: "loading" });
				Promise.resolve().then(() => list()).then((value) => {
					if (current) setState({ status: "ready", value });
				}, () => {
					if (current) setState({ status: "error" });
				});
				return () => {
					current = false;
				};
			}, [list, attempt]);

			const normalized = query.trim().toLocaleLowerCase();
			const rows = state.status === "ready" ? state.value.rows ?? [] : [];
			const matched = normalized.length === 0
				? rows
				: rows.filter((row) => row.moduleName.toLocaleLowerCase().includes(normalized) || row.entryId.toLocaleLowerCase().includes(normalized));
			const shown = matched.slice(0, limit);

			return (0, react_jsx_runtime.jsxs)("div", {
				className: "dupl-section",
				"aria-busy": state.status === "loading",
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "dupl-row",
						children: [
							(0, react_jsx_runtime.jsx)("h3", { className: "dupl-title", children: t("title") }),
							state.status === "ready" ? (0, react_jsx_runtime.jsxs)("span", { className: "dupl-count", children: [String(matched.length), " ", t("unit")] }) : null
						]
					}),
					(0, react_jsx_runtime.jsx)("p", { className: "dupl-sub", children: t("subtitle") }),

					state.status === "loading" ? (0, react_jsx_runtime.jsx)("p", { className: "dupl-empty", children: t("loading") }) : null,
					state.status === "error" ? (0, react_jsx_runtime.jsxs)("div", {
						className: "dupl-fail",
						children: [
							(0, react_jsx_runtime.jsx)("p", { role: "alert", children: t("error") }),
							(0, react_jsx_runtime.jsx)("button", { type: "button", onClick: () => setAttempt((value) => value + 1), children: t("retry") })
						]
					}) : null,

					state.status === "ready" ? (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, {
						children: [
							(0, react_jsx_runtime.jsxs)("label", {
								className: "dupl-search",
								children: [
									(0, react_jsx_runtime.jsx)(IconSearch, {}),
									(0, react_jsx_runtime.jsx)("input", {
										type: "search",
										value: query,
										placeholder: t("search"),
										"aria-label": t("search"),
										onChange: (event) => {
											setQuery(event.currentTarget.value);
											setLimit(PAGE);
										}
									})
								]
							}),
							rows.length === 0 ? (0, react_jsx_runtime.jsxs)("p", {
								className: "dupl-empty",
								children: [t("empty"), (0, react_jsx_runtime.jsx)("br", {}), (0, react_jsx_runtime.jsx)("code", { children: "dsh plugin --profile web add <包名>" })]
							}) : null,
							rows.length > 0 && matched.length === 0 ? (0, react_jsx_runtime.jsx)("p", { className: "dupl-empty", children: t("emptySearch") }) : null,
							shown.length > 0 ? (0, react_jsx_runtime.jsx)("ul", {
								className: "dupl-list",
								children: shown.map((row) => (0, react_jsx_runtime.jsx)(UserPluginCard, {
									row,
									open: open === row.entryId,
									onToggle: (entryId) => setOpen((current) => current === entryId ? null : entryId),
									t
								}, row.entryId))
							}) : null,
							matched.length > shown.length ? (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "dupl-more",
								onClick: () => setLimit((value) => value + PAGE),
								children: [t("more"), " (", String(matched.length - shown.length), ")"]
							}) : null
						]
					}) : null
				]
			});
		}
		//#endregion

		//#region 文案
		const zh = {
			tab: "用户插件",
			title: "用户插件",
			subtitle: "你自己装进当前 Profile 的插件（profile 依赖 + 你写的 cordis.patch.yml 行）。官方的会话插件与全局插件请看「插件列表」。",
			search: "搜索用户插件",
			loading: "正在读取用户插件…",
			error: "暂时无法读取用户插件。",
			retry: "重试",
			empty: "还没有用户插件。用下面这条命令装的插件会出现在这里：",
			emptySearch: "没有匹配的用户插件。",
			more: "显示更多",
			unit: "个",
			moduleLabel: "完整名称",
			entryLabel: "Loader 行 id",
			stateLabel: "配置状态",
			runningTag: "已启用",
			disabledTag: "已停用",
			loadingTag: "加载中",
			notRunningTag: "未运行",
			failedTag: "启动失败"
		};
		const en = {
			tab: "User plugins",
			title: "User plugins",
			subtitle: "Plugins you installed into this profile (profile dependencies plus the rows in your own cordis.patch.yml). Shipped session and global plugins live in Plugin list.",
			search: "Search user plugins",
			loading: "Reading user plugins…",
			error: "User plugins are temporarily unavailable.",
			retry: "Retry",
			empty: "No user plugins yet. Plugins installed with the command below appear here:",
			emptySearch: "No matching user plugins.",
			more: "Show more",
			unit: "plugins",
			moduleLabel: "Module",
			entryLabel: "Loader entry id",
			stateLabel: "Configuration",
			runningTag: "Enabled",
			disabledTag: "Disabled",
			loadingTag: "Loading",
			notRunningTag: "Not running",
			failedTag: "Failed"
		};
		//#endregion

		const NS = "settings.userPlugins";
		const inject = ["slots", "locale"];

		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "user-plugins-list: dictionaries");
			const t = ctx.locale.bind(NS);
			const list = async () => {
				const response = await fetch("/api/user-plugins.json", {
					credentials: "same-origin",
					headers: { accept: "application/json" }
				});
				if (!response.ok) throw new Error(`user-plugins.json returned HTTP ${String(response.status)}`);
				return await response.json();
			};
			const injected = () => ({ list });
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "user-plugins",
				order: 20,
				label: () => t("tab"),
				locale: NS,
				inject: injected
			}, UserPluginsTab));
		}

		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
