// ===== 遊戲資料庫 =====

const ENEMIES = {
    goblin: { id: 'goblin', name: '哥布林', hp: 12, attack: 5, defense: 2, speed: 6, exp: 30, gold: 15 },
    orc: { id: 'orc', name: '獸人', hp: 25, attack: 8, defense: 4, speed: 5, exp: 80, gold: 40 },
    skeleton: { id: 'skeleton', name: '骷髏戰士', hp: 20, attack: 7, defense: 3, speed: 7, exp: 60, gold: 30 },
    wolf: { id: 'wolf', name: '灰狼', hp: 15, attack: 6, defense: 2, speed: 8, exp: 40, gold: 20 },
    spider: { id: 'spider', name: '巨蜘蛛', hp: 18, attack: 7, defense: 1, speed: 9, exp: 50, gold: 25 },
    goblinKing: { id: 'goblinKing', name: '哥布林國王', hp: 50, attack: 12, defense: 6, speed: 5, exp: 500, gold: 200 },
    darkKnight: { id: 'darkKnight', name: '暗黑騎士', hp: 60, attack: 15, defense: 8, speed: 6, exp: 800, gold: 400 },
    demon: { id: 'demon', name: '惡魔', hp: 80, attack: 18, defense: 10, speed: 8, exp: 1200, gold: 600 },
    dragonWyvern: { id: 'dragonWyvern', name: '龍翼獸', hp: 90, attack: 20, defense: 12, speed: 7, exp: 1500, gold: 800 },
    evilGod: { id: 'evilGod', name: '邪惡之神', hp: 150, attack: 25, defense: 15, speed: 9, exp: 3000, gold: 1500 }
};

const ITEMS = {
    potion: { id: 'potion', name: '紅色藥水', type: 'consumable', description: '恢復30HP' },
    mpPotion: { id: 'mpPotion', name: '藍色藥水', type: 'consumable', description: '恢復20MP' },
    fullPotion: { id: 'fullPotion', name: '滿狀態藥水', type: 'consumable', description: '完全恢復HP和MP', rarity: 'rare' },
    key: { id: 'key', name: '古老的鑰匙', type: 'quest', description: '打開神祕的門' },
    map: { id: 'map', name: '古代地圖', type: 'quest', description: '指向寶藏的位置' },
    scroll: { id: 'scroll', name: '魔法卷軸', type: 'consumable', description: '一次性攻擊技能' }
};

const WEAPONS = {
    ironSword: { id: 'ironSword', name: '鐵劍', attack: 5, rarity: 'common', price: 100 },
    steelSword: { id: 'steelSword', name: '鋼劍', attack: 10, rarity: 'uncommon', price: 300 },
    goldSword: { id: 'goldSword', name: '黃金劍', attack: 15, rarity: 'rare', price: 800 },
    demonBlade: { id: 'demonBlade', name: '惡魔刀', attack: 25, rarity: 'legendary', price: 2000 },
    mageStaff: { id: 'mageStaff', name: '魔法杖', attack: 8, rarity: 'uncommon', price: 400 },
    holyWand: { id: 'holyWand', name: '聖光杖', attack: 12, rarity: 'rare', price: 900 },
    shortBow: { id: 'shortBow', name: '短弓', attack: 7, rarity: 'common', price: 150 }
};

const ARMOR = {
    clothArmor: { id: 'clothArmor', name: '布甲', defense: 2, rarity: 'common', price: 50 },
    leatherArmor: { id: 'leatherArmor', name: '皮甲', defense: 4, rarity: 'common', price: 150 },
    chainMail: { id: 'chainMail', name: '鎖甲', defense: 7, rarity: 'uncommon', price: 400 },
    plateArmor: { id: 'plateArmor', name: '板甲', defense: 10, rarity: 'rare', price: 900 },
    mithrilArmor: { id: 'mithrilArmor', name: '秘銀甲', defense: 14, rarity: 'rare', price: 1500 },
    demonArmor: { id: 'demonArmor', name: '惡魔甲', defense: 20, rarity: 'legendary', price: 2500 }
};

