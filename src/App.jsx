import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowUpLeft, ArrowUpRight, Atom, BrainCircuit, Check, ChevronDown,
  ChevronLeft, ChevronRight, Code2, Cpu, Gamepad2, GraduationCap, Instagram,
  Laptop, Menu, MessageCircle, Monitor, MousePointer2, Play, Rocket, Send,
  Sparkles, Star, Target, Users, X, Zap, Clock3, BookOpen, ShieldCheck,
  Lightbulb, Globe2, HeartHandshake, Trophy, Layers3, ExternalLink, Mail, Phone,
  Facebook, Youtube, MoveUpRight, Moon, Sun, Compass, RotateCcw
} from 'lucide-react';
import { siteData } from './data/siteData';
import instructorFarahCartoon from './assets/instructor-farah-cartoon.webp';

const AGES = [['7-9', '7 – 9 سنين'], ['10-12', '10 – 12 سنة'], ['13+', '13 سنة أو أكتر']];
const EXPS = [['none', 'لسه هيبدأ'], ['scratch', 'خلّص Scratch'], ['coding', 'عنده خبرة في البرمجة']];
function recommend(age, exp) {
  if (exp === 'scratch') return ['pictoblox', age === '13+' ? 'web' : age === '10-12' ? 'python' : null];
  if (age === '7-9') return ['scratch', null];
  if (age === '10-12') return exp === 'coding' ? ['cpp', 'python'] : ['python', 'scratch'];
  return exp === 'coding' ? ['web', 'cpp'] : ['web', 'python'];
}
function PathFinder({ courses, onOpen, wa }) {
  const [age, setAge] = useState('');
  const [exp, setExp] = useState('');
  const [mainId, altId] = age && exp ? recommend(age, exp) : [];
  const main = courses.find(c => c.id === mainId);
  const alt = courses.find(c => c.id === altId);
  const label = (list, v) => (list.find(x => x[0] === v) || [])[1];
  const chips = (list, value, set) => list.map(([v, t]) => <button type="button" key={v} className={value === v ? 'pf-chip on' : 'pf-chip'} aria-pressed={value === v} onClick={() => set(v)}>{t}</button>);
  const link = main && `https://wa.me/${wa}?text=${encodeURIComponent(`السلام عليكم، عمر طفلي ${label(AGES, age)} ومستواه "${label(EXPS, exp)}"، وموقعكم رشّح لي مسار ${main.title}. حابب أعرف التفاصيل.`)}`;
  return (
    <section className="pf-section section-pad" id="pathfinder"><div className="section-wrap pf">
      <div className="pf-head"><div className="eyebrow"><span className="eyebrow-dot"/> PATH FINDER</div><h2>مش عارف <span>تبدأ بإيه؟</span></h2><p>جاوب على سؤالين بس، وهنرشحلك نقطة البداية المناسبة لطفلك.</p></div>
      <div className="pf-card">
        <fieldset><legend>عمر الطفل</legend><div className="pf-chips">{chips(AGES, age, setAge)}</div></fieldset>
        <fieldset><legend>خبرته الحالية</legend><div className="pf-chips">{chips(EXPS, exp, setExp)}</div></fieldset>
        <div className="pf-result" aria-live="polite">
          {main ? <>
            <span className="pf-badge"><Compass size={15}/> ترشيحنا ليه</span>
            <h3>{main.title}</h3><b>{main.subtitle}</b><p>{main.prerequisite}</p>
            <div className="pf-actions"><button type="button" className="btn btn-primary" onClick={() => onOpen(main.id)}>تفاصيل المسار <ArrowLeft size={16}/></button><a className="btn btn-light pf-wa" href={link} target="_blank" rel="noreferrer">كلمنا على واتساب</a><button type="button" className="pf-reset" onClick={() => { setAge(''); setExp(''); }}><RotateCcw size={14}/> من الأول</button></div>
            {alt && <small>بديل ممكن: <button type="button" onClick={() => onOpen(alt.id)}>{alt.title}</button> — الترشيح مبدئي والتأكيد النهائي حسب مستوى الطفل.</small>}
          </> : <p className="pf-empty">اختار العمر والخبرة وهيظهر الترشيح هنا.</p>}
        </div>
      </div>
    </div></section>
  );
}

