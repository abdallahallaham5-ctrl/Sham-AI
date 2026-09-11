'use client'

import { useEffect, useState } from 'react'
import { AccountControls } from '@/components/account-controls'
import { DamascusStar } from '@/components/damascus-star'
import VoiceInput from '@/components/voice-input'
import { AudioLines, Check, ChevronDown, CircleHelp, Code2, FileCode2, ImageIcon, Languages, Layers3, LayoutTemplate, Menu, MessageSquareText, Moon, Paperclip, Plus, Presentation, Send, Settings2, Sparkles, Sun, WandSparkles, X, Zap } from 'lucide-react'

type Locale = 'en' | 'ar'
type Tool = { id: string; icon: typeof MessageSquareText; en: { label: string; description: string; examples: string[] }; ar: { label: string; description: string; examples: string[] }; accent: string }

const VOICE_LANGUAGES_LIST = [
  { code: 'ar-SA', label: 'العربية (السعودية)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'es-ES', label: 'Español' },
  { code: 'de-DE', label: 'Deutsch' },
]

const tools: Tool[] = [
  { id: 'chat', icon: MessageSquareText, accent: 'gold', en: { label: 'Chat', description: 'Ask, brainstorm, write, and think faster', examples: ['Help me plan my week', 'Brainstorm a product name', 'Explain a difficult concept'] }, ar: { label: 'المحادثة', description: 'اسأل وفكّر واكتب بشكل أسرع', examples: ['ساعدني في تخطيط أسبوعي', 'اقترح اسماً لمنتج', 'اشرح مفهوماً صعباً'] } },
  { id: 'slides', icon: Presentation, accent: 'gold', en: { label: 'Presentations', description: 'Turn an outline into a polished presentation', examples: ['Investor pitch for a climate startup', 'Quarterly business review', 'Product launch keynote'] }, ar: { label: 'العروض التقديمية', description: 'حوّل فكرتك إلى عرض تقديمي احترافي', examples: ['عرض استثماري لشركة مناخية', 'مراجعة أعمال ربع سنوية', 'كلمة إطلاق منتج'] } },
  { id: 'website', icon: LayoutTemplate, accent: 'blue', en: { label: 'Websites', description: 'Generate responsive sites you can ship', examples: ['Luxury coffee roastery landing page', 'SaaS pricing page', 'Portfolio for an architect'] }, ar: { label: 'المواقع', description: 'أنشئ مواقع متجاوبة جاهزة للنشر', examples: ['صفحة هبوط لمحمصة قهوة فاخرة', 'صفحة أسعار لخدمة SaaS', 'موقع أعمال لمهندس معماري'] } },
  { id: 'docs', icon: FileCode2, accent: 'cyan', en: { label: 'Documents', description: 'Analyze, summarize, and work with PDFs', examples: ['Summarize this annual report', 'Compare two contracts', 'Extract action items'] }, ar: { label: 'المستندات', description: 'حلّل ملفات PDF ولخّصها واعمل عليها', examples: ['لخّص هذا التقرير السنوي', 'قارن بين عقدين', 'استخرج المهام المطلوبة'] } },
  { id: 'career', icon: WandSparkles, accent: 'orange', en: { label: 'CV & Career', description: 'Build a stronger profile and career path', examples: ['Rewrite my CV for product roles', 'Prepare interview answers', 'Write a cover letter'] }, ar: { label: 'السيرة المهنية', description: 'ابنِ ملفاً مهنياً ومساراً أقوى', examples: ['أعد كتابة سيرتي لوظائف المنتجات', 'حضّر إجابات المقابلة', 'اكتب خطاب تقديم'] } },
  { id: 'image', icon: ImageIcon, accent: 'rose', en: { label: 'Image', description: 'Create striking visuals from a sentence', examples: ['A cinematic city at dusk', 'Editorial portrait in warm light', 'Surreal desert landscape'] }, ar: { label: 'الصور', description: 'أنشئ صوراً مميزة من جملة واحدة', examples: ['مدينة سينمائية عند الغروب', 'صورة تحريرية بضوء دافئ', 'منظر صحراوي سريالي'] } },
  { id: 'upscale', icon: Sparkles, accent: 'gold', en: { label: 'Upscaler', description: 'Restore detail and enhance image quality', examples: ['Upscale this product photo', 'Restore an old family image', 'Sharpen architectural detail'] }, ar: { label: 'تحسين الصور', description: 'استعد التفاصيل وارفع جودة الصور', examples: ['حسّن صورة المنتج هذه', 'رمّم صورة عائلية قديمة', 'وضّح تفاصيل مبنى'] } },
  { id: 'vector', icon: Layers3, accent: 'green', en: { label: 'Vector', description: 'Convert artwork into clean SVG files', examples: ['Simplify this brand mark', 'Trace an olive branch', 'Make a geometric icon set'] }, ar: { label: 'المتجهات', description: 'حوّل رسوماتك إلى ملفات SVG نظيفة', examples: ['بسّط شعار العلامة', 'تتبّع غصن زيتون', 'أنشئ مجموعة أيقونات هندسية'] } },
  { id: 'text-code', icon: MessageSquareText, accent: 'gold', en: { label: 'Text & Code', description: 'Write, build, debug, and think faster', examples: ['Write a product story', 'Build a React dashboard', 'Explain this error'] }, ar: { label: 'النص والبرمجة', description: 'اكتب وابنِ وصحّح وفكّر بشكل أسرع', examples: ['اكتب قصة منتج', 'ابنِ لوحة React', 'اشرح هذا الخطأ'] } },
  { id: 'audio', icon: AudioLines, accent: 'orange', en: { label: 'Audio', description: 'Turn scripts into expressive voice', examples: ['Narrate my product demo', 'Read this in a calm tone', 'Create a podcast intro'] }, ar: { label: 'الصوت', description: 'حوّل النصوص إلى صوت معبّر', examples: ['علّق على عرض المنتج', 'اقرأ هذا بنبرة هادئة', 'أنشئ مقدمة بودكاست'] } },
]

const copy = { 
  en: { studio: 'Studio', eyebrow: 'Enterprise creative suite', title: <>Make something <em>remarkable.</em></>, success: 'Your creation is ready.', subhead: 'One workspace for every idea, from first prompt to final export.', quick: 'Quick actions', trial: 'Have a trial code?', unlock: 'Unlock unlimited access', placeholder: 'Enter your hourly passcode', redeem: 'Redeem', generator: 'Unlimited generator', beta: 'Beta', attach: 'Attach', shift: 'Shift + Enter for new line', tryPrompt: 'Try a prompt', recent: 'Recent creations', recentSub: 'Your latest work across Sham AI', viewLibrary: 'View library', nav: 'Generate', unlimited: 'Unlimited access', all: 'All generators. No caps.', plans: 'View plans', library: 'Library', personal: 'Personal studio', workspace: 'Unlimited workspace', language: 'العربية', newCreation: 'New creation', settings: 'Settings', help: 'Help center', codeAccepted: 'Passcode accepted' }, 
  ar: { studio: 'الاستوديو', eyebrow: 'منظومة إبداعية للمؤسسات', title: <>أنشئ شيئاً <em>استثنائياً.</em></>, success: 'إبداعك جاهز.', subhead: 'مساحة واحدة لكل فكرة، من أول أمر إلى التصدير النهائي.', quick: 'إجراءات سريعة', trial: 'لديك رمز تجربة؟', unlock: 'افتح الوصول غير المحدود', placeholder: 'أدخل رمز الساعة', redeem: 'تفعيل', generator: 'مولّد غير محدود', beta: 'تجريبي', attach: 'إرفاق', shift: 'Shift + Enter لسطر جديد', tryPrompt: 'جرّب أمراً', recent: 'الإبداعات الأخيرة', recentSub: 'أحدث أعمالك في Sham AI', viewLibrary: 'عرض المكتبة', nav: 'إنشاء', unlimited: 'وصول غير محدود', all: 'كل المولّدات. بلا حدود.', plans: 'عرض الخطط', library: 'المكتبة', personal: 'الاستوديو الشخصي', workspace: 'مساحة غير محدودة', language: 'English', newCreation: 'إبداع جديد', settings: 'الإعدادات', help: 'مركز المساعدة', codeAccepted: 'تم قبول الرمز' } 
}

function StarMark({ small = false }: { small?: boolean }) { return <DamascusStar size={small ? 28 : 40} /> }
function MoreDots() { return <span className="more-dots"><i /><i /><i /></span> }

export default function Page() {
  const [locale, setLocale] = useState<Locale>('en'); 
  const [active, setActive] = useState('chat');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]); 
  const [chatLoading, setChatLoading] = useState(false); 
  const [chatError, setChatError] = useState(''); 
  const [voiceLang, setVoiceLang] = useState(locale === 'ar' ? 'ar-SA' : 'en-US'); 
  const [voiceNotice, setVoiceNotice] = useState(''); 
  const [trialLocked, setTrialLocked] = useState(false); 
  const [deviceId, setDeviceId] = useState('');
  const [prompt, setPrompt] = useState(''); 
  const [menu, setMenu] = useState(false); 
  const [dark, setDark] = useState(true); 
  const [pricing, setPricing] = useState(false); 
  const [passcode, setPasscode] = useState(''); 
  const [passcodeMessage, setPasscodeMessage] = useState(''); 
  const [created, setCreated] = useState(false);

  useEffect(() => { 
    const stored = window.localStorage.getItem('sham-ai-device-id'); 
    if (stored) setDeviceId(stored); 
    else { 
      const id = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', ''); 
      window.localStorage.setItem('sham-ai-device-id', id); 
      setDeviceId(id);
    } 
  }, []); 

  useEffect(() => { 
    document.documentElement.lang = locale; 
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    setVoiceLang(locale === 'ar' ? 'ar-SA' : 'en-US');
  }, [locale]);

  const t = copy[locale]; 
  const current = tools.find((tool) => tool.id === active) ?? tools[0]; 
  const content = current[locale]; 
  const Icon = current.icon;

  async function verifyPasscode() { 
    setPasscodeMessage(locale === 'ar' ? 'جارٍ التحقق...' : 'Checking passcode...'); 
    try { 
      const response = await fetch('/api/verify-passcode', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: passcode }) }); 
      const result = await response.json(); 
      setPasscodeMessage(response.ok ? `${t.codeAccepted}: ${result.durationDays} ${locale === 'ar' ? 'يوماً من الوصول.' : 'days of access granted.'}` : result.error); 
      if (response.ok) setPasscode('');
    } catch { 
      setPasscodeMessage(locale === 'ar' ? 'الخدمة قيد التحديث، حاول لاحقاً.' : 'Service temporarily updating, please try again shortly.'); 
    } 
  }

  async function submit() { 
    if (!prompt.trim()) return; 
    const text = prompt.trim(); 
    setPrompt(''); 
    if (active === 'chat') { 
      setChatError(''); 
      setMessages((m) => [...m, { role: 'user', content: text }]); 
      setChatLoading(true); 
      try { 
        const response = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: text }] }) }); 
        const result = await response.json(); 
        if (!response.ok) throw new Error(result.error); 
        setMessages((m) => [...m, { role: 'assistant', content: result.message }]);
      } catch (error) { 
        setChatError(error instanceof Error ? error.message : 'Chat is temporarily unavailable.'); 
      } finally { 
        setChatLoading(false);
      } 
      return; 
    } 
    if (!deviceId) return; 
    const trial = await fetch('/api/trial', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deviceId }) }); 
    if (!trial.ok) { 
      setTrialLocked(true); 
      return; 
    } 
    setCreated(true); 
    window.setTimeout(() => setCreated(false), 3000); 
  }

  return (
    <main className={`${dark ? 'app-shell' : 'app-shell light-shell'} ${locale === 'ar' ? 'rtl-shell' : ''} ${active === 'chat' ? 'chat-active' : ''}`}>
      <aside className={`sidebar ${menu ? 'sidebar-open' : ''}`}>
        <div className="brand"><StarMark small /><span>Sham <b>AI</b></span><button className="icon-button close-menu" onClick={() => setMenu(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace-switch"><div className="workspace-avatar">S</div><div><strong>{t.personal}</strong><small>{t.workspace}</small></div><ChevronDown size={15} /></div>
        <button className="new-project" onClick={() => { setActive('slides'); setPrompt('') }}><Plus size={17} /> {t.newCreation} <kbd>⌘ K</kbd></button>
        <nav aria-label={t.nav}>
          <p className="nav-label">{t.nav}</p>
          {tools.map((tool) => { 
            const ToolIcon = tool.icon; 
            return (
              <button key={tool.id} className={`tool-link ${active === tool.id ? 'active' : ''}`} onClick={() => { setActive(tool.id); setMenu(false) }}>
                <ToolIcon size={18} /><span>{tool[locale].label}</span>{active === tool.id && <i />}
              </button>
            )
          })}
        </nav>
        <div className="sidebar-bottom">
          <button className="side-link"><FileCode2 size={17} /> {t.library}</button>
          <button className="side-link"><Settings2 size={17} /> {t.settings}</button>
          <button className="side-link"><CircleHelp size={17} /> {t.help}</button>
          <div className="upgrade-card">
            <div className="upgrade-top"><Zap size={16} /><span>{t.unlimited}</span></div>
            <p>{t.all}</p>
            <button onClick={() => setPricing(true)}>{t.plans} <Sparkles size={13} /></button>
          </div>
          <div className="profile">
            <div className="profile-avatar">AK</div><div><strong>Ahmad K.</strong><small>ahmad@example.com</small></div><MoreDots />
          </div>
        </div>
      </aside>
      
      <section className="main-panel">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMenu(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="crumb"><span>{t.studio}</span><span>/</span><b>{content.label}</b></div>
          <div className="top-actions">
            <AccountControls />
            <button className="language-toggle" onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')} aria-label="Switch language"><Languages size={16} /> {t.language}</button>
            <button className="icon-button" aria-label="Notifications"><Sparkles size={17} /></button>
            <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
            <button className="credits"><Zap size={14} /> {t.unlimited}</button>
          </div>
        </header>
        
        <div className="content">
          <div className="welcome-row">
            <div><p className="eyebrow">{t.eyebrow}</p><h1>{created ? t.success : t.title}</h1><p className="subhead">{t.subhead}</p></div>
            <button className="command"><Sparkles size={15} /> <span>{t.quick}</span><kbd>⌘ /</kbd></button>
          </div>
          <div className="tool-tabs">
            {tools.map((tool) => <button key={tool.id} className={active === tool.id ? 'selected' : ''} onClick={() => setActive(tool.id)}>{tool[locale].label}</button>)}
          </div>
          
          <div className="voice-language">
            <Languages size={14} />
            <label htmlFor="voice-language">Voice language</label>
            <select id="voice-language" value={voiceLang} onChange={(e) => setVoiceLang(e.target.value)}>
              {VOICE_LANGUAGES_LIST.map((item) => (
                <option key={item.code} value={item.code}>{item.label}</option>
              ))}
            </select>
          </div>
          
          <section className="passcode-panel" aria-label={t.trial}>
            <div><p className="eyebrow">{t.trial}</p><strong>{t.unlock}</strong></div>
            <div className="passcode-form">
              <input value={passcode} onChange={(e) => setPasscode(e.target.value)} maxLength={20} placeholder={t.placeholder} aria-label={t.placeholder} />
              <button onClick={verifyPasscode} disabled={passcode.length < 10 || passcode.length > 20}>{t.redeem}</button>
            </div>
            {passcodeMessage && <small role="status">{passcodeMessage}</small>}
          </section>

          {active === 'chat' && (
            <section className="chat-workspace" aria-label="Sham AI chat">
              <div className="chat-history">
                {messages.length === 0 && (
                  <div className="chat-welcome">
                    <DamascusStar size={44} />
                    <p className="eyebrow">{locale === 'ar' ? 'محادثة Sham AI' : 'Sham AI chat'}</p>
                    <h2>{locale === 'ar' ? 'كيف يمكنني مساعدتك اليوم؟' : 'What can I help you with today?'}</h2>
                    <p>{locale === 'ar' ? 'اكتب سؤالك أو فكرتك وسأساعدك على تطويرها.' : 'Ask a question, explore an idea, or start brainstorming.'}</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`chat-message ${message.role}`}>
                    <span>{message.role === 'user' ? 'You' : 'Sham AI'}</span><p>{message.content}</p>
                  </div>
                ))}
                {chatLoading && <div className="chat-message assistant"><span>Sham AI</span><p className="typing">Thinking…</p></div>}
                {chatError && <p className="chat-error" role="alert">{chatError}</p>}
              </div>
            </section>
          )}

          <section className={`creation-card card-${current.accent}`}>
            <div className="creation-header">
              <div className="tool-symbol"><Icon size={22} /></div>
              <div><p className="eyebrow">{t.generator}</p><h2>{content.label} Studio <span>{t.beta}</span></h2><p>{content.description}</p></div>
              <button className="more-button" aria-label="More options"><MoreDots /></button>
            </div>
            <div className="prompt-area">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) { e.preventDefault(); submit() } }} placeholder={`${locale === 'ar' ? 'صف ما تريد إنشاءه في ' : 'Describe what you want to create in '}${content.label}...`} aria-label="Creation prompt" />
              <div className="prompt-tools">
                <button className="attach"><Paperclip size={17} /> <span>{t.attach}</span></button>
                <VoiceInput value={prompt} onChange={setPrompt} lang={voiceLang} onUnsupported={setVoiceNotice} />
                <div className="prompt-right">
                  <small>{t.shift}</small>
                  <button className="send-button" onClick={submit} aria-label="Generate"><Send size={17} /></button>
                </div>
              </div>
            </div>
            <div className="suggestions">
              <span>{t.tryPrompt}</span>
              {content.examples.map((s) => <button key={s} onClick={() => setPrompt(s)}>{s}</button>)}
            </div>
          </section>

          {voiceNotice && <button className="voice-toast" role="status" onClick={() => setVoiceNotice('')}>{voiceNotice}<X size={13} /></button>}
          
          <div className="generator-capabilities">
            <div><Check size={15} /> {locale === 'ar' ? 'إبداعات غير محدودة' : 'Unlimited generations'}</div>
            <div><Check size={15} /> {locale === 'ar' ? 'ملفات جاهزة للتصدير' : 'Export-ready files'}</div>
            <div><Check size={15} /> {locale === 'ar' ? 'خاص افتراضياً' : 'Private by default'}</div>
          </div>

          <div className="section-heading">
            <div><h2>{t.recent}</h2><p>{t.recentSub}</p></div>
            <button>{t.viewLibrary} <span>→</span></button>
          </div>
          <div className="recent-grid">
            <RecentCard type="image" title={locale === 'ar' ? 'صباح هادئ في دمشق' : 'A quiet morning in Damascus'} meta={locale === 'ar' ? 'صورة · منذ دقيقتين' : 'Image · 2 min ago'} />
            <RecentCard type="slides" title={locale === 'ar' ? 'مستقبل العمل' : 'The future of work'} meta={locale === 'ar' ? 'عرض · أمس' : 'Slides · Yesterday'} />
            <RecentCard type="app" title={locale === 'ar' ? 'لوحة التجارة' : 'Commerce dashboard'} meta={locale === 'ar' ? 'تطبيق · 24 أغسطس' : 'Apps & Code · Aug 24'} />
          </div>
        </div>
      </section>

      {trialLocked && (
        <div className="modal-backdrop" onClick={() => setTrialLocked(false)}>
          <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTrialLocked(false)} aria-label="Close"><X size={18} /></button>
            <DamascusStar /><p className="eyebrow">Trial limit reached</p>
            <h2>Keep creating<br /><em>without limits.</em></h2>
            <p className="modal-copy">Your three complimentary generations have been used on this device and network.</p>
            <button className="new-project" onClick={() => { setTrialLocked(false); setPricing(true) }}>View subscription plans</button>
          </div>
        </div>
      )}

      {pricing && (
        <div className="modal-backdrop" onClick={() => setPricing(false)}>
          <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPricing(false)} aria-label="Close"><X size={18} /></button>
            <StarMark /><p className="eyebrow">{locale === 'ar' ? 'غير محدود، بتصميم' : 'Unlimited, by design'}</p>
            <h2>{locale === 'ar' ? <>اترك مساحة<br /><em>لأفكار كبيرة.</em></> : <>Make room for<br /><em>big ideas.</em></>}</h2>
            <p className="modal-copy">{locale === 'ar' ? 'كل مولّد وكل تصدير، بلا حدود يومية.' : 'Every generator, every export, with no daily quotas or hidden caps.'}</p>
            <div className="plans">
              <Plan name="Weekly" price="$3" suffix="/ week" featured />
              <Plan name="Monthly" price="$5" suffix="/ month" />
              <div className="plan passcode-plan">
                <p>3-Day Trial</p><strong>Passcode</strong><small>exclusive</small>
                <button onClick={() => setPricing(false)}>Redeem above</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function RecentCard({ type, title, meta }: { type: string; title: string; meta: string }) { 
  return (
    <button className={`recent-card recent-${type}`}>
      <div className="recent-art">{type === 'app' ? <Code2 size={25} /> : type === 'slides' ? <Presentation size={25} /> : <WandSparkles size={25} />}</div>
      <div className="recent-info"><strong>{title}</strong><small>{meta}</small></div>
      <span className="arrow">↗</span>
    </button>
  )
}

function Plan({ name, price, suffix, featured = false }: { name: string; price: string; suffix: string; featured?: boolean }) { 
  return (
    <div className={`plan ${featured ? 'featured-plan' : ''}`}>
      {featured && <span className="popular">Most popular</span>}
      <p>{name}</p><strong>{price}</strong><small>{suffix}</small>
      <button onClick={() => { window.location.href = `/api/subscribe?plan=${name === 'Monthly' ? 'month' : 'week'}` }}>Choose {name}</button>
    </div>
  ) 
}
