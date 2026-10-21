import type { PortfolioData } from '@/types'

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ME'
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const ACCENT_MAP: Record<string, string> = {
  gold: '#c9a84c', purple: '#8b5cf6', teal: '#0d9488',
  rose: '#f43f5e', sky: '#0ea5e9', orange: '#f97316', green: '#22c55e',
}

const FONT_MAP: Record<string, string> = {
  playfair: "'Playfair Display', serif",
  space:    "'Space Grotesk', sans-serif",
  syne:     "'Syne', sans-serif",
  dm:       "'DM Sans', sans-serif",
}

const THEME_BG: Record<string, { bg: string; bg2: string; bg3: string; bg4: string; isLight: boolean }> = {
  'dark-luxury':    { bg: '#08080d', bg2: '#0e0e16', bg3: '#13131e', bg4: '#191926', isLight: false },
  'light-minimal':  { bg: '#f8fafc', bg2: '#f1f5f9', bg3: '#ffffff', bg4: '#e2e8f0', isLight: true  },
  'bold-creative':  { bg: '#0d0820', bg2: '#180d2e', bg3: '#1e0f38', bg4: '#2a1550', isLight: false },
  'tech-clean':     { bg: '#080c14', bg2: '#0d1628', bg3: '#111e35', bg4: '#162540', isLight: false },
  'warm-editorial': { bg: '#0d0a06', bg2: '#1a1208', bg3: '#231a0a', bg4: '#2e2210', isLight: false },
}

