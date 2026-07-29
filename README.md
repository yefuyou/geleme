<div align="center">

![割了么 Hero Banner](assets/readme/hero.svg)

# 📉 割了么 · GeLeMe

**专注解决拿不住问题 · 中文投资社区自嘲单页互动 H5**

[![Live Demo GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-22c55e?style=for-the-badge&logo=github&logoColor=white)](https://yefuyou.github.io/geleme/)
[![Live Demo Vercel](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://geleme.vercel.app)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.style=for-the-badge)](LICENSE)

*“股票拿不住？去打工、进厂拧螺丝、耕地拿锄头！锄头和螺丝总拿得住吧？”*

[👉 立即在线游玩 (GitHub Pages)](https://yefuyou.github.io/geleme/) · [🚀 Vercel 镜像](https://geleme.vercel.app)

---

</div>

## 💡 为什么有「割了么」？

连跌三天手发抖？重仓股票正在挑战你的大脑神经承受极限...  
**「割了么」** 是一款专为中文投资社区打造的自嘲互动 Web 应用。网页不是正式金融产品，不提供任何投资建议，而是将社交媒体上广为流传的“拿不住去打工”梗重构为一个适合发到群聊里发泄与娱乐的荒诞小游戏。

---

## 🔄 核心互动闭环

![割了么 流程图](assets/readme/features.svg)

### 🎮 玩法特色

- 📉 **持仓跳水震动**：虚构收益从 `-2.71%` 坠落至 `-8.43%`，伴随屏幕发抖，体验本金蒸发至 47,250 元的“手正在钻石化”过程，生成官方【钻石手认证】。
- ✂️ **1. 立即割肉 (流动性天使)**：二次确认“确定卖在最低点吗？”，卖出瞬间股票**秒拉 +19.98% 涨停**，获得“您已成功为市场提供流动性”锦旗。
- 🌾 **2. 拿锄头 (3秒握持挑战)**：3 秒长按耕地小游戏。提前松手提示“锄头也没拿住，建议进厂拧螺丝”；坚持 3 秒领取【两筐新鲜土豆】。
- 🔧 **3. 进厂拧螺丝 (10秒30次手速Run)**：传送带视觉 + 10 秒内连续狂点 30 次螺丝。结算日薪 86 元、亏损 8600 元与 **100 天回本工期**。
- 🛵 **4. 送外卖 (同城竞速模拟)**：28 分钟 6 单同城配送，随机触发“出餐慢、爬28楼、电梯故障、到了别打电话、预计超时7分钟”真实突发事件。
- 🚨 **谎言检测强制梭哈 (All-In 循环)**：到账 3,842 元劳动所得，询问“是否全部买入？”，选择“我已经成熟了”时触发**“系统检测到您正在撒谎”**，强制执行 All-In 梭哈并遭遇天地板跌停！
- 📜 **割了么职业评估报告**：自动计算“股票承受能力、锄头握持能力、螺丝完成率、外卖准时率”，生成专属称号（如 *钻石手受害者*、*最低点狙击手*、*流动性提供者*），支持 **`html2canvas` 一键保存报告截图**。

---

## 🛠️ 技术栈与设计亮点

- **前端框架**：React 19 + TypeScript + Vite
- **UI & 样式**：Tailwind CSS v4 + Lucide React 极简高质感图标库
- **视觉美学**：采用真实金融 App 黑色/深灰底色，配合中国股市习惯（红色涨 +/绿色跌 -），包含触觉按压反馈、快速滚动数字与跳水闪烁动画。
- **设备适配**：桌面端呈现带 status bar 的手机 Shell 容器，移动端自动缩放适配手机竖屏。
- **截图保存**：集成 `html2canvas` 导出高清 PNG 评估报告。

---

## 💻 本地运行指南

```bash
# 1. 克隆本仓库
git clone https://github.com/yefuyou/geleme.git

# 2. 进入项目目录
cd geleme

# 3. 安装依赖
npm install

# 4. 启动本地开发服务器
npm run dev

# 5. 打开浏览器访问 http://localhost:5173
```

---

## 📦 打包与免费发布

```bash
# 执行生产环境构建
npm run build

# 一键发布至 GitHub Pages
npx gh-pages -d dist
```

---

## ⚖️ 免责声明

> **纯属娱乐，不构成投资建议。**  
> 本项目所有数据、收益率、股价、结算薪资均为前端虚构娱乐数据，不涉及任何真实股票、真实平台或真实金融交易。
