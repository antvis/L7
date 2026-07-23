# @antv/l7-test-utils

## 2.30.0-beta.0

### Patch Changes

- fix(test-utils): 移除冗余 peerDependencies，修复 changeset 版本计算误判 major

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

- Updated dependencies [[`9a455f4`](https://github.com/antvis/L7/commit/9a455f42ec057482646a49fde2f5ecd16dd9713a)]:
  - @antv/l7-maps@2.30.0-beta.0
  - @antv/l7-scene@2.30.0-beta.0
  - @antv/l7-map@2.30.0-beta.0

## 2.29.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-map@2.29.1
  - @antv/l7-maps@2.29.1
  - @antv/l7-scene@2.29.1

## 2.28.14

### Patch Changes

- Release 2.28.14.

- Updated dependencies []:
  - @antv/l7-map@2.28.14
  - @antv/l7-maps@2.28.14
  - @antv/l7-scene@2.28.14

## 2.28.13

### Patch Changes

- Release 2.28.13.

- Updated dependencies []:
  - @antv/l7-map@2.28.13
  - @antv/l7-maps@2.28.13
  - @antv/l7-scene@2.28.13

## 2.28.12

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.28.12
  - @antv/l7-scene@2.28.12
  - @antv/l7-map@2.28.12

## 2.25.9

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.25.9
  - @antv/l7-scene@2.25.9
  - @antv/l7-map@2.25.9

## 2.25.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.25.4
  - @antv/l7-map@2.25.4
  - @antv/l7-maps@2.25.4

## 2.23.3-beta.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.23.3-beta.3
  - @antv/l7-scene@2.23.3-beta.3
  - @antv/l7-map@2.23.3-beta.3

## 2.23.3-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-maps@2.23.3-beta.2
  - @antv/l7-scene@2.23.3-beta.2
  - @antv/l7-map@2.23.3-beta.2

## 2.23.3-beta.1

### Patch Changes

- 版本更新

- Updated dependencies []:
  - @antv/l7-scene@2.23.3-beta.1
  - @antv/l7-maps@2.23.3-beta.1
  - @antv/l7-map@2.23.3-beta.1

## 2.23.3-beta.0

### Patch Changes

- Updated dependencies [[`8248e26`](https://github.com/antvis/L7/commit/8248e264c6cad611547c7f9730540ab0729115ac)]:
  - @antv/l7-scene@2.23.3-beta.0
  - @antv/l7-maps@2.23.3-beta.0
  - @antv/l7-map@2.23.3-beta.0

## 2.23.2

### Patch Changes

- [`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d) Thanks [@lzxue](https://github.com/lzxue)! - rename source

- Updated dependencies [[`a3e9a44`](https://github.com/antvis/L7/commit/a3e9a440e43030a297ee8dd32aabb32c10624e7d)]:
  - @antv/l7-map@2.23.2
  - @antv/l7-maps@2.23.2
  - @antv/l7-scene@2.23.2

## 2.23.1

### Patch Changes

- [`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2) Thanks [@lzxue](https://github.com/lzxue)! - 更新demo

- [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d) Thanks [@lzxue](https://github.com/lzxue)! - 移动端事件

- Updated dependencies [[`7932838`](https://github.com/antvis/L7/commit/79328384d8b1deb547ff2422aaa4366201dfe9b2), [`4f690b8`](https://github.com/antvis/L7/commit/4f690b837a322bc9923baf2b387ea43d37ba1e5d)]:
  - @antv/l7-scene@2.23.1
  - @antv/l7-maps@2.23.1
  - @antv/l7-map@2.23.1

## 2.22.6

### Patch Changes

- Updated dependencies [[`c357dc8`](https://github.com/antvis/L7/commit/c357dc8520e1d3f53af60e4a325096da2d4e223c)]:
  - @antv/l7-maps@2.22.6
  - @antv/l7-map@2.22.6
  - @antv/l7-scene@2.22.6

## 2.22.5

### Patch Changes

- [#2680](https://github.com/antvis/L7/pull/2680) [`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e) Thanks [@XinyueDu](https://github.com/XinyueDu)! - update version

- Updated dependencies [[`42134f3`](https://github.com/antvis/L7/commit/42134f3aac3f2814e167bedca3c84b98766ebd6e)]:
  - @antv/l7-map@2.22.5
  - @antv/l7-maps@2.22.5
  - @antv/l7-scene@2.22.5

## 2.22.4

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-map@2.22.4
  - @antv/l7-maps@2.22.4
  - @antv/l7-scene@2.22.4

## 2.22.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.22.3
  - @antv/l7-map@2.22.3
  - @antv/l7-maps@2.22.3

## 2.22.2

### Patch Changes

- [#2631](https://github.com/antvis/L7/pull/2631) [`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4) Thanks [@lzxue](https://github.com/lzxue)! - raster tile extent

- Updated dependencies [[`8a9413f`](https://github.com/antvis/L7/commit/8a9413fa842397d7eb2beae18e896ffddc9abdf4)]:
  - @antv/l7-map@2.22.2
  - @antv/l7-maps@2.22.2
  - @antv/l7-scene@2.22.2

## 2.22.1

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.22.1
  - @antv/l7-map@2.22.1
  - @antv/l7-maps@2.22.1

## 2.22.0

### Patch Changes

- Updated dependencies [[`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8), [`ce90571`](https://github.com/antvis/L7/commit/ce90571ba77686790b2476936b9466657e187ae8)]:
  - @antv/l7-maps@2.22.0
  - @antv/l7-map@2.22.0
  - @antv/l7-scene@2.22.0

## 2.21.11-beta.7

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.11-beta.7
  - @antv/l7-map@2.21.11-beta.7
  - @antv/l7-maps@2.21.11-beta.7

## 2.21.11-beta.6

### Patch Changes

- Updated dependencies [[`7e38a83`](https://github.com/antvis/L7/commit/7e38a83d9324fb9443f5a04e6d2fc9a1fef9c17c)]:
  - @antv/l7-map@2.21.11-beta.6
  - @antv/l7-scene@2.21.11-beta.6
  - @antv/l7-maps@2.21.11-beta.6

## 2.21.11-beta.5

### Patch Changes

- Updated dependencies [[`8939e9b`](https://github.com/antvis/L7/commit/8939e9bc0e744d75b5b469c221d6695c7a313e83)]:
  - @antv/l7-maps@2.21.11-beta.5
  - @antv/l7-scene@2.21.11-beta.5
  - @antv/l7-map@2.21.11-beta.5

## 2.21.11-beta.4

### Patch Changes

- Updated dependencies [[`cca16a3`](https://github.com/antvis/L7/commit/cca16a3d72de462afa9d71c386c82f92952d1c47)]:
  - @antv/l7-maps@2.21.11-beta.4
  - @antv/l7-scene@2.21.11-beta.4
  - @antv/l7-map@2.21.11-beta.4

## 2.21.11-beta.3

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.11-beta.3
  - @antv/l7-maps@2.21.11-beta.3
  - @antv/l7-map@2.21.11-beta.3

## 2.21.11-beta.2

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.11-beta.2
  - @antv/l7-map@2.21.11-beta.2
  - @antv/l7-maps@2.21.11-beta.2

## 2.21.11-beta.1

### Patch Changes

- Updated dependencies [[`05dd5cc`](https://github.com/antvis/L7/commit/05dd5ccf31e12a9440efbebc9fcb803c594b5a44)]:
  - @antv/l7-scene@2.21.11-beta.1
  - @antv/l7-map@2.21.11-beta.1
  - @antv/l7-maps@2.21.11-beta.1

## 2.21.11-beta.0

### Patch Changes

- Updated dependencies [[`05dd5cc`](https://github.com/antvis/L7/commit/05dd5ccf31e12a9440efbebc9fcb803c594b5a44)]:
  - @antv/l7-scene@2.21.11-beta.0
  - @antv/l7-map@2.21.11-beta.0
  - @antv/l7-maps@2.21.11-beta.0

## 2.21.10

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.10
  - @antv/l7-map@2.21.10
  - @antv/l7-maps@2.21.10

## 2.21.9

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.9
  - @antv/l7-map@2.21.9
  - @antv/l7-maps@2.21.9

## 2.21.8

### Patch Changes

- Updated dependencies [[`a57bb39`](https://github.com/antvis/L7/commit/a57bb3997a20b041974baeabd64f2869f0e6559d)]:
  - @antv/l7-map@2.21.8
  - @antv/l7-maps@2.21.8
  - @antv/l7-scene@2.21.8

## 2.21.7

### Patch Changes

- [#2420](https://github.com/antvis/L7/pull/2420) [`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a) Thanks [@lzxue](https://github.com/lzxue)! - fix regl bool uniform

- Updated dependencies [[`bb0af05`](https://github.com/antvis/L7/commit/bb0af057acafeeafd7eb52224ff2863c4a1c302a)]:
  - @antv/l7-map@2.21.7
  - @antv/l7-maps@2.21.7
  - @antv/l7-scene@2.21.7

## 2.21.6

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.6
  - @antv/l7-map@2.21.6
  - @antv/l7-maps@2.21.6

## 2.21.5

### Patch Changes

- Updated dependencies [[`a73f0b6`](https://github.com/antvis/L7/commit/a73f0b6ef8aee79cce346a183e9323dee41176c7)]:
  - @antv/l7-maps@2.21.5
  - @antv/l7-scene@2.21.5
  - @antv/l7-map@2.21.5

## 2.21.4

### Patch Changes

- Updated dependencies []:
  - @antv/l7-scene@2.21.4
  - @antv/l7-map@2.21.4
  - @antv/l7-maps@2.21.4