export function generatePortfolioHTML(data: PortfolioData): string {
  const initials = getInitials(data.name)
  const showProfilePhoto = Boolean(data.profilePhoto && data.showProfilePhoto)
  const accent   = ACCENT_MAP[data.theme.accent] || '#c9a84c'
  const fontHead = FONT_MAP[data.theme.font] || FONT_MAP.playfair
  const fontBody = "'DM Sans', sans-serif"
  const thm      = THEME_BG[data.theme.style] || THEME_BG['dark-luxury']
  const isLight  = thm.isLight
  const text     = isLight ? '#1e293b' : '#edeae4'
  const text2    = isLight ? '#64748b' : '#9b9488'
  const text3    = isLight ? '#94a3b8' : '#625e58'
  const border   = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'
  const acDim    = `${accent}20`
  const acBord   = `${accent}40`

  const projectsJSON = JSON.stringify(data.projects.map(p => ({
    id: p.id, name: p.name, stack: p.stack, desc: p.desc, longDesc: p.longDesc,
    icon: p.icon, category: p.category, year: p.year, role: p.role,
    liveUrl: p.liveUrl, githubUrl: p.githubUrl, featured: p.featured,
    highlights: p.highlights,
    images: p.images.map(img => ({ id: img.id, url: img.url, caption: img.caption, alt: img.alt })),
  })))

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${data.seoTitle || data.name + ' — Portfolio'}</title>
<meta name="description" content="${data.seoDesc || ''}">
<meta property="og:title" content="${data.seoTitle || data.name}">
<meta property="og:description" content="${data.seoDesc || ''}">
${data.seoImage ? `<meta property="og:image" content="${data.seoImage}">` : ''}
<meta name="theme-color" content="${accent}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
${data.analytics ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${data.analytics}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${data.analytics}');</script>` : ''}
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--a:${accent};--ad:${acDim};--ab:${acBord};--bg:${thm.bg};--bg2:${thm.bg2};--bg3:${thm.bg3};--bg4:${thm.bg4};--t:${text};--t2:${text2};--t3:${text3};--b:${border}}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--t);font-family:${fontBody};font-size:15px;line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--a);border-radius:2px}
::selection{background:var(--ad);color:var(--a)}
a{text-decoration:none}button{font-family:inherit;cursor:pointer}
nav{position:fixed;top:0;left:0;right:0;z-index:100;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 2.5rem;background:${isLight?'rgba(248,250,252,0.92)':'rgba(8,8,13,0.88)'};backdrop-filter:blur(20px);border-bottom:1px solid var(--b);transition:background .3s}
nav.scrolled{background:${isLight?'rgba(248,250,252,0.98)':'rgba(8,8,13,0.98)'}}
.logo{font-family:${fontHead};font-size:1.4rem;font-weight:700;background:linear-gradient(135deg,var(--a),${accent}cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:1.75rem}.nav-links a{color:var(--t2);font-size:.875rem;font-weight:500;transition:color .2s}.nav-links a:hover{color:var(--a)}
.hero{min-height:100vh;padding:130px 2rem 100px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;background:radial-gradient(ellipse 80% 55% at 50% -5%,${accent}15,transparent 65%)}
.avatar{width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--a),#8b5cf6);display:flex;align-items:center;justify-content:center;font-family:${fontHead};font-size:2.5rem;font-weight:900;color:#080810;margin:0 auto 2rem;border:3px solid var(--ab);box-shadow:0 0 50px var(--ad)}
.avatar-img{width:100px;height:100px;border-radius:50%;object-fit:contain;object-position:center;background:#f5f5f5;padding:2px;transform:scale(1.02);display:block;margin:0 auto 2rem;border:3px solid var(--ab);box-shadow:0 0 50px var(--ad)}
.hero h1{font-family:${fontHead};font-size:clamp(2.5rem,5vw,4.5rem);font-weight:900;line-height:1.1;margin-bottom:.75rem;background:linear-gradient(135deg,var(--a),${accent}cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-role{color:var(--a);font-size:1rem;font-weight:600;margin-bottom:1.25rem}
.hero-bio{color:var(--t2);font-size:1rem;max-width:540px;margin:0 auto 2.5rem;line-height:1.8}
.btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn-p{background:linear-gradient(135deg,var(--a),${accent}88);color:#080810;border:none;padding:.75rem 1.75rem;border-radius:10px;font-size:.925rem;font-weight:700;cursor:pointer;transition:all .25s;text-decoration:none;display:inline-block}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 28px var(--ad)}
.btn-o{background:transparent;color:var(--t);border:1px solid var(--ab);padding:.75rem 1.75rem;border-radius:10px;font-size:.925rem;cursor:pointer;transition:all .25s;text-decoration:none;display:inline-block}
.btn-o:hover{border-color:var(--a);color:var(--a)}
.sec{padding:4rem 2rem;max-width:1000px;margin:0 auto}
.sdiv{height:1px;background:linear-gradient(90deg,transparent,var(--ab),transparent);max-width:1000px;margin:0 auto}
.stitle{font-family:${fontHead};font-size:1.8rem;font-weight:700;margin-bottom:1.75rem}
.stitle span{background:linear-gradient(135deg,var(--a),${accent}cc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.tags{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:.75rem}
.tag-a{background:var(--ad);border:1px solid var(--ab);color:var(--a);border-radius:8px;padding:.35rem .875rem;font-size:.85rem;font-weight:600;transition:all .2s;cursor:default}
.tag-a:hover{transform:translateY(-2px)}
.tag-t{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:#a78bfa;border-radius:8px;padding:.35rem .875rem;font-size:.82rem;font-weight:600}
.proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem}
.proj-card{background:var(--bg3);border:1px solid var(--b);border-radius:18px;overflow:hidden;transition:all .3s;cursor:pointer;position:relative}
.proj-card:hover{border-color:var(--ab);transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.4)}
.proj-img{height:180px;background:var(--bg4);position:relative;overflow:hidden}
.proj-img img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
.proj-card:hover .proj-img img{transform:scale(1.05)}
.proj-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem}
.proj-badge{position:absolute;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;backdrop-filter:blur(4px)}
.proj-cat{top:10px;left:10px;background:rgba(0,0,0,.7);color:rgba(255,255,255,.85)}
.proj-feat{top:10px;right:10px;background:var(--ad);border:1px solid var(--ab);color:var(--a)}
.proj-count{bottom:8px;right:10px;position:absolute;background:rgba(0,0,0,.7);color:rgba(255,255,255,.8);padding:2px 8px;border-radius:100px;font-size:11px}
.proj-hover{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
.proj-card:hover .proj-hover{opacity:1}
.proj-hint{background:rgba(0,0,0,.8);color:white;padding:6px 16px;border-radius:8px;font-size:12px;font-weight:600}
.proj-body{padding:1.25rem}
.proj-name{font-weight:700;font-size:1rem;margin-bottom:.3rem}
.proj-stack{color:var(--t3);font-size:.8rem;margin-bottom:.75rem}
.proj-desc{color:var(--t2);font-size:.875rem;line-height:1.65}
.proj-links{display:flex;gap:.5rem;margin-top:.875rem}
.proj-link{font-size:.78rem;padding:.275rem .7rem;border-radius:6px;text-decoration:none;transition:all .2s}
.pl-a{color:var(--a);border:1px solid var(--ab)}.pl-a:hover{background:var(--ad)}
.pl-g{color:var(--t3);border:1px solid var(--b)}
.exp-item{padding:1.5rem 0;border-bottom:1px solid var(--b)}.exp-item:last-child{border-bottom:none}
.exp-row{display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem;margin-bottom:.375rem}
.exp-title{font-weight:700;font-size:.975rem}
.exp-period{color:var(--a);font-size:.82rem;font-weight:600;display:flex;align-items:center;gap:.375rem}
.exp-dot{width:6px;height:6px;border-radius:50%;background:var(--a);display:inline-block}
.exp-co{color:var(--t2);font-size:.875rem;margin-bottom:.5rem}
.exp-desc{color:var(--t3);font-size:.875rem;line-height:1.7}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem}
.svc-card{background:var(--bg3);border:1px solid var(--b);border-radius:10px;padding:1.5rem;text-align:center;transition:all .25s;cursor:default}
.svc-card:hover{border-color:var(--ab)}
.testi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.25rem}
.testi-card{background:var(--bg3);border:1px solid var(--b);border-radius:18px;padding:1.75rem}
.testi-stars{color:var(--a);letter-spacing:.15em;font-size:1rem;margin-bottom:.875rem}
.testi-text{color:var(--t2);font-size:.9rem;font-style:italic;line-height:1.75;margin-bottom:1.25rem}
.testi-author{display:flex;align-items:center;gap:.75rem}
.testi-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:700;color:#080810;flex-shrink:0}
.contact-sec{text-align:center;padding:5rem 2rem;background:var(--bg2);border-top:1px solid var(--b)}
.contact-sec h2{font-family:${fontHead};font-size:2rem;font-weight:700;color:var(--a);margin-bottom:.875rem}
.cform{display:flex;flex-direction:column;gap:1rem;max-width:480px;margin:1.5rem auto 0}
.cform input,.cform textarea{background:var(--bg4);border:1px solid var(--ab);border-radius:9px;padding:.875rem 1rem;color:var(--t);font-family:${fontBody};font-size:.9rem;outline:none;width:100%;transition:border-color .2s}
.cform input:focus,.cform textarea:focus{border-color:var(--a)}
.cform textarea{min-height:120px;resize:vertical}
.social-row{display:flex;gap:1rem;justify-content:center;margin-top:2rem}
.social-btn{width:44px;height:44px;border-radius:50%;background:var(--bg4);border:1px solid var(--b);display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:700;cursor:pointer;color:var(--t2);transition:all .25s;text-decoration:none}
.social-btn:hover{background:var(--ad);border-color:var(--ab);color:var(--a);transform:translateY(-2px)}
.ach-item{display:flex;align-items:center;gap:.75rem;color:var(--t2);font-size:.9rem;padding:.75rem 1rem;background:var(--ad);border:1px solid var(--ab);border-radius:9px;margin-bottom:.625rem}
.cert-tag{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:#a78bfa;border-radius:100px;padding:.3rem .875rem;font-size:.8rem;font-weight:600;display:inline-block;margin:.25rem .25rem 0 0}
footer{background:var(--bg2);border-top:1px solid var(--b);padding:2rem;text-align:center;color:var(--t3);font-size:.82rem}
footer a{color:var(--a)}
.anim{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
.anim.vis{opacity:1;transform:translateY(0)}
/* MODAL */
.overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.88);backdrop-filter:blur(10px);display:none;align-items:flex-start;justify-content:center;overflow-y:auto;padding:2rem 1rem}
.overlay.open{display:flex}
.mpanel{background:var(--bg2);border:1px solid rgba(255,255,255,.08);border-radius:24px;width:100%;max-width:900px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8);margin:auto}
.mbar{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 2rem;background:var(--bg3);border-bottom:1px solid var(--b)}
.mbody{padding:2rem}
.mgrid{display:grid;grid-template-columns:1fr 280px;gap:2rem}
.mmeta{background:var(--bg3);border:1px solid var(--b);border-radius:12px;padding:1.25rem;margin-bottom:1rem}
.mml{font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--t3);margin-bottom:.375rem}
.mmv{font-size:.9rem;font-weight:600}
.mlink{display:flex;align-items:center;justify-content:center;padding:.7rem;border-radius:10px;font-weight:700;font-size:.875rem;text-decoration:none;transition:all .2s;margin-bottom:.625rem;text-align:center}
.mlink-p{background:linear-gradient(135deg,var(--a),${accent}88);color:#080810}
.mlink-p:hover{transform:translateY(-1px);box-shadow:0 4px 20px var(--ad)}
.mlink-g{background:transparent;color:var(--t2);border:1px solid rgba(255,255,255,.1)}
.mlink-g:hover{border-color:rgba(255,255,255,.3)}
.mhl{display:flex;align-items:flex-start;gap:.75rem;color:var(--t2);font-size:.875rem;margin-bottom:.75rem}
.mhl-star{color:var(--a);font-size:1rem;flex-shrink:0;margin-top:.1rem}
.mfooter{padding:1rem 2rem;border-top:1px solid var(--b);background:var(--bg3);display:flex;justify-content:space-between;align-items:center}
.mnav{background:none;border:1px solid rgba(255,255,255,.1);color:var(--t2);padding:.5rem 1rem;border-radius:8px;cursor:pointer;font-size:.875rem;transition:all .2s}
.mnav:hover{border-color:var(--ab);color:var(--a)}
.mclose{width:36px;height:36px;border-radius:9px;border:1px solid rgba(255,255,255,.1);background:none;color:var(--t2);font-size:1.25rem;cursor:pointer;display:flex;align-items:center;justify-content:center}
.mclose:hover{border-color:red;color:red}
/* CAROUSEL */
.carousel{position:relative;border-radius:14px;overflow:hidden;background:var(--bg4);border:1px solid var(--b);margin-bottom:1.5rem}
.c-main{aspect-ratio:16/9;position:relative;overflow:hidden}
.c-main img{width:100%;height:100%;object-fit:cover;transition:opacity .3s}
.c-grad{position:absolute;inset-x:0;bottom:0;height:80px;background:linear-gradient(to top,rgba(0,0,0,.7),transparent);pointer-events:none}
.c-cap{position:absolute;bottom:.875rem;left:1rem;right:3rem;color:white;font-size:.85rem;font-weight:500}
.c-cnt{position:absolute;top:.875rem;right:.875rem;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);border:1px solid var(--b);border-radius:100px;padding:.2rem .75rem;font-size:.75rem;color:var(--t2)}
.cbtn{position:absolute;top:50%;transform:translateY(-50%);width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,.7);border:1px solid var(--b);color:var(--t);font-size:1.25rem;cursor:pointer;opacity:0;transition:all .2s;display:flex;align-items:center;justify-content:center}
.carousel:hover .cbtn{opacity:1}
.cbtn:hover{border-color:var(--ab);color:var(--a)}
.cbprev{left:.5rem}.cbnext{right:.5rem}
.cdots{position:absolute;bottom:.875rem;right:1rem;display:flex;gap:.375rem}
.cdot{height:4px;border-radius:100px;background:rgba(255,255,255,.4);cursor:pointer;transition:all .2s}
.cdot.active{width:14px;background:var(--a)}.cdot:not(.active){width:6px}
.cthumbs{display:flex;gap:.5rem;overflow-x:auto;padding:.125rem .125rem .5rem;scrollbar-width:none}
.cthumbs::-webkit-scrollbar{display:none}
.cthumb{flex-shrink:0;width:70px;height:46px;border-radius:7px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .2s}
.cthumb.active{border-color:var(--a);transform:scale(1.05)}.cthumb:not(.active){opacity:.55}
.cthumb:hover:not(.active){opacity:.85}.cthumb img{width:100%;height:100%;object-fit:cover}
/* LIGHTBOX */
.lightbox{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.96);display:none;align-items:center;justify-content:center;flex-direction:column}
.lightbox.open{display:flex}
.lightbox img{max-width:90vw;max-height:78vh;object-fit:contain;border-radius:12px}
.lb-close{position:absolute;top:1.25rem;right:1.25rem;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:none;color:white;font-size:1.5rem;cursor:pointer}
.lb-btn{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:none;color:white;font-size:1.5rem;cursor:pointer}
.lb-prev{left:1.25rem}.lb-next{right:1.25rem}
.lb-cap{color:rgba(255,255,255,.6);font-size:.875rem;margin-top:.875rem}
.lb-hint{color:rgba(255,255,255,.3);font-size:.75rem;margin-top:.375rem}
@media(max-width:768px){.nav-links{display:none}.hero h1{font-size:2.25rem}.hero{padding:100px 1.5rem 80px}.sec{padding:3rem 1.5rem}.mgrid{grid-template-columns:1fr}.mside{display:none}.mbody{padding:1.25rem}}
</style>
</head>
<body>
<nav id="nav">
  <div class="logo">${data.name || 'Portfolio'}</div>
  <div class="nav-links">
    ${data.sections.about     ? '<a href="#about">About</a>'       : ''}
    ${data.sections.projects  ? '<a href="#projects">Work</a>'     : ''}
    ${data.sections.skills    ? '<a href="#skills">Skills</a>'     : ''}
    ${data.sections.experience? '<a href="#exp">Experience</a>'    : ''}
    ${data.sections.contact   ? '<a href="#contact">Contact</a>'   : ''}
  </div>
  ${data.sections.contact ? `<a class="btn-p" href="#contact" style="font-size:.85rem;padding:.45rem 1.1rem;border-radius:8px">Hire Me</a>` : ''}
