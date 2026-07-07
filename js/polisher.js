/**
 * AI润色功能核心模块
 * 支持多种润色风格：专业正式、简洁精炼、生动活泼、温柔亲和、逻辑清晰、口语化
 * 复用扣子Coze API，通过Prompt指令区分翻译和润色功能
 */

/* ==================== 润色风格配置 ==================== */
const POLISH_STYLES = {
    professional: {
        name: '专业正式',
        icon: '👔',
        description: '商务、学术风格，用词严谨规范',
        prompt: '请将以下文本润色为专业正式的风格，适合商务或学术场景。要求：用词严谨、表达规范、逻辑清晰、语气得体。只输出润色后的文本，不要解释。'
    },
    concise: {
        name: '简洁精炼',
        icon: '✂️',
        description: '去掉冗余，更加简明扼要',
        prompt: '请将以下文本润色为简洁精炼的风格。要求：删除冗余内容，保留核心信息，语句简短有力，不啰嗦。只输出润色后的文本，不要解释。'
    },
    vivid: {
        name: '生动活泼',
        icon: '🎨',
        description: '更有感染力、趣味性和表现力',
        prompt: '请将以下文本润色为生动活泼的风格。要求：使用形象的比喻、恰当的修辞，让文字更有画面感和感染力，读起来生动有趣。只输出润色后的文本，不要解释。'
    },
    warm: {
        name: '温柔亲和',
        icon: '🌸',
        description: '更友好、温暖、有亲和力',
        prompt: '请将以下文本润色为温柔亲和的风格。要求：语气温暖友善，用词柔和体贴，给人如沐春风的感觉，拉近与读者的距离。只输出润色后的文本，不要解释。'
    },
    logical: {
        name: '逻辑清晰',
        icon: '🧠',
        description: '优化结构，更有条理性',
        prompt: '请将以下文本润色为逻辑清晰的风格。要求：优化文本结构，理清层次关系，使用恰当的连接词，让表达更加有条理、有说服力。只输出润色后的文本，不要解释。'
    },
    colloquial: {
        name: '口语化',
        icon: '💬',
        description: '更自然，像日常对话一样',
        prompt: '请将以下文本润色为口语化的风格。要求：像日常聊天一样自然流畅，避免书面语的生硬感，使用通俗易懂的表达，让人感觉亲切自然。只输出润色后的文本，不要解释。'
    }
};

/* ==================== AI润色器主类 ==================== */
class AIPolisher {
    constructor() {
        // DOM 元素缓存
        this.polishText = document.getElementById('polishText');
        this.polishStyle = document.getElementById('polishStyle');
        this.polishBtn = document.getElementById('polishBtn');
        this.polishClearBtn = document.getElementById('polishClearBtn');
        this.polishResultArea = document.getElementById('polishResultArea');
        this.polishCharCount = document.getElementById('polishCharCount');
        this.polishCopyBtn = document.getElementById('polishCopyBtn');
        this.polishRedoBtn = document.getElementById('polishRedoBtn');

        // 扣子API配置（使用润色专用Bot）
        this.COZE_CONFIG = {
            apiKey: 'pat_cJG3jgqZQQc6G3Jkvg4oSvUOnVcB9qxYAIRInjkiOxZHlGWGFxcXAV8qdN7kavvj',
            botId: '7659704340340965416',
            apiUrl: 'https://api.coze.cn/v3/chat'
        };

        this.maxLength = 5000;
        this.isPolishing = false;
        this.lastPolishText = '';
        this.lastPolishStyle = '';

        this.init();
    }

    /* ---------- 初始化 ---------- */
    init() {
        this.bindEvents();
        this.updateCharCount();
        this.renderStyleOptions();
    }

