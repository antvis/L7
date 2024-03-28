// @ts-ignore
import { LineLayer, PolygonLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

const data = [
  { name: '美国', qz: '82404' },
  { name: '格陵兰（丹）', qz: '18' },
  { name: '中国', qz: '79404' },
  { name: '意大利', qz: '80539' },
  { name: '西班牙', qz: '56188' },
  { name: '德国', qz: '36508' },
  { name: '伊朗', qz: '29406' },
  { name: '法国', qz: '29155' },
  { name: '英国', qz: '11658' },
  { name: '韩国', qz: '9232' },
  { name: '瑞士', qz: '8789' },
  { name: '荷兰', qz: '7431' },
  { name: '比利时', qz: '6235' },
  { name: '奥地利', qz: '5888' },
  { name: '土耳其', qz: '3629' },
  { name: '加拿大', qz: '3409' },
  { name: '葡萄牙', qz: '2995' },
  { name: '挪威', qz: '2916' },
  { name: '澳大利亚', qz: '2799' },
  { name: '瑞典', qz: '2510' },
  { name: '巴西', qz: '2433' },
  { name: '以色列', qz: '2369' },
  { name: '马来西亚', qz: '2031' },
  { name: '爱尔兰', qz: '1819' },
  { name: '丹麦', qz: '1724' },
  { name: '捷克', qz: '1654' },
  { name: '卢森堡', qz: '1453' },
  { name: '日本', qz: '1313' },
  { name: '厄瓜多尔', qz: '1211' },
  { name: '智利', qz: '1142' },
  { name: '巴基斯坦', qz: '1057' },
  { name: '波兰', qz: '1051' },
  { name: '泰国', qz: '1045' },
  { name: '罗马尼亚', qz: '906' },
  { name: '沙特阿拉伯', qz: '900' },
  { name: '印度尼西亚', qz: '893' },
  { name: '芬兰', qz: '880' },
  { name: '俄罗斯', qz: '840' },
  { name: '希腊', qz: '821' },
  { name: '冰岛', qz: '737' },
  { name: '钻石公主号邮轮', qz: '712' },
  { name: '南非', qz: '709' },
  { name: '印度', qz: '694' },
  { name: '菲律宾', qz: '636' },
  { name: '新加坡', qz: '631' },
  { name: '巴拿马', qz: '558' },
  { name: '卡塔尔', qz: '537' },
  { name: '斯洛文尼亚', qz: '528' },
  { name: '阿根廷', qz: '502' },
  { name: '秘鲁', qz: '480' },
  { name: '墨西哥', qz: '478' },
  { name: '哥伦比亚', qz: '470' },
  { name: '埃及', qz: '456' },
  { name: '巴林', qz: '419' },
  { name: '克罗地亚', qz: '418' },
  { name: '爱沙尼亚', qz: '404' },
  { name: '多米尼加共和国', qz: '392' },
  { name: '塞尔维亚', qz: '384' },
  { name: '黎巴嫩', qz: '368' },
  { name: '伊拉克', qz: '346' },
  { name: '阿拉伯联合酋长国', qz: '333' },
  { name: '亚美尼亚', qz: '290' },
  { name: '立陶宛', qz: '290' },
  { name: '新西兰', qz: '262' },
  { name: '匈牙利', qz: '261' },
  { name: '阿尔及利亚', qz: '246' },
  { name: '保加利亚', qz: '242' },
  { name: '摩洛哥', qz: '225' },
  { name: '拉脱维亚', qz: '221' },
  { name: '乌拉圭', qz: '217' },
  { name: '斯洛伐克', qz: '216' },
  { name: '安道尔共和国', qz: '213' },
  { name: '圣马力诺', qz: '208' },
  { name: '科威特', qz: '208' },
  { name: '哥斯达黎加', qz: '201' },
  { name: '北马其顿共和国', qz: '177' },
  { name: '阿尔巴尼亚', qz: '174' },
  { name: '波斯尼亚和黑塞哥维那', qz: '173' },
  { name: '突尼斯', qz: '173' },
  { name: '约旦', qz: '172' },
  { name: '乌克兰', qz: '156' },
  { name: '摩尔多瓦', qz: '149' },
  { name: '布基纳法索', qz: '146' },
  { name: '越南', qz: '141' },
  { name: '塞浦路斯', qz: '132' },
  { name: '法罗群岛', qz: '132' },
  { name: '马耳他', qz: '129' },
  { name: '文莱', qz: '109' },
  { name: '委内瑞拉', qz: '107' },
  { name: '塞内加尔', qz: '105' },
  { name: '斯里兰卡', qz: '102' },
  { name: '阿曼', qz: '99' },
  { name: '柬埔寨', qz: '98' },
  { name: '哈萨克斯坦', qz: '97' },
  { name: '阿塞拜疆', qz: '93' },
  { name: '白俄罗斯', qz: '86' },
  { name: '留尼汪岛', qz: '83' },
  { name: '阿富汗', qz: '80' },
  { name: '科特迪瓦', qz: '80' },
  { name: '格鲁吉亚', qz: '77' },
  { name: '瓜德罗普', qz: '76' },
  { name: '喀麦隆', qz: '72' },
  { name: '科索沃地区', qz: '71' },
  { name: '加纳', qz: '68' },
  { name: '马提尼克', qz: '66' },
  { name: '乌兹别克斯坦', qz: '65' },
  { name: '巴勒斯坦', qz: '64' },
  { name: '特立尼达和多巴哥', qz: '60' },
  { name: '古巴', qz: '57' },
  { name: '黑山', qz: '52' },
  { name: '洪都拉斯', qz: '52' },
  { name: '波多黎各', qz: '51' },
  { name: '刚果（金）', qz: '51' },
  { name: '列支敦士登', qz: '51' },
  { name: '毛里求斯', qz: '47' },
  { name: '尼日利亚', qz: '46' },
  { name: '吉尔吉斯斯坦', qz: '44' },
  { name: '巴拉圭', qz: '41' },
  { name: '卢旺达', qz: '41' },
  { name: '玻利维亚', qz: '39' },
  { name: '孟加拉国', qz: '39' },
  { name: '关岛', qz: '37' },
  { name: '马约特岛', qz: '35' },
  { name: '肯尼亚', qz: '31' },
  { name: '根西岛', qz: '30' },
  { name: '法属圭亚那', qz: '28' },
  { name: '牙买加', qz: '26' },
  { name: '直布罗陀', qz: '26' },
  { name: '法属玻利尼西亚', qz: '25' },
  { name: '危地马拉', qz: '24' },
  { name: '多哥', qz: '23' },
  { name: '马恩岛', qz: '23' },
  { name: '摩纳哥', qz: '23' },
  { name: '阿鲁巴岛', qz: '19' },
  { name: '马达加斯加', qz: '19' },
  { name: '巴巴多斯', qz: '18' },
  { name: '泽西岛', qz: '18' },
  { name: '美属维尔京群岛', qz: '17' },
  { name: '新喀里多尼亚', qz: '14' },
  { name: '乌干达', qz: '14' },
  { name: '马尔代夫', qz: '13' },
  { name: '坦桑尼亚', qz: '13' },
  { name: '萨尔瓦多', qz: '13' },
  { name: '吉布提', qz: '12' },
  { name: '埃塞俄比亚', qz: '12' },
  { name: '赤道几内亚', qz: '11' },
  { name: '法属圣马丁岛', qz: '11' },
  { name: '蒙古', qz: '10' },
  { name: '海地', qz: '8' },
  { name: '开曼群岛', qz: '8' },
  { name: '塞舌尔', qz: '7' },
  { name: '百慕大群岛', qz: '7' },
  { name: '苏里南', qz: '7' },
  { name: '加蓬', qz: '6' },
  { name: '库拉索', qz: '6' },
  { name: '圭亚那', qz: '5' },
  { name: '叙利亚', qz: '5' },
  { name: '格林兰岛', qz: '5' },
  { name: '中非共和国', qz: '5' },
  { name: '莫桑比克', qz: '5' },
  { name: '斐济', qz: '5' },
  { name: '贝宁', qz: '5' },
  { name: '纳米比亚', qz: '5' },
  { name: '巴哈马', qz: '5' },
  { name: '缅甸', qz: '5' },
  { name: '几内亚', qz: '5' },
  { name: '史瓦帝尼', qz: '4' },
  { name: '斯威士兰', qz: '4' },
  { name: '厄立特里亚', qz: '4' },
  { name: '梵蒂冈', qz: '4' },
  { name: '刚果（布）', qz: '4' },
  { name: '尼日尔', qz: '4' },
  { name: '老挝', qz: '3' },
  { name: '安提瓜和巴布达', qz: '3' },
  { name: '圣卢西亚', qz: '3' },
  { name: '圣巴泰勒米岛', qz: '3' },
  { name: '尼泊尔', qz: '3' },
  { name: '乍得', qz: '3' },
  { name: '苏丹', qz: '3' },
  { name: '利比里亚', qz: '3' },
  { name: '佛得角', qz: '3' },
  { name: '赞比亚', qz: '3' },
  { name: '毛里塔尼亚', qz: '2' },
  { name: '索马里', qz: '2' },
  { name: '尼加拉瓜', qz: '2' },
  { name: '马里', qz: '2' },
  { name: '几内亚比绍', qz: '2' },
  { name: '多米尼克', qz: '2' },
  { name: '圣基茨和尼維斯', qz: '2' },
  { name: '蒙特塞拉特', qz: '2' },
  { name: '冈比亚', qz: '2' },
  { name: '伯利兹', qz: '2' },
  { name: '安哥拉', qz: '2' },
  { name: '津巴布韦', qz: '2' },
  { name: '不丹', qz: '2' },
  { name: '荷属圣马丁', qz: '2' },
  { name: '圣文森特和格林纳丁斯', qz: '1' },
  { name: '东帝汶', qz: '1' },
  { name: '格林纳达', qz: '1' },
  { name: '特克斯和凯科斯群岛', qz: '1' },
  { name: '利比亚', qz: '1' },
  { name: '巴布亚新几内亚', qz: '1' },
];

const counts = [10000, 5000, 1000, 500, 100];
const color = [
  '#fcfbfd',
  '#efedf5',
  '#dadaeb',
  '#bcbddc',
  '#9e9ac8',
  '#807dba',
  '#6a51a3',
  '#4a1486',
].reverse();
const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    center: [100, 30],
    minZoom: 0,
    zoom: 2,
  }),
});