</nav>

${data.sections.hero ? `
<div class="hero" id="home">
  ${showProfilePhoto && data.profilePhoto ? `<img class="avatar-img" src="${data.profilePhoto}" alt="${data.name || 'Profile photo'}">` : `<div class="avatar">${initials}</div>`}
  <h1>${data.name || 'Your Name'}</h1>
  <div class="hero-role">${data.role}</div>
  <p class="hero-bio">${data.headline}</p>
  <div class="btns">
    <a href="#projects" class="btn-p">View My Work</a>
    <a href="#contact" class="btn-o">Get In Touch</a>
  </div>
</div>` : ''}

${data.sections.about ? `
<div class="sdiv"></div>
<div class="sec anim" id="about">
  <div class="stitle"><span>About</span> Me</div>
  <p style="color:var(--t2);font-size:.975rem;line-height:1.85;max-width:680px">${data.about}</p>
  ${data.achievements.length ? `<div style="margin-top:1.75rem">${data.achievements.map(a => `<div class="ach-item"><span style="color:var(--a);font-size:1.1rem">★</span>${a}</div>`).join('')}</div>` : ''}
  ${data.certifications.length ? `<div style="margin-top:1.25rem">${data.certifications.map(c => `<span class="cert-tag">🏅 ${c}</span>`).join('')}</div>` : ''}
</div>` : ''}

