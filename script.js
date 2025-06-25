// 当前选中的功能
let currentFunction = '智能成片';
let isWorkflowActive = false;
let workflowInstanceId = 0;
let activeWorkflows = new Map();

// 搜索框占位符配置
const placeholders = {
    '智能成片': '描述想制作的视频内容，AI将为您智能剪辑',
    '人设设计': '描述您想要的角色形象和特点',
    '爆款分析': '输入关键词分析热门趋势和爆款内容',
    '数字人视频': '描述数字人的外观和要说的内容'
};

// 卡片旋转映射
const cardRotations = {
    '智能成片': '',
    '人设设计': 'rotate-back',
    '爆款分析': 'rotate-left', 
    '数字人视频': 'rotate-right'
};

// 工作流内容定义
const workflowContent = {
    '智能成片': {
        title: '智能成片工作流',
        steps: [
            {
                title: '创作想法',
                content: '正在分析您的创作需求，理解视频主题和目标受众...'
            },
            {
                title: '理解分析', 
                content: '深度解析内容结构，识别关键信息点和情感表达...'
            },
            {
                title: '创意脚本',
                content: '基于分析结果生成创意脚本，优化叙事节奏和视觉效果...'
            },
            {
                title: '剪辑成片',
                content: '智能剪辑素材，添加转场效果，生成高质量视频作品...'
            }
        ]
    },
    '人设设计': {
        title: '人设设计工作流',
        steps: [
            {
                title: '角色定位',
                content: '正在分析目标用户群体，确定人设的核心特征和定位方向，包括年龄、性格、职业背景等关键要素...'
            },
            {
                title: '特征分析',
                content: '深入挖掘人设的独特性格特点，分析语言风格、行为习惯、价值观念，构建立体化的角色形象...'
            },
            {
                title: '形象塑造',
                content: '设计人设的视觉形象和表达方式，包括外观特征、穿着风格、表情动作，打造具有辨识度的角色形象...'
            },
            {
                title: '人设完善',
                content: '完善人设的背景故事和互动模式，优化角色的一致性和可信度，生成完整的人设档案...'
            }
        ]
    },
    '爆款分析': {
        title: '爆款分析工作流',
        steps: [
            {
                title: '数据收集',
                content: '正在收集热门内容数据，分析各平台的爆款视频特征，包括播放量、互动率、传播路径等关键指标...'
            },
            {
                title: '趋势识别',
                content: '识别当前热门趋势和流行元素，分析用户偏好变化，挖掘潜在的爆款因子和传播规律...'
            },
            {
                title: '策略制定',
                content: '基于分析结果制定内容策略，优化标题、封面、发布时机等关键要素，提升内容的爆款潜力...'
            },
            {
                title: '效果预测',
                content: '运用AI模型预测内容表现，评估爆款概率，提供优化建议和风险提示，助力内容精准投放...'
            }
        ]
    },
    '数字人视频': {
        title: '数字人视频工作流',
        steps: [
            {
                title: '形象生成',
                content: '正在创建数字人形象，设计面部特征、发型、服装等视觉元素，打造符合需求的虚拟主播形象...'
            },
            {
                title: '动作捕捉',
                content: '配置数字人的动作系统，包括面部表情、手势动作、身体姿态，确保自然流畅的表演效果...'
            },
            {
                title: '语音合成',
                content: '生成高质量的AI语音，调整语调、语速、情感表达，让数字人具备生动自然的语言能力...'
            },
            {
                title: '视频渲染',
                content: '渲染生成最终视频，优化画质和音效同步，添加背景和特效，输出专业级数字人视频作品...'
            }
        ]
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateSearchPlaceholder();
    addCardHoverEffects();
});

