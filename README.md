# 比特皇交易笔记

一个纯静态的 GitHub Pages 阅读站，把五份公开资料整理成四条主轴：核心交易思想、系统拆解、交易纪律、风控规则，并补充 11 条带来源与动作读法的经典语料、实盘阶段复盘。

## 本地预览

```powershell
cd bithuang-reading
python -m http.server 4173
```

然后打开 <http://localhost:4173>。

## GitHub Pages

最省事的发布方式是：

1. 在 GitHub 新建一个空仓库（例如 `bithuang-reading`）。
2. 把本目录中的 `index.html`、`styles.css`、`app.js` 和 `assets/` 上传到仓库根目录。
3. 打开仓库 `Settings → Pages`，选择 `Deploy from a branch`、`main`、`/ (root)`，保存后等待部署。

这是无构建步骤的静态页面，`index.html` 可直接部署。如果保留在已有仓库的 `bithuang-reading/` 子目录，建议使用 GitHub Actions 或把该目录内容移动到 Pages 根目录。

当前公开地址：<https://steven-air.github.io/bithuang-reading/>

金水 / 五行周期研究已拆分到独立站点：<https://steven-air.github.io/bithuang-jinshui/>

也可以在本目录直接初始化并推送：

```powershell
cd bithuang-reading
git init
git add .
git commit -m "初始化比特皇交易笔记"
git branch -M main
git remote add origin https://github.com/<用户名>/<仓库名>.git
git push -u origin main
```

## 内容边界

- `比特皇实盘分析.pdf`、`比特皇采访录.pdf`、`比特皇语录2.pdf` 提供了页面中主要的可提取文字来源。
- `比特皇.pdf` 与 `比特皇语录1.pdf` 以扫描页为主，本页仅保留索引说明，未把不可验证的内容写成结论。
- 实盘数字、杠杆案例和收益阶段均按资料中的公开整理呈现；页面把“引用、总结、推断”分开标注，不把历史结果当作可复制承诺。