${data.sections.skills ? `
<div class="sdiv"></div>
<div class="sec anim" id="skills">
  <div class="stitle"><span>Skills</span> & Tools</div>
  <div class="tags">${data.skills.map(s => `<span class="tag-a">${s}</span>`).join('')}</div>
  ${data.tools.length ? `<div class="tags">${data.tools.map(t => `<span class="tag-t">${t}</span>`).join('')}</div>` : ''}
</div>` : ''}

${data.sections.projects ? `
<div class="sdiv"></div>
<div class="sec anim" id="projects">
  <div class="stitle">Featured <span>Projects</span></div>
  <div class="proj-grid">
    ${data.projects.map((p, idx) => `
      <div class="proj-card" onclick="openProject(${idx})">
        <div class="proj-img">
          ${p.images && p.images.length > 0
            ? `<img src="${p.images[0].url}" alt="${p.images[0].alt}" loading="lazy">`
            : `<div class="proj-placeholder">${p.icon || '💡'}</div>`}
          ${p.category ? `<div class="proj-badge proj-cat">${p.category}</div>` : ''}
          ${p.featured ? `<div class="proj-badge proj-feat">⭐ Featured</div>` : ''}
          ${p.images && p.images.length > 1 ? `<div class="proj-count">📸 ${p.images.length}</div>` : ''}
          <div class="proj-hover"><div class="proj-hint">View Details →</div></div>
        </div>
        <div class="proj-body">
          <div class="proj-name">${p.name}</div>
          <div class="proj-stack">${p.stack}</div>
          <div class="proj-desc">${p.desc.length > 100 ? p.desc.slice(0,100)+'...' : p.desc}</div>
          ${p.liveUrl || p.githubUrl ? `<div class="proj-links">
            ${p.liveUrl ? `<a href="${p.liveUrl}" class="proj-link pl-a" target="_blank" rel="noopener" onclick="event.stopPropagation()">Live ↗</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" class="proj-link pl-g" target="_blank" rel="noopener" onclick="event.stopPropagation()">GitHub ↗</a>` : ''}
          </div>` : ''}
        </div>
      </div>`).join('')}
  </div>
