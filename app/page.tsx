"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Topic = "前程" | "关系" | "财运" | "灵感" | "平安";

type Fortune = {
  level: "上上" | "上吉" | "中吉" | "小吉" | "平";
  title: string;
  verse: [string, string, string, string];
  reading: string;
  action: string;
  caution: string;
  keywords: [string, string, string];
  signal: string;
};

const topics: Topic[] = ["前程", "关系", "财运", "灵感", "平安"];

const fortunes: Fortune[] = [
  {
    level: "上上",
    title: "云开见月",
    verse: ["长夜将阑灯未收", "微光已过旧城楼", "莫疑行路无人应", "风起之时正好舟"],
    reading: "你等待的转折并非突然降临，而是此前积累开始显形。眼下最重要的不是继续观望，而是让自己出现在机会能够发现的位置。",
    action: "在今天结束前，主动发出那封邮件、邀请或作品。",
    caution: "别用“再准备一下”掩饰对结果的担心。",
    keywords: ["显现", "主动", "顺风"],
    signal: "留意 21:00 前出现的第二次机会",
  },
  {
    level: "上吉",
    title: "竹影过窗",
    verse: ["疏影无声入小窗", "旧枝新节各相望", "不争一夜花颜色", "自有清风送远香"],
    reading: "缓慢并不等于停滞。你正在建立一种更耐久的节奏，短期内不够醒目，长期却会成为真正的优势。",
    action: "把最重要的事连续做满二十五分钟，不切换窗口。",
    caution: "不要拿自己的过程与别人的高光时刻比较。",
    keywords: ["生长", "节奏", "耐心"],
    signal: "绿色物件与数字 4 会带来提醒",
  },
  {
    level: "中吉",
    title: "渡口逢灯",
    verse: ["潮来渡口水初平", "隔岸人家一盏明", "若问前程何处去", "先循灯火再听风"],
    reading: "方向不必一次看清。先选择信息更充分、反馈更快速的一步，小范围试探会比宏大计划更快带你靠岸。",
    action: "把大决定缩成一个可以在四十八小时内验证的实验。",
    caution: "警惕只让你兴奋、却无法验证的判断。",
    keywords: ["试探", "反馈", "靠岸"],
    signal: "一句无意听见的话会补上缺失的信息",
  },
  {
    level: "小吉",
    title: "炉中有火",
    verse: ["寒雨敲檐客未归", "炉心一点尚光辉", "莫嫌此夜风声紧", "守到晨明暖自回"],
    reading: "外界暂时不配合，但你的核心资源仍在。保存体力、守住底线，比勉强扩张更有价值。",
    action: "删掉一项非必要承诺，为真正重要的事留出余温。",
    caution: "疲惫时不要替未来做永久决定。",
    keywords: ["保存", "边界", "回暖"],
    signal: "温热饮品与来自旧友的消息",
  },
  {
    level: "上吉",
    title: "双鹤同川",
    verse: ["一川秋水映双翎", "各带长风各自鸣", "不是同行须同路", "心知彼此便安宁"],
    reading: "真正稳固的关系不要求时时同步。给彼此留下独立空间，反而能让沟通回到真诚而轻盈的位置。",
    action: "表达需求时先说感受，再说期待，不替对方下结论。",
    caution: "不要把沉默自动翻译成拒绝。",
    keywords: ["空间", "真诚", "同行"],
    signal: "水边、桥上或蓝色画面中的巧合",
  },
  {
    level: "平",
    title: "雾锁前山",
    verse: ["山前白雾未曾开", "樵客停肩坐石苔", "不是此间无去路", "只因天色尚须来"],
    reading: "当前信息不足，强行推进只会把猜测变成成本。允许事情暂停片刻，答案会随着新事实自然清晰。",
    action: "列出你仍不知道的三件事，只处理能够补充信息的动作。",
    caution: "今天不适合用情绪填补信息空白。",
    keywords: ["等待", "求证", "留白"],
    signal: "答案可能在第三次确认后出现",
  },
  {
    level: "中吉",
    title: "石上新泉",
    verse: ["旧石无言岁月深", "忽闻泉响出层阴", "涓涓不问江河远", "先向低洼自在寻"],
    reading: "新的可能正从被忽略的角落出现。它起初很小，甚至不像答案，但持续关注会发现它有自己的流向。",
    action: "重新查看那个被你搁置的小想法，并为它做一个最简版本。",
    caution: "不要因为起点朴素就低估长期复利。",
    keywords: ["新生", "原型", "复利"],
    signal: "清晨最先想到的念头值得记录",
  },
  {
    level: "小吉",
    title: "归鸟识林",
    verse: ["暮色沉沉路几重", "归禽不问旧行踪", "但凭一线林间气", "越过千山认晚钟"],
    reading: "当分析彼此冲突时，你身体的反应可能更诚实。那个让你呼吸舒展的方向，通常更接近内心真正的选择。",
    action: "离开屏幕十分钟，再分别想象两个选择后的普通一天。",
    caution: "直觉不是冲动；真正的直觉往往安静而稳定。",
    keywords: ["归属", "身体", "辨认"],
    signal: "钟声、鸟鸣或熟悉气味带来的确认",
  },
  {
    level: "上上",
    title: "星落掌中",
    verse: ["天河昨夜转新枢", "一点星芒落玉壶", "若把奇思藏袖里", "清晨醒后便模糊"],
    reading: "灵感窗口已经开启，但它需要立刻被捕捉。此刻先不要判断是否成熟，完整记录比立即优化更重要。",
    action: "用十五分钟做出一个粗糙、可见、可分享的草图。",
    caution: "第一版的任务是存在，不是完美。",
    keywords: ["灵感", "捕捉", "初稿"],
    signal: "突然出现的三个连续联想",
  },
  {
    level: "中吉",
    title: "风回旧庭",
    verse: ["旧院苔痕雨后青", "东风又过小轩亭", "当年未解花中意", "今日重看别样明"],
    reading: "过去没有完成的事正在以新形式返回。你已经不是当时的你，因此这一次可以用更成熟的方法重新作答。",
    action: "联系一个曾经合作愉快的人，或重读一份旧笔记。",
    caution: "回到过去是为了取回资源，不是重复遗憾。",
    keywords: ["重逢", "复盘", "更新"],
    signal: "旧照片、旧文件或重复出现的名字",
  },
  {
    level: "平",
    title: "月照空阶",
    verse: ["月白阶前夜气清", "无人来去亦无声", "空庭不是全无事", "正好听心落一更"],
    reading: "今日的空白并非浪费，它在帮助你辨认哪些欲望来自自己，哪些只是外界噪声。休息本身也是有效行动。",
    action: "为自己保留一段不被输入占据的时间。",
    caution: "不要把暂时的安静误判为被世界遗忘。",
    keywords: ["安静", "清理", "复位"],
    signal: "月光或白色空间会让答案变清楚",
  },
  {
    level: "上吉",
    title: "鱼跃春池",
    verse: ["春水初生石岸宽", "游鳞试跃破微寒", "一圈波动虽轻浅", "已报东风到此间"],
    reading: "局面正由静转动。第一次尝试不需要惊人，只要它能制造真实反馈，就会引来下一层机会。",
    action: "公开一个你已经做到七成的成果，并邀请具体反馈。",
    caution: "不要等到毫无风险才开始，那一天不会出现。",
    keywords: ["启动", "公开", "回响"],
    signal: "来自陌生人的积极回应",
  },
];

