// 全局变量
let tasks = {
    daily: [],
    longTerm: []
};

let achievements = [];
let rewards = [];
let crystals = 0;
let completedTasks = 0;
let todayCompletedTasks = 0;
let todayCrystals = 0;
let lastSettlementDate = '';
let checkIns = [];
let streakCount = 0;
let childGender = '';

// DOM元素
const elements = {
    // 导航
    navBtns: document.querySelectorAll('.nav-btn'),
    sections: document.querySelectorAll('.section'),
    
    // 任务管理
    taskTabs: document.querySelectorAll('.tab-btn'),
    taskLists: document.querySelectorAll('.task-list'),
    addTaskBtn: document.getElementById('add-task-btn'),
    addTaskModal: document.getElementById('add-task-modal'),
    addTaskForm: document.getElementById('add-task-form'),
    cancelTaskBtn: document.getElementById('cancel-task-btn'),
    
    // 成就系统
    addAchievementBtn: document.getElementById('add-achievement-btn'),
    addAchievementModal: document.getElementById('add-achievement-modal'),
    addAchievementForm: document.getElementById('add-achievement-form'),
    cancelAchievementBtn: document.getElementById('cancel-achievement-btn'),
    
    // 奖品兑换
    addRewardBtn: document.getElementById('add-reward-btn'),
    addRewardModal: document.getElementById('add-reward-modal'),
    addRewardForm: document.getElementById('add-reward-form'),
    cancelRewardBtn: document.getElementById('cancel-reward-btn'),
    
    // 兑换确认
    exchangeModal: document.getElementById('exchange-modal'),
    cancelExchangeBtn: document.getElementById('cancel-exchange-btn'),
    confirmExchangeBtn: document.getElementById('confirm-exchange-btn'),
    
    // 提示
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    
    // 结算
    manualSettlementBtn: document.getElementById('manual-settlement-btn'),
    todayCompletedTasksEl: document.getElementById('today-completed-tasks'),
    todayCrystalsEl: document.getElementById('today-crystals'),
    totalCompletedTasksEl: document.getElementById('total-completed-tasks'),
    totalCrystalsEl: document.getElementById('total-crystals'),
    
    // 晶石计数
    crystalCountEl: document.getElementById('crystal-count')
};

// 初始化
function init() {
    loadData();
    setupEventListeners();
    renderTasks();
    renderAchievements();
    renderRewards();
    updateCounters();
    checkDailySettlement();
    
    // 设置每日结算定时器
    setInterval(checkDailySettlement, 60000); // 每分钟检查一次
}

// 加载数据
function loadData() {
    const savedTasks = localStorage.getItem('tasks');
    const savedAchievements = localStorage.getItem('achievements');
    const savedRewards = localStorage.getItem('rewards');
    const savedCrystals = localStorage.getItem('crystals');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    const savedTodayCompletedTasks = localStorage.getItem('todayCompletedTasks');
    const savedTodayCrystals = localStorage.getItem('todayCrystals');
    const savedLastSettlementDate = localStorage.getItem('lastSettlementDate');
    const savedCheckIns = localStorage.getItem('checkIns');
    const savedStreakCount = localStorage.getItem('streakCount');
    const savedChildGender = localStorage.getItem('childGender');
    
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedAchievements) achievements = JSON.parse(savedAchievements);
    if (savedRewards) rewards = JSON.parse(savedRewards);
    if (savedCrystals) crystals = parseInt(savedCrystals);
    if (savedCompletedTasks) completedTasks = parseInt(savedCompletedTasks);
    if (savedTodayCompletedTasks) todayCompletedTasks = parseInt(savedTodayCompletedTasks);
    if (savedTodayCrystals) todayCrystals = parseInt(savedTodayCrystals);
    if (savedLastSettlementDate) lastSettlementDate = savedLastSettlementDate;
    if (savedCheckIns) checkIns = JSON.parse(savedCheckIns);
    if (savedStreakCount) streakCount = parseInt(savedStreakCount);
    if (savedChildGender) childGender = savedChildGender;
}

// 保存数据
function saveData() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('rewards', JSON.stringify(rewards));
    localStorage.setItem('crystals', crystals.toString());
    localStorage.setItem('completedTasks', completedTasks.toString());
    localStorage.setItem('todayCompletedTasks', todayCompletedTasks.toString());
    localStorage.setItem('todayCrystals', todayCrystals.toString());
    localStorage.setItem('lastSettlementDate', lastSettlementDate);
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
    localStorage.setItem('streakCount', streakCount.toString());
    localStorage.setItem('childGender', childGender);
}

