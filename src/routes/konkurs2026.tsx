import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { formatNextAwardDate } from "@/lib/award-date";
import { CONTEST_2026, formatContest2026EndDate } from "@/lib/contest-2026";
import {
  Menu,
  X,
  ArrowRight,
  ExternalLink,
  Trophy,
  Medal,
  Award,
  Crown,
  Building2,
  ShieldCheck,
  Megaphone,
  Sparkles,
  Mail,
  CheckCircle2,
  Plus,
  Minus,
  Palmtree,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/konkurs2026")({
  head: () => ({
    meta: [
      { title: "Конкурс аналитиков 2026 — конкурс инвестиционных идей" },
      {
        name: "description",
        content:
          `Открытый конкурс аналитиков по российскому фондовому рынку с призовым фондом ${CONTEST_2026.fund.toLocaleString("ru-RU")} рублей.`,
      },
      { property: "og:title", content: "Конкурс аналитиков 2026" },
      {
        property: "og:description",
        content:
          `Конкурс инвестиционных идей по российскому фондовому рынку. Призовой фонд — ${CONTEST_2026.fund.toLocaleString("ru-RU")} рублей.`,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/konkurs2026" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: "/konkurs2026" }],
  }),
  component: LandingPage,
});

const NAV = [
  { id: "about", label: "О конкурсе" },
  { id: "awards", label: "Призовой фонд" },
  { id: "format", label: "Формат" },
  { id: "participation", label: "Участие" },
  { id: "faq", label: "FAQ" },
] as const;

const EXAMPLES_URL = "https://invest-idei.ru/unauthorized?pro=0";
const MOEX_URL = "https://www.moex.com/n100378";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function anchorHref(id: string) {
  return `#${id}`;
}

function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  scrollToId(id);
  window.history.replaceState(null, "", anchorHref(id));
}


function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors theme="dark" />
      <Header />
      <main>
        <Hero />
        <Awards />
        <Format />
        <Participation />
        <Faq />
        <Apply />
      </main>
      <Footer />
      <MobileApplyBar />
    </div>
  );
}

/* ---------- Reusable: sexy "Примеры идей" button ---------- */

