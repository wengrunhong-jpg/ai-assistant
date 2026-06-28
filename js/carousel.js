/**
 * 轮播图组件
 * 实现自动播放、手动切换、圆点指示器功能
 */
class Carousel {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('轮播图容器未找到:', containerId);
            return;
        }

        // 配置选项
        this.options = {
            autoPlay: true,
            interval: 4000, // 4秒切换一次
            transitionDuration: 500,
            pauseOnHover: true,
            ...options
        };

        // 获取元素
        this.wrapper = this.container.querySelector('.carousel-wrapper');
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.prevBtn = this.container.querySelector('.carousel-btn.prev');
        this.nextBtn = this.container.querySelector('.carousel-btn.next');
        this.dotsContainer = this.container.querySelector('.carousel-dots');
        this.dots = this.container.querySelectorAll('.carousel-dot');

        // 状态
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayTimer = null;
        this.isTransitioning = false;

        // 初始化
        this.init();
    }

    init() {
        if (this.totalSlides === 0) {
            console.warn('没有找到轮播图幻灯片');
            return;
        }

        this.bindEvents();
        this.updateCarousel();

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    bindEvents() {
        // 左右按钮事件
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // 圆点点击事件
        if (this.dotsContainer) {
            this.dotsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('carousel-dot')) {
                    const index = parseInt(e.target.dataset.index);
                    this.goTo(index);
                }
            });
        }

        // 鼠标悬停暂停
        if (this.options.pauseOnHover) {
            this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.container.addEventListener('mouseleave', () => {
                if (this.options.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }

        // 触摸滑动支持
        this.addTouchSupport();

        // 键盘支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prev();
            } else if (e.key === 'ArrowRight') {
                this.next();
            }
        });
    }

    addTouchSupport() {
        let startX = 0;
        let endX = 0;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }

    prev() {
        if (this.isTransitioning) return;
        const newIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goTo(newIndex);
    }

    next() {
        if (this.isTransitioning) return;
        const newIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goTo(newIndex);
    }

    goTo(index) {
        if (index === this.currentIndex || this.isTransitioning) return;

        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateCarousel();

        setTimeout(() => {
            this.isTransitioning = false;
        }, this.options.transitionDuration);
    }

    updateCarousel() {
        // 更新轮播图位置
        if (this.wrapper) {
            this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }

        // 更新圆点状态
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, this.options.interval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    destroy() {
        this.stopAutoPlay();
        // 移除事件监听器等清理工作
    }
}

// 页面加载完成后初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel('mainCarousel', {
        autoPlay: true,
        interval: 4000,
        pauseOnHover: true
    });

    // 暴露到全局以便调试
    window.mainCarousel = carousel;
});