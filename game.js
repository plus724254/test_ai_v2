// ===== 復古純文字RPG - 核心遊戲系統 =====

// 玩家數據存檔結構
const gameState = {
    // 玩家基本資訊
    player: {
        name: '',
        level: 1,
        exp: 0,
        expToLevel: 100,
        hp: 30,
        maxHp: 30,
        mp: 20,
        maxMp: 20,
        attack: 8,
        defense: 5,
        speed: 6,
        gold: 0
    },

    // 物品系統
    inventory: {
        items: [],
        weapons: [],
        armor: [],
        accessories: []
    },

    // 裝備中的物品
    equipped: {
        weapon: null,      // { id, name, attack }
        armor: null,       // { id, name, defense }
        accessory: null    // { id, name, bonus }
    },

    // 進度追蹤
    progress: {
        currentScene: 'start',
        visitedLocations: [],
        completedQuests: [],
        defeatedBosses: []
    }
};

// ===== 存檔管理 =====
function saveGame() {
    localStorage.setItem('textGameSave', JSON.stringify(gameState));
    console.log('遊戲已儲存');
}

function loadGame() {
    const saved = localStorage.getItem('textGameSave');
    if (saved) {
        Object.assign(gameState, JSON.parse(saved));
        console.log('遊戲已讀取');
        return true;
    }
    return false;
}

function deleteSave() {
    localStorage.removeItem('textGameSave');
    console.log('遊戲存檔已刪除');
}

function hasSave() {
    return localStorage.getItem('textGameSave') !== null;
}

// ===== 角色創建 =====
function createCharacter(name, classType) {
    gameState.player.name = name;

    // 基礎職業配置
    const classes = {
        warrior: { hp: 40, mp: 10, attack: 10, defense: 8, speed: 5 },
        mage: { hp: 20, mp: 40, attack: 6, defense: 3, speed: 7 },
        rogue: { hp: 25, mp: 15, attack: 9, defense: 4, speed: 9 },
        paladin: { hp: 35, mp: 25, attack: 8, defense: 9, speed: 6 }
    };

    const config = classes[classType] || classes.warrior;
    Object.assign(gameState.player, config);
    gameState.player.maxHp = gameState.player.hp;
    gameState.player.maxMp = gameState.player.mp;
}

// ===== 戰鬥系統 =====
function calculateDamage(attacker, defender) {
    const baseDamage = attacker.attack;
    const variance = Math.floor(Math.random() * 5) - 2;
    const defenseReduction = Math.floor(defender.defense / 2);
    const finalDamage = Math.max(1, baseDamage + variance - defenseReduction);
    return finalDamage;
}

function playerAttack(enemy) {
    const damage = calculateDamage(gameState.player, enemy);
    enemy.hp -= damage;
    return {
        success: true,
        damage: damage,
        message: `${gameState.player.name}攻擊，造成 ${damage} 傷害！`
    };
}

function enemyAttack(enemy) {
    const damage = calculateDamage(enemy, gameState.player);
    gameState.player.hp -= damage;
    return {
        success: true,
        damage: damage,
        message: `${enemy.name}攻擊，${gameState.player.name}受到 ${damage} 傷害！`
    };
}

function useSkill(skillName) {
    const skills = {
        slash: { mpCost: 0, multiplier: 1.5, name: '重斬' },
        fireball: { mpCost: 15, multiplier: 1.8, name: '火球術' },
        heal: { mpCost: 20, name: '治癒術' },
        backstab: { mpCost: 10, multiplier: 1.3, name: '背刺' }
    };

    const skill = skills[skillName];
    if (!skill) return { success: false, message: '技能不存在' };

    if (gameState.player.mp < skill.mpCost) {
        return { success: false, message: 'MP不足！' };
    }

    gameState.player.mp -= skill.mpCost;
    return { success: true, skill: skill };
}