function ExamplesButton({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeCls =
    size === "lg"
      ? "h-12 px-6 text-base"
      : size === "sm"
        ? "h-10 px-4 text-sm"
        : "h-11 px-5 text-sm";
  return (
    <a
      href={EXAMPLES_URL}
      target="_blank"
      rel="noreferrer noopener"
      className={`group inline-flex items-center justify-center gap-2 ${sizeCls} rounded-xl font-semibold bg-[oklch(0.13_0.02_260)] text-[oklch(0.85_0.14_85)] border border-[oklch(0.85_0.14_85)]/40 hover:border-[oklch(0.85_0.14_85)] hover:bg-[oklch(0.16_0.025_260)] transition-colors ${className}`}
    >
      <span>Примеры идей</span>
      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

/* ---------- HEADER ---------- */

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <a
          href={anchorHref("about")}
          onClick={(e) => onAnchorClick(e, "about")}
          className="flex items-center gap-2 group"
          aria-label="Конкурс аналитиков 2026"
        >
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-primary shadow-glow">
            <Crown className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display font-bold tracking-tight text-base sm:text-lg">
            Конкурс аналитиков <span className="text-gradient-primary">2026</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={anchorHref(n.id)}
              onClick={(e) => onAnchorClick(e, n.id)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ExamplesButton size="sm" />
          <a
            href={anchorHref("apply")}
            onClick={(e) => onAnchorClick(e, "apply")}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            Подать заявку
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-border bg-surface/60"
          aria-label="Меню"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={anchorHref(n.id)}
                onClick={() => {
                  setOpen(false);
                }}
                className="text-left px-3 py-3 rounded-md text-sm text-foreground hover:bg-surface"
              >
                {n.label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <ExamplesButton className="w-full" />
              <a
                href={anchorHref("apply")}
                onClick={() => {
                  setOpen(false);
                }}
                className="inline-flex items-center justify-center gap-1.5 h-11 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground"
              >
                Подать заявку
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- HERO ---------- */

function Hero() {
  return (
    <section
      id="about"
      className="relative pt-28 pb-12 sm:pt-36 sm:pb-20 overflow-hidden bg-gradient-hero scroll-mt-24"
    >
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 backdrop-blur text-xs font-medium text-muted-foreground animate-slide-up">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
          </span>
          Регистрация открыта · Старт — май 2026
        </div>

        <h1
          className="mt-6 mx-auto max-w-4xl font-display font-extrabold leading-[1.05] tracking-tight text-[2rem] sm:text-6xl lg:text-7xl animate-slide-up"
          style={{ animationDelay: "60ms" }}
        >
          Сделаем <span className="text-gradient-primary">финансовую аналитику</span>{" "}
          великой снова
        </h1>

        <p
          className="mt-5 mx-auto max-w-2xl text-base sm:text-xl text-muted-foreground animate-slide-up"
          style={{ animationDelay: "120ms" }}
        >
          Открытый конкурс аналитики по российскому фондовому рынку
        </p>

        <div
          className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 animate-slide-up"
          style={{ animationDelay: "180ms" }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-surface/80 backdrop-blur">
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Организатор
              </div>
              <div className="text-sm font-semibold">Invest-idei.ru</div>
            </div>
          </div>
          <span className="text-muted-foreground text-sm font-medium px-1">×</span>
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-border bg-surface/80 backdrop-blur">
            <div className="text-left leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Партнёр
              </div>
              <div className="text-sm font-semibold">Московская Биржа</div>
            </div>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-slide-up"
          style={{ animationDelay: "240ms" }}
        >
          <a
            href={anchorHref("apply")}
            onClick={(e) => onAnchorClick(e, "apply")}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            Подать заявку
            <ArrowRight className="h-4 w-4" />
          </a>
          <ExamplesButton size="lg" />
        </div>
      </div>
    </section>
  );
}

/* ---------- AWARDS ---------- */

function Awards() {
  return (
    <section id="awards" className="relative py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionEyebrow icon={<Trophy className="h-3.5 w-3.5" />}>Награды</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">Призовой фонд</h2>

        <div className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-elegant overflow-hidden relative text-left">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-4 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="mt-2 font-display font-extrabold tracking-tight text-gradient-gold leading-none whitespace-nowrap text-[clamp(2rem,11vw,5rem)] lg:text-[clamp(2rem,5.2vw,5rem)]">
                {CONTEST_2026.fund.toLocaleString("ru-RU")}&nbsp;₽
              </div>
              <div className="mt-3 text-sm sm:text-base text-muted-foreground">
                Распределяем среди лучших аналитиков
              </div>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-background/30 px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="font-display font-bold leading-none text-gradient-gold text-[clamp(2rem,5vw,3rem)]">
                    {CONTEST_2026.months}
                  </div>
                  <div className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    месяцев
                  </div>
                </div>
                <div className="font-display font-light text-gold/60 text-[clamp(1.25rem,3vw,1.75rem)] leading-none">
                  ×
                </div>
                <div className="text-center">
                  <div className="font-display font-bold leading-none text-gradient-gold text-[clamp(1.5rem,4vw,2.25rem)] whitespace-nowrap">
                    {CONTEST_2026.monthlyFund.toLocaleString("ru-RU")}&nbsp;₽
                  </div>
                  <div className="mt-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    каждый месяц
                  </div>
                </div>
              </div>
              <div className="mt-4 h-px w-full bg-gradient-gold opacity-60" />
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <h3 className="font-display font-bold text-2xl sm:text-3xl">Награды и признание</h3>
          <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
            Каждый месяц определяем самые доходные инвест-идеи и награждаем
            авторов.
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-5 text-left">
            <NominationCard
              tier="gold"
              title="Лучшая идея по акциям"
              prize="500 000 ₽"
            />
            <NominationCard
              tier="primary"
              title="Лучшая идея на рынке коллективных инвестиций"
              prize="350 000 ₽"
            />
            <NominationCard
              tier="bronze"
              title="Лучшая идея на внебиржевом рынке"
              prize="50 000 ₽"
            />
          </div>
        </div>

        <div className="mt-10 inline-flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-surface/70 backdrop-blur">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan" />
          </span>
          <span className="text-sm sm:text-base">
            Ближайшее награждение —{" "}
            <span className="font-semibold">{formatNextAwardDate()}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function NominationCard({
  tier,
  title,
  prize,
}: {
  tier: "gold" | "primary" | "bronze";
  title: string;
  prize: string;
}) {
  const tierStyle =
    tier === "gold"
      ? "from-[oklch(0.85_0.14_85)]/25 to-transparent"
      : tier === "primary"
        ? "from-[oklch(0.66_0.16_250)]/25 to-transparent"
        : "from-[oklch(0.65_0.12_55)]/25 to-transparent";
  return (
    <div className="group relative rounded-2xl border border-border bg-surface p-6 overflow-hidden transition hover:-translate-y-1 hover:border-foreground/20 hover:shadow-elegant">
      <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${tierStyle} opacity-80`} />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <Trophy className="h-5 w-5 text-gold" />
          <Medal className="h-5 w-5 text-silver" />
          <Award className="h-5 w-5 text-bronze" />
        </div>
        <h4 className="mt-5 font-display font-bold text-lg leading-snug min-h-[3.5rem]">{title}</h4>
        <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
          ТОП-1
        </div>
        <div className="font-display font-extrabold text-3xl text-gradient-gold mt-1">
          {prize}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Денежный приз и лидерство в номинации
        </p>
        <div className="mt-4 h-px w-full bg-border" />
        <p className="mt-4 text-sm text-muted-foreground">
          ТОП-2 и ТОП-3: признание и место в рейтинге
        </p>
      </div>
    </div>
  );
}

/* ---------- FORMAT ---------- */

function Format() {
  const simple = [
    {
      n: "1",
      title: "Вы делитесь идеей",
      text: "Пишете в своём канале, блоге или на сайте: «Думаем, что акция X вырастет до Y по следующим причинам».",
    },
    {
      n: "2",
      title: "Мы её ловим",
      text: "Сами находим вашу идею в открытых источниках или получаем по согласованной ссылке.",
    },
    {
      n: "3",
      title: "Смотрим, что получилось",
      text: "Считаем, как изменилась цена после публикации. Если идея сработала — она поднимается в рейтинге.",
    },
    {
      n: "4",
     title: "Лучшие получают награды",
     text: "В конце каждого месяца авторы лучших идей получают статус чемпиона и денежный приз.",
    },
  ];
  return (
    <section id="format" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionEyebrow icon={<Sparkles className="h-3.5 w-3.5" />}>Формат</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Как это работает
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-muted-foreground text-base sm:text-lg">
          Вы продолжаете создавать аналитику, а мы доносим ваши идеи до широкой
          аудитории.
        </p>

        {/* Desktop timeline */}
        <div className="hidden lg:block mt-16 relative">
          <div className="absolute top-7 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[oklch(0.66_0.16_250)]/60 to-transparent" />
          <div className="grid grid-cols-4 gap-6 relative">
            {simple.map((s, i) => (
              <div key={s.n} className="relative flex flex-col items-center text-center px-2">
                <div className="relative grid place-items-center w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground font-display font-bold text-xl shadow-glow ring-4 ring-background z-10">
                  {s.n}
                </div>
                {i < simple.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-5 -right-4 h-5 w-5 text-[oklch(0.66_0.16_250)]/70 z-20" />
                )}
                <h3 className="mt-5 font-display font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile/tablet vertical timeline */}
        <div className="lg:hidden mt-10 relative text-left">
          <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-[oklch(0.66_0.16_250)]/60 via-[oklch(0.66_0.16_250)]/40 to-transparent" />
          <div className="space-y-5">
            {simple.map((s) => (
              <div key={s.n} className="relative pl-16">
                <div className="absolute left-0 top-0 grid place-items-center w-14 h-14 rounded-full bg-gradient-primary text-primary-foreground font-display font-bold text-lg shadow-glow ring-4 ring-background">
                  {s.n}
                </div>
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="font-display font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- PARTICIPATION ---------- */

function Participation() {
  const cards = [
    {
      icon: <Building2 className="h-6 w-6" />,
      tag: "Институционалы",
      title: "Профессиональные аналитики",
      text: "",
      bullets: [
        "Брокерские компании",
        "Управляющие компании",
        "Банки и инвест-дома",
      ],
      accent: "primary" as const,
    },
    {
      icon: <Palmtree className="h-6 w-6" />,
      tag: "Инфлюенсеры",
      title: "Независимые авторы",
      text: "",
      footnote: "Попросим подтвердить опыт и пройти верификацию",
      bullets: [
        "Инвестиционные каналы и блоги",
        "Авторские рассылки",
        "Сайты и сервисы аналитики",
      ],
      accent: "gold" as const,
    },
  ];
  const benefits = [
    {
      icon: <Star className="h-5 w-5" />,
      title: "Честный знак качества",
      text: "Независимая оценка вашей аналитики и публичное подтверждение качества инвестиционных идей.",
    },
    {
      icon: <Megaphone className="h-5 w-5" />,
      title: "Продвижение бренда",
      text: "Идеи автоматически транслируются на сотни тысяч инвесторов: на сайте Invest-idei.ru, ресурсах Мосбиржи, приложениях ведущих брокеров с вашим именем и ссылкой.",
    },
    {
      icon: <Medal className="h-5 w-5" />,
      title: "Награды и признание",
      text: "Денежные призы, статус победителя и регулярное попадание в рейтинг лучших аналитиков рынка.",
    },
  ];
  return (
    <section id="participation" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionEyebrow icon={<Crown className="h-3.5 w-3.5" />}>Участие</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Кто может участвовать
        </h2>

        <div className="mt-10 mx-auto max-w-5xl grid md:grid-cols-2 gap-5 text-left">
          {cards.map((c) => {
            const isGold = c.accent === "gold";
            return (
              <div
                key={c.title}
                className="group relative rounded-3xl border border-border bg-gradient-to-br from-surface-2 to-surface p-7 sm:p-8 overflow-hidden transition hover:-translate-y-1 hover:border-foreground/25 hover:shadow-elegant"
              >
                <div
                  className={`absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-25 ${
                    isGold ? "bg-gradient-gold" : "bg-gradient-primary"
                  }`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid place-items-center w-14 h-14 rounded-2xl text-primary-foreground shadow-glow ${
                        isGold ? "bg-gradient-gold text-background" : "bg-gradient-primary"
                      }`}
                    >
                      {c.icon}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground px-2.5 py-1 rounded-full border border-border bg-background/40">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display font-bold text-2xl">{c.title}</h3>
                  {c.text && (
                    <p className="mt-2.5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                      {c.text}
                    </p>
                  )}
                  {c.footnote && (
                    <p className="mt-2 text-xs text-muted-foreground/70 leading-relaxed">
                      {c.footnote}
                    </p>
                  )}
                  <ul className="mt-5 space-y-2.5 pt-5 border-t border-border">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm">
                        <CheckCircle2
                          className={`h-4 w-4 shrink-0 ${
                            isGold ? "text-[oklch(0.85_0.14_85)]" : "text-accent-cyan"
                          }`}
                        />
                        <span className="text-foreground/90">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h3 className="font-display font-bold text-2xl sm:text-3xl">Что получает участник</h3>
          <div className="mt-8 grid md:grid-cols-3 gap-5 text-left">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="relative rounded-2xl border border-border bg-gradient-to-b from-surface-2 to-surface p-6 overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-primary opacity-15 blur-2xl" />
                <div className="relative">
                  <div className="grid place-items-center w-11 h-11 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
                    {b.icon}
                  </div>
                  <h4 className="mt-5 font-display font-semibold text-lg">{b.title}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={anchorHref("apply")}
            onClick={(e) => onAnchorClick(e, "apply")}
            className="inline-flex items-center gap-2 h-12 px-7 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            Подать заявку
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQ_ITEMS = [
  {
    q: "Как принять участие?",
    a: "Принять участие в конкурсе может любой желающий, удовлетворяющий определённым требованиям. Чтобы принять участие, оставьте заявку в форме обратной связи или напишите нам на konkurs@invest-idei.ru. Затем мы согласуем или настроим канал получения ваших инвест-идей. Далее вам нужно просто генерировать инвест-идеи и обновлять их статус.",
  },
  {
    q: "Сколько идет конкурс?",
    a: `Идеи на конкурс можно присылать с 25 мая 2026 года по ${formatContest2026EndDate()}. Победителей месяца объявляем первого числа каждого месяца с июля по декабрь 2026.`,
  },
  {
    q: "Кто может принять участие?",
    a: "Принять участие могут любые лица, чья деятельность связана с аналитикой фондового рынка. Могут участвовать как сотрудники профессиональных участников рынка — брокеров, инвестиционных компаний, так и независимые авторы контента. К участию приглашаются блогеры, ведущие свою публичную деятельность более одного года и имеющие от 1000 подписчиков.",
  },
  {
    q: "Какие идеи принимаются?",
    a: "Можно присылать инвестиционные идеи на инструменты Московской биржи: 1) акции, допущенные к организованным торгам; 2) акции, с которыми возможно заключение внебиржевых сделок; 3) инструменты рынка коллективных инвестиций (БПИФ, ОПИФ, ИПИФ, ЗПИФ). Можно делать идеи на отдельные инструменты, а также предлагать в качестве идеи портфель из нескольких инструментов. Можно присылать идеи на «Лонг» и/или на «Шорт».",
  },
  {
    q: "Нужно ли отправлять каждую идею вручную?",
    a: "Не обязательно. Вы можете прислать ссылку на ваш публичный ресурс, и мы сможем настроить автоматический сбор идей. При необходимости можно согласовать отдельный формат передачи данных.",
  },
  {
    q: "Как определяются лучшие идеи месяца?",
    a: "Лучшие идеи месяца определяются в трёх номинациях: «Лучшая идея на рынке акций», «Лучшая идея на рынке коллективных инвестиций», «Лучшая идея на внебиржевом рынке». Лучшей считается идея, которая была закрыта по достижению целевой цены или по уведомлению от аналитика в текущем месяце с максимальной доходностью (при условии, что эта доходность больше нуля) относительно всех других закрытых идей. Если в текущем месяце нет закрытых идей с положительной доходностью, то в качестве лучшей идеи месяца признаётся одна из активных идей. А именно — идея, которая показала максимальную положительную доходность в текущем месяце в своей категории.",
  },
  {
    q: "Можно ли получить несколько наград?",
    a: "Одна идея может получить одну награду за время конкурса. При этом аналитик может получить неограниченное количество наград за свои идеи. Чем больше идей генерирует аналитик, тем выше шанс на победу и больше потенциальных наград.",
  },
  {
    q: "Как и когда выплачиваются призы?",
    a: "Денежные призы выплачиваются физическим лицам — авторам идей или коллективу авторов идей после объявления результатов прошедшего месяца. Мы связываемся с победителями, оформляем необходимые документы и выплачиваем приз банковским платежом на указанные реквизиты, удерживая необходимые налоги по законодательству РФ.",
  },
  {
    q: "Как связаться с организатором конкурса?",
    a: "С организатором конкурса можно связаться по электронной почте konkurs@invest-idei.ru или через форму обратной связи на сайте.",
  },
];

function Faq() {
  return (
    <section id="faq" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionEyebrow icon={<Sparkles className="h-3.5 w-3.5" />}>FAQ</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Справка и частые вопросы
        </h2>

        <div className="mt-10 space-y-3 text-left">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-surface/60 overflow-hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold text-base sm:text-lg">{item.q}</h3>
                <span className="grid place-items-center w-8 h-8 rounded-lg border border-border shrink-0">
                  <Plus className="h-4 w-4 group-open:hidden" />
                  <Minus className="hidden h-4 w-4 group-open:block" />
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- APPLY ---------- */

const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Введите ваше имя" })
    .max(200, { message: "Имя слишком длинное" }),
  status: z.enum(["Профучастник", "Частный аналитик"], {
    errorMap: () => ({ message: "Выберите статус" }),
  }),
  link: z
    .string()
    .trim()
    .min(1, { message: "Укажите ссылку на ваш ресурс" })
    .max(500, { message: "Слишком длинное значение" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Укажите email для связи" })
    .max(254, { message: "Email слишком длинный" })
    .email({ message: "Введите корректный email" }),
});

function Apply() {
  return (
    <section id="apply" className="py-12 sm:py-16 scroll-mt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <SectionEyebrow icon={<Sparkles className="h-3.5 w-3.5" />}>Заявка</SectionEyebrow>
        <h2 className="mt-3 font-display font-bold text-3xl sm:text-5xl">
          Подать заявку на участие
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-muted-foreground text-base sm:text-lg">
          Расскажите, кто вы и где публикуете идеи. Мы свяжемся и подскажем
          следующий шаг.
        </p>

        <div className="mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-elegant text-left">
          <ApplyForm />
        </div>
      </div>
    </section>
  );
}

function ApplyForm() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"" | "Профучастник" | "Частный аналитик">("Профучастник");
  const [link, setLink] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = applicationSchema.safeParse({ name, status, link, email });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("applications").insert({
      name: parsed.data.name,
      status: parsed.data.status,
      link: parsed.data.link,
      email: parsed.data.email,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }
    setSuccess(true);
    setName("");
    setStatus("Профучастник");
    setLink("");
    setEmail("");
    toast.success("Спасибо! Заявка отправлена.");
  };

  if (success) {
    return (
      <div className="min-h-[260px] flex flex-col items-center justify-center text-center">
        <div className="grid place-items-center w-14 h-14 rounded-full bg-gradient-gold text-background">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h4 className="mt-5 font-display font-bold text-xl">Спасибо! Заявка отправлена.</h4>
        <p className="mt-2 text-sm text-muted-foreground">Мы свяжемся с вами.</p>
        <p className="mt-6 text-sm text-accent-cyan">
          Можно приступать к придумыванию инвест-идей!
        </p>
      </div>
    );
  }

  const statusOptions: Array<"Профучастник" | "Частный аналитик"> = [
    "Профучастник",
    "Частный аналитик",
  ];

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
      <Field id="name" label="Ваше имя / Бренд" error={errors.name}>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Федор Баффет"
          className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          aria-invalid={!!errors.name}
          required
        />
      </Field>

      <Field id="status" label="Статус" error={errors.status}>
        <div
          role="radiogroup"
          aria-label="Статус"
          className="grid grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-background border border-border"
        >
          {statusOptions.map((opt) => {
            const active = status === opt;
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setStatus(opt)}
                className={`h-10 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        id="link"
        label="Ссылка на компанию, блог, канал или сайт"
        error={errors.link}
      >
        <input
          id="link"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://t.me/your_channel или @your_nickname"
          className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          aria-invalid={!!errors.link}
          required
        />
      </Field>

      <Field id="email" label="E-mail для связи" error={errors.email}>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
          aria-invalid={!!errors.email}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-base font-semibold bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95 transition disabled:opacity-60"
      >
        {submitting ? "Отправляем..." : "Отправить заявку"}
        {!submitting && <ArrowRight className="h-4 w-4" />}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- FOOTER ---------- */

function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-gradient-primary">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="font-display font-bold text-lg">
                Конкурс аналитиков <span className="text-gradient-primary">2026</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Открытый конкурс аналитики по российскому фондовому рынку.
              Организатор — Invest-idei.ru при поддержке ПАО Московская Биржа.
            </p>
            <a
              href="mailto:konkurs@invest-idei.ru"
              className="mt-5 inline-flex items-center gap-2 text-sm text-foreground hover:text-accent-cyan transition-colors"
            >
              <Mail className="h-4 w-4" />
              konkurs@invest-idei.ru
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Разделы
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={anchorHref(n.id)}
                    onClick={(e) => onAnchorClick(e, n.id)}
                    className="text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Документы и ресурсы
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={MOEX_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  Информация на сайте Мосбиржи
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://invest-idei.ru/uploads/6a1502b95023c.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1.5"
                >
                  Регламент конкурса
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground">
          <div>© 2026 Invest-idei.ru. Все права защищены.</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- MOBILE STICKY APPLY ---------- */

function MobileApplyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40">
      <a
        href={anchorHref("apply")}
        onClick={(e) => onAnchorClick(e, "apply")}
        className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold bg-gradient-primary text-primary-foreground shadow-glow"
      >
        Подать заявку
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------- helpers ---------- */

function SectionEyebrow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/60 text-xs font-medium text-muted-foreground">
      {icon}
      {children}
    </div>
  );
}
