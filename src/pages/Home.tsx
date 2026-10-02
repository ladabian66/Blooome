import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Link001, Link003, Link004 } from "@/components/ui/skiper40";

/* ------------------------------------------------------------------ */
/* 数据：之后换成你的真实作品                                            */
/* ------------------------------------------------------------------ */
const WORKS = [
  {
    index: "01",
    title: "生成艺术实验",
    en: "GENERATIVE STUDY",
    tags: "p5.js / TouchDesigner",
    year: "2026",
  },
  {
    index: "02",
    title: "品牌视觉识别",
    en: "VISUAL IDENTITY",
    tags: "海报 / 字体排印",
    year: "2026",
  },
  {
    index: "03",
    title: "交互装置",
    en: "INTERACTIVE INSTALLATION",
    tags: "传感器 / 空间",
    year: "2025",
  },
  {
    index: "04",
    title: "就是这个网站",
    en: "THIS VERY SITE",
    tags: "React / Skiper UI",
    year: "2026",
  },
];

/* 纯 CSS 画的作品预览图：单色构成 + 描边大序号，悬停时跟随光标 */
function WorkPreview({ work }: { work: (typeof WORKS)[number] }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      {/* 构成元素：同心圆 + 斜切色块，靠构图区分而非颜色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "repeating-radial-gradient(circle at 70% 30%, transparent 0px, transparent 38px, rgba(255,255,255,0.06) 38px, rgba(255,255,255,0.06) 39px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 55%, rgba(255,255,255,0.10) 55%, rgba(255,255,255,0.10) 72%, transparent 72%)",
        }}
      />
      <span className="font-display text-stroke-white absolute -bottom-[6%] -left-[2%] text-[26rem] leading-none font-black tracking-tighter opacity-90 select-none">
        {work.index}
      </span>
      <div className="absolute top-6 left-6 flex flex-col gap-1">
        <span className="text-xs tracking-[0.3em] text-white/60 uppercase">
          {work.en}
        </span>
        <span className="text-2xl font-bold text-white">{work.title}</span>
      </div>
      <div className="absolute right-6 bottom-6 text-xs tracking-[0.2em] text-white/50">
        {work.tags} — {work.year}
      </div>
      {/* 噪点 */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.15] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

/* 行内文字上滑揭示 */
function LineReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, delay, ease: [0.2, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* 邮箱悬停解码：variant="inline" 用于社交链接行的小字版本 */
function EmailReveal({
  email,
  variant = "hero",
}: {
  email: string;
  variant?: "hero" | "inline";
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (!revealed) {
      setRevealed(true); // 触屏设备：第一次点按 = 显示
      return;
    }
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* 剪贴板不可用时静默 */
    }
  };

  const display = copied ? "已复制 ✓" : revealed ? email : "EMAIL";

  const chars = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={display}
        className="flex"
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {display.split("").map((ch, i) => (
          <motion.span
            key={`${display}-${i}`}
            className="inline-block whitespace-pre"
            variants={{
              hidden: { y: "115%", opacity: 0 },
              show: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.4,
                  delay: i * 0.02,
                  ease: [0.2, 1, 0.3, 1],
                },
              },
              exit: {
                y: "-115%",
                opacity: 0,
                transition: { duration: 0.2, delay: i * 0.006 },
              },
            }}
          >
            {ch}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );

  if (variant === "inline") {
    return (
      <button
        type="button"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => {
          setRevealed(false);
          setCopied(false);
        }}
        onClick={handleClick}
        className="group relative self-start overflow-hidden text-left normal-case tracking-[0.2em]"
        aria-label={revealed ? `复制邮箱 ${email}` : "显示邮箱地址"}
      >
        {chars}
        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:origin-left group-hover:scale-x-100" />
      </button>
    );
  }

  return null;
}