</div>` : ''}

${data.sections.experience ? `
<div class="sdiv"></div>
<div class="sec anim" id="exp">
  <div class="stitle">Work <span>Experience</span></div>
  ${data.experience.map(e => `
    <div class="exp-item">
      <div class="exp-row"><div class="exp-title">${e.title}</div><div class="exp-period">${e.current ? '<span class="exp-dot"></span>' : ''}${e.period}</div></div>
      <div class="exp-co">${e.company}</div>
      <div class="exp-desc">${e.desc}</div>
    </div>`).join('')}
</div>` : ''}

${data.sections.education && data.education.length ? `
<div class="sdiv"></div>
<div class="sec anim" id="edu">
  <div class="stitle"><span>Education</span></div>
  ${data.education.map(e => `
    <div class="exp-item">
      <div class="exp-row"><div class="exp-title">${e.degree}</div><div class="exp-period">${e.year}</div></div>
      <div class="exp-co">${e.school}</div>
      ${e.desc ? `<div class="exp-desc">${e.desc}</div>` : ''}
    </div>`).join('')}
</div>` : ''}

${data.sections.services && data.services.length ? `
<div class="sdiv"></div>
<div class="sec anim" id="services">
  <div class="stitle">What I <span>Offer</span></div>
  <div class="svc-grid">${data.services.map(s => `<div class="svc-card"><div style="font-size:1.75rem;margin-bottom:.875rem">✦</div><div style="font-weight:700;font-size:.95rem">${s}</div></div>`).join('')}</div>