// 切换功能
function switchFunction(functionName) {
    // 更新当前功能
    currentFunction = functionName;
    
    // 更新选项卡状态
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-function="${functionName}"]`).classList.add('active');
    
    // 旋转3D卡片
    const card = document.getElementById('card3d');
    card.className = 'card-3d ' + (cardRotations[functionName] || '');
    
    // 更新搜索框占位符
    updateSearchPlaceholder();
    
    // 添加视觉反馈
    if (event && event.target) {
        addClickFeedback(event.target);
    }
    
    // 如果有活跃的工作流，可以选择关闭所有或保留
    // closeAllWorkflows(); // 可选：关闭所有现有工作流
}

// 更新搜索框占位符
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('searchInput');
    searchInput.placeholder = placeholders[currentFunction];
    
    // 添加打字机效果
    typewriterEffect(searchInput, placeholders[currentFunction]);
}

// 打字机效果
function typewriterEffect(element, text) {
    element.placeholder = '';
    let i = 0;
    const timer = setInterval(() => {
        element.placeholder += text.charAt(i);
        i++;
        if (i > text.length) {
            clearInterval(timer);
        }
    }, 50);
}

// 处理搜索
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        showNotification('请输入搜索内容', 'warning');
        return;
    }
    
    // 保存项目数据到localStorage
    const projectData = {
        title: query,
        type: currentFunction,
        timestamp: new Date().toISOString(),
        description: `基于"${query}"的${currentFunction}项目`
    };
    
    localStorage.setItem('currentProject', JSON.stringify(projectData));
    
    // 添加搜索动画效果
    addSearchAnimation();
    
    // 延迟跳转，让动画播放完成
    setTimeout(() => {
        // 跳转到第一个步骤页面
        window.location.href = 'step1-idea.html';
    }, 800);
}

// 智能成片处理
function handleSmartVideo(query) {
    showNotification(`正在为您生成"${query}"的智能成片...`, 'info');
    
    // 开始工作流处理
    startWorkflowProcess(query, '智能成片');
}

// 创建新的工作流实例
function createNewWorkflow(functionType = '智能成片', query = '') {
    workflowInstanceId++;
    const instanceId = `workflow-${workflowInstanceId}`;
    
    // 创建新的工作流容器
    const newWorkflowContainer = createWorkflowElement(instanceId, functionType, query);
    
    // 添加到主容器
    const mainContent = document.querySelector('.main-content');
    mainContent.appendChild(newWorkflowContainer);
    
    // 存储工作流实例
    activeWorkflows.set(instanceId, {
        functionType,
        query,
        element: newWorkflowContainer,
        completed: false
    });
    
    // 显示动画
    setTimeout(() => {
        newWorkflowContainer.style.opacity = '1';
        newWorkflowContainer.style.transform = 'translateY(0)';
    }, 100);
    
    isWorkflowActive = true;
    return instanceId;
}

// 创建工作流DOM元素
function createWorkflowElement(instanceId, functionType, query) {
    const titles = {
        '智能成片': '智能成片工作流',
        '人设设计': '人设设计工作流', 
        '爆款分析': '爆款分析工作流',
        '数字人视频': '数字人视频工作流'
    };
    
    const workflowContainer = document.createElement('div');
    workflowContainer.className = 'workflow-container';
    workflowContainer.id = instanceId;
    workflowContainer.style.opacity = '0';
    workflowContainer.style.transform = 'translateY(50px)';
    workflowContainer.style.transition = 'all 0.6s ease-out';
    workflowContainer.style.marginTop = '20px';
    
    workflowContainer.innerHTML = `
        <div class="workflow-header">
            <h2>${titles[functionType]} - "${query}"</h2>
            <button class="close-workflow" onclick="closeWorkflowInstance('${instanceId}')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <div class="workflow-steps" id="${instanceId}-steps">
            <!-- 步骤将动态生成 -->
        </div>
    `;
    
    return workflowContainer;
}

// 开始工作流处理
function startWorkflowProcess(query, functionType = '智能成片') {
    const instanceId = createNewWorkflow(functionType, query);
    
    // 延迟开始生成步骤，让容器先显示
    setTimeout(() => {
        generateStepsWithAnimation(instanceId, functionType);
    }, 800);
    
    return instanceId;
}

// 动态生成步骤并添加动画
function generateStepsWithAnimation(instanceId, functionType) {
    const stepsContainer = document.getElementById(`${instanceId}-steps`);
    const steps = workflowContent[functionType].steps;
    
    // 逐个生成步骤
    steps.forEach((step, index) => {
        setTimeout(() => {
            createStepElement(stepsContainer, index + 1, step, instanceId);
        }, index * 500); // 每个步骤间隔500ms生成
    });
    
    // 开始处理第一个步骤
    setTimeout(() => {
        processStepInInstance(instanceId, 1, functionType);
    }, steps.length * 500 + 500);
}

// 创建单个步骤元素
function createStepElement(container, stepNumber, stepData, instanceId) {
    const stepElement = document.createElement('div');
    stepElement.className = 'step-item';
    stepElement.setAttribute('data-step', stepNumber);
    stepElement.setAttribute('data-instance', instanceId);
    stepElement.style.opacity = '0';
    stepElement.style.transform = 'translateX(-50px)';
    stepElement.style.transition = 'all 0.5s ease-out';
    
    stepElement.innerHTML = `
        <div class="step-header">
            <div class="step-number">${stepNumber}</div>
            <div class="step-title">${stepData.title}</div>
            <div class="step-status">待处理</div>
        </div>
        <div class="step-content">
            <div class="ai-text" id="${instanceId}-step${stepNumber}Text"></div>
        </div>
    `;
    
    container.appendChild(stepElement);
    
    // 显示动画
    setTimeout(() => {
        stepElement.style.opacity = '1';
        stepElement.style.transform = 'translateX(0)';
    }, 100);
}

// 处理工作流实例中的单个步骤
function processStepInInstance(instanceId, stepNumber, functionType) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"][data-instance="${instanceId}"]`);
    if (!stepElement) return;
    
    const statusElement = stepElement.querySelector('.step-status');
    const textElement = stepElement.querySelector('.ai-text');
    
    // 设置为活跃状态
    stepElement.classList.add('active');
    statusElement.textContent = '处理中';
    
    // 添加脉动动画
    stepElement.style.animation = 'pulse 1.5s infinite';
    
    // 模拟处理延迟
    setTimeout(() => {
        // 开始逐字显示文本
        const content = workflowContent[functionType].steps[stepNumber - 1].content;
        typewriterText(textElement, content, () => {
            // 文本显示完成后，标记为完成状态
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            stepElement.style.animation = '';
            statusElement.textContent = '已完成';
            
            // 添加完成动画
            stepElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                stepElement.style.transform = 'scale(1)';
            }, 200);
            
            // 如果不是最后一步，继续下一步
            if (stepNumber < 4) {
                setTimeout(() => {
                    processStepInInstance(instanceId, stepNumber + 1, functionType);
                }, 800);
            } else {
                // 所有步骤完成
                const workflow = activeWorkflows.get(instanceId);
                if (workflow) {
                    workflow.completed = true;
                }
                
                const completionMessages = {
                    '智能成片': '智能成片生成完成！',
                    '人设设计': '角色设计完成！',
                    '爆款分析': '趋势分析报告已生成！',
                    '数字人视频': '数字人视频生成完成！'
                };
                
                setTimeout(() => {
                    showNotification(completionMessages[functionType], 'success');
                    addCompletionAnimation(instanceId);
                }, 1000);
            }
        });
    }, 1200);
}

