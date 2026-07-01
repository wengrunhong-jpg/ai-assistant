/**
 * 翻译工具核心功能
 * 模拟翻译API调用，展示交互效果
 * 支持7种语言互译、翻译历史、深色模式、Toast通知等
 */

/* ==================== 语言配置 ==================== */
const LANGUAGES = {
    zh: { name: '中文', flag: '🇨🇳' },
    en: { name: '英语', flag: '🇬🇧' },
    ja: { name: '日语', flag: '🇯🇵' },
    ko: { name: '韩语', flag: '🇰🇷' },
    fr: { name: '法语', flag: '🇫🇷' },
    de: { name: '德语', flag: '🇩🇪' },
    es: { name: '西班牙语', flag: '🇪🇸' }
};

/* ==================== 模拟翻译词典 ==================== */
const DICTIONARIES = {
    'zh-en': {
        '你好': 'Hello', '世界': 'World', '翻译': 'Translation',
        '助手': 'Assistant', '语言': 'Language', '学习': 'Study',
        '欢迎': 'Welcome', '使用': 'Use', '实时': 'Real-time',
        '智能': 'Smart', '你好世界': 'Hello World',
        '今天天气很好': 'The weather is nice today',
        '我爱你': 'I love you', '谢谢': 'Thank you',
        '早上好': 'Good morning', '晚安': 'Good night',
        '请帮我翻译这段话': 'Please help me translate this passage'
    },
    'en-zh': {
        'hello': '你好', 'world': '世界', 'translation': '翻译',
        'assistant': '助手', 'language': '语言', 'study': '学习',
        'welcome': '欢迎', 'use': '使用', 'real-time': '实时',
        'smart': '智能', 'hello world': '你好世界',
        'good morning': '早上好', 'good night': '晚安',
        'thank you': '谢谢', 'i love you': '我爱你',
        'how are you': '你好吗', 'nice to meet you': '很高兴认识你'
    },
    'zh-ja': {
        '你好': 'こんにちは', '世界': '世界', '翻译': '翻訳',
        '助手': 'アシスタント', '语言': '言語', '学习': '学習',
        '欢迎': 'ようこそ', '谢谢': 'ありがとう',
        '早上好': 'おはようございます', '晚安': 'おやすみなさい'
    },
    'ja-zh': {
        'こんにちは': '你好', '世界': '世界', '翻訳': '翻译',
        'ありがとう': '谢谢', 'おはよう': '早上好',
        'さようなら': '再见', 'すみません': '对不起'
    },
    'zh-ko': {
        '你好': '안녕하세요', '世界': '세계', '翻译': '번역',
        '助手': '도우미', '谢谢': '감사합니다',
        '早上好': '좋은 아침이에요', '晚安': '잘 자요'
    },
    'ko-zh': {
        '안녕하세요': '你好', '세계': '世界', '번역': '翻译',
        '감사합니다': '谢谢', '사랑해요': '我爱你'
    },
    'zh-fr': {
        '你好': 'Bonjour', '世界': 'Monde', '翻译': 'Traduction',
        '谢谢': 'Merci', '早上好': 'Bonjour', '晚安': 'Bonne nuit'
    },
    'fr-zh': {
        'bonjour': '你好', 'monde': '世界', 'traduction': '翻译',
        'merci': '谢谢', 'au revoir': '再见'
    },
    'zh-de': {
        '你好': 'Hallo', '世界': 'Welt', '翻译': 'Übersetzung',
        '谢谢': 'Danke', '早上好': 'Guten Morgen', '晚安': 'Gute Nacht'
    },
    'de-zh': {
        'hallo': '你好', 'welt': '世界', 'übersetzung': '翻译',
        'danke': '谢谢', 'guten morgen': '早上好'
    },
    'zh-es': {
        '你好': 'Hola', '世界': 'Mundo', '翻译': 'Traducción',
        '谢谢': 'Gracias', '早上好': 'Buenos días', '晚安': 'Buenas noches'
    },
    'es-zh': {
        'hola': '你好', 'mundo': '世界', 'traducción': '翻译',
        'gracias': '谢谢', 'adiós': '再见'
    },
    'en-ja': {
        'hello': 'こんにちは', 'world': '世界', 'thank you': 'ありがとう',
        'good morning': 'おはようございます'
    },
    'en-ko': {
        'hello': '안녕하세요', 'world': '세계', 'thank you': '감사합니다'
    },
    'en-fr': {
        'hello': 'Bonjour', 'world': 'Monde', 'thank you': 'Merci'
    },
    'en-de': {
        'hello': 'Hallo', 'world': 'Welt', 'thank you': 'Danke'
    },
    'en-es': {
        'hello': 'Hola', 'world': 'Mundo', 'thank you': 'Gracias'
    }
};