// 设置事件监听器
function setupEventListeners() {
    // 导航切换
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            elements.navBtns.forEach(b => b.classList.remove('active'));
            elements.sections.forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(section).classList.add('active');
        });
    });
    
    // 任务标签切换
    elements.taskTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            elements.taskTabs.forEach(t => t.classList.remove('active'));
            elements.taskLists.forEach(l => l.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabType}-tasks`).classList.add('active');
        });
    });
    
    // 添加任务
    elements.addTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.add('show');
    });
    
    elements.cancelTaskBtn.addEventListener('click', () => {
        elements.addTaskModal.classList.remove('show');
        elements.addTaskForm.reset();
    });
    
    elements.addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('task-name').value;
        const type = document.getElementById('task-type').value;
        const reward = parseInt(document.getElementById('task-reward').value);
        const description = document.getElementById('task-description').value;
        
        addTask(name, type, reward, description);
        elements.addTaskModal.classList.remove('show');
        elements.addTaskForm.reset();
        showToast('任务添加成功！');
    });
    
    // 添加成就
    elements.addAchievementBtn.addEventListener('click', () => {
        elements.addAchievementModal.classList.add('show');
    });
    
    elements.cancelAchievementBtn.addEventListener('click', () => {
        elements.addAchievementModal.classList.remove('show');
        elements.addAchievementForm.reset();
    });
    
    elements.addAchievementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('achievement-name').value;
        const reward = parseInt(document.getElementById('achievement-reward').value);
        const description = document.getElementById('achievement-description').value;
        
        addAchievement(name, reward, description);
        elements.addAchievementModal.classList.remove('show');
        elements.addAchievementForm.reset();
        showToast('成就添加成功！');
    });
    
    // 添加奖品
    elements.addRewardBtn.addEventListener('click', () => {
        elements.addRewardModal.classList.add('show');
    });
    
    elements.cancelRewardBtn.addEventListener('click', () => {
        elements.addRewardModal.classList.remove('show');
        elements.addRewardForm.reset();
    });
    
    elements.addRewardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reward-name').value;
        const cost = parseInt(document.getElementById('reward-cost').value);
        const description = document.getElementById('reward-description').value;
        
        addReward(name, cost, description);
        elements.addRewardModal.classList.remove('show');
        elements.addRewardForm.reset();
        showToast('奖品添加成功！');
    });
    
    // 兑换确认
    elements.cancelExchangeBtn.addEventListener('click', () => {
        elements.exchangeModal.classList.remove('show');
    });
    
    // 手动结算
    elements.manualSettlementBtn.addEventListener('click', () => {
        performSettlement();
        showToast('手动结算完成！');
    });
}

// 显示提示
function showToast(message, isError = false) {
    elements.toastMessage.textContent = message;
    elements.toast.className = 'toast show';
    if (isError) {
        elements.toast.classList.add('error');
    }
    
    setTimeout(() => {
        elements.toast.classList.remove('show', 'error');
    }, 3000);
}

// 添加任务
function addTask(name, type, reward, description) {
    const task = {
        id: Date.now().toString(),
        name,
        type: type === 'daily' ? 'daily' : 'longTerm',
        reward,
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    if (type === 'daily') {
        tasks.daily.push(task);
    } else {
        tasks.longTerm.push(task);
    }
    
    saveData();
    renderTasks();
}

// 完成任务
function completeTask(taskId, type) {
    let task;
    let taskItem;
    
    if (type === 'daily') {
        task = tasks.daily.find(t => t.id === taskId);
        taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"][data-task-type="daily"]`);
    } else {
        task = tasks.longTerm.find(t => t.id === taskId);
        taskItem = document.querySelector(`.task-item[data-task-id="${taskId}"][data-task-type="longTerm"]`);
    }
    
    if (task && !task.completed && taskItem) {
        // 添加完成动画
        taskItem.style.animation = 'complete 0.5s ease-in-out';
        
        // 创建火花效果
        createSparkleEffect(taskItem);
        
        // 延迟更新数据，等待动画完成
        setTimeout(() => {
            task.completed = true;
            crystals += task.reward;
            completedTasks++;
            todayCompletedTasks++;
            todayCrystals += task.reward;
            
            saveData();
            renderTasks();
            updateCounters();
            showToast(`任务完成！获得 ${task.reward} 晶石`);
            
            // 检查是否完成所有每日任务，如果是则自动打卡
            if (type === 'daily') {
                checkAndHandleDailyCheckIn();
            }
        }, 500);
    }
}

