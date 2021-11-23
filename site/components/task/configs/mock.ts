import Mock from 'mockjs';

export const chartList = Mock.mock({
  // 生成长度在 0~32 之间的小写字母
  success: '@string("lower", 0, 32)',
  // 生成长度在 0~32 之间的小写字母
  errorMessage: '@string("lower", 0, 32)',
  data: {
    'list|4-7': [
      {
        // 生成长度在 100~1000 之间的小写字母
        xField: '@integer(100,1000)',
        // 生成长度在 3~5 之间的中文
        yField: '@ctitle(3, 5)',
      },
    ],
  },
});

export const personOption = () => {
  const data = Mock.mock({
    'list|10': [
      {
        label: '@cname',
        staffNo: '@integer(100000,1000000)',
        value: '@integer(100000,1000000)'
      },
    ],
  })
  return data.list
}

export const selectActivityItem = [
  {
    label: '双十一赢金币',
    value: '双十一赢金币',
    icon: 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*JYNuSaNAga8AAAAAAAAAAAAAARQnAQ'
  },
  {
    label: '充电桩铺设',
    value: '充电桩铺设',
    icon: 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*eay2Q7nXeG4AAAAAAAAAAAAAARQnAQ'
  },
  {
    label: '1块钱升级月卡',
    value: '1块钱升级月卡',
    icon: 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*nA0vQbl_hGMAAAAAAAAAAAAAARQnAQ'
  },
  {
    label: '免费充电1小时',
    value: '免费充电1小时',
    icon: 'https://gw.alipayobjects.com/mdn/rms_58ab56/afts/img/A*snkKRYonMgEAAAAAAAAAAAAAARQnAQ'
  },
]

export function randomData<T>(data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
}

export const ActivityOption = [
  { label: '全部活动', value: '全部活动' },
  { label: '双十一赢金币', value: '双十一赢金币' },
  { label: '充电桩铺设', value: '充电桩铺设' },
  { label: '1块钱升级月卡', value: '1块钱升级月卡' },
  { label: '免费充电1小时', value: '免费充电1小时' }
]

export const StatusOption = [
  { label: '全部状态', value: '全部状态' },
  { label: '未拓展', value: '未拓展' },
  { label: '已拓展', value: '已拓展' },
]

export const CityList = [
  {
    value: '330000',
    areaLevel: 'province',
    label: '浙江省',
    children: [
      {
        value: '330100',
        areaLevel: 'city',
        label: '杭州市',
        children: [],
      },
    ],
  },
  {
    value: '110000',
    areaLevel: 'province',
    label: '北京市',
    children: [
      {
        value: '110000',
        areaLevel: 'city',
        label: '北京市',
        children: [],
      },
    ],
  },
  {
    value: '120000',
    areaLevel: 'province',
    label: '天津市',
    children: [
      {
        value: '120000',
        areaLevel: 'city',
        label: '天津市',
        children: [],
      },
    ],
  },
  {
    value: '310000',
    areaLevel: 'province',
    label: '上海市',
    children: [
      {
        value: '310000',
        areaLevel: 'province',
        label: '上海市',
        children: [],
      },
    ],
  },
  {
    value: '440000',
    areaLevel: 'province',
    label: '广东省',
    children: [
      {
        value: '440100',
        areaLevel: 'city',
        label: '广州市',
        children: [],
      },
      {
        value: '440300',
        areaLevel: 'city',
        label: '深圳市',
        children: [],
      },
      {
        value: '440400',
        areaLevel: 'city',
        label: '珠海市',
        children: [],
      },
      {
        value: '440600',
        areaLevel: 'city',
        label: '佛山市',
        children: [],
      },
      {
        value: '441300',
        areaLevel: 'city',
        label: '惠州市',
        children: [],
      },
      {
        value: '441900',
        areaLevel: 'city',
        label: '东莞市',
        children: [],
      },
      {
        value: '442000',
        areaLevel: 'city',
        label: '中山市',
        children: [],
      },
    ],
  },
  {
    value: '130000',
    areaLevel: 'province',
    label: '河北省',
    children: [
      {
        value: '130100',
        areaLevel: 'city',
        label: '石家庄市',
        children: [],
      },
      {
        value: '131000',
        areaLevel: 'city',
        label: '廊坊市',
        children: [],
      },
    ],
  },
];
