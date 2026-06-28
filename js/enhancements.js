/**
 * 页面增强效果模块
 * 包含：加载进度条、淡入动画、涟漪效果、打字机效果、
 * 导航栏滚动增强、移动端下拉菜单
 */

/* ==================== 加载进度条 ==================== */
const LoadingBar = {
    bar: null,

    /** 创建进度条元素 */
    init() {
        this.bar = document.createElement('div');
        this.bar.className = 'page-loading-bar';
        document.body.prepend(this.bar);

        // 模拟加载进度
        requestAnimationFrame(() => {
            this.bar.style.width = '60%';
        });

        window.addEventListener('load', () => {
            this.bar.style.width = '100%';
            setTimeout(() => {
                this.bar.classList.add('done');
            }, 300);
        });
    }
};

/* ==================== 滚动淡入动画 ==================== */
const FadeInObserver = {
    /** 为各内容区块添加淡入类并启动观察器 */
    init() {
        const sections = document.querySelectorAll(
            '.carousel-section, .translator-section, .features-section, .content-card, .page-header'
        );

        sections.forEach(el => el.classList.add('fade-in-section'));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        sections.forEach(el => observer.observe(el));
    }
};

/* ==================== 按钮涟漪效果 ==================== */
const RippleEffect = {
    /** 为所有主要按钮绑定涟漪点击效果 */
    init() {
        const buttons = document.querySelectorAll(
            '.action-btn-primary, .form-btn, .btn-primary'
        );

        buttons.forEach(btn => {
            btn.classList.add('ripple-btn');
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
                btn.appendChild(ripple);

                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }
};

/* ==================== 翻译结果打字机效果 ==================== */
const TypewriterEffect = {
    /**
     * 逐字显示翻译结果
     * @param {HTMLElement} container - 结果容器
     * @param {string} text - 要显示的文本
     * @param {number} speed - 每字符间隔(ms)
     */
    type(container, text, speed = 30) {
        return new Promise((resolve) => {
            container.innerHTML = '';
            const textSpan = document.createElement('span');
            textSpan.className = 'result-text';
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            container.appendChild(textSpan);
            container.appendChild(cursor);

            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    textSpan.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                    // 打字完成后移除光标
                    setTimeout(() => {
                        if (cursor.parentNode) cursor.remove();
                        resolve();
                    }, 800);
                }
            }, speed);
        });
    }
};

/* ==================== 导航栏滚动增强 ==================== */
const NavScroll = {
    /** 监听滚动，为导航栏添加阴影增强效果 */
    init() {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    nav.classList.toggle('scrolled', window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
};

/* ==================== 移动端下拉菜单点击切换 ==================== */
const MobileDropdown = {
    /** 移动端用点击切换下拉菜单，而非 hover */
    init() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (!toggle) return;

            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 关闭其他已打开的下拉菜单
                dropdowns.forEach(other => {
                    if (other !== dropdown) other.classList.remove('open');
                });

                dropdown.classList.toggle('open');
            });
        });

        // 点击页面其他区域关闭下拉菜单
        document.addEventListener('click', () => {
            dropdowns.forEach(d => d.classList.remove('open'));
        });
    }
};

/* ==================== 页面初始化 ==================== */
document.addEventListener('DOMContentLoaded', () => {
    LoadingBar.init();
    FadeInObserver.init();
    RippleEffect.init();
    NavScroll.init();
    MobileDropdown.init();
});