// 删除任务
function deleteTask(taskId, type) {
    if (type === 'daily') {
        tasks.daily = tasks.daily.filter(t => t.id !== taskId);
    } else {
        tasks.longTerm = tasks.longTerm.filter(t => t.id !== taskId);
    }
    
    saveData();
    renderTasks();
    showToast('任务已删除');
}

// 渲染任务
function renderTasks() {
    // 渲染每日任务
    const dailyTasksEl = document.getElementById('daily-tasks');
    if (tasks.daily.length === 0) {
        dailyTasksEl.innerHTML = '<div class="empty-state"><p>还没有每日任务，点击添加按钮创建吧！</p></div>';
    } else {
        dailyTasksEl.innerHTML = tasks.daily.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" data-task-type="daily">
                <div class="task-info">
                    <h3>${task.name}</h3>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    <span class="task-reward ${task.reward >= 0 ? 'positive' : 'negative'}">
                        ${task.reward >= 0 ? '+' : ''}${task.reward} 晶石
                    </span>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `
                        <button class="task-btn complete-btn">完成</button>
                    ` : ''}
                    <button class="task-btn delete-btn">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    // 渲染长期任务
    const longTermTasksEl = document.getElementById('long-term-tasks');
    if (tasks.longTerm.length === 0) {
        longTermTasksEl.innerHTML = '<div class="empty-state"><p>还没有长期任务，点击添加按钮创建吧！</p></div>';
    } else {
        longTermTasksEl.innerHTML = tasks.longTerm.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}" data-task-type="longTerm">
                <div class="task-info">
                    <h3>${task.name}</h3>
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    <span class="task-reward ${task.reward >= 0 ? 'positive' : 'negative'}">
                        ${task.reward >= 0 ? '+' : ''}${task.reward} 晶石
                    </span>
                </div>
                <div class="task-actions">
                    ${!task.completed ? `
                        <button class="task-btn complete-btn">完成</button>
                    ` : ''}
                    <button class="task-btn delete-btn">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    // 添加事件监听器
    addTaskEventListeners();
}

// 添加任务事件监听器
function addTaskEventListeners() {
    // 为所有任务项添加事件委托
    const taskLists = document.querySelectorAll('.task-list');
    taskLists.forEach(list => {
        list.addEventListener('click', (e) => {
            const target = e.target;
            
            // 处理完成任务
            if (target.classList.contains('complete-btn')) {
                const taskItem = target.closest('.task-item');
                if (taskItem) {
                    const taskId = taskItem.dataset.taskId;
                    const taskType = taskItem.dataset.taskType;
                    completeTask(taskId, taskType);
                }
            }
            
            // 处理删除任务
            if (target.classList.contains('delete-btn')) {
                const taskItem = target.closest('.task-item');
                if (taskItem) {
                    const taskId = taskItem.dataset.taskId;
                    const taskType = taskItem.dataset.taskType;
                    deleteTask(taskId, taskType);
                }
            }
        });
    });
}

// 添加成就
function addAchievement(name, reward, description) {
    const achievement = {
        id: Date.now().toString(),
        name,
        reward,
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    achievements.push(achievement);
    saveData();
    renderAchievements();
}

// 创建火花效果
function createSparkleEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 创建5个火花
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.backgroundColor = '#ffd700';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkle 0.8s ease-out';
        
        // 随机方向
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;
        
        sparkle.style.transform = `translate(${translateX}px, ${translateY}px)`;
        
        document.body.appendChild(sparkle);
        
        // 动画结束后移除
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }
}

// 完成成就
function completeAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    const achievementItem = document.querySelector(`.achievement-item[data-achievement-id="${achievementId}"]`);
    
    if (achievement && !achievement.completed && achievementItem) {
        // 添加完成动画
        achievementItem.style.animation = 'complete 0.5s ease-in-out';
        
        // 创建火花效果
        createSparkleEffect(achievementItem);
        
        // 延迟更新数据，等待动画完成
        setTimeout(() => {
            achievement.completed = true;
            crystals += achievement.reward;
            todayCrystals += achievement.reward;
            
            saveData();
            renderAchievements();
            updateCounters();
            showToast(`成就达成！获得 ${achievement.reward} 晶石`);
        }, 500);
    }
}

