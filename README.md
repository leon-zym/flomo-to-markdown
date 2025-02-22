# Flomo to Markdown 转换工具

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC) [![AI: Code Assist](https://img.shields.io/badge/AI-Code%20Assist-EB9FDA)](https://github.com/features/copilot)

一个简单的 Node.js 工具，用于将 [Flomo](https://flomoapp.com/) 导出的 HTML 笔记文件转换为 [Markdown](https://wikipedia.org/wiki/Markdown) 文件。这个工具可以帮助你将笔记从 Flomo 迁移到任何支持 Markdown 的笔记系统中。

## 特性

- 将 Flomo HTML 导出文件转换为独立的 Markdown 文件
- 保留原始创建时间戳
- 保持图片及其目录结构
- 支持有序列表和无序列表
- 自动移除空段落
- 按日期组织文件，同一天的多篇笔记自动编号
- 其他待完善特性……

## 环境要求

- [Node.js](https://nodejs.org/) (v12 或更高版本)
- [pnpm](https://pnpm.io/) (或 npm/yarn)

## 安装

1. 克隆此仓库：
```bash
git clone https://github.com/leon-zym/flomo-to-markdown.git
cd flomo-to-markdown
```

2. 安装依赖：
```bash
pnpm install
```

## 使用方法

1. [从 Flomo 导出数据](https://help.flomoapp.com/basic/storage.html#%E5%A6%82%E4%BD%95%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE)，得到一个 .zip 压缩包
2. 解压后，将其中的所有文件复制到项目目录下
3. 在终端中运行转换脚本：
```bash
node convert.js
```
4. 如果成功，则会生成 `output` 目录，将其复制到任何支持 Markdown 的笔记系统中即可

脚本将会：
- 自动检测并使用目录下的第一个 HTML 文件，该文件包含了所有的笔记文字内容
- 创建 `output` 目录
- 生成格式为 `memo-YYYY-MM-DD[-n].md` 的 Markdown 文件
- 将笔记中引用的所有图片复制到对应目录中

## 输出格式

每个 Markdown 文件的结构如下：
```markdown
# memo-YYYY-MM-DD

[笔记内容]

Created: YYYY-MM-DD HH:mm:ss

[图片（如果有）]
```

如果同一天有多篇笔记，将会按顺序编号：
- `memo-2024-01-27.md`（当天只有一篇笔记时）
- `memo-2024-01-27-1.md`, `memo-2024-01-27-2.md` 等（当天有多篇笔记时）

## 贡献

欢迎提出 issues 或提交 pull requests 来改进这个工具。

## 开源协议

本项目使用 ISC 协议。
