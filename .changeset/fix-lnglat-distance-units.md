---
'@antv/l7-utils': patch
---

fix(utils): respect the units parameter in lnglatDistance

`lnglatDistance` 接收 `units` 参数但内部用 `(units = 'meters')` 覆盖了它，导致
调用方传入的单位被忽略，函数始终返回米。现将 `units` 改为默认值 `'meters'` 并
直接透传给 `radiansToLength`，使 `kilometers` 等单位正常生效。