// 删除成就
function deleteAchievement(achievementId) {
    achievements = achievements.filter(a => a.id !== achievementId);
    saveData();
    renderAchievements();
    showToast('成就已删除');
}

// 渲染成就
function renderAchievements() {
    const achievementsEl = document.getElementById('achievement-list');
    if (achievements.length === 0) {
        achievementsEl.innerHTML = '<div class="empty-state"><p>还没有成就，点击添加按钮创建吧！</p></div>';
    } else {
        achievementsEl.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.completed ? 'completed' : ''}" data-achievement-id="${achievement.id}">
                <h3>${achievement.name}</h3>
                ${achievement.description ? `<p>${achievement.description}</p>` : ''}
                <div class="achievement-reward">+${achievement.reward} 晶石</div>
                <div class="task-actions">
                    ${!achievement.completed ? `
                        <button class="task-btn complete-btn">达成</button>
                    ` : ''}
                    <button class="task-btn delete-btn">删除</button>
                </div>
            </div>
        `).join('');
    }
    
    // 添加成就事件监听器
    addAchievementEventListeners();
}

// 添加成就事件监听器
function addAchievementEventListeners() {
    const achievementsEl = document.getElementById('achievement-list');
    if (achievementsEl) {
        achievementsEl.addEventListener('click', (e) => {
            const target = e.target;
            
            // 处理完成成就
            if (target.classList.contains('complete-btn')) {
                const achievementItem = target.closest('.achievement-item');
                if (achievementItem) {
                    const achievementId = achievementItem.dataset.achievementId;
                    completeAchievement(achievementId);
                }
            }
            
            // 处理删除成就
            if (target.classList.contains('delete-btn')) {
                const achievementItem = target.closest('.achievement-item');
                if (achievementItem) {
                    const achievementId = achievementItem.dataset.achievementId;
                    deleteAchievement(achievementId);
                }
            }
        });
    }
}

// 添加奖品
function addReward(name, cost, description) {
    const reward = {
        id: Date.now().toString(),
        name,
        cost,
        description,
        createdAt: new Date().toISOString()
    };
    
    rewards.push(reward);
    saveData();
    renderRewards();
}

// 兑换奖品
function exchangeReward(rewardId) {
    const reward = rewards.find(r => r.id === rewardId);
    
    if (reward) {
        if (crystals >= reward.cost) {
            elements.exchangeModal.classList.add('show');
            document.getElementById('exchange-message').textContent = `确定要兑换 ${reward.name} 吗？需要 ${reward.cost} 晶石`;
            
            elements.confirmExchangeBtn.onclick = () => {
                crystals -= reward.cost;
                saveData();
                renderRewards();
                updateCounters();
                elements.exchangeModal.classList.remove('show');
                showToast(`兑换成功！获得 ${reward.name}`);
            };
        } else {
            showToast('晶石不足，无法兑换', true);
        }
    }
}

// 删除奖品
function deleteReward(rewardId) {
    rewards = rewards.filter(r => r.id !== rewardId);
    saveData();
    renderRewards();
    showToast('奖品已删除');
}

// 渲染奖品
function renderRewards() {
    const rewardsEl = document.getElementById('reward-list');
    if (rewards.length === 0) {
        rewardsEl.innerHTML = '<div class="empty-state"><p>还没有奖品，点击添加按钮创建吧！</p></div>';
    } else {
        rewardsEl.innerHTML = rewards.map(reward => `
            <div class="reward-item" data-reward-id="${reward.id}">
                <h3>${reward.name}</h3>
                ${reward.description ? `<p>${reward.description}</p>` : ''}
                <div class="reward-cost">${reward.cost} 晶石</div>
                <button class="exchange-btn ${crystals >= reward.cost ? '' : 'disabled'}">
                    兑换
                </button>
                <button class="task-btn delete-btn">删除</button>
            </div>
        `).join('');
    }
    
    // 添加奖品事件监听器
    addRewardEventListeners();
}

// 添加奖品事件监听器
function addRewardEventListeners() {
    const rewardsEl = document.getElementById('reward-list');
    if (rewardsEl) {
        rewardsEl.addEventListener('click', (e) => {
            const target = e.target;
            
            // 处理兑换奖品
            if (target.classList.contains('exchange-btn') && !target.classList.contains('disabled')) {
                const rewardItem = target.closest('.reward-item');
                if (rewardItem) {
                    const rewardId = rewardItem.dataset.rewardId;
                    exchangeReward(rewardId);
                }
            }
            
            // 处理删除奖品
            if (target.classList.contains('delete-btn')) {
                const rewardItem = target.closest('.reward-item');
                if (rewardItem) {
                    const rewardId = rewardItem.dataset.rewardId;
                    deleteReward(rewardId);
                }
            }
        });
    }
}

// 更新计数器
function updateCounters() {
    elements.crystalCountEl.textContent = crystals;
    document.getElementById('today-completed-tasks').textContent = todayCompletedTasks;
    document.getElementById('today-crystals').textContent = todayCrystals;
    document.getElementById('total-completed-tasks').textContent = completedTasks;
    document.getElementById('total-crystals').textContent = crystals;
}

// 检查每日结算
function checkDailySettlement() {
    const today = new Date().toDateString();
    
    if (lastSettlementDate !== today) {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // 每天晚上8点自动结算
        if (hours === 20 && minutes === 0) {
            performSettlement();
        }
    }
}

// 执行每日结算
function performSettlement() {
    const today = new Date().toDateString();
    lastSettlementDate = today;
    
    // 添加结算动画
    const settlementInfo = document.querySelector('.settlement-info');
    if (settlementInfo) {
        settlementInfo.style.animation = 'settlement 1s ease-in-out';
    }
    
    // 延迟更新数据，等待动画完成
    setTimeout(() => {
        // 重置每日任务
        tasks.daily.forEach(task => {
            task.completed = false;
        });
        
        // 重置每日统计
        todayCompletedTasks = 0;
        todayCrystals = 0;
        
        saveData();
        renderTasks();
        updateCounters();
        showToast('每日结算完成！');
    }, 1000);
}

// AI助手功能
function setupAIAssistant() {
    // AI功能切换
    const aiFeatureBtns = document.querySelectorAll('.ai-feature-btn');
    const aiFeatureContents = document.querySelectorAll('.ai-feature-content');
    
    aiFeatureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.dataset.feature;
            
            // 更新按钮状态
            aiFeatureBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新内容显示
            aiFeatureContents.forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(feature).style.display = 'block';
        });
    });
    
    // 任务奖励计算器表单提交
    const rewardCalculatorForm = document.getElementById('reward-calculator-form');
    if (rewardCalculatorForm) {
        rewardCalculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const taskName = document.getElementById('task-name-input').value;
            const difficulty = document.getElementById('task-difficulty').value;
            const taskType = document.getElementById('task-type-input').value;
            const description = document.getElementById('task-description-input').value;
            
            const recommendedReward = calculateRecommendedReward(difficulty, taskType);
            displayRewardResult(taskName, difficulty, taskType, recommendedReward);
        });
    }
    
    // 奖品价值转换器表单提交
    const prizeConverterForm = document.getElementById('prize-converter-form');
    if (prizeConverterForm) {
        prizeConverterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const prizeName = document.getElementById('prize-name-input').value;
            const prizeValue = parseInt(document.getElementById('prize-value-input').value);
            const description = document.getElementById('prize-description-input').value;
            
            const requiredCrystals = convertPrizeValueToCrystals(prizeValue);
            displayPrizeResult(prizeName, prizeValue, requiredCrystals);
        });
    }
}

// 计算推荐的任务奖励
function calculateRecommendedReward(difficulty, taskType) {
    // 基础奖励值
    const baseRewards = {
        easy: 5,
        medium: 10,
        hard: 20,
        'very-hard': 30
    };
    
    // 任务类型倍数
    const typeMultipliers = {
        daily: 1,
        'long-term': 2
    };
    
    const baseReward = baseRewards[difficulty] || 10;
    const multiplier = typeMultipliers[taskType] || 1;
    
    return Math.round(baseReward * multiplier);
}

// 将奖品价值转换为晶石数量
function convertPrizeValueToCrystals(prizeValue) {
    // 设定汇率：1元人民币 = 10晶石
    // 这个汇率可以根据实际情况调整
    const exchangeRate = 10;
    return prizeValue * exchangeRate;
}

// 显示任务奖励计算结果
function displayRewardResult(taskName, difficulty, taskType, recommendedReward) {
    const resultEl = document.getElementById('reward-result');
    
    // 难度和类型的中文映射
    const difficultyMap = {
        easy: '简单',
        medium: '中等',
        hard: '困难',
        'very-hard': '非常困难'
    };
    
    const typeMap = {
        daily: '每日任务',
        'long-term': '长期任务'
    };
    
    resultEl.innerHTML = `
        <h4>推荐奖励结果</h4>
        <p><strong>任务名称：</strong>${taskName}</p>
        <p><strong>任务难度：</strong>${difficultyMap[difficulty]}</p>
        <p><strong>任务类型：</strong>${typeMap[taskType]}</p>
        <div class="recommended-value">${recommendedReward} 晶石</div>
        <p class="explanation">
            根据任务的难度和类型，我们推荐的奖励是 ${recommendedReward} 晶石。
            这个奖励值考虑了任务的挑战性和完成所需的时间精力。
        </p>
    `;
    
    resultEl.classList.add('show');
}

// 显示奖品价值转换结果
function displayPrizeResult(prizeName, prizeValue, requiredCrystals) {
    const resultEl = document.getElementById('prize-result');
    
    resultEl.innerHTML = `
        <h4>晶石需求计算结果</h4>
        <p><strong>奖品名称：</strong>${prizeName}</p>
        <p><strong>奖品价值：</strong>${prizeValue} 元人民币</p>
        <div class="recommended-value">${requiredCrystals} 晶石</div>
        <p class="explanation">
            根据奖品的实际价值，我们建议设置 ${requiredCrystals} 晶石的兑换价格。
            这个计算基于 1元人民币 = 10晶石 的兑换率。
        </p>
    `;
    
    resultEl.classList.add('show');
}

// 生成日历
function generateCalendar() {
    const calendarEl = document.getElementById('check-in-calendar');
    if (!calendarEl) return;
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 获取当月第一天是星期几
    const firstDay = new Date(year, month, 1).getDay();
    // 获取当月的天数
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    calendarEl.innerHTML = '';
    
    // 添加上个月的空白日期
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarEl.appendChild(emptyDay);
    }
    
    // 添加当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        const dateStr = new Date(year, month, day).toDateString();
        const isToday = dateStr === now.toDateString();
        const isCheckedIn = checkIns.includes(dateStr);
        
        if (isToday) {
            dayEl.classList.add('today');
        }
        
        if (isCheckedIn) {
            dayEl.classList.add('checked-in');
        }
        
        calendarEl.appendChild(dayEl);
    }
}

// 检查是否完成所有每日任务
function checkAllDailyTasksCompleted() {
    if (tasks.daily.length === 0) return false;
    return tasks.daily.every(task => task.completed);
}

// 处理打卡
function handleCheckIn() {
    const today = new Date().toDateString();
    
    if (!checkIns.includes(today) && checkAllDailyTasksCompleted()) {
        checkIns.push(today);
        calculateStreakCount();
        saveData();
        generateCalendar();
        updateStreakDisplay();
        showToast('打卡成功！');
    }
}

// 计算连续打卡天数
function calculateStreakCount() {
    if (checkIns.length === 0) {
        streakCount = 0;
        return;
    }
    
    // 对打卡日期进行排序
    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(b) - new Date(a));
    
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const checkInDate of sortedCheckIns) {
        const checkIn = new Date(checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        
        // 计算日期差（天数）
        const diffTime = Math.abs(currentDate - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === currentStreak) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    streakCount = currentStreak;
}

// 更新连续打卡天数显示
function updateStreakDisplay() {
    const streakCountEl = document.getElementById('streak-count');
    const sparkEffectEl = document.getElementById('spark-effect');
    
    if (streakCountEl) {
        streakCountEl.textContent = streakCount;
    }
    
    if (sparkEffectEl) {
        if (streakCount >= 3) {
            sparkEffectEl.style.display = 'block';
        } else {
            sparkEffectEl.style.display = 'none';
        }
    }
}

// 检查并处理每日打卡
function checkAndHandleDailyCheckIn() {
    if (checkAllDailyTasksCompleted()) {
        handleCheckIn();
    }
}

// 设置界面功能
function setupSettings() {
    // 性别选择
    const genderBtns = document.querySelectorAll('.gender-btn');
    const appContainer = document.querySelector('.app-container');
    
    genderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const gender = btn.dataset.gender;
            childGender = gender;
            
            // 更新按钮状态
            genderBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新主题
            updateTheme();
            saveData();
            showToast(`已切换到${gender === 'boy' ? '男孩' : '女孩'}版`);
        });
    });
    
    // 背景音乐切换
    const musicToggle = document.getElementById('music-toggle');
    const musicStatus = document.getElementById('music-status');
    
    if (musicToggle && musicStatus) {
        musicToggle.addEventListener('change', () => {
            const isChecked = musicToggle.checked;
            musicStatus.textContent = isChecked ? '开启' : '关闭';
            showToast(`背景音乐已${isChecked ? '开启' : '关闭'}`);
        });
    }
}

// 更新主题
function updateTheme() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;
    
    // 移除所有主题类
    appContainer.classList.remove('boy-theme', 'girl-theme');
    
    // 添加当前主题类
    if (childGender === 'boy') {
        appContainer.classList.add('boy-theme');
    } else if (childGender === 'girl') {
        appContainer.classList.add('girl-theme');
    }
}

// 显示性别选择弹窗
function showGenderPopup() {
    if (!childGender) {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        popup.style.display = 'flex';
        popup.style.alignItems = 'center';
        popup.style.justifyContent = 'center';
        popup.style.zIndex = '1000';
        
        popup.innerHTML = `
            <div style="background-color: white; padding: 30px; border-radius: 20px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
                <h2 style="color: #54a0ff; margin-bottom: 20px;">👶 欢迎使用育儿小助手</h2>
                <p style="margin-bottom: 30px; font-size: 16px;">请选择您孩子的性别，我们将为您推荐合适的界面风格</p>
                <div style="display: flex; gap: 20px; justify-content: center;">
                    <button style="padding: 15px 30px; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; background-color: #e3f2fd; color: #1976d2; cursor: pointer; transition: all 0.3s ease;">男孩</button>
                    <button style="padding: 15px 30px; border: none; border-radius: 12px; font-size: 16px; font-weight: bold; background-color: #fce4ec; color: #c2185b; cursor: pointer; transition: all 0.3s ease;">女孩</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // 添加按钮点击事件
        const buttons = popup.querySelectorAll('button');
        buttons[0].addEventListener('click', () => {
            childGender = 'boy';
            updateTheme();
            saveData();
            popup.remove();
        });
        
        buttons[1].addEventListener('click', () => {
            childGender = 'girl';
            updateTheme();
            saveData();
            popup.remove();
        });
    }
}