const IconByCourse = ({ type, size = 22 }) => {
  const props = { size, strokeWidth: 1.8 };
  if (type === 'game') return <Gamepad2 {...props} />;
  if (type === 'python' || type === 'cpp') return <Code2 {...props} />;
  if (type === 'web') return <Monitor {...props} />;
  return <BrainCircuit {...props} />;
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Dark mode is the first-visit default; remember the visitor's choice afterward.
  const [isDark, setIsDark] = useState(() => {
    try { return window.localStorage.getItem('af-code-theme') !== 'light'; }
    catch { return true; }
  });
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem('af-code-theme', theme); } catch {}
  }, [isDark]);
  const [activeCourse, setActiveCourse] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ parent: '', phone: '', age: '', interest: '', note: '' });
  const [submitted, setSubmitted] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);
  const selectedCourse = siteData.courses.find(c => c.id === activeCourse);
  const waLink = `https://wa.me/${siteData.whatsapp}?text=${encodeURIComponent('السلام عليكم، حابب أعرف تفاصيل كورسات AF Code المناسبة لطفلي.')}`;

  useEffect(() => {
    if (!activeCourse) return;
    const onKey = (e) => e.key === 'Escape' && setActiveCourse(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [activeCourse]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const els = document.querySelectorAll('.section-pad .section-wrap > *, .metric, .course-card, .project-card, .team-card, .journey-step');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.1 });
    els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
    return () => io.disconnect();
  }, []);

  const navItems = [
    ['الرئيسية', '#home'], ['عن الأكاديمية', '#about'], ['الكورسات', '#courses'],
    ['المدرّبة', '#team'], ['المشاريع', '#projects'], ['تواصل معنا', '#contact']
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `استفسار جديد من موقع AF Code%0Aالاسم: ${encodeURIComponent(form.parent)}%0Aرقم التواصل: ${encodeURIComponent(form.phone)}%0Aعمر الطالب: ${encodeURIComponent(form.age)}%0Aالمجال المهتم به: ${encodeURIComponent(form.interest)}%0Aملاحظات: ${encodeURIComponent(form.note)}`;
    window.open(`https://wa.me/${siteData.whatsapp}?text=${msg}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="site-shell"><a className="skip-link" href="#main">تخطي إلى المحتوى</a>
      <div className="announcement"><Sparkles size={14} /> رحلة طفلك في عالم التكنولوجيا بتبدأ بفكرة <span>·</span> <b>احجز استشارة مجانية</b> <ArrowLeft size={13} /></div>
      <header className="header">
        <a className="brand" href="#home" aria-label="AF Code home">
          <span className="brand-mark"><span>A</span><span>F</span><i /></span>
          <span className="brand-copy"><strong>AF <em>CODE</em></strong><small>LEARN · CREATE · GROW</small></span>
        </a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={() => setIsDark(value => !value)} aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"} title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}>{isDark ? <Sun size={17} /> : <Moon size={17} />}<span>{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</span></button>
          <a className="header-login" href="#contact">استفسر عن الكورسات</a>
          <a className="btn btn-dark btn-small" href={waLink} target="_blank" rel="noreferrer">ابدأ الرحلة <ArrowUpLeft size={16} /></a>
        </div>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="فتح القائمة">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="main">
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> A NEW WAY TO LEARN TECHNOLOGY</div>
            <h1>مش بس بيتعلم كود،<br /><span>بيتعلم يصنع</span> <i>المستقبل.</i></h1>
            <p className="hero-lead">في AF Code بنحوّل فضول الأطفال لشغف، وأفكارهم لمشاريع حقيقية — بتجربة تعليم أونلاين تجمع بين اللعب، التفكير، والإبداع.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#courses">اكتشف الكورسات <ArrowLeft size={17} /></a>
              <a className="watch-link" href="#projects"><span className="play-circle"><Play size={15} fill="currentColor" /></span><span><b>شوف أفكار المشاريع</b><small>أفكار صغيرة بتكبر كل يوم</small></span></a>
            </div>
            <div className="hero-trust"><span><Clock3 size={15}/> 4 سيشن في كل مستوى</span><span><Laptop size={15}/> أونلاين بالكامل</span><span><Users size={15}/> مجموعات حسب المستوى</span></div>
          </div>
          <div className="hero-art" aria-label="رسم توضيحي للتعلم والبرمجة">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="hero-blob" />
            <div className="floating-tag tag-code"><Code2 size={17}/><span>let ideas = amazing;</span></div>
            <div className="floating-tag tag-ai"><BrainCircuit size={18}/><span>AI + Creativity</span></div>
            <div className="floating-tag tag-stars"><Sparkles size={16}/> Big ideas start here</div>
            <div className="hero-image-frame"><img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=90" alt="رسم كرتوني لمدرّبة برمجة في أكاديمية AF Code" /></div>
            <div className="hero-image-overlay" />
            <div className="robot-card"><div className="robot-face"><span/><span/></div><div><b>Meet your future</b><small>One line of code at a time</small></div><Sparkles size={20}/></div>
            <div className="mini-stat"><span className="stat-icon"><Rocket size={19}/></span><div><b>Learn by making</b><small>مشاريع مش حفظ وبس</small></div></div>
            <div className="hero-spark spark-a">✳</div><div className="hero-spark spark-b">✦</div>
          </div>
          <div className="hero-bottom-note"><span>01 / 04</span><div /><span>SCROLL TO EXPLORE</span><ChevronDown size={15}/></div>
        </section>

        <section className="metrics section-wrap" aria-label="مميزات الأكاديمية">
          <div className="metric-intro"><span className="mini-label">WHY AF CODE?</span><h2>التعلّم الصح،<br /><span>بيبان في اللي بنعمله.</span></h2></div>
          <div className="metric"><span className="metric-icon lilac"><Target /></span><strong>01</strong><b>تعلّم بالممارسة</b><small>كل فكرة وراها تجربة ومشروع.</small></div>
          <div className="metric"><span className="metric-icon peach"><Lightbulb /></span><strong>02</strong><b>فضول قبل الكود</b><small>نسأل، نجرب، ونكتشف الحل.</small></div>
          <div className="metric"><span className="metric-icon mint"><Trophy /></span><strong>03</strong><b>إنجازات ملموسة</b><small>الطالب يشوف تطوره بنفسه.</small></div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="section-wrap about-grid">
            <div className="about-visual">
              <div className="about-photo photo-main"><img src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?auto=format&fit=crop&w=900&q=85" alt="تعلّم تفاعلي" /></div>
              <div className="about-photo photo-small"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=85" alt="مشروع برمجي على شاشة" /></div>
              <div className="about-note"><span><HeartHandshake size={22}/></span><div><b>مساحة آمنة للتجربة</b><small>الغلط خطوة في طريق التعلّم</small></div></div>
              <div className="about-doodle">✳</div>
            </div>
            <div className="about-copy">
              <div className="eyebrow"><span className="eyebrow-dot" /> MORE THAN CODING</div>
              <h2>بنعلّمهم <span>يفكّروا،</span><br />قبل ما يكتبوا كود.</h2>
              <p>إحنا مؤمنين إن البرمجة مش مجرد لغة أو أوامر؛ دي طريقة تفكير بتعلّم الطفل يقسّم المشكلة، يجرّب حلول، ويحوّل خياله لحاجة يقدر يشوفها ويشاركها.</p>
              <p>عشان كده تجربتنا أونلاين مبنية على التفاعل، والمتابعة، ومشاريع تناسب سن كل طالب ومستواه.</p>
              <div className="about-points"><div><Check size={17}/> مجموعات مناسبة للمستوى</div><div><Check size={17}/> تطبيق عملي في كل مرحلة</div><div><Check size={17}/> متابعة وتغذية راجعة</div><div><Check size={17}/> عرض المشاريع والاحتفال بالتقدم</div></div>
              <a className="text-link" href="#journey">اكتشف طريقة التعلّم <ArrowLeft size={16}/></a>
            </div>
          </div>
        </section>

        <section className="courses-section section-pad" id="courses">
          <div className="section-wrap">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> OUR LEARNING PATHS</div><h2>كل طفل له <span>طريقته.</span></h2><p>اختار نقطة البداية، وإحنا هنساعدك تلاقي المسار اللي يناسب فضول طفلك واهتماماته.</p></div><a className="text-link" href="#pathfinder">مش عارف تختار؟ جرّب الترشيح السريع <ArrowLeft size={16}/></a></div>
            <div className="course-grid">
              {siteData.courses.map((course) => <article className={`course-card ${course.color}`} key={course.id}>
                <div className="course-top"><span className="course-number">{course.number} / PATH</span><span className="course-icon"><IconByCourse type={course.icon} size={24}/></span></div>
                <div className="course-meta"><span>{course.category}</span><span><Users size={13}/> {course.age}</span></div>
                <h3>{course.title}</h3><h4>{course.subtitle}</h4><p>{course.description}</p>
                <div className="course-footer"><div className="course-facts"><span><Layers3 size={14}/>{course.duration}</span><span><Clock3 size={14}/>{course.lessons}</span></div><button className="circle-arrow" onClick={() => setActiveCourse(course.id)} aria-label={`تفاصيل ${course.title}`}><ArrowUpLeft size={19}/></button></div>
              </article>)}
            </div>
            <div className="courses-bottom"><span className="course-bottom-icon"><Sparkles size={18}/></span><p><b>مش متأكد أنهي مسار مناسب؟</b> احكيلنا عن عمر طفلك واهتماماته، ونساعدك تختار بداية مريحة ليه.</p><a href={waLink} target="_blank" rel="noreferrer">خلينا نختار سوا <ArrowLeft size={15}/></a></div>
          </div>
        </section>

        <PathFinder courses={siteData.courses} onOpen={setActiveCourse} wa={siteData.whatsapp} />

        <section className="journey-section section-pad" id="journey">
          <div className="section-wrap journey-wrap">
            <div className="journey-heading"><div className="eyebrow"><span className="eyebrow-dot"/> THE AF CODE METHOD</div><h2>من أول <span>«أنا بجرب»</span><br />لحد «أنا عملتها!»</h2><p>رحلة واضحة، خطوة بخطوة، بتخلي الطفل شريك في تعلّمه مش مجرد متلقي.</p><a className="btn btn-light" href="#contact">ابدأ معانا <ArrowLeft size={16}/></a></div>
            <div className="journey-steps">
              <div className="journey-line" />
              <div className="journey-step"><span className="step-no">01</span><span className="step-icon"><MessageCircle/></span><div><h3>نتعرّف على اهتمامه</h3><p>نفهم سنه وخبرته والحاجات اللي بيحبها عشان نختار بداية مناسبة.</p><small>DISCOVER</small></div></div>
              <div className="journey-step"><span className="step-no">02</span><span className="step-icon"><Code2/></span><div><h3>نتعلّم بالتجربة</h3><p>مفاهيم صغيرة، تحديات ممتعة، وتطبيق عملي مع كل فكرة جديدة.</p><small>EXPERIMENT</small></div></div>
              <div className="journey-step"><span className="step-no">03</span><span className="step-icon"><Rocket/></span><div><h3>نبني مشروعه</h3><p>يجمع اللي اتعلمه في مشروع يعبر عن أفكاره ويقدر يطوره.</p><small>BUILD</small></div></div>
              <div className="journey-step"><span className="step-no">04</span><span className="step-icon"><Trophy/></span><div><h3>نعرض ونحتفل بالتقدم</h3><p>نراجع المشروع، نطوّره، ونشوف الخطوة الجاية في رحلته.</p><small>SHARE & GROW</small></div></div>
            </div>
          </div>
        </section>

        <section className="projects-section section-pad" id="projects">
          <div className="section-wrap">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> MADE WITH CURIOSITY</div><h2>أفكار بتتحوّل <span>لحاجة حقيقية.</span></h2><p>أمثلة لنوع المشاريع اللي بيبنيها الطلاب داخل المسارات. هنضيف هنا شغل طلاب AF Code الحقيقي بعد موافقة أولياء الأمور.</p></div><div className="slider-controls"><button onClick={() => setProjectIndex((projectIndex + siteData.projects.length - 1) % siteData.projects.length)} aria-label="المشروع السابق"><ChevronRight/></button><button onClick={() => setProjectIndex((projectIndex + 1) % siteData.projects.length)} aria-label="المشروع التالي"><ChevronLeft/></button></div></div>
            <div className="project-grid">
              {siteData.projects.map((project, index) => <article className={`project-card ${index === projectIndex ? 'project-featured' : ''}`} key={project.title}>
                <div className="project-image"><span className={`project-art art-${project.tone}`} aria-hidden="true"><IconByCourse type={project.icon} size={56}/></span><span className="project-tag">{project.tag}</span><span className="project-view"><ArrowUpLeft size={18}/></span></div>
                <div className="project-info"><div><h3>{project.title}</h3><p>{project.type}</p></div><span className="project-index">0{index + 1}</span></div>
              </article>)}
            </div>
            <div className="project-disclaimer"><span><Lightbulb size={17}/></span> دي أفكار مشاريع توضيحية، وليست أعمال طلاب حقيقية.</div>
          </div>
        </section>

        <section className="team-section section-pad" id="team">
          <div className="section-wrap">
            <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> THE INSTRUCTOR</div><h2>تعليم قريب من الطفل،<br /><span>وشرح على قد مستواه.</span></h2><p>خبرة في تبسيط البرمجة للأطفال وربط كل مفهوم بتطبيق عملي.</p></div><a className="text-link" href="#contact">تواصل مع الأكاديمية <ArrowLeft size={16}/></a></div>
            <div className="team-grid">
              {siteData.instructors.map((person, index) => <article className="team-card" key={person.name}>
                <div className="team-photo instructor-art" role="img" aria-label="رسم كرتوني توضيحي للمهندسة فرح الأشقر">
                  <img className="instructor-portrait" src={instructorFarahCartoon} alt="رسم كرتوني لمهندسة برمجة بحجاب بنفسجي في مساحة عمل تقنية" />
                  <span className="team-count">01</span><span className="team-verified"><Sparkles size={14}/> AF CODE TEAM</span>
                </div>
                <div className="team-content"><div className="team-role">{person.role}</div><h3>{person.name}</h3><p>{person.bio}</p><div className="skill-list">{person.specialty.split(' · ').map(skill => <span key={skill}>{skill}</span>)}</div><a href="#contact" className="team-link">اسأل عن المسار <ArrowUpLeft size={16}/></a></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="online-section section-pad">
          <div className="section-wrap online-card">
            <div className="online-copy"><div className="online-status"><span/> ONLINE ACADEMY</div><h2>مستقبل التعلّم مش محتاج <span>مكان.</span></h2><p>AF Code أكاديمية أونلاين حاليًا، عشان الطفل يقدر يتعلّم من مكانه، في بيئة مريحة، وبخطوات واضحة تناسبه.</p><div className="online-features"><span><Laptop/> جلسات أونلاين تفاعلية</span><span><BookOpen/> تطبيق ومشاريع</span><span><HeartHandshake/> تواصل مع ولي الأمر</span></div><a className="btn btn-primary" href="#contact">اعرف تفاصيل الدراسة <ArrowLeft size={16}/></a></div>
            <div className="online-visual"><div className="online-window"><div className="window-bar"><i/><i/><i/><span>AF CODE / CLASSROOM</span></div><div className="window-content"><div className="window-code"><span>01</span> <b>let</b> idea = <em>"future"</em>;<br/><span>02</span> <b>while</b> (curious) {'{'}<br/><span>03</span> &nbsp;&nbsp;learn();<br/><span>04</span> &nbsp;&nbsp;build();<br/><span>05</span> {'}'}</div><div className="window-badge"><span><Check size={19}/></span><div><b>Project completed!</b><small>You're getting better</small></div></div></div></div><div className="online-orbit"><Cpu size={26}/></div><div className="online-sticker"><Star size={15} fill="currentColor"/> Learn at your own pace</div></div>
          </div>
        </section>

        <section className="faq-section section-pad" id="faq">
          <div className="section-wrap faq-grid"><div className="faq-intro"><div className="eyebrow"><span className="eyebrow-dot"/> GOOD QUESTIONS</div><h2>قبل ما تبدأوا،<br /><span>خلّينا نجاوب.</span></h2><p>لو عندك سؤال تاني عن السن المناسب أو تفاصيل الكورسات، ابعت لنا وهنساعدك.</p><a className="text-link" href={waLink} target="_blank" rel="noreferrer">اسأل سؤال تاني <ArrowLeft size={16}/></a><div className="faq-decoration"><MessageCircle/><Sparkles/></div></div><div className="faq-list">
            {siteData.faqs.map((faq, index) => <div className={`faq-item ${openFaq === index ? 'faq-open' : ''}`} key={faq.q}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span className="faq-num">0{index + 1}</span><b>{faq.q}</b><span className="faq-toggle">{openFaq === index ? <X size={17}/> : <ChevronDown size={18}/>}</span></button>{openFaq === index && <p>{faq.a}</p>}</div>)}
          </div></div>
        </section>

        <section className="contact-section section-pad" id="contact">
          <div className="section-wrap contact-grid">
            <div className="contact-copy"><div className="eyebrow"><span className="eyebrow-dot"/> LET'S START SOMETHING</div><h2>أول خطوة صغيرة،<br /><span>ممكن تفتح عالم كبير.</span></h2><p>سيب بياناتك، وقولنا طفلك مهتم بإيه. هنتواصل معاك عشان نساعدك تختار المسار المناسب.</p>
              <div className="contact-methods"><a href={waLink} target="_blank" rel="noreferrer"><span className="contact-method-icon whatsapp"><MessageCircle/></span><span><small>الأسرع في التواصل</small><b>واتساب · {siteData.phoneDisplay}</b></span><ArrowUpLeft size={17}/></a><a href={`mailto:${siteData.email}`}><span className="contact-method-icon"><Mail/></span><span><small>للاستفسارات</small><b>{siteData.email}</b></span><ArrowUpLeft size={17}/></a></div>
              <div className="contact-note"><ShieldCheck size={17}/> بياناتك هتُستخدم للتواصل بخصوص استفسارك فقط.</div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-head"><span>01 — GET IN TOUCH</span><span className="form-spark"><Sparkles size={19}/></span></div>
              <h3>خلّينا نتعرّف عليكم.</h3><p>املا البيانات دي وهنكمل معاك التفاصيل.</p>
              <label>اسم ولي الأمر<input required autoComplete="name" value={form.parent} onChange={e => setForm({...form, parent: e.target.value})} placeholder="اسمك هنا" /></label>
              <div className="form-row"><label>رقم الموبايل<input required type="tel" inputMode="numeric" autoComplete="tel" maxLength={11} pattern="01[0125][0-9]{8}" title="رقم موبايل مصري من 11 رقم، مثال: 01012345678" value={form.phone} onChange={e => setForm({...form, phone: e.target.value.replace(/\D/g, '')})} placeholder="01012345678" /></label><label>عمر الطالب<select required value={form.age} onChange={e => setForm({...form, age: e.target.value})}><option value="">اختار السن</option><option>6–8 سنين</option><option>9–11 سنة</option><option>12–14 سنة</option><option>15 سنة أو أكثر</option></select></label></div>
              <label>إيه المجال اللي مهتمين بيه؟<select value={form.interest} onChange={e => setForm({...form, interest: e.target.value})}><option value="">لسه محتاجين ترشيح</option>{siteData.courses.map(c => <option key={c.id}>{c.title}</option>)}</select></label>
              <label>أي تفاصيل تحب تضيفيها؟ <span className="optional">اختياري</span><textarea rows="3" value={form.note} onChange={e => setForm({...form, note: e.target.value})} placeholder="خبرة سابقة، اهتمامات الطفل..." /></label>
              <button className="btn btn-primary form-submit" type="submit">{submitted ? 'ابعت استفسار تاني' : 'إرسال الاستفسار'} <Send size={16}/></button>
              <small className="form-foot">بالضغط على إرسال، هيفتح واتساب برسالة جاهزة لمراجعتها وإرسالها.</small>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-wrap footer-main"><div className="footer-brand"><a className="brand" href="#home"><span className="brand-mark"><span>A</span><span>F</span><i/></span><span className="brand-copy"><strong>AF <em>CODE</em></strong><small>LEARN · CREATE · GROW</small></span></a><p>بنساعد العقول الصغيرة تكتشف إمكانياتها، وتحوّل أفكارها لمشاريع للمستقبل.</p><span className="footer-slogan">Code Today, Create Tomorrow.</span></div><div className="footer-links"><b>استكشف</b><a href="#about">عن الأكاديمية</a><a href="#courses">الكورسات</a><a href="#team">المدرّبة</a><a href="#projects">المشاريع</a></div><div className="footer-links"><b>معلومات تهمك</b><a href="#journey">طريقة التعلّم</a><a href="#faq">الأسئلة الشائعة</a><a href="#contact">التواصل والتسجيل</a><span className="online-footer"><i/> أكاديمية أونلاين</span></div><div className="footer-social"><b>خليك قريبة</b><p>تابعنا عشان تشوف أفكار ومشاريع جديدة.</p><div>{siteData.social.facebook && <a href={siteData.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook/></a>}{siteData.social.instagram && <a href={siteData.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a>}{siteData.social.youtube && <a href={siteData.social.youtube} target="_blank" rel="noreferrer" aria-label="Youtube"><Youtube/></a>}<a href={waLink} aria-label="WhatsApp"><MessageCircle/></a></div></div></div>
        <div className="footer-bottom section-wrap"><span>© {new Date().getFullYear()} AF Code. All rights reserved.</span><span>Made for curious minds <span className="footer-heart">✦</span></span><a href="#home">الرجوع للأعلى ↑</a></div>
      </footer>

      {selectedCourse && <div className="modal-backdrop" onClick={() => setActiveCourse(null)} role="presentation"><div className="course-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`تفاصيل ${selectedCourse.title}`}><button className="modal-close" autoFocus onClick={() => setActiveCourse(null)} aria-label="إغلاق"><X/></button><div className={`modal-hero ${selectedCourse.color}`}><div className="modal-topline"><span className="modal-course-icon"><IconByCourse type={selectedCourse.icon} size={30}/></span><span className="modal-course-number">{selectedCourse.number} / LEARNING PATH</span></div><h2>{selectedCourse.title}</h2><p>{selectedCourse.subtitle}</p><div className="modal-meta"><span><Users size={15}/>{selectedCourse.age}</span><span><Layers3 size={15}/>{selectedCourse.duration}</span><span><Clock3 size={15}/>{selectedCourse.lessons}</span></div></div><div className="modal-body"><h3>الطالب هيستفيد بإيه؟</h3><div className="outcome-grid">{selectedCourse.outcomes.map(outcome => <span key={outcome}><Check size={15}/>{outcome}</span>)}</div><h3>محتوى المستويات</h3><p className="course-prerequisite"><Lightbulb size={16}/>{selectedCourse.prerequisite}</p><div className="level-list">{selectedCourse.levels.map((level, index) => <div className="level-row" key={level.name}><span className="level-index">0{index + 1}</span><div><b>{level.name}</b><ul className="session-topics">{level.sessions.map((session) => <li key={session}>{session}</li>)}</ul></div><small>{level.time}</small></div>)}</div><div className="modal-note"><Clock3 size={17}/><span>{siteData.sessionPlan} كل مستوى يمتد على 4 أسابيع.</span></div><a className="btn btn-primary modal-cta" href={waLink} target="_blank" rel="noreferrer">اسأل عن المستوى المناسب <ArrowLeft size={16}/></a></div></div></div>}
      <a className="floating-whatsapp" href={waLink} target="_blank" rel="noreferrer" aria-label="تواصل عبر واتساب"><MessageCircle size={22}/><span>اسأل عن الكورسات</span></a>
    </div>
  );
}

export default App;
