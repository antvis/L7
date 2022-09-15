| 名称      | 说明                                                                                             | 类型                                              |
| --------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| position  | 控件被添加到地图中的插槽位置以及排列方式，详情可见 [控件插槽](/zh/docs/api/control/control#插槽) | [Position](#position) |
| className | 自定义样式名                                                                                     | `string`                                          |
| style     | 自定义样式                                                                                       | `string`                                          |

## Position

```ts
export type Position =
  | 'topright'
  | 'topleft'
  | 'bottomright'
  | 'bottomleft'
  | 'topcenter'
  | 'bottomcenter'
  | 'leftcenter'
  | 'rightcenter'
  | 'lefttop'
  | 'righttop'
  | 'leftbottom'
  | 'rightbottom';
```
