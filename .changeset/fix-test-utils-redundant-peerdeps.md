---
'@antv/l7-test-utils': patch
---

fix(test-utils): 移除冗余 peerDependencies，修复 changeset 版本计算误判 major

@antv/l7-test-utils 同时在 dependencies 与 peerDependencies 声明了
@antv/l7-map / @antv/l7-maps / @antv/l7-scene (workspace:^)。
peerDependencies 对内部兄弟包是语义错误 (test-utils 是开发工具,
不应让消费者"提供"这些包), 且触发 changesets 的 peer-dependent
major bump:

- changesets 默认 onlyUpdatePeerDependentsWhenOutOfRange=false,
  任一 peer (l7-maps/l7-scene) 获 non-patch (minor) release 时,
  强制将 test-utils 提升为 major
- fixed group ["@antv/l7","@antv/l7-*"] 随之把全组 (含 l7-source)
  拉到 major → 2.30.0-beta.0 被错误算成 3.0.0-beta.0

这阻塞了 source 重构 beta 发布 (5 minor + 14 patch changeset 却
算出 major)。

修法: 删除 peerDependencies (三包已在 dependencies, 行为等价且
更正确)。已用 @changesets/get-release-plan 验证: 移除后全组正确
算为 minor → 2.30.0-beta.0, 0 major。

无运行时行为变更 (依赖关系不变, 仅声明位置纠正)。