function useItem(itemIndex) {
    const item = gameState.inventory.items[itemIndex];
    if (!item) return { success: false, message: '沒有該物品' };

    const itemEffects = {
        potion: { hp: 30, name: '紅色藥水' },
        mpPotion: { mp: 20, name: '藍色藥水' },
        fullPotion: { hp: 100, mp: 100, name: '滿狀態藥水' }
    };

    const effect = itemEffects[item.type];
    if (!effect) return { success: false, message: '未知物品' };

    if (effect.hp) gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + effect.hp);
    if (effect.mp) gameState.player.mp = Math.min(gameState.player.maxMp, gameState.player.mp + effect.mp);

    gameState.inventory.items.splice(itemIndex, 1);
    return { success: true, message: `使用了${effect.name}！` };
}

// ===== 升級系統 =====
function gainExp(amount) {
    gameState.player.exp += amount;

    while (gameState.player.exp >= gameState.player.expToLevel) {
        levelUp();
    }
}

function levelUp() {
    gameState.player.level += 1;
    gameState.player.exp -= gameState.player.expToLevel;

    // 屬性成長
    gameState.player.maxHp += 5;
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.maxMp += 3;
    gameState.player.mp = gameState.player.maxMp;
    gameState.player.attack += 2;
    gameState.player.defense += 1;

    // 下一級所需經驗
    gameState.player.expToLevel = Math.floor(gameState.player.expToLevel * 1.1);

    return `${gameState.player.name}升級到${gameState.player.level}級！`;
}

// ===== 物品管理 =====
function addItem(item) {
    gameState.inventory.items.push(item);
    return `獲得${item.name}`;
}

function addGold(amount) {
    gameState.player.gold += amount;
    return `獲得${amount}金幣`;
}

function equipWeapon(weaponId) {
    const weapon = gameState.inventory.weapons.find(w => w.id === weaponId);
    if (!weapon) return false;

    // 卸下舊武器
    if (gameState.equipped.weapon) {
        gameState.inventory.weapons.push(gameState.equipped.weapon);
    }

    gameState.equipped.weapon = weapon;
    gameState.inventory.weapons = gameState.inventory.weapons.filter(w => w.id !== weaponId);
    gameState.player.attack += weapon.attack;

    return true;
}

function equipArmor(armorId) {
    const armor = gameState.inventory.armor.find(a => a.id === armorId);
    if (!armor) return false;

    if (gameState.equipped.armor) {
        gameState.inventory.armor.push(gameState.equipped.armor);
    }

    gameState.equipped.armor = armor;
    gameState.inventory.armor = gameState.inventory.armor.filter(a => a.id !== armorId);
    gameState.player.defense += armor.defense;

    return true;
}

// ===== 場景導航 =====
function goToScene(sceneName) {
    gameState.progress.currentScene = sceneName;
    if (!gameState.progress.visitedLocations.includes(sceneName)) {
        gameState.progress.visitedLocations.push(sceneName);
    }
    saveGame();

    // 判斷當前是否在 scenes 文件夾內
    const currentPath = window.location.pathname;
    const isInScenes = currentPath.includes('/scenes/');

    if (isInScenes) {
        // 在 scenes 內部，直接訪問同級文件
        window.location.href = `${sceneName}.html`;
    } else {
        // 在根目錄，進入 scenes 文件夾
        window.location.href = `scenes/${sceneName}.html`;
    }
}

// ===== 工具函式 =====
function displayPlayerStats() {
    return `
角色：${gameState.player.name} | Lv.${gameState.player.level}
HP: ${gameState.player.hp}/${gameState.player.maxHp} | MP: ${gameState.player.mp}/${gameState.player.maxMp}
攻擊: ${gameState.player.attack} | 防禦: ${gameState.player.defense} | 速度: ${gameState.player.speed}
經驗: ${gameState.player.exp}/${gameState.player.expToLevel} | 金幣: ${gameState.player.gold}G
${gameState.equipped.weapon ? `武器: ${gameState.equipped.weapon.name}` : '武器: 空'}
${gameState.equipped.armor ? `防具: ${gameState.equipped.armor.name}` : '防具: 空'}
    `;
}

function isPlayerAlive() {
    return gameState.player.hp > 0;
}

function restoreHealth(amount) {
    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + amount);
}

function restoreMana(amount) {
    gameState.player.mp = Math.min(gameState.player.maxMp, gameState.player.mp + amount);
}

// 初始化遊戲
function initGame() {
    if (loadGame()) {
        console.log('載入存檔成功');
    } else {
        console.log('新遊戲');
    }
}
