<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.en-US.md) | 简体中文

<h1 align="center">L7</h1>

<div align="center">

🌍 地理空间数据可视分析引擎

[![CI](https://github.com/antvis/L7/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/antvis/L7/actions/workflows/ci.yml) [![NPM](https://flat.badgen.net/npm/v/@antv/l7?icon=npm)](https://www.npmjs.com/package/@antv/l7) ![last commit](https://badgen.net/github/last-commit/antvis/L7)

<p align="center">
  <a href="https://l7.antv.antgroup.com/tutorial/quickstart">教程</a> •
  <a href="https://l7.antv.antgroup.com/api/scene">文档</a> •
  <a href="https://l7.antv.antgroup.com/examples">示例</a> •
  <a href="./CONTRIBUTING.md">贡献</a>
</p>

![L7 demo](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*S-73QpO8d0YAAAAAAAAAAABkARQnAQ)

</div>

L7 是由蚂蚁集团 AntV 数据可视化团队推出的基于 WebGL 的开源大规模地理空间数据可视分析引擎。L7 中的 L 代表 Location，7 代表世界七大洲，寓意能为全球位置数据提供可视分析的能力。L7 专注数据可视化化表达，通过颜色、大小、纹理，方向，体积等视觉变量设置实现从数据到信息清晰，有效的表达。

L7 能够满足常见的地图图表，BI 系统的可视化分析、以及 GIS，交通，电力，国土，农业，城市等领域的空间信息管理，分析等应用系统开发需求。

## 🌟 核心特性

🌏 数据驱动可视化展示

数据驱动，灵活数据映射，从数到形，支持丰富的地图可视化类型，更好洞察数据。

🌏 2D，3D 一体化的海量数据高性能渲染

海量空间数据实时，可交互，动态渲染。

🌏 简单灵活的数据接入

支持 CSV，JSON，GeoJSON 等数据格式接入，可以根据需求自定义数据格式，无需复杂的空间数据转换。

🌏 多地图底图支持，支持离线内网部署

屏蔽不同底图之间的差异，用户只需要关注数据层表达，交互。高德地图国内合法合规的地理底图，Mapbox 满足国际化业务需求。

## 🌈 支持丰富的图表类型

#### 点图层

- 气泡图
- 散点图
- 符号地图
- 3D 柱状地图
- 聚合地图
- 复合图表地图
- 自定义 Marker

#### 线图层

- 路径地图
- 弧线，支持 2D 弧线、3D 弧线以及大圆航线
- 等值线

#### 面图层

- 填充图
- 3D 填充图

#### 热力图

- 经典热力图
- 蜂窝热力图
- 网格热力图

#### 栅格地图

- 图片
- Raster

## 📦 如何使用

### 安装

```bash
npm install @antv/l7
```

### 初始化地图

```javascript
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'light',
    pitch: 0,
    center: [107.054293, 35.246265],
    zoom: 4.056,
  }),
});
```

### 添加图层

```javascript
import { PointLayer } from '@antv/l7';

const pointLayer = new PointLayer()
  .source(data)
  .shape('circle')
  .size('mag', [1, 25])
  .color('mag', ['#5B8FF9', '#5CCEA1'])
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });

scene.addLayer(pointLayer);
```

## 🔗 周边生态

- [L7Draw](https://github.com/antvis/L7Draw)
- [L7Plot](https://github.com/antvis/L7Plot)
- [LarkMap](https://github.com/antvis/LarkMap)
- [L7VP](https://locationinsight.antv.antgroup.com)
- [L7Editor](https://l7editor.antv.antgroup.com)

## 🤝 参与贡献

如果希望参与到开发中，请遵从我们的[贡献指南](./CONTRIBUTING.md)。

![https://github.com/antvis/l7/graphs/contributors](https://contrib.rocks/image?repo=antvis/l7)

## 📄 开源协议

该项目的代码和文档基于 [MIT license](./LICENSE) 开源协议。


## 🌐 Web Resources & Interactive Index
- [SUMMER AESTHETICS](https://ilearnworld.pages.dev/summer-aesthetics.html)
- [WORD GAME 2026](https://themindplays.pages.dev/word-game-2026.html)
- [CHILL CLICKER](https://quizverses-9d2f2.web.app/chill-clicker.html)
- [FLY AND SHOOT 1 ITALIAN BOSSES](https://themindzone.pages.dev/fly-and-shoot-1-italian-bosses.html)
- [DIY MAKEUP SALON SPA MAKEOVER STUDIO](https://themindzone.pages.dev/diy-makeup-salon-spa-makeover-studio.html)
- [CRAZY TRAFFIC RACER](https://themindplays.pages.dev/crazy-traffic-racer.html)
- [MAGIC SORT](https://quizverses.github.io/magic-sort.html)
- [INDEX14](https://studyplayings.pages.dev/index14.html)
- [PROTECT MY DOG 3](https://themindplays.pages.dev/protect-my-dog-3.html)
- [CATEGORY TOWER DEFENSE118](https://themindzone.pages.dev/category-tower-defense118.html)
- [MY CASTLE MERGE STORY](https://studyquesthub.web.app/my-castle-merge-story.html)
- [DAY OF ATROCITY](https://learnquesters.pages.dev/day-of-atrocity.html)
- [CAT LIFE MERGE MONEY](https://skillplay.github.io/cat-life-merge-money.html)
- [WHEEL OF BINGO](https://studyplayings.web.app/wheel-of-bingo.html)
- [MERGE PIXEL](https://studyquests.pages.dev/merge-pixel.html)
- [CATEGORY RACING127](https://studyquests.pages.dev/category-racing127.html)
- [REAL DRIVING SIMULATOR](https://themindplays.pages.dev/real-driving-simulator.html)
- [CATEGORY SURVIVAL366](https://studyquests.pages.dev/category-survival366.html)
- [BRICKS BALLS BREAKER](https://studyplayings.pages.dev/bricks-balls-breaker.html)
- [TEXAS HOLDEM POKER](https://themindplays.pages.dev/texas-holdem-poker.html)
- [MY DINOSAUR LAND](https://themindplays.pages.dev/my-dinosaur-land.html)
- [ZOO RESTAURANT](https://themindplays.pages.dev/zoo-restaurant.html)
- [SPACE STRIKE GALAXY SHOOTER](https://thelearnquesters.pages.dev/space-strike-galaxy-shooter.html)
- [CATEGORY CASUAL 4](https://themindzone.pages.dev/category-casual-4.html)
- [GOON BALL](https://studyplayings.pages.dev/goon-ball.html)
- [FEED THE PARROT](https://quizverses.pages.dev/feed-the-parrot.html)
- [POXEL IO](https://thelearnquesters.pages.dev/poxel-io.html)
- [MONSTER SCHOOL CHALLENGE](https://thelearnquesters.pages.dev/monster-school-challenge.html)
- [CATEGORY MISSION207](https://learnquesters.pages.dev/category-mission207.html)
- [CATEGORY LOGIC538](https://thequizzone.pages.dev/category-logic538.html)
- [ROYAL GARDEN MATCH](https://quizverses-9d2f2.web.app/royal-garden-match.html)
- [BATTLE ZONE 2D](https://studyquests.github.io/battle-zone-2d.html)
- [SUDOKU MASTER](https://theskillquest.pages.dev/sudoku-master.html)
- [BEST FRIENDS PUZZLE](https://thelearnquesters.pages.dev/best-friends-puzzle.html)
- [GROW WARSIO](https://themindplays.pages.dev/grow-warsio.html)
- [CATEGORY CASUAL 7](https://studyquests.github.io/category-casual-7.html)
- [MICKEY RUN ADVENTURE GAME](https://studyplayings.pages.dev/mickey-run-adventure-game.html)
- [MAGES SECRET](https://theskillquest.pages.dev/mages-secret.html)
- [GUN RUSH](https://learnquester.pages.dev/gun-rush.html)
- [CELEBRITIES GET READY FOR CHRISTMAS](https://theskillquest.pages.dev/celebrities-get-ready-for-christmas.html)
- [EXCAVATOR SIMULATOR 3D](https://thelearnquesters.pages.dev/excavator-simulator-3d.html)
- [TROLL THE TEACHER](https://themindplays.pages.dev/troll-the-teacher.html)
- [ROYAL JEWELS MATCH](https://themindzone.pages.dev/royal-jewels-match.html)
- [CATEGORY SANDBOX](https://themindzone.pages.dev/category-sandbox.html)
- [TUNG TUNG SAHUR OBBY CHALLENGE](https://studyquesthub.web.app/tung-tung-sahur-obby-challenge.html)
- [CHRISTMAS SORTING](https://themindzone.pages.dev/christmas-sorting.html)
- [CATEGORY 2D1 060](https://skillplay.github.io/category-2d1-060.html)
- [TOWER OF FALL](https://learnquester.pages.dev/tower-of-fall.html)
- [SODA BLOCK JAM](https://theskillquest.pages.dev/soda-block-jam.html)
- [UNBLOCK BALL SLIDE PUZZLE](https://learnquester.pages.dev/unblock-ball-slide-puzzle.html)
- [MERGE CAR DEFENSE](https://studyplayings.pages.dev/merge-car-defense.html)
- [ONE HERO](https://studyplayings.pages.dev/one-hero.html)
- [MISSION SANTA DELIVER THE GIFTS](https://studyquests.github.io/mission-santa-deliver-the-gifts.html)
- [MATH MASTER](https://quizverses.github.io/math-master.html)
- [CATEGORY STICKMAN](https://studyquests.pages.dev/category-stickman.html)
- [WORLDGUESSR](https://learnquester.pages.dev/worldguessr.html)
- [CATEGORY TOP DOWN251](https://thelearnquesters.pages.dev/category-top-down251.html)
- [WEDNESDAY ADDAMS BEAUTY SALON](https://themindplays.pages.dev/wednesday-addams-beauty-salon.html)
- [FLIGHT PILOT AIRPLANE GAMES 24](https://studyplayings.pages.dev/flight-pilot-airplane-games-24.html)
- [STICKMAN ARCHER SHOOTING ARROWS AT REDS](https://studyquests.github.io/stickman-archer-shooting-arrows-at-reds.html)
- [CATEGORY MATCH 3](https://learnquesters.pages.dev/category-match-3.html)
- [NOOB PARKOUR TRICKS](https://thelearnquesters.pages.dev/noob-parkour-tricks.html)
- [ESCAPE OR DIE TROLL DEVIL LEVELS](https://themindplays.pages.dev/escape-or-die-troll-devil-levels.html)
- [PACXON NEW REALMS](https://themindplays.pages.dev/pacxon-new-realms.html)
- [REAL MOTORBIKE SUPER HERO STUNT 3D](https://themindplays.pages.dev/real-motorbike-super-hero-stunt-3d.html)
- [FUNNY FEVER HOSPITAL](https://quizverses-9d2f2.web.app/funny-fever-hospital.html)
- [REAL CAR PARKING SIMULATOR](https://themindplays.pages.dev/real-car-parking-simulator.html)
- [FIND IT OUT COLORFUL BOOK](https://studyquesthub.web.app/find-it-out-colorful-book.html)
- [WORDMEISTER HD](https://theskillquest.pages.dev/wordmeister-hd.html)
- [PLANET MERGE](https://studyquesthub.web.app/planet-merge.html)
- [SPACE SURVIVAL RAINBOW FRIENDS MONSTER](https://studyplayings.pages.dev/space-survival-rainbow-friends-monster.html)
- [KNIFE UP 3D](https://studyquests.github.io/knife-up-3d.html)
- [WILD WEST MATCH 3](https://themindplays.pages.dev/wild-west-match-3.html)
- [BURGER HERE](https://thequizzone.pages.dev/burger-here.html)
- [IDLE POP MERGE](https://themindzone.pages.dev/idle-pop-merge.html)
- [ENCHANTED MAHJONG SAGA](https://studyplayings.pages.dev/enchanted-mahjong-saga.html)
- [CATEGORY PUZZLE](https://learnquester.github.io/category-puzzle.html)
- [PURRFECT BAKERY](https://themindplays.pages.dev/purrfect-bakery.html)
- [ECO BLOCK PUZZLE](https://quizverses.github.io/eco-block-puzzle.html)
- [PIN BOARD PUZZLE](https://themindzone.pages.dev/pin-board-puzzle.html)
- [SURVIVAL ON RAFT MULTIPLAYER](https://quizverses.github.io/survival-on-raft-multiplayer.html)
- [SUMMER MAZE](https://studyplayings.pages.dev/summer-maze.html)
- [NUBIK IN THE MONSTER WORLD](https://thequizzone.pages.dev/nubik-in-the-monster-world.html)
- [SURVIVAL SWORD BATTLE](https://themindplays.pages.dev/survival-sword-battle.html)
- [ZOMBIE MONSTER SURVIVORS](https://themindplays.pages.dev/zombie-monster-survivors.html)
- [MALL ANOMALY](https://themindplays.pages.dev/mall-anomaly.html)
- [SWORD LIFE](https://quizverses-9d2f2.web.app/sword-life.html)
- [SANTA GO](https://themindplays.pages.dev/santa-go.html)
- [MYSTIC OBJECT HUNT](https://themindplays.pages.dev/mystic-object-hunt.html)
- [BIRD SORT CHALLENGES](https://themindplays.pages.dev/bird-sort-challenges.html)
- [CATEGORY QUIZ](https://thelearnquesters.pages.dev/category-quiz.html)
- [SPIDER SOLITAIRE](https://learnquester.pages.dev/spider-solitaire.html)
- [NUTS BOLTS WOOD PUZZLE GAME](https://studyquests.github.io/nuts-bolts-wood-puzzle-game.html)
- [KOKO LOCO BLOCK BLAST](https://quizverses.github.io/koko-loco-block-blast.html)
- [TICTOC BRAIDED HAIRSTYLES](https://themindplays.pages.dev/tictoc-braided-hairstyles.html)
- [THE GRENCH COUPLE HOLIDAY DRESS UP](https://studyplayings.pages.dev/the-grench-couple-holiday-dress-up.html)
- [BUTTERFLY KYODAI RAINBOW](https://theskillquest.pages.dev/butterfly-kyodai-rainbow.html)
- [SCHOOL TEACHER GAME SCHOOL DAY](https://learnquester.pages.dev/school-teacher-game-school-day.html)
- [2 PLAYER GAMES KIDS KITCHEN](https://quizverses.github.io/2-player-games-kids-kitchen.html)
- [CATEGORY ARENA255](https://learnquesters.pages.dev/category-arena255.html)
- [FUNNY FRUITS MERGE AND GATHER WATERMELON](https://theskillquest.pages.dev/funny-fruits-merge-and-gather-watermelon.html)
- [KAWAII FRIENDS TILES MATCHER](https://themindplays.pages.dev/kawaii-friends-tiles-matcher.html)
- [CATEGORY PUZZLE 10](https://thequizzone.pages.dev/category-puzzle-10.html)
- [CHILL CLICKER](https://themindzone.pages.dev/chill-clicker.html)
- [LABUBU AND TREASURES FUN ADVENTURE](https://thelearnquesters.pages.dev/labubu-and-treasures-fun-adventure.html)
- [MAHJONG ADVENTURE WORLD QUEST](https://studyplayings.pages.dev/mahjong-adventure-world-quest.html)
- [HERO WIZARD SAVE YOUR GIRLFRIEND](https://quizverses.github.io/hero-wizard-save-your-girlfriend.html)
- [HYPER WAVE CHALLENGE](https://themindplays.pages.dev/hyper-wave-challenge.html)
- [HOPNOVA](https://learnquesters.pages.dev/hopnova.html)
- [HIDE SEEK GO AND FIND](https://themindplays.pages.dev/hide-seek-go-and-find.html)
- [TRALALA CONNECT](https://theskillquest.pages.dev/tralala-connect.html)
- [JEWEL DRESS UP](https://themindplays.pages.dev/jewel-dress-up.html)
- [KNIFEIO](https://themindplays.pages.dev/knifeio.html)
- [BUBBLE SHOOTER LEGEND](https://thelearnquesters.pages.dev/bubble-shooter-legend.html)
- [FILL THE BOTTLE](https://themindplays.pages.dev/fill-the-bottle.html)
- [WORDMEISTER HD](https://learnquester.github.io/wordmeister-hd.html)
- [QUIZ 10 SECONDS MATH](https://thelearnquesters.pages.dev/quiz-10-seconds-math.html)
- [DOGE MATCH](https://quizverses.github.io/doge-match.html)
- [TANK STARS BATTLE ARENA](https://studyplayings.pages.dev/tank-stars-battle-arena.html)
- [CATEGORY FIGHTING](https://quizverses.github.io/category-fighting.html)
- [MAFIA SNIPER CRIME SHOOTING](https://quizverses-9d2f2.web.app/mafia-sniper-crime-shooting.html)
- [ZENITH RUSH](https://studyplayings.web.app/zenith-rush.html)
- [CATEGORY SURVIVAL365](https://quizverses-9d2f2.web.app/category-survival365.html)
- [HAPPY BUBBLES](https://themindzone.pages.dev/happy-bubbles.html)
- [DESTINATION BRAIN TEST](https://studyquesthub.web.app/destination-brain-test.html)
- [SAVE MY PET](https://quizverses-9d2f2.web.app/save-my-pet.html)
- [TREASURE SEEKER](https://quizverses-9d2f2.web.app/treasure-seeker.html)
- [CATEGORY STUNT128](https://studyquests.pages.dev/category-stunt128.html)
- [ITALIAN ANIMALS CREATE YOUR OWN BRAINROT](https://learnquesters.pages.dev/italian-animals-create-your-own-brainrot.html)
- [ROYAL JIGSAW](https://themindplays.pages.dev/royal-jigsaw.html)
