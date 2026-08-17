/* Design reminder — L’Atelier de l’Ouverture: une landing éditoriale, chaleureuse et asymétrique; le safran ne signale que l’action ou le progrès. */
import { useState } from "react";
import { ArrowDown, ArrowUpRight, Check, ChevronRight, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

const boardRows = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "", "♜"],
  ["♟", "♟", "♟", "", "", "♟", "♟", "♟"],
  ["", "", "", "", "", "♞", "", ""],
  ["", "", "", "♟", "", "", "", ""],
  ["", "", "", "♙", "", "", "", ""],
  ["", "", "♘", "", "", "♘", "", ""],
  ["♙", "♙", "♙", "", "", "♙", "♙", "♙"],
  ["♖", "", "♗", "♕", "♔", "♗", "", "♖"],
];

function Mark() {
  return <img className="h-10 w-10 object-contain" src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663890875436/WMeJhgIGICmYOuIM.png" alt="Symbole Échiquier" />;
}

function MiniBoard() {
  return (
    <div className="hero-board relative mx-auto w-[min(80vw,440px)] shrink-0 rotate-[-2.5deg] bg-[#153d36] p-2 shadow-[20px_24px_0_rgba(31,32,22,.16),0_20px_45px_rgba(24,42,35,.22)] sm:p-3">
      <div className="grid grid-cols-8 overflow-hidden border border-[#fff6e5]/50">
        {boardRows.flatMap((row, rowIndex) => row.map((piece, columnIndex) => {
          const isDark = (rowIndex + columnIndex) % 2 === 1;
          const focus = (rowIndex === 3 && columnIndex === 3) || (rowIndex === 4 && columnIndex === 3);
          return (
            <div key={`${rowIndex}-${columnIndex}`} className={`relative flex aspect-square items-center justify-center ${isDark ? "bg-[#3a6658]" : "bg-[#f4e5c2]"} ${focus ? "after:absolute after:inset-[12%] after:border-2 after:border-[#d69024]" : ""}`}>
              {piece && <span className={`relative z-10 font-serif text-[clamp(1.2rem,4vw,2.8rem)] leading-none ${rowIndex < 4 ? "text-[#182d28]" : "text-[#fffaf0] [text-shadow:0_1px_0_#4b3c29]"}`}>{piece}</span>}
            </div>
          );
        }))}
      </div>
      <div className="absolute -right-3 top-[35%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#fbf6e9] bg-[#d69024] text-lg font-extrabold text-[#173e37] shadow-lg">e4</div>
      <div className="absolute -bottom-7 left-8 flex items-center gap-2 bg-[#fbf6e9] px-4 py-3 text-xs font-extrabold uppercase tracking-[.12em] text-[#173e37] shadow-lg"><span className="h-2 w-2 rounded-full bg-[#d69024]" /> Coup à jouer</div>
    </div>
  );
}