// 添加完成动画
function addCompletionAnimation(instanceId) {
    const workflowElement = document.getElementById(instanceId);
    if (workflowElement) {
        workflowElement.style.border = '2px solid #48bb78';
        workflowElement.style.boxShadow = '0 0 20px rgba(72, 187, 120, 0.3)';
        
        // 添加成功标识
        const header = workflowElement.querySelector('.workflow-header h2');
        header.innerHTML += ' <span style="color: #48bb78; font-size: 1.2rem;">✓</span>';
    }
}

// 关闭特定工作流实例
function closeWorkflowInstance(instanceId) {
    const workflowElement = document.getElementById(instanceId);
    if (workflowElement) {
        // 添加关闭动画
        workflowElement.style.transform = 'translateY(-50px)';
        workflowElement.style.opacity = '0';
        
        setTimeout(() => {
            workflowElement.remove();
            activeWorkflows.delete(instanceId);
            
            // 如果没有活跃的工作流，更新状态
            if (activeWorkflows.size === 0) {
                isWorkflowActive = false;
            }
        }, 600);
    }
}

// 关闭所有工作流
function closeAllWorkflows() {
    activeWorkflows.forEach((workflow, instanceId) => {
        closeWorkflowInstance(instanceId);
    });
}

// 人设设计处理
function handleCharacterDesign(query) {
    showNotification(`正在为您设计"${query}"的人设...`, 'info');
    
    // 开始工作流处理
    startWorkflowProcess(query, '人设设计');
}

