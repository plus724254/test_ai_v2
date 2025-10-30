# 遊戲 Bug 修復報告

## 修復的問題

### 1. ✅ 路由導航問題（scenes/scenes 雙層）
**問題描述**：
- 從城鎮進入商店時，URL 變成 `/scenes/scenes/shop.html`，導致 404 錯誤

**根本原因**：
- `goToScene()` 函數在 `game.js` 中總是添加 `scenes/` 前綴
- 但場景內部已經在 `scenes/` 文件夾中，導致路徑重複

**修復方案**：
- 修改 `game.js` 中的 `goToScene()` 函數
- 添加檢測邏輯判斷當前是否在 `scenes/` 文件夾內
- 根據位置決定是否添加路徑前綴

**修改文件**：`game.js` (第 226-244 行)

```javascript
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
```

---

### 2. ✅ 物品名稱顯示為 HTML 文字
**問題描述**：
- 角色背包、裝備欄位中的物品名稱顯示為 HTML 標籤

**根本原因**：
- `status.html` 中使用了 `innerText` 設置包含 HTML 標籤的內容
- `innerText` 會將 HTML 標籤作為純文本顯示而不是解析

**修復方案**：
- 將 `innerText` 改為 `innerHTML`
- 正確地解析和渲染 HTML 內容

**修改文件**：`status.html` (第 213-217 行)

```javascript
// 之前 (錯誤)：
document.getElementById('content').innerText = html;

// 之後 (正確)：
if (tab !== 'stats') {
    document.getElementById('content').innerHTML = html;
}
```

---

### 3. ✅ 開始遊戲後無反應
**問題描述**：
- 創建角色後點擊「開始冒險」沒有進入遊戲

**根本原因**：
- 缺少 `data.js` 的引用，導致 `STORY` 對象未定義
- 導航邏輯使用了 `goToScene()` 函數，但在初始化時可能有問題

**修復方案**：
- 在 `index.html` 中添加 `data.js` 的 `<script>` 標籤
- 改進 `startNewGame()` 函數的導航邏輯
- 使用直接的 `window.location.href` 而不是 `goToScene()`
- 添加錯誤處理和調試信息

**修改文件**：`index.html`
- 第 250 行：添加 `<script src="data.js"></script>`
- 第 360-389 行：重構 `startNewGame()` 函數

```javascript
// 改進的開始遊戲流程
function startNewGame() {
    // ... 驗證邏輯 ...

    // 套用職業確認後才保存
    saveGame();

    // 顯示故事並進入遊戲
    const classNames = {
        warrior: '戰士',
        mage: '法師',
        rogue: '盜賊',
        paladin: '聖騎'
    };

    const storyText = `...`;
    alert(storyText);

    // 導航到城鎮場景
    try {
        window.location.href = 'scenes/town.html';
    } catch(e) {
        console.error('導航失敗:', e);
        alert('進入遊戲失敗，請檢查文件路徑');
    }
}
```

---

## 所有修改總結

| 文件 | 修改行號 | 修改內容 |
|------|--------|--------|
| `game.js` | 226-244 | 修復路由導航邏輯 |
| `index.html` | 250 | 添加 data.js 引用 |
| `index.html` | 360-389 | 改進開始遊戲函數 |
| `status.html` | 128-152 | 修復 stats 標籤顯示 |
| `status.html` | 159-202 | 修復裝備和物品顯示 |
| `status.html` | 206-210 | 修復物品名稱提取 |
| `status.html` | 213-217 | 修復 innerHTML 使用 |

---

## 測試檢查清單

完成以下測試以確保修復成功：

- [x] 創建角色後成功進入遊戲
- [x] 場景間導航不會出現雙層路徑
- [x] 背包中物品名稱正確顯示
- [x] 裝備欄位顯示正確
- [x] 購買物品後能在背包中看到
- [x] 裝備物品後在裝備欄顯示正確

---

## 預防措施

為了防止未來出現類似問題：

1. **路由管理**
   - 確保路由函數正確判斷當前位置
   - 使用相對路徑時要小心

2. **HTML 渲染**
   - 區分 `innerText` 和 `innerHTML` 的使用場景
   - 當顯示包含 HTML 標籤的內容時使用 `innerHTML`
   - 當顯示純文本時使用 `innerText`

3. **依賴管理**
   - 確保所有必要的 JS 文件都被正確引入
   - 在使用全局對象前檢查它們是否已定義

4. **錯誤處理**
   - 添加 try-catch 塊捕獲潛在錯誤
   - 在瀏覽器控制台檢查错誤信息

---

**修復日期**：2025年10月30日
**修復者**：Claude Code AI
**狀態**：✅ 所有問題已修復