    /* ---------- 渲染风格选项 ---------- */
    renderStyleOptions() {
        if (!this.polishStyle) return;

        this.polishStyle.innerHTML = '';
        Object.entries(POLISH_STYLES).forEach(([key, style]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${style.icon} ${style.name}`;
            option.title = style.description;
            this.polishStyle.appendChild(option);
        });
    }

    /* ---------- 事件绑定 ---------- */
    bindEvents() {
        // 润色按钮
        if (this.polishBtn) {
            this.polishBtn.addEventListener('click', () => this.polish());
        }

        // 输入框事件
        if (this.polishText) {
            this.polishText.addEventListener('input', () => this.updateCharCount());
            this.polishText.addEventListener('keydown', (e) => {
                // Ctrl+Shift+Enter 触发润色
                if (e.key === 'Enter' && e.ctrlKey && e.shiftKey) {
                    e.preventDefault();
                    this.polish();
                }
            });
        }

        // 清空按钮
        if (this.polishClearBtn) {
            this.polishClearBtn.addEventListener('click', () => this.clearAll());
        }

        // 复制结果按钮
        if (this.polishCopyBtn) {
            this.polishCopyBtn.addEventListener('click', () => this.copyResult());
        }

        // 重新润色按钮
        if (this.polishRedoBtn) {
            this.polishRedoBtn.addEventListener('click', () => this.redoPolish());
        }

        // 风格选择变化时显示描述
        if (this.polishStyle) {
            this.polishStyle.addEventListener('change', () => this.updateStyleDescription());
        }
    }

    /* ==================== 字数统计 ==================== */
    updateCharCount() {
        if (!this.polishText || !this.polishCharCount) return;
        const count = this.polishText.value.length;
        this.polishCharCount.textContent = `${count} / ${this.maxLength}`;
        this.polishCharCount.style.color = count > this.maxLength * 0.9
            ? 'var(--error-red)' : 'var(--text-muted)';
    }

    /* ==================== 更新风格描述 ==================== */
    updateStyleDescription() {
        const styleDesc = document.getElementById('styleDescription');
        if (!styleDesc || !this.polishStyle) return;

        const selectedStyle = POLISH_STYLES[this.polishStyle.value];
        if (selectedStyle) {
            styleDesc.textContent = selectedStyle.description;
            styleDesc.style.display = 'block';
        } else {
            styleDesc.style.display = 'none';
        }
    }

    /* ==================== 核心润色功能 ==================== */
    async polish() {
        if (this.isPolishing) return;

        const text = this.polishText?.value?.trim();
        if (!text) {
            Toast.warning('请输入需要润色的文本');
            this.polishText?.focus();
            return;
        }

        const styleKey = this.polishStyle?.value || 'professional';
        const style = POLISH_STYLES[styleKey];
        if (!style) {
            Toast.error('请选择润色风格');
            return;
        }

        // 保存当前状态用于重新润色
        this.lastPolishText = text;
        this.lastPolishStyle = styleKey;

        this.isPolishing = true;
        this.showLoading();

        try {
            const polishedText = await this.callCozeAPI(text, style.prompt);
            this.showResult(polishedText);

            // 记录到历史
            if (window.translator && typeof window.translator.addHistory === 'function') {
                const displayText = text.length > 100 ? text.substring(0, 100) + '...' : text;
                const displayResult = polishedText.length > 100 ? polishedText.substring(0, 100) + '...' : polishedText;
                window.translator.addHistory(displayText, displayResult, null, styleKey, 'polish');
            }

            Toast.success('润色完成');
        } catch (err) {
            console.error('润色错误:', err);
            Toast.error('润色失败，请重试');
            this.showError('润色请求失败，请检查网络连接后重试');
        } finally {
            this.isPolishing = false;
            this.hideLoading();
        }
    }

    /* ==================== 调用扣子API ==================== */
    async callCozeAPI(text, stylePrompt) {
        const fullPrompt = `${stylePrompt}\n\n原文：${text}`;

        const response = await fetch(this.COZE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.COZE_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_id: this.COZE_CONFIG.botId,
                user_id: 'user_polish_' + Date.now(),
                stream: true,
                additional_messages: [{
                    role: 'user',
                    content: fullPrompt,
                    content_type: 'text'
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // 读取 SSE 流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let result = '';
        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (value) {
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || !trimmed.startsWith('data:')) continue;

                    const jsonStr = trimmed.substring(5).trim();
                    if (jsonStr === '[DONE]') break;

                    try {
                        const eventData = JSON.parse(jsonStr);

                        if (eventData.role === 'assistant' && eventData.type === 'answer' && eventData.content) {
                            if (eventData.created_at) {
                                result = eventData.content;
                            } else {
                                result += eventData.content;
                            }
                        }
                    } catch (e) {
                        // 忽略解析失败
                    }
                }
            }
        }

        if (result && result.trim()) {
            return result.trim();
        }

        // SSE 未获取到结果，降级到轮询
        return await this._pollForResult(fullPrompt);
    }

    /* ==================== 降级轮询方案 ==================== */
    async _pollForResult(prompt) {
        const response = await fetch(this.COZE_CONFIG.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.COZE_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bot_id: this.COZE_CONFIG.botId,
                user_id: 'user_polish_' + Date.now(),
                stream: false,
                additional_messages: [{
                    role: 'user',
                    content: prompt,
                    content_type: 'text'
                }]
            })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.code !== 0) throw new Error(data.msg || 'API返回错误');

        const chatId = data.data?.id;
        const conversationId = data.data?.conversation_id;
        if (!chatId || !conversationId) throw new Error('未获取到会话ID');

        let attempts = 0;
        const maxAttempts = 30;

        while (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            attempts++;

            const statusRes = await fetch(
                `https://api.coze.cn/v3/chat/retrieve?chat_id=${chatId}&conversation_id=${conversationId}`,
                { headers: { 'Authorization': `Bearer ${this.COZE_CONFIG.apiKey}` } }
            );

            if (!statusRes.ok) continue;
            const statusData = await statusRes.json();
            const status = statusData?.data?.status;

            if (status === 'requires_action') {
                throw new Error('润色服务需要人工介入');
            }

            if (status === 'in_progress' || status === 'created' || status === 'queued') {
                continue;
            }

            if (status === 'failed') {
                throw new Error('润色请求失败');
            }

            if (status === 'completed' || status === 'completed_but_need_confirm') {
                const msgRes = await fetch(
                    `https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.COZE_CONFIG.apiKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            chat_id: chatId,
                            conversation_id: conversationId
                        })
                    }
                );
                if (msgRes.ok) {
                    const msgData = await msgRes.json();
                    if (msgData.code === 0 && msgData.data) {
                        const assistant = msgData.data.find(m =>
                            m.role === 'assistant' && (m.type === 'answer' || m.type === 'verbose')
                        );
                        if (assistant?.content) return assistant.content;

                        const anyAssistant = msgData.data.find(m =>
                            m.role === 'assistant' && m.content
                        );
                        if (anyAssistant?.content) return anyAssistant.content;
                    }
                }
                break;
            }
        }

        throw new Error('润色超时，请重试');
    }

    /* ==================== 从翻译结果导入 ==================== */
    importFromTranslation(text) {
        if (!this.polishText) return;
        this.polishText.value = text;
        this.updateCharCount();

        // 滚动到润色区域
        const polishSection = document.getElementById('polish');
        if (polishSection) {
            polishSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 自动触发润色
        setTimeout(() => this.polish(), 500);
    }

    /* ==================== 重新润色 ==================== */
    redoPolish() {
        if (this.lastPolishText && this.lastPolishStyle) {
            this.polishText.value = this.lastPolishText;
            this.polishStyle.value = this.lastPolishStyle;
            this.updateCharCount();
            this.polish();
        } else {
            Toast.warning('没有可重新润色的内容');
        }
    }

    /* ==================== 清空所有 ==================== */
    clearAll() {
        if (this.polishText) {
            this.polishText.value = '';
            this.updateCharCount();
        }
        if (this.polishResultArea) {
            this.polishResultArea.innerHTML = `
                <div class="polish-result-placeholder">
                    <p>✨</p>
                    <p>润色结果将在这里显示</p>
                </div>
            `;
        }
        // 隐藏操作按钮
        const actions = document.getElementById('polishActions');
        if (actions) {
            actions.style.display = 'none';
        }
        this.lastPolishText = '';
        this.lastPolishStyle = '';
        Toast.info('已清空');
    }

    /* ==================== 复制结果 ==================== */
    copyResult() {
        const resultText = this.polishResultArea?.querySelector('.polish-result-text');
        if (!resultText) {
            Toast.warning('没有可复制的润色结果');
            return;
        }

        const text = resultText.textContent;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                Toast.success('已复制到剪贴板');
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            Toast.success('已复制到剪贴板');
        } catch {
            Toast.error('复制失败，请手动复制');
        }
        document.body.removeChild(ta);
    }

    /* ==================== 显示加载状态 ==================== */
    showLoading() {
        if (!this.polishResultArea) return;
        this.polishResultArea.innerHTML = `
            <div class="polish-loading">
                <div class="loading-spinner"></div>
                <div class="loading-text">AI正在润色...</div>
                <div class="loading-hint">请稍候，正在为您优化文本</div>
            </div>
        `;
        if (this.polishBtn) {
            this.polishBtn.disabled = true;
            this.polishBtn.innerHTML = '⏳ 润色中...';
        }
    }

    hideLoading() {
        if (this.polishBtn) {
            this.polishBtn.disabled = false;
            this.polishBtn.innerHTML = '✨ 开始润色';
        }
    }

    /* ==================== 显示润色结果 ==================== */
    async showResult(text) {
        if (!this.polishResultArea) return;

        const styleKey = this.polishStyle?.value || 'professional';
        const style = POLISH_STYLES[styleKey];

        this.polishResultArea.innerHTML = `
            <div class="polish-result-header">
                <span class="polish-result-style">${style?.icon || '✨'} ${style?.name || '润色'}风格</span>
            </div>
            <div class="polish-result-content"></div>
        `;

        const contentArea = this.polishResultArea.querySelector('.polish-result-content');

        // 使用打字机效果显示结果
        if (typeof TypewriterEffect !== 'undefined') {
            await TypewriterEffect.type(contentArea, text, 25);
        } else {
            contentArea.innerHTML = `<div class="polish-result-text">${this.escapeHtml(text)}</div>`;
        }

        // 显示操作按钮
        const actions = document.getElementById('polishActions');
        if (actions) {
            actions.style.display = 'flex';
        }
    }

    /* ==================== 显示错误 ==================== */
    showError(message) {
        if (!this.polishResultArea) return;
        this.polishResultArea.innerHTML = `
            <div class="polish-error">
                <div class="polish-error-icon">⚠️</div>
                <div class="polish-error-message">${message}</div>
            </div>
        `;
    }

    /* ---------- 工具方法 ---------- */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

/* ==================== 页面初始化 ==================== */
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保翻译器先加载
    setTimeout(() => {
        const polisher = new AIPolisher();
        window.polisher = polisher;

        // 绑定翻译结果区域的"润色这段文字"按钮
        const polishFromTranslationBtn = document.getElementById('polishFromTranslationBtn');
        if (polishFromTranslationBtn) {
            polishFromTranslationBtn.addEventListener('click', () => {
                const resultArea = document.getElementById('resultArea');
                const resultText = resultArea?.querySelector('.result-text') || resultArea?.querySelector('.result-typing-area span');
                if (resultText && resultText.textContent.trim()) {
                    polisher.importFromTranslation(resultText.textContent.trim());
                } else {
                    Toast.warning('请先翻译文本');
                }
            });
        }
    }, 100);
});