</div>` : ''}

${data.sections.testimonials && data.testimonials.length ? `
<div class="sdiv"></div>
<div class="sec anim" id="testi">
  <div class="stitle">What People <span>Say</span></div>
  <div class="testi-grid">${data.testimonials.map(t => `
    <div class="testi-card">
      <div class="testi-stars">★★★★★</div>
      <p class="testi-text">"${t.text}"</p>
      <div class="testi-author"><div class="testi-av" style="background:${t.color}">${t.initials}</div><div><div style="font-weight:600;font-size:.9rem">${t.name}</div><div style="color:var(--t3);font-size:.8rem">${t.role}</div></div></div>
    </div>`).join('')}
  </div>
</div>` : ''}

${data.sections.contact ? `
<div class="sdiv"></div>
<div class="contact-sec" id="contact">
  <h2>Let's Work Together</h2>
  <p style="color:var(--t2);font-size:.95rem">Open to freelance, full-time, and collaboration opportunities.</p>
  <div class="cform">
    <input type="text" placeholder="Your name">
    <input type="email" placeholder="Your email">
    <textarea placeholder="Your message..."></textarea>
    <button class="btn-p" onclick="this.textContent='Sent ✓';this.style.opacity='.7'" style="width:100%;border:none">Send Message</button>
  </div>
  <p style="color:var(--t3);font-size:.85rem;margin-top:1.5rem">${data.email}${data.location ? ' · '+data.location : ''}</p>
  <div class="social-row">
    ${data.social.linkedin ? `<a href="https://${data.social.linkedin}" class="social-btn" target="_blank">in</a>` : ''}
    ${data.social.github   ? `<a href="https://${data.social.github}"   class="social-btn" target="_blank">GH</a>` : ''}
    ${data.social.twitter  ? `<a href="https://twitter.com/${data.social.twitter.replace('@','')}" class="social-btn" target="_blank">𝕏</a>` : ''}
    <a href="mailto:${data.email}" class="social-btn">✉</a>
  </div>