/* ==================== 模拟翻译回复模板 ==================== */
const MOCK_RESPONSES = {
    'zh-en': '[Translated to English] ',
    'en-zh': '[翻译成中文] ',
    'zh-ja': '[日本語に翻訳] ',
    'ja-zh': '[中文翻訳] ',
    'zh-ko': '[한국어로 번역] ',
    'ko-zh': '[中文翻译] ',
    'zh-fr': '[Traduit en français] ',
    'fr-zh': '[翻译成中文] ',
    'zh-de': '[Ins Deutsche übersetzt] ',
    'de-zh': '[翻译成中文] ',
    'zh-es': '[Traducido al español] ',
    'es-zh': '[翻译成中文] ',
    'en-ja': '[Japanese Translation] ',
    'ja-en': '[English Translation] ',
    'en-ko': '[Korean Translation] ',
    'ko-en': '[English Translation] ',
    'en-fr': '[French Translation] ',
    'fr-en': '[English Translation] ',
    'en-de': '[German Translation] ',
    'de-en': '[English Translation] ',
    'en-es': '[Spanish Translation] ',
    'es-en': '[English Translation] ',
    'ja-ko': '[韓国語に翻訳] ',
    'ko-ja': '[日本語に翻訳] ',
    'fr-de': '[Ins Deutsche übersetzt] ',
    'de-fr': '[Traduit en français] ',
    'ja-fr': '[Traduit en français] ',
    'fr-ja': '[日本語に翻訳] '
};

/* ==================== 翻译器主类 ==================== */
class Translator {
    constructor() {
        // DOM 元素缓存
        this.sourceText = document.getElementById('sourceText');
        this.sourceLang = document.getElementById('sourceLang');
        this.targetLang = document.getElementById('targetLang');
        this.translateBtn = document.getElementById('translateBtn');
        this.swapBtn = document.getElementById('swapBtn');
        this.resultArea = document.getElementById('resultArea');
        this.charCount = document.getElementById('charCount');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.historyList = document.getElementById('historyList');
        this.historyClearBtn = document.getElementById('historyClearBtn');
        this.historyCount = document.getElementById('historyCount');
        this.themeToggle = document.getElementById('themeToggle');
        this.headerTime = document.getElementById('headerTime');

        this.maxLength = 5000;
        this.isTranslating = false;
        this.history = this.loadHistory();

        this.init();
    }

    /* ---------- 初始化 ---------- */
    init() {
        this.bindEvents();
        this.updateCharCount();
        this.renderHistory();
        this.initTheme();
        this.startClock();
    }