function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();
  return <button type="button" onClick={toggleLanguage} aria-label={`${t("language")}: ${language === "fr" ? t("english") : t("french")}`} className="inline-flex h-10 items-center border border-[#b8aa86] px-3 text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] transition-colors hover:border-[#d69024] hover:bg-[#f5ecd7]"><span aria-hidden="true">{language === "fr" ? "EN" : "FR"}</span><span className="sr-only">{language === "fr" ? t("english") : t("french")}</span></button>;
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? t("lightMode") : t("darkMode")}
      aria-pressed={isDark}
      className="theme-toggle group inline-flex h-10 items-center gap-2 border border-[#b8aa86] px-3 text-[.62rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] transition-colors hover:border-[#d69024] hover:bg-[#f5ecd7]"
    >
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#173e37] text-[#fffaf0] transition-transform duration-200 group-hover:scale-105">
        {isDark ? <Sun size={12} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}
      </span>
      <span className="hidden min-[1180px]:inline">{isDark ? t("light") : t("dark")}</span>
    </button>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="echequier-site min-h-screen overflow-hidden bg-[#fbf6e9] text-[#27241d]">
      <header className="echequier-header paper-texture relative z-30 border-b border-[#cbc09f]">
        <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" aria-label="Échiquier, retour au début" className="group flex items-center gap-3">
            <Mark />
            <div className="leading-none"><span className="display-font block text-[1.6rem] tracking-[-.04em]">Échiquier</span><span className="block pt-1 text-[.58rem] font-extrabold uppercase tracking-[.18em] text-[#766d57]">Apprendre en jouant</span></div>
          </a>
          <nav className="hidden items-center gap-8 text-[.7rem] font-extrabold uppercase tracking-[.12em] lg:flex" aria-label="Navigation principale">
            <a className="transition-colors hover:text-[#8b6217]" href="/path">{language === "fr" ? "Le parcours" : "The path"}</a>
            <a className="transition-colors hover:text-[#8b6217]" href="#methode">{language === "fr" ? "La méthode" : "The method"}</a>
            <a className="transition-colors hover:text-[#8b6217]" href="#puzzle">{language === "fr" ? "Puzzle du jour" : "Daily puzzle"}</a>
          </nav>
          <div className="hidden items-center gap-3 lg:flex"><LanguageToggle /><ThemeToggle /><a href="/account" className="text-[.65rem] font-extrabold uppercase tracking-[.12em] text-[#173e37] hover:text-[#8b6217]">{t("account")}</a><a href="/lesson/1" className="button-ink !min-h-10 !px-5">{t("tryFirstMove")} <ArrowUpRight size={15} /></a></div>
          <div className="flex items-center gap-2 lg:hidden"><LanguageToggle /><ThemeToggle /><button className="grid h-11 w-11 place-items-center border border-[#b8aa86]" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={language === "fr" ? "Ouvrir le menu" : "Open menu"}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div>
        </div>
        {menuOpen && <div className="echequier-mobile-menu absolute inset-x-0 top-full border-b border-[#cbc09f] bg-[#fbf6e9] px-5 py-5 shadow-xl lg:hidden"><nav className="flex flex-col gap-4 text-sm font-extrabold"><a onClick={closeMenu} href="/path">{language === "fr" ? "Le parcours" : "The path"}</a><a onClick={closeMenu} href="#methode">{language === "fr" ? "La méthode" : "The method"}</a><a onClick={closeMenu} href="#puzzle">{language === "fr" ? "Puzzle du jour" : "Daily puzzle"}</a><a onClick={closeMenu} href="/account">{t("account")}</a></nav></div>}
      </header>

      <main id="top">
        <section className="echequier-hero paper-texture relative isolate border-b border-[#cbc09f]">
          <div className="hero-sidewash absolute inset-y-0 right-0 -z-10 hidden w-[46%] bg-[#e8d7ae]/50 lg:block" />
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[.94fr_1.06fr] lg:px-12 lg:pb-28 lg:pt-24">
            <div className="rise-in relative z-10 flex max-w-xl flex-col items-start lg:pt-8">
              <div className="mb-7 flex items-center gap-3"><span className="h-px w-10 bg-[#d69024]" /><span className="eyebrow">{language === "fr" ? "Le premier coup compte" : "The first move matters"}</span></div>
              <h1 className="display-font max-w-[11ch] text-[clamp(3.8rem,7.2vw,7rem)] leading-[.88] tracking-[-.06em] text-[#173e37]">{language === "fr" ? "Votre prochain coup peut tout changer." : "Your next move can change everything."}</h1>
              <p className="mt-8 max-w-[48ch] text-[1rem] leading-8 text-[#5d594d] sm:text-[1.08rem]">{language === "fr" ? "Des leçons courtes, des positions à jouer et des repères concrets pour apprendre les échecs sans vous perdre dans la théorie." : "Short lessons, playable positions and practical guidance to learn chess without getting lost in theory."}</p>
              <div className="mt-9 flex flex-wrap items-center gap-3"><a href="/lesson/1" className="button-ink">{t("startLesson")} <ArrowUpRight size={16} /></a><a href="#methode" className="inline-flex items-center gap-2 px-3 py-3 text-xs font-extrabold uppercase tracking-[.1em] text-[#173e37] transition-colors hover:text-[#8b6217]">{t("viewMethod")} <ArrowDown size={16} /></a></div>
              <div className="mt-16 flex gap-8 border-l border-[#b6a985] pl-5"><div><span className="display-font block text-3xl leading-none text-[#173e37]">12 min</span><span className="mt-2 block text-[.62rem] font-extrabold uppercase tracking-[.13em] text-[#756d58]">{language === "fr" ? "par leçon" : "per lesson"}</span></div><div><span className="display-font block text-3xl leading-none text-[#173e37]">1 coup</span><span className="mt-2 block text-[.62rem] font-extrabold uppercase tracking-[.13em] text-[#756d58]">{language === "fr" ? "à la fois" : "at a time"}</span></div></div>
            </div>
            <div className="rise-in-delay relative flex min-h-[390px] items-center justify-center pb-6 pt-9 sm:min-h-[510px] lg:justify-end lg:pb-10">
              <span className="pointer-events-none absolute right-[4%] top-[7%] select-none font-mono text-[clamp(4.6rem,11vw,10rem)] font-bold leading-none text-[#173e37]/[.055]">e4</span>
              <div className="absolute bottom-0 right-[1%] hidden h-[82%] w-[82%] border border-[#c5b587] lg:block" />
              <MiniBoard />
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663890875436/XFOFssOQLDvPiBrr.png" alt="Position d’ouverture sur un échiquier en bois" className="absolute -right-10 bottom-3 -z-10 hidden h-[62%] w-[68%] object-cover opacity-65 mix-blend-multiply lg:block" />
            </div>
          </div>
          <div className="checker-line h-3" />
        </section>

        <section id="parcours" className="echequier-path relative bg-[#fffaf0] py-24 sm:py-32">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid items-end gap-9 border-b border-[#cfc3a5] pb-11 lg:grid-cols-[1.2fr_.8fr]">
              <div><p className="eyebrow">{language === "fr" ? "Un parcours, pas un labyrinthe" : "A path, not a maze"}</p><h2 className="display-font mt-5 max-w-[10ch] text-5xl leading-[.93] tracking-[-.045em] text-[#173e37] sm:text-6xl">{language === "fr" ? "Comprendre. Jouer. Progresser." : "Understand. Play. Progress."}</h2></div>
              <p className="max-w-md text-[.95rem] leading-7 text-[#6b6555] lg:justify-self-end">{language === "fr" ? "Chaque niveau construit les bons réflexes avant de passer au suivant. Sans jargon, avec des positions qui ont du sens." : "Each level builds the right habits before you move on. No jargon, just meaningful positions."}</p>
            </div>
            <div className="mt-12 grid gap-px bg-[#d3c7aa] md:grid-cols-3">
              {(language === "fr" ? [{n:"01",title:"Les bases",text:"Le plateau, les pièces et les règles essentielles. Vous jouez votre première partie guidée.",tag:"5 leçons"},{n:"02",title:"Voir les menaces",text:"Repérez les attaques, protégez vos pièces et découvrez les motifs tactiques les plus utiles.",tag:"8 leçons"},{n:"03",title:"Penser un coup",text:"Apprenez une routine simple pour choisir votre coup, même lorsque l’échiquier semble complexe.",tag:"6 leçons"}] : [{n:"01",title:"The basics",text:"The board, the pieces and the essential rules. Play your first guided game.",tag:"5 lessons"},{n:"02",title:"See the threats",text:"Spot attacks, protect your pieces and discover useful tactical patterns.",tag:"8 lessons"},{n:"03",title:"Think one move ahead",text:"Learn a simple routine to choose your move, even when the board looks complex.",tag:"6 lessons"}]).map((item, index) => <article key={item.n} className={`group relative min-h-[290px] bg-[#fffaf0] p-7 transition-colors hover:bg-[#f5ecd7] sm:p-9 ${index === 1 ? "md:translate-y-8" : ""}`}><span className="font-mono text-xs font-bold text-[#d69024]">{item.n} /</span><h3 className="display-font mt-9 text-[2.35rem] leading-none tracking-[-.04em] text-[#173e37]">{item.title}</h3><p className="mt-5 max-w-[27ch] text-sm leading-6 text-[#625d50]">{item.text}</p><div className="absolute bottom-8 left-9 right-9 flex items-center justify-between"><span className="text-[.65rem] font-extrabold uppercase tracking-[.14em] text-[#756d58]">{item.tag}</span><span className="grid h-8 w-8 place-items-center border border-[#b9ab86] transition-all group-hover:border-[#d69024] group-hover:bg-[#d69024]"><ArrowUpRight size={15} /></span></div></article>)}
            </div>
          </div>
        </section>

        <section id="methode" className="echequier-method ink-panel relative overflow-hidden py-24 sm:py-32">
          <div className="absolute left-0 top-0 h-full w-[27%] checker-line opacity-10" />
          <div className="relative mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:px-12">
            <div className="flex flex-col items-start"><p className="eyebrow !text-[#e6b95e]">{language === "fr" ? "La méthode Échiquier" : "The Échiquier method"}</p><h2 className="display-font mt-5 max-w-[8ch] text-5xl leading-[.93] tracking-[-.045em] text-[#fffaf0] sm:text-6xl">{language === "fr" ? "La théorie attend. La position, non." : "Theory can wait. The position cannot."}</h2><p className="mt-7 max-w-[42ch] leading-7 text-[#d2d8ca]">{language === "fr" ? "Vous n’apprenez pas seulement ce qu’un coup signifie. Vous le jouez, vous l’observez, puis vous comprenez son idée." : "You do not only learn what a move means. You play it, observe it, then understand its idea."}</p><a href="#puzzle" className="button-paper mt-9">{language === "fr" ? "Découvrir un exercice" : "Discover an exercise"} <ArrowDown size={16} /></a></div>
            <div className="grid gap-px bg-[#66857c]/50 sm:grid-cols-3">{(language === "fr" ? [{icon:"01",title:"Une idée",text:"Une règle nette, expliquée avec le juste niveau de détail."},{icon:"02",title:"Une position",text:"Un échiquier concret à explorer et un objectif précis."},{icon:"03",title:"Un réflexe",text:"Une correction qui transforme le coup en méthode."}] : [{icon:"01",title:"An idea",text:"A clear rule, explained with just the right amount of detail."},{icon:"02",title:"A position",text:"A concrete board to explore with a precise objective."},{icon:"03",title:"A reflex",text:"A correction that turns a move into a method."}]).map((step) => <div key={step.icon} className="min-h-[255px] bg-[#173e37] p-7 sm:p-8"><span className="display-font text-4xl italic text-[#e6b95e]">{step.icon}</span><h3 className="display-font mt-10 text-3xl tracking-[-.03em]">{step.title}</h3><p className="mt-4 text-sm leading-6 text-[#cad4c9]">{step.text}</p></div>)}</div>
          </div>
        </section>

        <section id="puzzle" className="echequier-puzzle relative bg-[#e9dcc0] py-24 sm:py-32">
          <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.06fr_.94fr] lg:px-12">
            <div className="relative min-h-[360px] overflow-hidden border border-[#bba980] bg-[#f8f0df] sm:min-h-[510px]"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663890875436/VzXMIXHeEnedAtWF.png" alt="Cavalier et échiquier sur un carnet de travail" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#163d36] via-[#163d36]/70 to-transparent p-7 pt-24 text-[#fffaf0] sm:p-10"><p className="eyebrow !text-[#e6b95e]">{language === "fr" ? "Position d’entraînement" : "Training position"}</p><p className="display-font mt-3 text-3xl leading-tight">{language === "fr" ? <>Les blancs jouent.<br />Quel est votre plan ?</> : <>White to move.<br />What is your plan?</>}</p></div></div>
            <div className="lg:pl-8"><div className="flex items-center gap-3"><Sparkles size={16} className="text-[#a87416]" /><span className="eyebrow">{language === "fr" ? "Le puzzle du jour" : "Daily puzzle"}</span></div><h2 className="display-font mt-5 max-w-[8ch] text-5xl leading-[.93] tracking-[-.045em] text-[#173e37] sm:text-6xl">{language === "fr" ? "Un peu de jeu. Beaucoup de déclics." : "A little play. Many breakthroughs."}</h2><p className="mt-7 max-w-md leading-7 text-[#635d4d]">{language === "fr" ? "Chaque jour, une situation courte pour entraîner votre regard. Trouvez le coup, puis accédez à une explication qui vous aide à refaire le même raisonnement demain." : "Each day, a short position to train your eye. Find the move, then get an explanation that helps you repeat the reasoning tomorrow."}</p><div className="mt-9 space-y-3">{["Une position adaptée à votre niveau", "Des indices seulement si vous en avez besoin", "Une explication après votre essai"].map((line) => <div key={line} className="flex items-center gap-3 text-sm font-semibold text-[#39362d]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#d69024] text-[#173e37]"><Check size={14} strokeWidth={3} /></span>{line}</div>)}</div><a href="/lesson/1" className="button-ink mt-10">{language === "fr" ? "Je veux essayer" : "I want to try"} <ChevronRight size={16} /></a></div>
          </div>
          <div className="absolute right-[6%] top-[12%] hidden h-16 w-16 rotate-45 border border-[#b9a477] lg:block" />
        </section>

        <section className="echequier-cta bg-[#fffaf0] py-20 sm:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="relative overflow-hidden bg-[#173e37] px-7 py-12 text-[#fffaf0] sm:px-12 sm:py-16 lg:flex lg:items-end lg:justify-between"><div className="absolute right-0 top-0 h-full w-[35%] checker-line opacity-10" /><div className="relative"><p className="eyebrow !text-[#e6b95e]">{language === "fr" ? "La prochaine position vous attend" : "The next position is waiting"}</p><h2 className="display-font mt-5 max-w-[11ch] text-5xl leading-[.92] tracking-[-.045em] sm:text-6xl">{language === "fr" ? "Prenez le temps de bien jouer." : "Take the time to play well."}</h2></div><a href="#parcours" className="button-paper relative mt-9 lg:mt-0">{language === "fr" ? "Commencer gratuitement" : "Start for free"} <ArrowUpRight size={16} /></a></div></div>
        </section>
      </main>

      <footer className="echequier-footer border-t border-[#376057] bg-[#173e37] text-[#fffaf0]"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12"><div className="flex items-center gap-3"><Mark /><div><span className="display-font block text-2xl tracking-[-.03em]">Échiquier</span><span className="text-[.58rem] font-extrabold uppercase tracking-[.17em] text-[#bfcbbd]">{language === "fr" ? "Apprendre en jouant" : "Learn by playing"}</span></div></div><p className="max-w-sm text-xs leading-5 text-[#bfcbbd]">{language === "fr" ? "Un projet d’apprentissage des échecs pensé pour rendre la stratégie plus accessible, un coup à la fois." : "A chess learning project designed to make strategy more accessible, one move at a time."}</p><div className="text-[.62rem] font-extrabold uppercase tracking-[.15em] text-[#bfcbbd]">© 2026 Échiquier</div></div></footer>
    </div>
  );
}