const url =
  'https://mvt.amap.com/district/WLD/{z}/{x}/{y}/4096?key=309f07ac6bc48160e80b480ae511e1e9&version=';
const source = new Source(url, {
  parser: {
    type: 'mvt',
    tileSize: 256,
    warp: false,
  },
});
function unicode2Char(name) {
  const code = name
    .split('/')
    .slice(1)
    .map((c) => {
      return String.fromCharCode('0x' + c);
    });
  return code.join('');
}

scene.on('loaded', () => {
  // 绿地
  const water_surface = new PolygonLayer({
    sourceLayer: 'WLD',
    zIndex: 1,
  })
    .source(source)
    .select(true)
    .active(false)
    .shape('fill')
    // .color('red')
    .color('NAME_CHN', (NAME_CHN) => {
      const namestr = unicode2Char(NAME_CHN);
      const country = data.find((c) => {
        return c.name == namestr;
      });
      if (!country) {
        return '#ffff33';
      }
      const qz = (country.qz as unknown as number) * 1;
      if (qz > counts[0]) {
        return color[0];
      } else if (qz > counts[1]) {
        return color[1];
      } else if (qz > counts[2]) {
        return color[2];
      } else if (qz > counts[3]) {
        return color[3];
      } else {
        return color[4];
      }
    });

  const line = new LineLayer({
    sourceLayer: 'WLD_L',
    zIndex: 2,
  })
    .source(source)
    .shape('line')
    .size(0.6)
    .color('type', (t) => {
      if (t === '0') {
        return 'red';
      }
      if (t === '2') {
        return '#09f';
      }
      return '#fc9272';
    });

  // water_surface.on('click', (e) => {
  //   console.log(e);
  // });

  scene.addLayer(water_surface);
  scene.addLayer(line);
});