    /* ---------- 事件绑定 ---------- */
    bindEvents() {
        // 翻译按钮
        if (this.translateBtn) {
            this.translateBtn.addEventListener('click', () => this.translate());
        }

        // 语言交换
        if (this.swapBtn) {
            this.swapBtn.addEventListener('click', () => this.swapLanguages());
        }

        // 输入框事件
        if (this.sourceText) {
            this.sourceText.addEventListener('input', () => this.updateCharCount());
            this.sourceText.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    this.translate();
                }
            });
        }

        // 清空按钮
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearAll());
        }

        // 复制结果按钮
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', () => this.copyResult());
        }

        // 清空历史
        if (this.historyClearBtn) {
            this.historyClearBtn.addEventListener('click', () => this.clearHistory());
        }

        // 深色模式切换
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    /* ==================== 字数统计 ==================== */
    updateCharCount() {
        if (!this.sourceText || !this.charCount) return;
        const count = this.sourceText.value.length;
        this.charCount.textContent = `${count} / ${this.maxLength}`;
        this.charCount.style.color = count > this.maxLength * 0.9
            ? 'var(--error-red)' : 'var(--text-muted)';
    }

    /* ==================== 语言交换 ==================== */
    swapLanguages() {
        if (!this.sourceLang || !this.targetLang) return;

        const srcVal = this.sourceLang.value;
        const tgtVal = this.targetLang.value;

        if (srcVal === 'auto') {
            Toast.warning('自动检测语言无法交换');
            return;
        }

        this.sourceLang.value = tgtVal;
        this.targetLang.value = srcVal;

        // 交换文本内容
        const resultText = this.resultArea?.querySelector('.result-text');
        if (resultText && this.sourceText) {
            this.sourceText.value = resultText.textContent;
            this.updateCharCount();
            this.translate();
        }

        Toast.success('语言已交换');
    }

    /* ==================== 清空所有 ==================== */
    clearAll() {
        if (this.sourceText) {
            this.sourceText.value = '';
            this.updateCharCount();
        }
        if (this.resultArea) {
            this.resultArea.innerHTML = `
                <div class="result-placeholder">
                    <p>🌐</p>
                    <p>翻译结果将在这里显示</p>
                </div>
            `;
        }
        this.copyBtn && (this.copyBtn.style.display = 'none');
        Toast.info('已清空');
    }

    /* ==================== 复制结果 ==================== */
    copyResult() {
        const resultText = this.resultArea?.querySelector('.result-text') || this.resultArea?.querySelector('.result-typing-area span');
        if (!resultText) {
            Toast.warning('没有可复制的翻译结果');
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

    /* ==================== 核心翻译 ==================== */
    async translate() {
    if (this.isTranslating) return;

    const text = this.sourceText?.value?.trim();
    if (!text) {
        Toast.warning('请输入要翻译的文本');
        this.sourceText?.focus();
        return;
    }

    const srcLang = this.sourceLang.value;
    const tgtLang = this.targetLang.value;

    if (srcLang !== 'auto' && srcLang === tgtLang) {
        Toast.warning('源语言和目标语言不能相同');
        return;
    }

    this.isTranslating = true;
    this.showLoading();

    try {
        const translatedText = await this.callCozeAPI(text, srcLang, tgtLang);
        this.showResult(translatedText);

        const actualSrc = srcLang === 'auto' ? this.detectLang(text) : srcLang;
        this.addHistory(text, translatedText, actualSrc, tgtLang);
        Toast.success('翻译完成');
    } catch (err) {
        console.error('翻译错误:', err);

        try {
            Toast.warning('API不可用，使用离线模式');
            const translatedText = this.mockTranslate(text, srcLang, tgtLang);
            this.showResult(translatedText);
            const actualSrc = srcLang === 'auto' ? this.detectLang(text) : srcLang;
            this.addHistory(text, translatedText, actualSrc, tgtLang);
            Toast.info('离线翻译完成');
        } catch (fallbackErr) {
            Toast.error('翻译失败，请重试');
        }
    } finally {
        this.isTranslating = false;
        this.hideLoading();
    }
}

// ====== 调用扣子API（stream 模式直接获取结果） ======
async callCozeAPI(text, srcLang, tgtLang) {
    const COZE_CONFIG = {
        apiKey: 'pat_cJG3jgqZQQc6G3Jkvg4oSvUOnVcB9qxYAIRInjkiOxZHlGWGFxcXAV8qdN7kavvj',
        botId: '7657108725542731816',
        apiUrl: 'https://api.coze.cn/v3/chat'
    };

    const langMap = {
        'zh': '中文', 'en': '英语', 'ja': '日语',
        'ko': '韩语', 'fr': '法语', 'de': '德语', 'es': '西班牙语'
    };
    const targetName = langMap[tgtLang] || tgtLang;

    const response = await fetch(COZE_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bot_id: COZE_CONFIG.botId,
            user_id: 'user_' + Date.now(),
            stream: true,
            additional_messages: [{
                role: 'user',
                content: `翻译成${targetName}：${text}`,
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

                    // Coze v3: assistant 的 answer 消息，delta 无 created_at（拼接），最终版有 created_at（覆盖）
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
    return await this._pollForResult(COZE_CONFIG, text, srcLang, tgtLang);
}

// ====== 降级方案：轮询模式 ======
async _pollForResult(COZE_CONFIG, text, srcLang, tgtLang) {
    const langMap = {
        'zh': '中文', 'en': '英语', 'ja': '日语',
        'ko': '韩语', 'fr': '法语', 'de': '德语', 'es': '西班牙语'
    };
    const targetName = langMap[tgtLang] || tgtLang;

    const response = await fetch(COZE_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bot_id: COZE_CONFIG.botId,
            user_id: 'user_' + Date.now(),
            stream: false,
            additional_messages: [{
                role: 'user',
                content: `翻译成${targetName}：${text}`,
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
            { headers: { 'Authorization': `Bearer ${COZE_CONFIG.apiKey}` } }
        );

        if (!statusRes.ok) continue;
        const statusData = await statusRes.json();
        const status = statusData?.data?.status;
        const lastError = statusData?.data?.last_error;

        if (status === 'requires_action') {
            throw new Error('翻译服务需要人工介入，请检查Bot配置');
        }

        if (status === 'in_progress' || status === 'created' || status === 'queued') {
            continue;
        }

        if (status === 'failed') {
            const errMsg = lastError?.msg || '';
            throw new Error('翻译请求失败: ' + errMsg);
        }

        if (status === 'completed' || status === 'completed_but_need_confirm') {
            const msgRes = await fetch(
                `https://api.coze.cn/v3/chat/message/list?chat_id=${chatId}&conversation_id=${conversationId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
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

    throw new Error('翻译超时，请重试');
}

    /* ---------- 检测语言（简化模拟） ---------- */
    detectLang(text) {
        if (/[一-鿿]/.test(text)) return 'zh';
        if (/[぀-ゟ゠-ヿ]/.test(text)) return 'ja';
        if (/[가-힯]/.test(text)) return 'ko';
        return 'en';
    }

    /* ---------- 模拟翻译逻辑 ---------- */
    mockTranslate(text, srcLang, tgtLang) {
        const actualSrc = srcLang === 'auto' ? this.detectLang(text) : srcLang;
        const langPair = `${actualSrc}-${tgtLang}`;
        const dict = DICTIONARIES[langPair] || {};

        // 精确匹配
        const lower = text.toLowerCase().trim();
        if (dict[lower]) return dict[lower];

        // 逐词替换演示
        let result = text;
        const entries = Object.entries(dict).sort((a, b) => b[0].length - a[0].length);
        for (const [key, val] of entries) {
            if (result.toLowerCase().includes(key)) {
                result = result.replace(new RegExp(key, 'gi'), val);
            }
        }

        // 如果没有发生替换，使用模板
        if (result === text) {
            const prefix = MOCK_RESPONSES[langPair] || `[${tgtLang.toUpperCase()}] `;
            result = prefix + text;
        }

        return result;
    }

    /* ---------- 显示加载状态 ---------- */
    showLoading() {
        if (!this.resultArea) return;
        this.resultArea.innerHTML = `
            <div class="translating-overlay">
                <div class="loading-spinner"></div>
                <div class="loading-text">翻译中...</div>
            </div>
        `;
        this.translateBtn && (this.translateBtn.disabled = true);
        this.translateBtn && (this.translateBtn.innerHTML = '⏳ 翻译中...');
    }

    hideLoading() {
        this.translateBtn && (this.translateBtn.disabled = false);
        this.translateBtn && (this.translateBtn.innerHTML = '🚀 开始翻译');
    }

    /* ---------- 显示翻译结果（带打字机效果） ---------- */
    async showResult(text) {
        if (!this.resultArea) return;

        // 创建结果容器结构
        this.resultArea.innerHTML = `
            <div class="result-typing-area"></div>
            <div class="result-actions" style="display:none;">
                <button class="result-action-btn" id="inlineCopyBtn" title="复制结果">📋 复制结果</button>
                <button class="result-action-btn" id="inlineClearBtn" title="清空结果">🗑️ 清空</button>
            </div>
        `;

        const typingArea = this.resultArea.querySelector('.result-typing-area');
        const actionsArea = this.resultArea.querySelector('.result-actions');

        // 使用打字机效果显示结果
        if (typeof TypewriterEffect !== 'undefined') {
            await TypewriterEffect.type(typingArea, text, 25);
        } else {
            // 降级方案：直接显示
            typingArea.innerHTML = `<div class="result-text">${this.escapeHtml(text)}</div>`;
        }

        // 显示操作按钮
        actionsArea.style.display = 'flex';

        // 绑定内联按钮
        const inlineCopy = document.getElementById('inlineCopyBtn');
        const inlineClear = document.getElementById('inlineClearBtn');
        inlineCopy && inlineCopy.addEventListener('click', () => this.copyResult());
        inlineClear && inlineClear.addEventListener('click', () => this.clearAll());

        // 显示外部复制按钮
        this.copyBtn && (this.copyBtn.style.display = 'inline-flex');
    }

    /* ==================== 翻译历史 ==================== */
    loadHistory() {
        try {
            return JSON.parse(localStorage.getItem('translator_history') || '[]');
        } catch {
            return [];
        }
    }

    saveHistory() {
        localStorage.setItem('translator_history', JSON.stringify(this.history));
    }

    addHistory(source, target, srcLang, tgtLang) {
        const entry = {
            id: Date.now(),
            source: source.length > 100 ? source.substring(0, 100) + '...' : source,
            target: target.length > 100 ? target.substring(0, 100) + '...' : target,
            srcLang,
            tgtLang,
            time: new Date().toLocaleString('zh-CN')
        };
        this.history.unshift(entry);
        if (this.history.length > 20) this.history = this.history.slice(0, 20);
        this.saveHistory();
        this.renderHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
        Toast.info('历史记录已清空');
    }

    renderHistory() {
        if (!this.historyList) return;

        // 更新计数
        if (this.historyCount) {
            this.historyCount.textContent = `(${this.history.length})`;
        }

        if (this.history.length === 0) {
            this.historyList.innerHTML = `
                <div class="history-empty">
                    <div class="history-empty-icon">📝</div>
                    <p>暂无翻译历史</p>
                    <p style="font-size: 0.85rem; margin-top: 4px;">翻译记录将显示在这里</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.history.map(item => {
            const srcName = LANGUAGES[item.srcLang]?.name || item.srcLang;
            const tgtName = LANGUAGES[item.tgtLang]?.name || item.tgtLang;
            const srcFlag = LANGUAGES[item.srcLang]?.flag || '🌐';
            const tgtFlag = LANGUAGES[item.tgtLang]?.flag || '🌐';
            return `
                <div class="history-item">
                    <div class="history-source">
                        <div class="history-lang">${srcFlag} ${srcName}</div>
                        <div>${this.escapeHtml(item.source)}</div>
                    </div>
                    <div class="history-arrow">→</div>
                    <div class="history-target">
                        <div class="history-lang">${tgtFlag} ${tgtName}</div>
                        <div>${this.escapeHtml(item.target)}</div>
                        <div class="history-meta">
                            <span class="history-time">${item.time}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==================== 深色/浅色模式 ==================== */
    initTheme() {
        const saved = localStorage.getItem('translator_theme') || 'light';
        this.setTheme(saved);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        this.setTheme(current === 'dark' ? 'light' : 'dark');
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('translator_theme', theme);
        if (this.themeToggle) {
            this.themeToggle.classList.toggle('active', theme === 'dark');
        }
    }

    /* ==================== 时钟 ==================== */
    startClock() {
        const update = () => {
            if (!this.headerTime) return;
            const now = new Date();
            const pad = n => String(n).padStart(2, '0');
            this.headerTime.textContent =
                `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
                `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        };
        update();
        setInterval(update, 1000);
    }

    /* ---------- 工具方法 ---------- */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ==================== Toast 通知系统 ==================== */
const Toast = {
    container: null,

    _ensureContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
        return this.container;
    },

    _iconMap: {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
    },

    show(message, type = 'info', duration = 3000) {
        const container = this._ensureContainer();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${this._iconMap[type] || 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" aria-label="关闭">&times;</button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        const remove = () => {
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        };

        closeBtn.addEventListener('click', remove);

        container.appendChild(toast);

        if (duration > 0) {
            setTimeout(remove, duration);
        }
    },

    success(msg) { this.show(msg, 'success'); },
    warning(msg) { this.show(msg, 'warning'); },
    error(msg) { this.show(msg, 'error'); },
    info(msg) { this.show(msg, 'info'); }
};

/* ==================== 反馈表单处理 ==================== */
function initFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (!feedbackForm) return;

    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = {
            userName: document.getElementById('userName')?.value?.trim(),
            userEmail: document.getElementById('userEmail')?.value?.trim(),
            feedbackType: document.getElementById('feedbackType')?.value,
            feedbackContent: document.getElementById('feedbackContent')?.value?.trim(),
            rating: document.getElementById('rating')?.value
        };

        if (!formData.userName || !formData.userEmail || !formData.feedbackContent) {
            Toast.warning('请填写所有必填字段');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.userEmail)) {
            Toast.warning('请输入有效的邮箱地址');
            return;
        }

        const submitBtn = feedbackForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ 提交中...';

        setTimeout(() => {
            Toast.success('感谢您的反馈！我们会认真对待每一条建议');
            feedbackForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '📨 提交反馈';
        }, 1500);
    });
}

/* ==================== 页面初始化 ==================== */
document.addEventListener('DOMContentLoaded', () => {
    const translator = new Translator();
    window.translator = translator;
    initFeedbackForm();
});