// ===== 場景資料 =====
const SCENES = {
    start: {
        id: 'start',
        name: '遊戲開始',
        description: '歡迎來到復古RPG世界',
        exits: []
    },
    town: {
        id: 'town',
        name: '新手村',
        description: `
╔════════════════════╗
║   新手村 - 安全區   ║
╚════════════════════╝

一個寧靜的村莊，簡樸的木造房屋聚集在一起。
村民們過著平靜的生活，遠離危險。

【設施】
> 旅館 - 回復生命與魔力
> 商店 - 購買物品與裝備
> 冒險者公會 - 接受任務
> 森林邊界 - 前往冒險
        `,
        exits: [
            { name: '進入旅館', target: 'inn' },
            { name: '進入商店', target: 'shop' },
            { name: '進入公會', target: 'guild' },
            { name: '前往綠林', target: 'forest1' },
            { name: '查看狀態', target: 'status' }
        ]
    },
    inn: {
        id: 'inn',
        name: '旅館',
        description: `
╔════════════════════╗
║   旅館 - 休息之地   ║
╚════════════════════╝

溫暖的火爐，舒適的房間。
老闆娘微笑地迎接你。

【服務】
> 睡眠休息 - 100G (完全恢復)
> 簡餐 - 50G (恢復50HP)
        `,
        exits: [
            { name: '睡眠休息 (100G)', action: 'rest', cost: 100 },
            { name: '簡餐 (50G)', action: 'meal', cost: 50 },
            { name: '返回村莊', target: 'town' }
        ]
    },
    shop: {
        id: 'shop',
        name: '商店',
        description: `
╔════════════════════╗
║   商店 - 買賣物品   ║
╚════════════════════╝

琳瑯滿目的商品陳列在架上。
商人熱情地招呼你。

【販售】
> 紅色藥水 - 50G
> 藍色藥水 - 50G
> 鐵劍 - 100G
> 皮甲 - 150G
        `,
        exits: [
            { name: '購買物品', action: 'buy' },
            { name: '返回村莊', target: 'town' }
        ]
    },
    guild: {
        id: 'guild',
        name: '冒險者公會',
        description: `
╔════════════════════╗
║  冒險者公會 - 訊息  ║
╚════════════════════╝

牆上貼滿了各種任務委託。
酒吧角落傳來冒險者的談笑聲。

【可用任務】
> 清除哥布林 - 獎勵200G
> 狼群圍攻 - 獎勵250G
> 收集藥草 - 獎勵100G
        `,
        exits: [
            { name: '接受哥布林任務', action: 'quest', questId: 'goblins' },
            { name: '接受狼群任務', action: 'quest', questId: 'wolves' },
            { name: '返回村莊', target: 'town' }
        ]
    },
    forest1: {
        id: 'forest1',
        name: '綠林第一區',
        description: `
╔════════════════════╗
║   綠林 - 初級冒險    ║
╚════════════════════╝

鬱鬱蔥蔥的森林，陽光透過樹葉灑落。
傳來野獸的聲音。

【敵人】
> 哥布林 x2
> 灰狼 x1
        `,
        exits: [
            { name: '戰鬥', action: 'battle', enemies: ['goblin', 'goblin'] },
            { name: '前往森林深處', target: 'forest2' },
            { name: '返回村莊', target: 'town' }
        ],
        treasure: [{ item: 'potion', chance: 0.6 }, { gold: 30, chance: 1 }]
    },
    forest2: {
        id: 'forest2',
        name: '綠林第二區',
        description: `
╔════════════════════╗
║   綠林 - 深處森林    ║
╚════════════════════╝

森林變得更加密集，光線昏暗。
野生狼群成群結隊地奔跑。

【敵人】
> 灰狼 x3
> 骷髏戰士 x1

【路徑】
北: 黑暗森林
東: 山脈洞窟
        `,
        exits: [
            { name: '與狼群戰鬥', action: 'battle', enemies: ['wolf', 'wolf', 'wolf'] },
            { name: '前往黑暗森林', target: 'darkForest1' },
            { name: '前往山脈洞窟', target: 'cave1' },
            { name: '返回綠林', target: 'forest1' }
        ],
        treasure: [{ item: 'mpPotion', chance: 0.5 }, { gold: 50, chance: 1 }]
    },
    darkForest1: {
        id: 'darkForest1',
        name: '黑暗森林第一區',
        description: `
╔════════════════════╗
║  黑暗森林 - 危險區   ║
╚════════════════════╝

這裡被陰影籠罩，死寂的氛圍瀰漫。
巨蜘蛛的嘶鳴聲回蕩在林間。

【敵人】
> 巨蜘蛛 x2
> 骷髏戰士 x2
        `,
        exits: [
            { name: '戰鬥蜘蛛', action: 'battle', enemies: ['spider', 'spider'] },
            { name: '前往黑暗森林深處', target: 'darkForest2' },
            { name: '返回綠林', target: 'forest2' }
        ],
        treasure: [{ item: 'fullPotion', chance: 0.3 }, { gold: 100, chance: 1 }]
    },
    darkForest2: {
        id: 'darkForest2',
        name: '黑暗森林深處',
        description: `
╔════════════════════╗
║  黑暗森林 - 深處    ║
╚════════════════════╝

森林的氣息變得越來越壓抑。
哥布林國王正在此地修煉...
        `,
        exits: [
            { name: '挑戰哥布林國王', action: 'battle', enemies: ['goblinKing'] },
            { name: '返回', target: 'darkForest1' }
        ]
    },
    cave1: {
        id: 'cave1',
        name: '山脈洞窟',
        description: `
╔════════════════════╗
║   山脈洞窟 - 入口   ║
╚════════════════════╝

一個巨大的洞窟入口出現在眼前。
冷風從洞穴深處吹出來。

【敵人】
> 骷髏戰士 x2
> 骨龍 (BOSS)
        `,
        exits: [
            { name: '進入洞窟', action: 'battle', enemies: ['skeleton', 'skeleton'] },
            { name: '返回', target: 'forest2' }
        ]
    }
};

// ===== 任務資料 =====
const QUESTS = {
    goblins: { id: 'goblins', name: '清除哥布林', reward: 200, exp: 150 },
    wolves: { id: 'wolves', name: '狼群圍攻', reward: 250, exp: 200 },
    boss: { id: 'boss', name: '擊敗大魔王', reward: 5000, exp: 2000 }
};

// ===== 故事片段 =====
const STORY = {
    intro: `
歡迎來到魔幻世界！

很久很久以前，一個邪惡的魔王統治了這片大地。
他用黑暗的力量奴役所有生靈，掠奪他們的希望。

直到有一天，一位古老的預言提到：
「當光芒之子降臨，黑暗將被驅散。」

你，就是這位預言中的英雄。
你必須收集力量，越過危險的冒險，
最終與魔王一戰，拯救這個世界。

你的冒險，從現在開始...
    `,

    firstBattle: `
突然！
草叢中竄出兩隻哥布林！
牠們揮舞著木棒，發出怪異的叫聲。

「格格格！」

戰鬥開始！
    `,

    midJourney: `
隨著你的實力不斷提升，
你終於來到了世界的邊界。

黑暗森林的深處，
傳來一陣低沉而邪惡的聲音：

「呵呵呵...又有冒險者來了？」
    `
};
