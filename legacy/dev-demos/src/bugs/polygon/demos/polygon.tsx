import { Scene, PolygonLayer, LineLayer, PointLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import React, { useEffect } from 'react';
const list = {
  portrKey: "PROVINCE_CITY_DITU",
  portrName: "预测常住城市",
  portrDesc: "预测用户省市分布，排除未知",
  coverage: 0.8288461538461539,
  reportDate: "20221127",
  dataList: [
    {
      portrValue: "浙江",
      num: 830,
      percentage: 0.27510772290354657,
      extInfo: {
        areaCode: "330000"
      },
      subList: [
        {
          portrValue: "杭州",
          num: 553,
          percentage: 0.18329466357308585,
          extInfo: {
            areaCode: "330100"
          }
        },
        {
          portrValue: "宁波",
          num: 56,
          percentage: 0.018561484918793503,
          extInfo: {
            areaCode: "330200"
          }
        },
        {
          portrValue: "温州",
          num: 50,
          percentage: 0.016572754391779913,
          extInfo: {
            areaCode: "330300"
          }
        },
        {
          portrValue: "绍兴",
          num: 39,
          percentage: 0.012926748425588332,
          extInfo: {
            areaCode: "330600"
          }
        },
        {
          portrValue: "金华",
          num: 29,
          percentage: 0.00961219754723235,
          extInfo: {
            areaCode: "330700"
          }
        },
        {
          portrValue: "嘉兴",
          num: 28,
          percentage: 0.009280742459396751,
          extInfo: {
            areaCode: "330400"
          }
        },
        {
          portrValue: "湖州",
          num: 28,
          percentage: 0.009280742459396751,
          extInfo: {
            areaCode: "330500"
          }
        },
        {
          portrValue: "台州",
          num: 23,
          percentage: 0.007623467020218761,
          extInfo: {
            areaCode: "331000"
          }
        },
        {
          portrValue: "衢州",
          num: 10,
          percentage: 0.003314550878355983,
          extInfo: {
            areaCode: "330800"
          }
        },
        {
          portrValue: "丽水",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "331100"
          }
        },
        {
          portrValue: "舟山",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "330900"
          }
        }
      ]
    },
    {
      portrValue: "广东",
      num: 338,
      percentage: 0.11203181968843222,
      extInfo: {
        areaCode: "440000"
      },
      subList: [
        {
          portrValue: "深圳",
          num: 97,
          percentage: 0.032151143520053035,
          extInfo: {
            areaCode: "440300"
          }
        },
        {
          portrValue: "广州",
          num: 67,
          percentage: 0.022207490884985085,
          extInfo: {
            areaCode: "440100"
          }
        },
        {
          portrValue: "东莞",
          num: 42,
          percentage: 0.013921113689095127,
          extInfo: {
            areaCode: "441900"
          }
        },
        {
          portrValue: "佛山",
          num: 27,
          percentage: 0.008949287371561154,
          extInfo: {
            areaCode: "440600"
          }
        },
        {
          portrValue: "惠州",
          num: 18,
          percentage: 0.005966191581040769,
          extInfo: {
            areaCode: "441300"
          }
        },
        {
          portrValue: "汕头",
          num: 16,
          percentage: 0.005303281405369572,
          extInfo: {
            areaCode: "440500"
          }
        },
        {
          portrValue: "揭阳",
          num: 11,
          percentage: 0.003646005966191581,
          extInfo: {
            areaCode: "445200"
          }
        },
        {
          portrValue: "中山",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "442000"
          }
        },
        {
          portrValue: "珠海",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "440400"
          }
        },
        {
          portrValue: "江门",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "440700"
          }
        },
        {
          portrValue: "茂名",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "440900"
          }
        },
        {
          portrValue: "河源",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "441600"
          }
        },
        {
          portrValue: "梅州",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "441400"
          }
        },
        {
          portrValue: "湛江",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "440800"
          }
        },
        {
          portrValue: "清远",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "441800"
          }
        },
        {
          portrValue: "韶关",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "440200"
          }
        },
        {
          portrValue: "汕尾",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "441500"
          }
        },
        {
          portrValue: "云浮",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "445300"
          }
        },
        {
          portrValue: "潮州",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "445100"
          }
        },
        {
          portrValue: "肇庆",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "441200"
          }
        },
        {
          portrValue: "阳江",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "441700"
          }
        }
      ]
    },
    {
      portrValue: "江苏",
      num: 202,
      percentage: 0.06695392774279085,
      extInfo: {
        areaCode: "320000"
      },
      subList: [
        {
          portrValue: "苏州",
          num: 52,
          percentage: 0.01723566456745111,
          extInfo: {
            areaCode: "320500"
          }
        },
        {
          portrValue: "南京",
          num: 39,
          percentage: 0.012926748425588332,
          extInfo: {
            areaCode: "320100"
          }
        },
        {
          portrValue: "无锡",
          num: 29,
          percentage: 0.00961219754723235,
          extInfo: {
            areaCode: "320200"
          }
        },
        {
          portrValue: "南通",
          num: 16,
          percentage: 0.005303281405369572,
          extInfo: {
            areaCode: "320600"
          }
        },
        {
          portrValue: "常州",
          num: 15,
          percentage: 0.004971826317533974,
          extInfo: {
            areaCode: "320400"
          }
        },
        {
          portrValue: "徐州",
          num: 14,
          percentage: 0.004640371229698376,
          extInfo: {
            areaCode: "320300"
          }
        },
        {
          portrValue: "盐城",
          num: 10,
          percentage: 0.003314550878355983,
          extInfo: {
            areaCode: "320900"
          }
        },
        {
          portrValue: "镇江",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "321100"
          }
        },
        {
          portrValue: "宿迁",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "321300"
          }
        },
        {
          portrValue: "淮安",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "320800"
          }
        },
        {
          portrValue: "扬州",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "321000"
          }
        },
        {
          portrValue: "连云港",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "320700"
          }
        },
        {
          portrValue: "泰州",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "321200"
          }
        }
      ]
    },
    {
      portrValue: "河南",
      num: 190,
      percentage: 0.06297646668876367,
      extInfo: {
        areaCode: "410000"
      },
      subList: [
        {
          portrValue: "郑州",
          num: 61,
          percentage: 0.020218760357971495,
          extInfo: {
            areaCode: "410100"
          }
        },
        {
          portrValue: "南阳",
          num: 23,
          percentage: 0.007623467020218761,
          extInfo: {
            areaCode: "411300"
          }
        },
        {
          portrValue: "焦作",
          num: 11,
          percentage: 0.003646005966191581,
          extInfo: {
            areaCode: "410800"
          }
        },
        {
          portrValue: "许昌",
          num: 11,
          percentage: 0.003646005966191581,
          extInfo: {
            areaCode: "411000"
          }
        },
        {
          portrValue: "周口",
          num: 11,
          percentage: 0.003646005966191581,
          extInfo: {
            areaCode: "411600"
          }
        },
        {
          portrValue: "洛阳",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "410300"
          }
        },
        {
          portrValue: "驻马店",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "411700"
          }
        },
        {
          portrValue: "平顶山",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "410400"
          }
        },
        {
          portrValue: "新乡",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "410700"
          }
        },
        {
          portrValue: "濮阳",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "410900"
          }
        },
        {
          portrValue: "信阳",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "411500"
          }
        },
        {
          portrValue: "开封",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "410200"
          }
        },
        {
          portrValue: "商丘",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "411400"
          }
        },
        {
          portrValue: "安阳",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "410500"
          }
        },
        {
          portrValue: "三门峡",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "411200"
          }
        },
        {
          portrValue: "漯河",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "411100"
          }
        },
        {
          portrValue: "鹤壁",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "410600"
          }
        },
        {
          portrValue: "济源",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "419000"
          }
        }
      ]
    },
    {
      portrValue: "北京",
      num: 172,
      percentage: 0.057010275107722906,
      extInfo: {
        areaCode: "110000"
      },
      subList: [
        {
          portrValue: "北京",
          num: 172,
          percentage: 0.057010275107722906,
          extInfo: {
            areaCode: "110100"
          }
        }
      ]
    },
    {
      portrValue: "上海",
      num: 138,
      percentage: 0.04574080212131256,
      extInfo: {
        areaCode: "310000"
      },
      subList: [
        {
          portrValue: "上海",
          num: 138,
          percentage: 0.04574080212131256,
          extInfo: {
            areaCode: "310100"
          }
        }
      ]
    },
    {
      portrValue: "山东",
      num: 119,
      percentage: 0.03944315545243619,
      extInfo: {
        areaCode: "370000"
      },
      subList: [
        {
          portrValue: "济南",
          num: 23,
          percentage: 0.007623467020218761,
          extInfo: {
            areaCode: "370100"
          }
        },
        {
          portrValue: "青岛",
          num: 18,
          percentage: 0.005966191581040769,
          extInfo: {
            areaCode: "370200"
          }
        },
        {
          portrValue: "潍坊",
          num: 15,
          percentage: 0.004971826317533974,
          extInfo: {
            areaCode: "370700"
          }
        },
        {
          portrValue: "日照",
          num: 10,
          percentage: 0.003314550878355983,
          extInfo: {
            areaCode: "371100"
          }
        },
        {
          portrValue: "烟台",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "370600"
          }
        },
        {
          portrValue: "济宁",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "370800"
          }
        },
        {
          portrValue: "枣庄",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "370400"
          }
        },
        {
          portrValue: "德州",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "371400"
          }
        },
        {
          portrValue: "泰安",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "370900"
          }
        },
        {
          portrValue: "滨州",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "371600"
          }
        },
        {
          portrValue: "淄博",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "370300"
          }
        },
        {
          portrValue: "临沂",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "371300"
          }
        },
        {
          portrValue: "聊城",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "371500"
          }
        },
        {
          portrValue: "东营",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "370500"
          }
        },
        {
          portrValue: "菏泽",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "371700"
          }
        },
        {
          portrValue: "威海",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "371000"
          }
        }
      ]
    },
    {
      portrValue: "四川",
      num: 113,
      percentage: 0.03745442492542261,
      extInfo: {
        areaCode: "510000"
      },
      subList: [
        {
          portrValue: "成都",
          num: 81,
          percentage: 0.02684786211468346,
          extInfo: {
            areaCode: "510100"
          }
        },
        {
          portrValue: "绵阳",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "510700"
          }
        },
        {
          portrValue: "遂宁",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "510900"
          }
        },
        {
          portrValue: "南充",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "511300"
          }
        },
        {
          portrValue: "自贡",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "510300"
          }
        },
        {
          portrValue: "德阳",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "510600"
          }
        },
        {
          portrValue: "广元",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "510800"
          }
        },
        {
          portrValue: "内江",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "511000"
          }
        },
        {
          portrValue: "广安",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "511600"
          }
        },
        {
          portrValue: "攀枝花",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "510400"
          }
        },
        {
          portrValue: "宜宾",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "511500"
          }
        },
        {
          portrValue: "达州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "511700"
          }
        },
        {
          portrValue: "雅安",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "511800"
          }
        },
        {
          portrValue: "巴中",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "511900"
          }
        },
        {
          portrValue: "资阳",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "512000"
          }
        },
        {
          portrValue: "阿坝",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "513200"
          }
        },
        {
          portrValue: "凉山",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "513400"
          }
        }
      ]
    },
    {
      portrValue: "湖北",
      num: 98,
      percentage: 0.03248259860788863,
      extInfo: {
        areaCode: "420000"
      },
      subList: [
        {
          portrValue: "武汉",
          num: 49,
          percentage: 0.016241299303944315,
          extInfo: {
            areaCode: "420100"
          }
        },
        {
          portrValue: "襄阳",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "420600"
          }
        },
        {
          portrValue: "孝感",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "420900"
          }
        },
        {
          portrValue: "黄石",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "420200"
          }
        },
        {
          portrValue: "荆州",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "421000"
          }
        },
        {
          portrValue: "荆门",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "420800"
          }
        },
        {
          portrValue: "鄂州",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "420700"
          }
        },
        {
          portrValue: "咸宁",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "421200"
          }
        },
        {
          portrValue: "黄冈",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "421100"
          }
        },
        {
          portrValue: "天门",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "429006"
          }
        },
        {
          portrValue: "宜昌",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "420500"
          }
        },
        {
          portrValue: "随州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "421300"
          }
        },
        {
          portrValue: "恩施",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "422800"
          }
        }
      ]
    },
    {
      portrValue: "安徽",
      num: 93,
      percentage: 0.03082532316871064,
      extInfo: {
        areaCode: "340000"
      },
      subList: [
        {
          portrValue: "合肥",
          num: 31,
          percentage: 0.010275107722903546,
          extInfo: {
            areaCode: "340100"
          }
        },
        {
          portrValue: "阜阳",
          num: 10,
          percentage: 0.003314550878355983,
          extInfo: {
            areaCode: "341200"
          }
        },
        {
          portrValue: "芜湖",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "340200"
          }
        },
        {
          portrValue: "宿州",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "341300"
          }
        },
        {
          portrValue: "滁州",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "341100"
          }
        },
        {
          portrValue: "六安",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "341500"
          }
        },
        {
          portrValue: "淮南",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "340400"
          }
        },
        {
          portrValue: "淮北",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "340600"
          }
        },
        {
          portrValue: "蚌埠",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "340300"
          }
        },
        {
          portrValue: "铜陵",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "340700"
          }
        },
        {
          portrValue: "亳州",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "341600"
          }
        },
        {
          portrValue: "安庆",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "340800"
          }
        },
        {
          portrValue: "宣城",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "341800"
          }
        },
        {
          portrValue: "马鞍山",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "340500"
          }
        },
        {
          portrValue: "池州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "341700"
          }
        }
      ]
    },
    {
      portrValue: "福建",
      num: 83,
      percentage: 0.027510772290354656,
      extInfo: {
        areaCode: "350000"
      },
      subList: [
        {
          portrValue: "厦门",
          num: 18,
          percentage: 0.005966191581040769,
          extInfo: {
            areaCode: "350200"
          }
        },
        {
          portrValue: "泉州",
          num: 17,
          percentage: 0.005634736493205171,
          extInfo: {
            areaCode: "350500"
          }
        },
        {
          portrValue: "福州",
          num: 12,
          percentage: 0.003977461054027179,
          extInfo: {
            areaCode: "350100"
          }
        },
        {
          portrValue: "漳州",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "350600"
          }
        },
        {
          portrValue: "南平",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "350700"
          }
        },
        {
          portrValue: "宁德",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "350900"
          }
        },
        {
          portrValue: "莆田",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "350300"
          }
        },
        {
          portrValue: "三明",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "350400"
          }
        },
        {
          portrValue: "龙岩",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "350800"
          }
        }
      ]
    },
    {
      portrValue: "河北",
      num: 73,
      percentage: 0.024196221411998675,
      extInfo: {
        areaCode: "130000"
      },
      subList: [
        {
          portrValue: "石家庄",
          num: 14,
          percentage: 0.004640371229698376,
          extInfo: {
            areaCode: "130100"
          }
        },
        {
          portrValue: "邯郸",
          num: 12,
          percentage: 0.003977461054027179,
          extInfo: {
            areaCode: "130400"
          }
        },
        {
          portrValue: "唐山",
          num: 10,
          percentage: 0.003314550878355983,
          extInfo: {
            areaCode: "130200"
          }
        },
        {
          portrValue: "保定",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "130600"
          }
        },
        {
          portrValue: "廊坊",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "131000"
          }
        },
        {
          portrValue: "沧州",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "130900"
          }
        },
        {
          portrValue: "邢台",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "130500"
          }
        },
        {
          portrValue: "秦皇岛",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "130300"
          }
        },
        {
          portrValue: "张家口",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "130700"
          }
        },
        {
          portrValue: "承德",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "130800"
          }
        },
        {
          portrValue: "衡水",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "131100"
          }
        }
      ]
    },
    {
      portrValue: "山西",
      num: 68,
      percentage: 0.022538945972820683,
      extInfo: {
        areaCode: "140000"
      },
      subList: [
        {
          portrValue: "太原",
          num: 19,
          percentage: 0.006297646668876367,
          extInfo: {
            areaCode: "140100"
          }
        },
        {
          portrValue: "临汾",
          num: 14,
          percentage: 0.004640371229698376,
          extInfo: {
            areaCode: "141000"
          }
        },
        {
          portrValue: "运城",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "140800"
          }
        },
        {
          portrValue: "晋中",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "140700"
          }
        },
        {
          portrValue: "长治",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "140400"
          }
        },
        {
          portrValue: "朔州",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "140600"
          }
        },
        {
          portrValue: "大同",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "140200"
          }
        },
        {
          portrValue: "晋城",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "140500"
          }
        },
        {
          portrValue: "阳泉",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "140300"
          }
        },
        {
          portrValue: "吕梁",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "141100"
          }
        }
      ]
    },
    {
      portrValue: "湖南",
      num: 67,
      percentage: 0.022207490884985085,
      extInfo: {
        areaCode: "430000"
      },
      subList: [
        {
          portrValue: "长沙",
          num: 26,
          percentage: 0.008617832283725556,
          extInfo: {
            areaCode: "430100"
          }
        },
        {
          portrValue: "衡阳",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "430400"
          }
        },
        {
          portrValue: "郴州",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "431000"
          }
        },
        {
          portrValue: "邵阳",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "430500"
          }
        },
        {
          portrValue: "岳阳",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "430600"
          }
        },
        {
          portrValue: "株洲",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "430200"
          }
        },
        {
          portrValue: "常德",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "430700"
          }
        },
        {
          portrValue: "益阳",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "430900"
          }
        },
        {
          portrValue: "永州",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "431100"
          }
        },
        {
          portrValue: "湘潭",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "430300"
          }
        },
        {
          portrValue: "张家界",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "430800"
          }
        },
        {
          portrValue: "怀化",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "431200"
          }
        },
        {
          portrValue: "湘西",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "433100"
          }
        },
        {
          portrValue: "娄底",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "431300"
          }
        }
      ]
    },
    {
      portrValue: "陕西",
      num: 66,
      percentage: 0.021876035797149487,
      extInfo: {
        areaCode: "610000"
      },
      subList: [
        {
          portrValue: "西安",
          num: 32,
          percentage: 0.010606562810739144,
          extInfo: {
            areaCode: "610100"
          }
        },
        {
          portrValue: "榆林",
          num: 9,
          percentage: 0.0029830957905203847,
          extInfo: {
            areaCode: "610800"
          }
        },
        {
          portrValue: "咸阳",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "610400"
          }
        },
        {
          portrValue: "渭南",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "610500"
          }
        },
        {
          portrValue: "汉中",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "610700"
          }
        },
        {
          portrValue: "安康",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "610900"
          }
        },
        {
          portrValue: "铜川",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "610200"
          }
        },
        {
          portrValue: "宝鸡",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "610300"
          }
        },
        {
          portrValue: "延安",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "610600"
          }
        },
        {
          portrValue: "商洛",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "611000"
          }
        }
      ]
    },
    {
      portrValue: "广西",
      num: 61,
      percentage: 0.020218760357971495,
      extInfo: {
        areaCode: "450000"
      },
      subList: [
        {
          portrValue: "南宁",
          num: 18,
          percentage: 0.005966191581040769,
          extInfo: {
            areaCode: "450100"
          }
        },
        {
          portrValue: "柳州",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "450200"
          }
        },
        {
          portrValue: "桂林",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "450300"
          }
        },
        {
          portrValue: "玉林",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "450900"
          }
        },
        {
          portrValue: "贵港",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "450800"
          }
        },
        {
          portrValue: "梧州",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "450400"
          }
        },
        {
          portrValue: "北海",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "450500"
          }
        },
        {
          portrValue: "钦州",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "450700"
          }
        },
        {
          portrValue: "来宾",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "451300"
          }
        },
        {
          portrValue: "百色",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "451000"
          }
        },
        {
          portrValue: "贺州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "451100"
          }
        },
        {
          portrValue: "河池",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "451200"
          }
        },
        {
          portrValue: "崇左",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "451400"
          }
        }
      ]
    },
    {
      portrValue: "江西",
      num: 50,
      percentage: 0.016572754391779913,
      extInfo: {
        areaCode: "360000"
      },
      subList: [
        {
          portrValue: "南昌",
          num: 13,
          percentage: 0.004308916141862778,
          extInfo: {
            areaCode: "360100"
          }
        },
        {
          portrValue: "赣州",
          num: 12,
          percentage: 0.003977461054027179,
          extInfo: {
            areaCode: "360700"
          }
        },
        {
          portrValue: "九江",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "360400"
          }
        },
        {
          portrValue: "上饶",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "361100"
          }
        },
        {
          portrValue: "吉安",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "360800"
          }
        },
        {
          portrValue: "宜春",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "360900"
          }
        },
        {
          portrValue: "萍乡",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "360300"
          }
        },
        {
          portrValue: "景德镇",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "360200"
          }
        },
        {
          portrValue: "新余",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "360500"
          }
        }
      ]
    },
    {
      portrValue: "辽宁",
      num: 44,
      percentage: 0.014584023864766324,
      extInfo: {
        areaCode: "210000"
      },
      subList: [
        {
          portrValue: "沈阳",
          num: 14,
          percentage: 0.004640371229698376,
          extInfo: {
            areaCode: "210100"
          }
        },
        {
          portrValue: "大连",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "210200"
          }
        },
        {
          portrValue: "营口",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "210800"
          }
        },
        {
          portrValue: "鞍山",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "210300"
          }
        },
        {
          portrValue: "阜新",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "210900"
          }
        },
        {
          portrValue: "朝阳",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "211300"
          }
        },
        {
          portrValue: "丹东",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "210600"
          }
        },
        {
          portrValue: "辽阳",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "211000"
          }
        },
        {
          portrValue: "抚顺",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "210400"
          }
        },
        {
          portrValue: "锦州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "210700"
          }
        },
        {
          portrValue: "铁岭",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "211200"
          }
        }
      ]
    },
    {
      portrValue: "云南",
      num: 35,
      percentage: 0.01160092807424594,
      extInfo: {
        areaCode: "530000"
      },
      subList: [
        {
          portrValue: "昆明",
          num: 19,
          percentage: 0.006297646668876367,
          extInfo: {
            areaCode: "530100"
          }
        },
        {
          portrValue: "曲靖",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "530300"
          }
        },
        {
          portrValue: "文山",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "532600"
          }
        },
        {
          portrValue: "昭通",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "530600"
          }
        },
        {
          portrValue: "普洱",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "530800"
          }
        },
        {
          portrValue: "临沧",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "530900"
          }
        },
        {
          portrValue: "楚雄",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "532300"
          }
        },
        {
          portrValue: "红河",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "532500"
          }
        }
      ]
    },
    {
      portrValue: "天津",
      num: 35,
      percentage: 0.01160092807424594,
      extInfo: {
        areaCode: "120000"
      },
      subList: [
        {
          portrValue: "天津",
          num: 35,
          percentage: 0.01160092807424594,
          extInfo: {
            areaCode: "120100"
          }
        }
      ]
    },
    {
      portrValue: "重庆",
      num: 30,
      percentage: 0.009943652635067949,
      extInfo: {
        areaCode: "500000"
      },
      subList: [
        {
          portrValue: "重庆",
          num: 28,
          percentage: 0.009280742459396751,
          extInfo: {
            areaCode: "500100"
          }
        },
        {
          portrValue: "重庆",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "500200"
          }
        }
      ]
    },
    {
      portrValue: "贵州",
      num: 24,
      percentage: 0.007954922108054359,
      extInfo: {
        areaCode: "520000"
      },
      subList: [
        {
          portrValue: "贵阳",
          num: 13,
          percentage: 0.004308916141862778,
          extInfo: {
            areaCode: "520100"
          }
        },
        {
          portrValue: "遵义",
          num: 5,
          percentage: 0.0016572754391779914,
          extInfo: {
            areaCode: "520300"
          }
        },
        {
          portrValue: "黔东",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "522600"
          }
        },
        {
          portrValue: "六盘水",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "520200"
          }
        },
        {
          portrValue: "毕节",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "520500"
          }
        },
        {
          portrValue: "铜仁",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "520600"
          }
        },
        {
          portrValue: "黔南",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "522700"
          }
        }
      ]
    },
    {
      portrValue: "黑龙江",
      num: 21,
      percentage: 0.0069605568445475635,
      extInfo: {
        areaCode: "230000"
      },
      subList: [
        {
          portrValue: "哈尔滨",
          num: 8,
          percentage: 0.002651640702684786,
          extInfo: {
            areaCode: "230100"
          }
        },
        {
          portrValue: "绥化",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "231200"
          }
        },
        {
          portrValue: "大庆",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "230600"
          }
        },
        {
          portrValue: "佳木斯",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "230800"
          }
        },
        {
          portrValue: "双鸭山",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "230500"
          }
        },
        {
          portrValue: "鸡西",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "230300"
          }
        }
      ]
    },
    {
      portrValue: "新疆",
      num: 16,
      percentage: 0.005303281405369572,
      extInfo: {
        areaCode: "650000"
      },
      subList: [
        {
          portrValue: "乌鲁木齐",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "650100"
          }
        },
        {
          portrValue: "阿克苏地区",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "652900"
          }
        },
        {
          portrValue: "克拉玛依",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "650200"
          }
        },
        {
          portrValue: "克孜勒苏柯尔克孜",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "653000"
          }
        },
        {
          portrValue: "喀什地区",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "653100"
          }
        },
        {
          portrValue: "伊犁",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "654000"
          }
        },
        {
          portrValue: "北屯",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "659005"
          }
        }
      ]
    },
    {
      portrValue: "甘肃",
      num: 12,
      percentage: 0.003977461054027179,
      extInfo: {
        areaCode: "620000"
      },
      subList: [
        {
          portrValue: "兰州",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "620100"
          }
        },
        {
          portrValue: "陇南",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "621200"
          }
        },
        {
          portrValue: "天水",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "620500"
          }
        },
        {
          portrValue: "武威",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "620600"
          }
        },
        {
          portrValue: "平凉",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "620800"
          }
        }
      ]
    },
    {
      portrValue: "海南",
      num: 12,
      percentage: 0.003977461054027179,
      extInfo: {
        areaCode: "460000"
      },
      subList: [
        {
          portrValue: "海口",
          num: 7,
          percentage: 0.002320185614849188,
          extInfo: {
            areaCode: "460100"
          }
        },
        {
          portrValue: "三亚",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "460200"
          }
        },
        {
          portrValue: "儋州",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "460400"
          }
        },
        {
          portrValue: "昌江",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "469026"
          }
        },
        {
          portrValue: "陵水",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "469028"
          }
        }
      ]
    },
    {
      portrValue: "吉林",
      num: 10,
      percentage: 0.003314550878355983,
      extInfo: {
        areaCode: "220000"
      },
      subList: [
        {
          portrValue: "长春",
          num: 6,
          percentage: 0.0019887305270135896,
          extInfo: {
            areaCode: "220100"
          }
        },
        {
          portrValue: "吉林",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "220200"
          }
        },
        {
          portrValue: "四平",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "220300"
          }
        },
        {
          portrValue: "松原",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "220700"
          }
        }
      ]
    },
    {
      portrValue: "内蒙古",
      num: 8,
      percentage: 0.002651640702684786,
      extInfo: {
        areaCode: "150000"
      },
      subList: [
        {
          portrValue: "包头",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "150200"
          }
        },
        {
          portrValue: "呼伦贝尔",
          num: 2,
          percentage: 6.629101756711965e-4,
          extInfo: {
            areaCode: "150700"
          }
        },
        {
          portrValue: "呼和浩特",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "150100"
          }
        },
        {
          portrValue: "赤峰",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "150400"
          }
        },
        {
          portrValue: "通辽",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "150500"
          }
        },
        {
          portrValue: "巴彦淖尔",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "150800"
          }
        }
      ]
    },
    {
      portrValue: "青海",
      num: 5,
      percentage: 0.0016572754391779914,
      extInfo: {
        areaCode: "630000"
      },
      subList: [
        {
          portrValue: "海西",
          num: 3,
          percentage: 9.943652635067948e-4,
          extInfo: {
            areaCode: "632800"
          }
        },
        {
          portrValue: "西宁",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "630100"
          }
        },
        {
          portrValue: "海南",
          num: 1,
          percentage: 3.3145508783559825e-4,
          extInfo: {
            areaCode: "632500"
          }
        }
      ]
    },
    {
      portrValue: "宁夏",
      num: 4,
      percentage: 0.001325820351342393,
      extInfo: {
        areaCode: "640000"
      },
      subList: [
        {
          portrValue: "银川",
          num: 4,
          percentage: 0.001325820351342393,
          extInfo: {
            areaCode: "640100"
          }
        }
      ]
    },
    {
      portrValue: "台湾",
      num: 0,
      percentage: 0.0,
      extInfo: {
        areaCode: "710000"
      },
      subList: []
    },
    {
      portrValue: "澳门",
      num: 0,
      percentage: 0.0,
      extInfo: {
        areaCode: "820000"
      },
      subList: []
    },
    {
      portrValue: "香港",
      num: 0,
      percentage: 0.0,
      extInfo: {
        areaCode: "810000"
      },
      subList: []
    },
    {
      portrValue: "西藏",
      num: 0,
      percentage: 0.0,
      extInfo: {
        areaCode: "540000"
      },
      subList: []
    }
  ]
};
export default () => {
    useEffect( () => {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          pitch: 0,
          style: "blank",
          center: [116.368652, 39.93866],
          zoom: 10.07
        })
      });
      scene.on("loaded", () => {
        fetch(
          // 'https://gw.alipayobjects.com/os/bmw-prod/1981b358-28d8-4a2f-9c74-a857d5925ef1.json' //  获取行政区划P噢利用
          "https://gw.alipayobjects.com/os/bmw-prod/d6da7ac1-8b4f-4a55-93ea-e81aa08f0cf3.json"
        )
          .then((res) => res.json())
          .then((data) => {
            data.features.forEach((i) => {
              i.properties.adcode = String(i.properties.adcode);
              const item = list.dataList.find(
                (item) => item.extInfo.areaCode === i.properties.adcode
              );
              // 把num塞到data里
              i.properties.num = item?.num || 0;
            });
            const chinaPolygonLayer = new PolygonLayer({
              autoFit: true,
              zIndex: 10
            })
              .source(data)
              // .color(
              //   'name',
              //   [
              //     'rgb(239,243,255)',
              //     'rgb(189,215,231)',
              //     'rgb(107,174,214)',
              //     'rgb(49,130,189)',
              //     'rgb(8,81,156)'
              //   ]
              // )
              .scale('num',{
                type:'quantile'
              })
              .color("num", ["#E8F1FF", "#A8BDEC", "#688DE4", "#3461CA", "#23396E"])
              .shape("fill")
              .select({
                color: "#FFDFB1"
              })
              .select(false)
              .style({
                opacity: 1
              });

            // 默认高亮选中北京
            chinaPolygonLayer.on("add", () => {
              setTimeout(() => {
                chinaPolygonLayer.setSelect("0");
              }, 1000);
            });
            // 点击省份添加高亮效果
            chinaPolygonLayer.on("click", (result) => {
              console.log("result", result);
              const adcode = result.feature.properties.adcode;
              const source = chinaPolygonLayer.getSource();
              const featureId = source.getFeatureId("adcode", adcode);
              chinaPolygonLayer.setSelect(featureId);
            });
            //  图层边界
            const layer2 = new LineLayer({
              zIndex: 2
            })
              .source(data)
              .color("rgb(93,112,146)")
              .size(0.6)
              .style({
                opacity: 1
              });
      
            scene.addLayer(chinaPolygonLayer);
            scene.addLayer(layer2);
            setTimeout(()=>{
              chinaPolygonLayer.scale('num',{
                type:'quantize'
              })
              // chinaPolygonLayer.color('num',['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026'])
              scene.render()
              console.log('render')
            },3000)
          });
        fetch(
          "https://gw.alipayobjects.com/os/bmw-prod/c4a6aa9d-8923-4193-a695-455fd8f6638c.json" //  标注数据
        )
          .then((res) => res.json())
          .then((data) => {
            const labelLayer = new PointLayer({
              zIndex: 5
            })
              .source(data, {
                parser: {
                  type: "json",
                  coordinates: "center"
                }
              })
              .color("#f00")
              .shape("name", "text")
              .size(12)
              .style({
                opacity: 1,
                stroke: "#fff",
                strokeWidth: 1,
                textAllowOverlap: false
              });
      
            scene.addLayer(labelLayer);
          });
      });
      
          
          
    }, []);
    return (
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    );
  };
  