const topicSalt: Record<Topic, number> = {
  前程: 11,
  关系: 23,
  财运: 37,
  灵感: 53,
  平安: 71,
};

function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function fortuneIndex(topic: Topic, date = new Date()) {
  const seed = Number(dateKey(date).replaceAll("-", "")) + topicSalt[topic];
  return Math.abs((seed * 9301 + 49297) % 233280) % fortunes.length;
}

function playOracleTone(enabled: boolean) {
  if (!enabled) return;
  const AudioContextClass = window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.11, context.currentTime + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.35);
  master.connect(context.destination);
  [196, 293.66, 440].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.52 / (index + 1);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(context.currentTime + index * 0.12);
    oscillator.stop(context.currentTime + 1.4);
  });
  window.setTimeout(() => void context.close(), 1600);
}

function drawShareCard(fortune: Fortune, topic: Topic, serial: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#070b0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const glow = ctx.createRadialGradient(900, 260, 20, 900, 260, 700);
  glow.addColorStop(0, "rgba(214, 255, 82, .22)");
  glow.addColorStop(1, "rgba(214, 255, 82, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(214,255,82,.20)";
  ctx.lineWidth = 2;
  for (let x = 40; x < canvas.width; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 40; y < canvas.height; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#d6ff52";
  ctx.lineWidth = 3;
  ctx.strokeRect(54, 54, 1092, 1392);
  ctx.fillStyle = "#d6ff52";
  ctx.font = "600 30px ui-monospace, monospace";
  ctx.fillText("TIANJI ORACLE / 天机接口", 94, 124);
  ctx.fillStyle = "rgba(231,239,232,.55)";
  ctx.font = "24px ui-monospace, monospace";
  ctx.fillText(`今日所问：${topic}  ·  ${serial}`, 94, 178);

  ctx.fillStyle = "#f24d34";
  ctx.font = '800 58px "Songti SC", "STSong", serif';
  ctx.fillText(`${fortune.level}签`, 94, 332);
  ctx.fillStyle = "#f2efe4";
  ctx.font = '800 120px "Songti SC", "STSong", serif';
  ctx.fillText(fortune.title, 94, 468);

  ctx.fillStyle = "rgba(242,239,228,.86)";
  ctx.font = '42px "Kaiti SC", "STKaiti", serif';
  fortune.verse.forEach((line, index) => ctx.fillText(line, 104, 612 + index * 76));

  ctx.fillStyle = "#d6ff52";
  ctx.font = "600 24px ui-monospace, monospace";
  ctx.fillText("ORACLE DECODE / 天机解码", 94, 986);
  ctx.fillStyle = "rgba(242,239,228,.82)";
  ctx.font = '34px "PingFang SC", sans-serif';
  const words = fortune.reading.split("");
  let line = "";
  let y = 1050;
  for (const word of words) {
    const testLine = line + word;
    if (ctx.measureText(testLine).width > 1000) {
      ctx.fillText(line, 94, y);
      line = word;
      y += 56;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 94, y);

  ctx.fillStyle = "#f24d34";
  ctx.fillRect(94, 1300, 12, 12);
  ctx.fillStyle = "rgba(242,239,228,.7)";
  ctx.font = "26px ui-monospace, monospace";
  ctx.fillText(`今日关键词：${fortune.keywords.join(" / ")}`, 126, 1312);
  ctx.fillText("仅供娱乐 · 愿你相信自己的判断", 94, 1380);

  const link = document.createElement("a");
  link.download = `天机签-${dateKey()}-${topic}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function Home() {
  const [topic, setTopic] = useState<Topic>("前程");
  const [phase, setPhase] = useState<"idle" | "drawing" | "revealed">("idle");
  const [sound, setSound] = useState(true);
  const [shareStatus, setShareStatus] = useState("");
  const [history, setHistory] = useState<Array<{ date: string; topic: Topic; title: string; level: string }>>([]);
  const resultRef = useRef<HTMLElement>(null);
  const fortune = useMemo(() => fortunes[fortuneIndex(topic)], [topic]);
  const serial = `TJ-${dateKey().replaceAll("-", "")}-${String(fortuneIndex(topic) + 1).padStart(2, "0")}`;

  useEffect(() => {
    const storageRead = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("tianji-history");
        if (stored) setHistory(JSON.parse(stored));
        setSound(window.localStorage.getItem("tianji-sound") !== "off");
      } catch {
        // The experience still works when browser storage is unavailable.
      }
    }, 0);
    return () => window.clearTimeout(storageRead);
  }, []);

  useEffect(() => {
    if (phase === "revealed") resultRef.current?.focus();
  }, [phase]);

  const drawFortune = () => {
    if (phase === "drawing") return;
    setPhase("drawing");
    window.setTimeout(() => {
      setPhase("revealed");
      playOracleTone(sound);
      const entry = { date: dateKey(), topic, title: fortune.title, level: fortune.level };
      setHistory((current) => {
        const next = [entry, ...current.filter((item) => !(item.date === entry.date && item.topic === entry.topic))].slice(0, 5);
        try {
          window.localStorage.setItem("tianji-history", JSON.stringify(next));
        } catch {
          // Ignore storage errors.
        }
        return next;
      });
    }, 1700);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    try {
      window.localStorage.setItem("tianji-sound", next ? "on" : "off");
    } catch {
      // Ignore storage errors.
    }
  };

  return (
    <main className="site-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="scanline" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="天机接口首页">
          <span className="brand-mark">卜</span>
          <span><b>天机接口</b><small>TIANJI ORACLE</small></span>
        </a>
        <div className="system-state"><i /> SYSTEM ONLINE <span>/ 天元协议</span></div>
        <button className="sound-toggle" type="button" onClick={toggleSound} aria-pressed={sound}>
          <span aria-hidden="true">{sound ? "◉" : "○"}</span> 声音 {sound ? "开" : "关"}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>NO. 01</span> 今日问卦 · 每日一签</div>
          <h1>向未知<br /><em>借一束光</em></h1>
          <p className="hero-lead">选择你此刻最想问的事。天机不会替你决定，只会照亮那些已经存在、却尚未被看见的线索。</p>
          <div className="meta-row">
            <span suppressHydrationWarning>坐标 / {Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric" }).format(new Date())}</span>
            <span>算法 / 本日固定</span>
            <span>用途 / 仅供娱乐</span>
          </div>
        </div>

        <div className={`oracle-machine ${phase}`} aria-label="求签终端">
          <div className="machine-index">天<br />机<br /><b>一</b><br />号</div>
          <div className="machine-screen">
            <div className="screen-head"><span>DIVINATION TERMINAL</span><span>{phase === "drawing" ? "SCANNING" : "READY"}</span></div>
            <div className="oracle-core" aria-hidden="true">
              <div className="orbit orbit-a"><span>☰</span><span>☷</span></div>
              <div className="orbit orbit-b"><span>☵</span><span>☲</span></div>
              <div className="core-seal">問<small>{topic}</small></div>
            </div>
            <div className="signal-bars" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} />)}</div>
            <div className="screen-status"><span>{phase === "drawing" ? "正在接入今日天机…" : phase === "revealed" ? "签文已解码" : "请先选择所问之事"}</span><b>{phase === "drawing" ? "•••" : "◌"}</b></div>
          </div>
        </div>
      </section>

      <section className="ritual-panel" aria-labelledby="ritual-title">
        <div className="ritual-heading">
          <span>STEP 01 / SET INTENTION</span>
          <h2 id="ritual-title">你今日，所问何事？</h2>
        </div>
        <div className="topic-picker" role="group" aria-label="选择问事方向">
          {topics.map((item, index) => (
            <button
              type="button"
              className={topic === item ? "active" : ""}
              aria-pressed={topic === item}
              key={item}
              onClick={() => { setTopic(item); setPhase("idle"); }}
            >
              <small>0{index + 1}</small><span>{item}</span><i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
        <button className="draw-button" type="button" onClick={drawFortune} disabled={phase === "drawing"}>
          <span>{phase === "drawing" ? "正在连接天机" : phase === "revealed" ? "再观此签" : "抽取今日签文"}</span>
          <i aria-hidden="true">{phase === "drawing" ? "◌" : "→"}</i>
        </button>
        <p className="ritual-note">同一日期与问事方向对应同一支签。命运可以重看，不能刷新。</p>
      </section>

      {phase === "revealed" && (
        <section className="fortune-result" ref={resultRef} tabIndex={-1} aria-live="polite" aria-labelledby="fortune-title">
          <div className="result-aside">
            <span className="vertical-label">ORACLE RECEIVED</span>
            <div className="seal"><strong>{fortune.level}</strong><span>签</span></div>
            <p>{serial}</p>
          </div>

          <article className="fortune-paper">
            <header>
              <div><small>今日签题 / FORTUNE TITLE</small><h2 id="fortune-title">{fortune.title}</h2></div>
              <span className="fortune-topic">问 · {topic}</span>
            </header>
            <div className="verse" aria-label={`签诗：${fortune.verse.join("，")}`}>
              {fortune.verse.map((line) => <p key={line}>{line}</p>)}
            </div>
            <div className="decode">
              <span className="section-code">02 / 天机解码</span>
              <p>{fortune.reading}</p>
            </div>
            <div className="guidance-grid">
              <div><small>今日行动</small><p>{fortune.action}</p></div>
              <div><small>留意</small><p>{fortune.caution}</p></div>
            </div>
            <div className="fortune-footer">
              <div className="keywords">{fortune.keywords.map((word) => <span key={word}>#{word}</span>)}</div>
              <p><small>LUCKY SIGNAL</small>{fortune.signal}</p>
            </div>
            <div className="result-actions">
              <button type="button" onClick={() => drawShareCard(fortune, topic, serial)}>保存分享签卡 <span>↓</span></button>
              <button type="button" onClick={async () => {
                const text = `我的今日${topic}签：${fortune.level} · ${fortune.title}\n${fortune.verse.join(" / ")}\n${window.location.href}`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: "天机接口 · 今日一签", text, url: window.location.href });
                    setShareStatus("分享面板已打开");
                  } else {
                    await navigator.clipboard.writeText(text);
                    setShareStatus("签文已复制");
                  }
                } catch {
                  setShareStatus("已取消分享");
                }
              }}>分享今日天机 <span>↗</span></button>
            </div>
            <p className="share-status" role="status" aria-live="polite">{shareStatus}</p>
          </article>
        </section>
      )}

      <section className="archive" aria-labelledby="archive-title">
        <div>
          <span className="section-code">03 / ORACLE ARCHIVE</span>
          <h2 id="archive-title">近日签录</h2>
        </div>
        {history.length > 0 ? (
          <ol>
            {history.map((item) => (
              <li key={`${item.date}-${item.topic}`}>
                <time>{item.date.replaceAll("-", ".")}</time><span>问 · {item.topic}</span><strong>{item.title}</strong><em>{item.level}</em>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty-archive">尚无签录。完成第一次问卦后，你的记录会保存在这台设备上。</p>
        )}
      </section>

      <footer>
        <div className="footer-mark">天机接口 <span>β</span></div>
        <p>答案从不在签中，它只是提醒你如何看见自己。</p>
        <p className="copyright" suppressHydrationWarning>© {new Date().getFullYear()} TIANJI ORACLE · FOR ENTERTAINMENT ONLY</p>
      </footer>
    </main>
  );
}
