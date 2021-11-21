import Mock from 'mockjs';

// 单折线图
export const singleLineChart = () => {
  const data = Mock.mock({
    'list|9': [
      {
        // 生成长度在 100~1000 之间的小写字母
        yField: '@integer(0,5000)',
      },
    ],
  });
  return data.list
    .sort((a, b) => a.yField - b.yField)
    .map((item, index) => {
      return {
        xField: `${index + 1}月`,
        ...item,
      };
    });
};

// 条形图
export const barChart = () => {
  let xField = ['餐饮', '影院', '百货购物中心', '国内旅游', '医疗'];
  const data = Mock.mock({
    'list|5': [
      {
        // 生成长度在 100~1000 之间的小写字母
        yField: '@integer(0,5000)',
      },
    ],
  });
  return data.list
    .sort((a, b) => b.yField - a.yField)
    .map((item, index) => {
      return {
        xField: xField[index],
        ...item,
      };
    });
};

// 多维折线图
export const multidimensionalChart = () => {
  const series = ['铺设失败', '铺设中', '铺设成功', '虚假铺设'];
  const xField = new Array(12).fill('').map((item, index) => {
    return `${2 * index + 2}:00`;
  });

  return series
    .map((a, k) => {
      return xField.map((b, index) => {
        return {
          xField: b,
          series: a,
          yField: Number(
            ((index + 1) * 10 + 20 * Math.random() + k * 20).toFixed(),
          ),
        };
      });
    })
    .flat();
};

// 作业单数
export const operation = () => {
  const data = Mock.mock({
    'list|15': [
      {
        name: '@cname',
        order_count: '@integer(0,100)',
        staff_no: '@integer(100000,1000000)',
      },
    ],
  });
  return data.list;
};

// 行业市场份额
export const marketShare = () => {
  const data = Mock.mock({
    'list|3': [
      {
        // 生成长度在 100~1000 之间的小写字母
        xField: '@integer(0,100)',
      },
    ],
  });
  const yField = ['街电', '怪兽', '小电'];
  return data.list
    .sort((a, b) => a.yField - b.yField)
    .map((item, index) => {
      return {
        yField: yField[index],
        ...item,
      };
    });
};

// 各品牌营收
export const brandRevenue = () => {
  const series = ['街电', '来电', '怪兽', '美团', '小电'];
  const xField = new Array(11).fill('').map((item, index) => {
    return `${2009 + index}`;
  });

  return series
    .map((a, k) => {
      return xField.map((b, index) => {
        return {
          xField: b,
          series: a,
          yField: Number(
            ((index + 1) * 10 + 30 * Math.random() + k * 20).toFixed(),
          ),
        };
      });
    })
    .flat();
};

export function randomData<T>(data: T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
}

// 生成范围内的随机数
export const randomNumBoth = (min: number, max: number) => {
  const Range = max - min;
  const Rand = Math.random();
  const num = min + Math.round(Rand * Range);
  return num;
}

export const brandOption = [
  { label: '全部类型', value: '1' },
  { label: '街电', value: '2' },
  { label: '怪兽', value: '3' },
  { label: '小电', value: '4' },
];

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