// 初始化应用
init();

// 设置AI助手
setupAIAssistant();

// 设置设置界面
setupSettings();

// 生成日历
setTimeout(() => {
    generateCalendar();
    updateStreakDisplay();
    
    // 显示性别选择弹窗
    showGenderPopup();
    
    // 更新主题
    updateTheme();
}, 100);

// 模拟数据（用于测试）
if (tasks.daily.length === 0 && tasks.longTerm.length === 0 && achievements.length === 0 && rewards.length === 0) {
    // 添加示例任务
    addTask('完成作业', 'daily', 10, '认真完成老师布置的作业');
    addTask('帮忙做家务', 'daily', 15, '帮助爸爸妈妈做一些力所能及的家务');
    addTask('按时睡觉', 'daily', 8, '晚上9点前上床睡觉');
    addTask('早起', 'daily', 5, '早上7点前起床');
    addTask('学会骑自行车', 'longTerm', 50, '学会独立骑自行车');
    addTask('读完一本书', 'longTerm', 30, '读完一整本课外书');
    
    // 添加示例成就
    addAchievement('连续7天完成所有任务', 100, '连续7天完成所有每日任务');
    addAchievement('累计获得500晶石', 200, '累计获得500晶石');
    addAchievement('完成10个长期任务', 150, '完成10个长期任务');
    
    // 添加示例奖品
    addReward('玩具车', 50, '一辆漂亮的玩具车');
    addReward('漫画书', 30, '一本有趣的漫画书');
    addReward('冰淇淋', 10, '一个美味的冰淇淋');
    addReward('游乐园门票', 200, '一张游乐园门票');
    
    // 初始晶石
    crystals = 100;
    saveData();
    updateCounters();
}