// 爆款分析处理
function handleTrendAnalysis(query) {
    showNotification(`正在分析"${query}"的爆款趋势...`, 'info');
    
    // 开始工作流处理
    startWorkflowProcess(query, '爆款分析');
}

// 数字人视频处理
function handleDigitalHuman(query) {
    showNotification(`正在为您生成"${query}"的数字人视频...`, 'info');
    
    // 开始工作流处理
    startWorkflowProcess(query, '数字人视频');
}

// 逐字显示文本效果
function typewriterText(element, text, callback) {
    element.textContent = '';
    let i = 0;
    
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) callback();
        }
    }, 30); // 30ms间隔，可以调整速度
}



// 显示用户信息
function showUserInfo() {
    document.getElementById('userModal').style.display = 'block';
    addModalAnimation('userModal');
}

// 显示视频库
function showVideoGallery() {
    document.getElementById('videoModal').style.display = 'block';
    addModalAnimation('videoModal');
}

// 关闭弹窗
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = '';
    }, 300);
}

// 点击外部关闭弹窗
window.onclick = function(event) {
    const userModal = document.getElementById('userModal');
    const videoModal = document.getElementById('videoModal');
    
    if (event.target === userModal) {
        closeModal('userModal');
    }
    if (event.target === videoModal) {
        closeModal('videoModal');
    }
}

// 添加卡片悬停效果
function addCardHoverEffects() {
    const card = document.getElementById('card3d');
    
    card.addEventListener('mouseenter', function() {
        this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
        this.classList.remove('card-hover');
    });
}

// 添加点击反馈
function addClickFeedback(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

// 添加搜索动画
function addSearchAnimation() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.style.transform = 'scale(0.9) rotate(360deg)';
    setTimeout(() => {
        searchBtn.style.transform = '';
    }, 300);
}

// 添加弹窗动画
function addModalAnimation(modalId) {
    const modal = document.getElementById(modalId);
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlideIn 0.3s ease-out';
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // 根据类型设置背景色
    const colors = {
        'info': 'linear-gradient(45deg, #667eea, #764ba2)',
        'success': 'linear-gradient(45deg, #48bb78, #38a169)',
        'warning': 'linear-gradient(45deg, #ed8936, #dd6b20)',
        'error': 'linear-gradient(45deg, #f56565, #e53e3e)'
    };
    notification.style.background = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 键盘事件处理
document.addEventListener('keydown', function(event) {
    // 回车键搜索
    if (event.key === 'Enter' && document.activeElement.id === 'searchInput') {
        handleSearch();
    }
    
    // ESC键关闭弹窗和工作流
    if (event.key === 'Escape') {
        closeModal('userModal');
        closeModal('videoModal');
        if (isWorkflowActive) {
            closeAllWorkflows();
        }
    }
    
    // 数字键快速切换功能
    const functionKeys = {
        '1': '智能成片',
        '2': '人设设计', 
        '3': '爆款分析',
        '4': '数字人视频'
    };
    
    if (functionKeys[event.key]) {
        switchFunction(functionKeys[event.key]);
    }
});

// 添加额外的CSS动画
const additionalStyles = `
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .search-input:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
    }
    
    .tab {
        user-select: none;
    }
    
    .card-3d {
        user-select: none;
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 页面加载完成后的初始化动画
window.addEventListener('load', function() {
    // 延迟显示各个元素
    const elements = ['.card-container', '.function-tabs', '.search-container'];
    elements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
});