</div>` : ''}

<footer>© ${new Date().getFullYear()} ${data.name} · Built with <a href="https://portfolioforge.app">PortfolioForge</a></footer>

<!-- PROJECT MODAL -->
<div class="overlay" id="modal" onclick="if(event.target===this)closeProject()">
  <div class="mpanel">
    <div class="mbar">
      <div style="display:flex;align-items:center;gap:.875rem">
        <span id="m-icon" style="font-size:1.75rem">💡</span>
        <div><div id="m-name" style="font-weight:700;font-size:1.05rem"></div><div id="m-cat" style="color:var(--a);font-size:.78rem;margin-top:.2rem"></div></div>
      </div>
      <div style="display:flex;gap:.5rem;align-items:center">
        <button class="mnav" id="m-prev" onclick="navProj(-1)">‹ Prev</button>
        <button class="mnav" id="m-next" onclick="navProj(1)">Next ›</button>
        <button class="mclose" onclick="closeProject()">×</button>
      </div>
    </div>
    <div class="mbody">
      <div id="m-carousel"></div>
      <div id="m-chips" style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem"></div>
      <div class="mgrid">
        <div>
          <div id="m-ov"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--a);margin-bottom:.75rem">Overview</div><p id="m-desc" style="color:var(--t2);font-size:.9rem;line-height:1.8;margin-bottom:1.75rem"></p></div>
          <div id="m-cs" style="display:none"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--a);margin-bottom:.75rem">Case Study</div><p id="m-long" style="color:var(--t2);font-size:.875rem;line-height:1.85;white-space:pre-line;margin-bottom:1.75rem"></p></div>
          <div id="m-hl"><div style="font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--a);margin-bottom:.75rem">Key Achievements</div><div id="m-hls"></div></div>
        </div>
        <div class="mside" id="m-side"></div>
      </div>
    </div>
    <div class="mfooter">
      <span style="color:var(--t3);font-size:.8rem">ESC to close · ← → navigate</span>
      <button class="mnav" onclick="closeProject()">Close</button>
    </div>
  </div>
</div>

<!-- LIGHTBOX -->
<div class="lightbox" id="lightbox">
  <button class="lb-close" onclick="closeLb()">×</button>
  <button class="lb-btn lb-prev" onclick="lbNav(-1)">‹</button>
  <img id="lb-img" src="" alt="">
  <div id="lb-cap" class="lb-cap"></div>
  <div class="lb-hint">← → navigate · ESC close</div>
  <button class="lb-btn lb-next" onclick="lbNav(1)">›</button>
</div>

<script>
const PJ=${projectsJSON};
let curPJ=0,curC=0,lbImgs=[],lbIdx=0;

window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40));
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('vis')}),{threshold:.1});
document.querySelectorAll('.anim').forEach(el=>obs.observe(el));
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(document.getElementById('lightbox').classList.contains('open'))closeLb();else closeProject();}
  if(document.getElementById('modal').classList.contains('open')){if(e.key==='ArrowRight')navProj(1);if(e.key==='ArrowLeft')navProj(-1);}
  if(document.getElementById('lightbox').classList.contains('open')){if(e.key==='ArrowRight')lbNav(1);if(e.key==='ArrowLeft')lbNav(-1);}
});

function openProject(idx){curPJ=idx;renderModal(PJ[idx]);document.getElementById('modal').classList.add('open');document.body.style.overflow='hidden';}
function closeProject(){document.getElementById('modal').classList.remove('open');document.body.style.overflow='';}
function navProj(d){curPJ=(curPJ+d+PJ.length)%PJ.length;renderModal(PJ[curPJ]);}

function renderModal(p){
  document.getElementById('m-icon').textContent=p.icon||'💡';
  document.getElementById('m-name').textContent=p.name;
  document.getElementById('m-cat').textContent=(p.category||'')+(p.year?' · '+p.year:'');
  document.getElementById('m-desc').textContent=p.desc;
  const cs=document.getElementById('m-cs');
  if(p.longDesc){document.getElementById('m-long').textContent=p.longDesc;cs.style.display='block';}else{cs.style.display='none';}
  const hlWrap=document.getElementById('m-hl'),hlEl=document.getElementById('m-hls');
  if(p.highlights&&p.highlights.length){hlEl.innerHTML=p.highlights.map(h=>'<div class="mhl"><span class="mhl-star">✦</span><span>'+h+'</span></div>').join('');hlWrap.style.display='block';}else{hlWrap.style.display='none';}
  const chips=document.getElementById('m-chips');
  chips.innerHTML=p.stack.split('·').map(s=>s.trim()).filter(Boolean).map(s=>'<span style="background:var(--ad);border:1px solid var(--ab);color:var(--a);border-radius:100px;padding:3px 12px;font-size:12px;font-weight:600">'+s+'</span>').join('');
  if(p.featured)chips.innerHTML+='<span style="background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.3);color:#a78bfa;border-radius:100px;padding:3px 12px;font-size:12px;font-weight:600">⭐ Featured</span>';
  curC=0;lbImgs=p.images||[];
  renderCarousel(p);
  const side=document.getElementById('m-side');
  side.innerHTML='';
  if(p.role)side.innerHTML+='<div class="mmeta"><div class="mml">My Role</div><div class="mmv">'+p.role+'</div></div>';
  side.innerHTML+='<div class="mmeta"><div class="mml">Category</div><div class="mmv">'+(p.category||'—')+'</div><div class="mml" style="margin-top:.875rem">Year</div><div class="mmv">'+(p.year||'—')+'</div></div>';
  if(lbImgs.length)side.innerHTML+='<div class="mmeta"><div class="mml">Images</div><div class="mmv">'+lbImgs.length+' image'+(lbImgs.length!==1?'s':'')+'</div></div>';
  if(p.liveUrl)side.innerHTML+='<a href="'+p.liveUrl+'" target="_blank" rel="noopener" class="mlink mlink-p">↗ View Live Site</a>';
  if(p.githubUrl)side.innerHTML+='<a href="'+p.githubUrl+'" target="_blank" rel="noopener" class="mlink mlink-g">⌥ View on GitHub</a>';
  document.getElementById('m-prev').style.display=PJ.length>1?'block':'none';
  document.getElementById('m-next').style.display=PJ.length>1?'block':'none';
}

function renderCarousel(p){
  const wrap=document.getElementById('m-carousel');
  const imgs=p.images||[];
  if(!imgs.length){wrap.innerHTML='<div style="aspect-ratio:16/9;background:var(--bg4);border-radius:14px;border:1px solid var(--b);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem"><div style="text-align:center;color:var(--t3)"><div style="font-size:2.5rem;margin-bottom:.5rem">'+(p.icon||'💡')+'</div><div style="font-size:.85rem">No images uploaded</div></div></div>';return;}
  const dots=imgs.map((_,i)=>'<span class="cdot'+(i===0?' active':'')+'" onclick="goC('+i+')"></span>').join('');
  const thumbs=imgs.length>1?'<div class="cthumbs">'+imgs.map((img,i)=>'<div class="cthumb'+(i===0?' active':'')+'" onclick="goC('+i+')"><img src="'+img.url+'" alt="'+img.alt+'"></div>').join('')+'</div>':'';
  wrap.innerHTML='<div class="carousel"><div class="c-main"><img id="c-img" src="'+imgs[0].url+'" alt="'+imgs[0].alt+'" onclick="openLb(0)" style="cursor:zoom-in"><div class="c-grad"></div>'+(imgs[0].caption?'<div class="c-cap" id="c-cap">'+imgs[0].caption+'</div>':'<div class="c-cap" id="c-cap"></div>')+'<div class="c-cnt" id="c-cnt">1 / '+imgs.length+'</div>'+(imgs.length>1?'<button class="cbtn cbprev" onclick="goC(-1,true)">‹</button><button class="cbtn cbnext" onclick="goC(1,true)">›</button>':'')+'<div class="cdots" id="c-dots">'+dots+'</div></div>'+thumbs+'</div>';
}

function goC(val,rel){
  const imgs=PJ[curPJ].images||[];if(!imgs.length)return;
  if(rel){curC=(curC+val+imgs.length)%imgs.length;}else{curC=val;}
  const img=document.getElementById('c-img');
  if(img){img.style.opacity='0';setTimeout(()=>{img.src=imgs[curC].url;img.alt=imgs[curC].alt;img.style.opacity='1';},150);}
  const cap=document.getElementById('c-cap');if(cap)cap.textContent=imgs[curC].caption||'';
  const cnt=document.getElementById('c-cnt');if(cnt)cnt.textContent=(curC+1)+' / '+imgs.length;
  document.querySelectorAll('.cdot').forEach((d,i)=>d.classList.toggle('active',i===curC));
  document.querySelectorAll('.cthumb').forEach((t,i)=>t.classList.toggle('active',i===curC));
}

function openLb(i){lbIdx=i!==undefined?i:curC;renderLb();document.getElementById('lightbox').classList.add('open');document.body.style.overflow='hidden';}
function closeLb(){document.getElementById('lightbox').classList.remove('open');document.body.style.overflow=document.getElementById('modal').classList.contains('open')?'hidden':'';}
function lbNav(d){if(!lbImgs.length)return;lbIdx=(lbIdx+d+lbImgs.length)%lbImgs.length;renderLb();}
function renderLb(){const img=lbImgs[lbIdx];if(!img)return;document.getElementById('lb-img').src=img.url;document.getElementById('lb-img').alt=img.alt;document.getElementById('lb-cap').textContent=img.caption||'';}
</script>
</body>
</html>`
}