export default function Home() {
  /* 首屏滚动视差 */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* 作品区：光标跟随的预览浮层 */
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.6 });
  const py = useSpring(my, { stiffness: 150, damping: 20, mass: 0.6 });

  return (
    <main className="bg-white text-black">
      {/* ---------------- 导航：mix-blend 让其在黑色区块上自动反色 ---------------- */}
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <nav className="flex items-center justify-between px-6 py-5 text-white md:px-10">
          <a href="#top" className="font-display text-sm font-black tracking-tight">
            BLOOOME<span className="align-super text-[0.6em]">®</span>
          </a>
          <div className="flex items-center gap-8 text-xs font-semibold tracking-[0.25em] uppercase">
            <Link003 href="#works">作品 Works</Link003>
            <Link003 href="#about">关于 About</Link003>
            <Link003 href="#contact">联系 Contact</Link003>
          </div>
        </nav>
      </header>

      {/* ---------------- 首屏 ---------------- */}
      <section
        id="top"
        ref={heroRef}
        className="relative flex min-h-screen flex-col justify-between overflow-hidden px-6 pt-24 pb-8 md:px-10"
      >
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex-1">
          <div className="mt-[8vh] flex items-baseline justify-between">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase">
              数字媒体艺术 × AI Coding
            </p>
            <p className="hidden text-xs tracking-[0.35em] uppercase md:block">
              Portfolio — 2026
            </p>
          </div>

          <h1 className="font-display mt-6 text-[clamp(4rem,16.5vw,17rem)] leading-[0.85] font-black tracking-tighter uppercase select-none">
            <LineReveal>Blooome</LineReveal>
          </h1>

          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <LineReveal delay={0.15} className="max-w-md">
              <span className="text-lg leading-relaxed font-medium md:text-xl">
                一个文科生的代码作品集。先用审美走路，再让代码说话。
              </span>
            </LineReveal>
            <LineReveal delay={0.3}>
              <span className="text-stroke-black font-display text-2xl font-black tracking-tight uppercase md:text-4xl">
                Design × Code
              </span>
            </LineReveal>
          </div>
        </motion.div>

        <div className="flex items-end justify-between text-[0.65rem] tracking-[0.3em] uppercase">
          <span>Blooome — Works &amp; Experiments</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓ Scroll
          </motion.span>
        </div>
      </section>

      {/* ---------------- 宣言（黑色断裂带） ---------------- */}
      <section className="bg-black px-6 py-[18vh] text-white md:px-10">
        <p className="mb-8 text-xs tracking-[0.35em] text-white/50 uppercase">
          宣言 / Manifesto
        </p>
        <h2 className="font-display text-[clamp(2rem,5.6vw,5.5rem)] leading-[1.02] font-black tracking-tight uppercase">
          <LineReveal>审美是直觉，</LineReveal>
          <LineReveal delay={0.1}>代码是杠杆。</LineReveal>
          <LineReveal delay={0.2} className="text-stroke-white">
            Taste is intuition.
          </LineReveal>
          <LineReveal delay={0.3} className="text-stroke-white">
            Code is leverage.
          </LineReveal>
        </h2>
        <LineReveal delay={0.4} className="mt-12 max-w-xl">
          <span className="text-base leading-relaxed text-white/70 md:text-lg">
            数字媒体艺术训练了我的眼睛，AI 与代码给了我新的手。这个网站记录两者咬合的过程——每一件作品，都是一次把直觉变成可交互现实的尝试。
          </span>
        </LineReveal>
      </section>

      {/* ---------------- 作品列表：悬停出预览，其余变暗 ---------------- */}
      <section
        id="works"
        className="relative px-6 py-[14vh] md:px-10"
        onMouseMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
      >
        <div className="mb-14 flex items-baseline justify-between">
          <h2 className="font-display text-sm font-black tracking-[0.35em] uppercase">
            作品 / Selected Works
          </h2>
          <span className="text-xs tracking-[0.2em] text-black/50 uppercase">
            ({String(WORKS.length).padStart(2, "0")})
          </span>
        </div>

        <ul>
          {WORKS.map((work, i) => (
            <li key={work.index} className="border-t border-black/15 last:border-b">
              <a
                href="#contact"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group flex items-baseline justify-between gap-4 py-8 transition-colors duration-300 md:py-10"
                style={{
                  opacity: active === null || active === i ? 1 : 0.2,
                  transition:
                    "opacity 0.4s cubic-bezier(0.2, 1, 0.3, 1)",
                }}
              >
                <div className="flex items-baseline gap-6">
                  <span className="text-xs font-semibold tracking-[0.2em] text-black/40">
                    {work.index}
                  </span>
                  <span className="font-display text-[clamp(1.8rem,5.5vw,5rem)] leading-none font-black tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:translate-x-4">
                    {work.title}
                  </span>
                </div>
                <div className="hidden flex-col items-end gap-1 text-xs tracking-[0.2em] text-black/50 uppercase md:flex">
                  <span>{work.tags}</span>
                  <span>{work.year}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* 光标跟随预览（仅精确指针设备） */}
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              className="pointer-events-none fixed z-40 hidden h-[300px] w-[420px] md:block"
              style={{
                left: px,
                top: py,
                x: "-50%",
                y: "-60%",
              }}
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.2, 1, 0.3, 1] }}
            >
              <WorkPreview work={WORKS[active]} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ---------------- 关于 ---------------- */}
      <section id="about" className="border-t border-black/15 px-6 py-[14vh] md:px-10">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <h2 className="font-display self-start text-sm font-black tracking-[0.35em] uppercase md:sticky md:top-28">
            关于 / About
          </h2>
          <div className="flex flex-col gap-10">
            <LineReveal>
              <span className="text-2xl leading-snug font-bold md:text-4xl">
                我是 Blooome，数字媒体艺术专业出身，正在从画布转向编辑器。
              </span>
            </LineReveal>
            <div className="grid gap-8 text-base leading-relaxed text-black/70 md:grid-cols-2">
              <p>
                过去几年我用海报、动态影像和装置讲故事；现在我学着用 React、动画库和
                AI 协作把同样的故事讲进浏览器里。设计训练给了我构图、节奏和取舍的直觉。
              </p>
              <p>
                代码于我是一门新的造型语言。这个网站本身就是第一件完整作品——从仓库命名到每一个悬停动效，都是学习路径上的坐标。
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3 text-xs font-semibold tracking-[0.25em] uppercase">
              <span>视觉设计</span>
              <span>动态图形</span>
              <span>React / TypeScript</span>
              <span>Tailwind</span>
              <span>AI 协作开发</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 联系 / 页脚（黑色） ---------------- */}
      <footer id="contact" className="bg-black px-6 pt-[16vh] pb-8 text-white md:px-10">
        <p className="mb-6 text-xs tracking-[0.35em] text-white/50 uppercase">
          有想法？聊聊 / Get in touch
        </p>

        {/* 巨大邮箱链接：悬停时色块从底部升起并反色（Skiper 40 / Link004）
            显示品牌邮箱，mailto 指向真实 QQ 邮箱（blooome.work 域名未注册） */}
        <Link004
          href="mailto:3520260570@qq.com"
          className="font-display max-w-full text-[clamp(1.4rem,7.2vw,8.5rem)] font-black tracking-tight uppercase"
        >
          hi@blooome.work
        </Link004>

        <div className="mt-[12vh] flex flex-wrap items-center gap-x-10 gap-y-4 text-sm font-semibold tracking-[0.2em] uppercase">
          <Link001 href="https://github.com/ladabian66/Blooome">GitHub</Link001>
          <Link001 href="https://www.kimi.com">Kimi</Link001>
          {/* 第三个快捷键：悬停逐字解码显示邮箱，点击复制 */}
          <EmailReveal variant="inline" email="3520260570@qq.com" />
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-white/15 pt-6 text-[0.65rem] tracking-[0.25em] text-white/40 uppercase md:flex-row">
          <span>© 2026 Blooome — 用代码做设计</span>
          <span>Link animations by Skiper UI (free, with attribution)</span>
        </div>
      </footer>
    </main>
  );
}
