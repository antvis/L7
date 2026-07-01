---
'@antv/l7-utils': patch
---

fix: 修复原型污染漏洞

在 merge 和 mergeWith 函数中添加对 **proto**、constructor 和 prototype 键的过滤，防止攻击者通过 JSON.parse 构造的恶意对象污染 Object.prototype。

安全报告由 Dremig 提供。
