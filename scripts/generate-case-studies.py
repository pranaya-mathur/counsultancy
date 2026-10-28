"""Render approved case-study copy into buildless pages using the retained site template."""
from pathlib import Path
from html import escape
from urllib.parse import urlencode
import json,re
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
cases=json.loads((ROOT/'content/case-studies.json').read_text())
template=(DIST/'work.html').read_text()
header=template.split('<main id="main">')[0]
footer=re.search(r'<footer>.*?</footer>',template,re.S)[0]
blocks=[('context','The business context','business-context'),('project','The project','the-project'),('scenario','An illustrative scenario','illustrative-scenario'),('pilot','What a pilot could evaluate','pilot-evaluation'),('audience','Who it is relevant to','who-it-is-for'),('walkthrough','Private walkthrough','private-walkthrough')]
for i,case in enumerate(cases):
 e=escape
 filename='case-study-'+case['slug']+'.html'
 contact='contact.html?'+urlencode({'project':case['slug'],'interest':case['interest']})+'#contact'
 head=re.sub(r'<title>.*?</title>',lambda m:'<title>'+e(case['name'])+' — Engineering Case Study · Enclave</title>',header)
 head=re.sub(r'<meta name="description" content="[^"]*">',lambda m:'<meta name="description" content="'+e(case['headline']+' '+case['context'][0],quote=True)+'">',head)
 head=head.replace('class="enclave-editorial"','class="enclave-editorial case-study-page"')
 hero=f'''<main id="main"><div class="page-path wrap"><a href="index.html">Enclave</a><span>/</span><a href="work.html">Work</a><span>/</span><span>{e(case['name'])}</span></div>
<section class="case-hero"><div class="wrap"><div class="eyebrow reveal"><span class="num">{i+1:02d}</span> / ENGINEERING CASE STUDY</div><div class="case-project-row reveal"><span class="case-project-name">{e(case['name'])}</span><span class="case-stage">{e(case['status'])}</span></div><h1 class="section-title reveal">{e(case['headline'])}</h1><div class="case-hero-bottom reveal"><span class="case-category">{e(case['category'])}</span><a class="text-link" href="#business-context">Read the story ↓</a></div></div></section>'''
 visual=''
 if case.get('image'):
  visual=f'''<div class="wrap case-visual-wrap"><figure class="case-visual reveal"><img src="{e(case['image'],quote=True)}" alt="{e(case['image_alt'],quote=True)}" width="{1024 if case['slug']=='parksight' else 1363}" height="{1024 if case['slug']=='parksight' else 936}" decoding="async"><figcaption>{e(case['image_caption'])}</figcaption></figure></div>'''
 toc='<aside class="case-contents"><nav aria-label="On this page"><span class="case-contents-label">IN THIS STORY</span>'
 for j,(key,title,anchor) in enumerate(blocks):toc+=f'<a href="#{anchor}"><span>{j+1:02d}</span>{e(title)}</a>'
 toc+='<a class="case-back-link" href="work.html">← All case studies</a></nav></aside>'
 story='<section class="case-reading"><div class="wrap case-layout">'+toc+'<article class="case-copy" aria-label="'+e(case['name'],quote=True)+' case study">'
 for j,(key,title,anchor) in enumerate(blocks):
  story+=f'<section class="case-story-block'+(' case-scenario' if key=='scenario' else '')+(' case-private' if key=='walkthrough' else '')+f' reveal" id="{anchor}" aria-labelledby="{anchor}-heading"><div class="case-block-index">{j+1:02d} /</div><h2 id="{anchor}-heading">{e(title)}</h2>'
  for p in case[key]:story+='<p>'+e(p)+'</p>'
  if key=='walkthrough':story+=f'<a class="btn btn-dark case-inquiry" href="{e(contact,quote=True)}">{e(case["cta"])}</a>'
  story+='</section>'
 story+='</article></div></section>'
 next_case=cases[(i+1)%len(cases)]
 navigation=f'''<section class="case-next"><div class="wrap case-next-inner"><a class="text-link" href="work.html">← All engineering case studies</a><a class="case-next-link" href="case-study-{next_case['slug']}.html"><span>NEXT CASE STUDY</span><strong>{e(next_case['name'])} →</strong></a></div></section></main>'''
 (DIST/filename).write_text(head+hero+visual+story+navigation+footer+'\n<script src="assets/site.js"></script>\n</body>\n</html>\n')
# Preserve every original project card and its metadata; add a case-study link to its footer.
work=(DIST/'work.html').read_text()
for case in cases:
 pattern=r'(<article\b[^>]*\bid="'+re.escape(case['slug'])+r'"[^>]*>)(.*?)(</article>)'
 def add_footer(m):
  body=m[2]
  if 'case-card-footer' in body:return m[0]
  foot=re.search(r'(<(?:a|span) class="card-link"[^>]*>.*?</(?:a|span)>)',body,re.S)
  assert foot,case['slug']
  old=foot[1]
  new='<div class="case-card-footer">'+old+'<a class="case-study-link" href="case-study-'+case['slug']+'.html" aria-label="Read '+escape(case['name'],quote=True)+' case study">Read case study →</a></div>'
  return m[1]+body.replace(old,new,1)+m[3]
 work,n=re.subn(pattern,add_footer,work,flags=re.S);assert n==1,case['slug']
# A small editorial introduction adds context without replacing original content.
intro='''<div class="case-index-note reveal" id="case-studies"><span>ENGINEERING CASE STUDIES</span><p>Explore the business context, project scope, representative scenarios and what a pilot could evaluate.</p></div>'''
if 'id="case-studies"' not in work:work=work.replace('<div class="grid grid-2 reveal-stagger">',intro+'<div class="grid grid-2 reveal-stagger">',1)
(DIST/'work.html').write_text(work)
home=(DIST/'index.html').read_text()
for old,new in [('enclave-ai.html','case-study-enclaveai.html'),('work.html#claimlens','case-study-claimlens.html'),('work.html#parksight','case-study-parksight.html')]:
 home=home.replace('class="portfolio-item reveal" href="'+old+'"','class="portfolio-item reveal" href="'+new+'"')
(DIST/'index.html').write_text(home)
product=(DIST/'enclave-ai.html').read_text()
if 'case-study-enclaveai.html' not in product:
 product=product.replace('<div class="product-labels reveal-stagger">','<p class="product-case-link reveal"><a href="case-study-enclaveai.html">Read the EnclaveAI case study →</a></p><div class="product-labels reveal-stagger">',1)
(DIST/'enclave-ai.html').write_text(product)
# Add a consistent discovery link in every footer, retaining the original navigation.
for p in DIST.glob('*.html'):
 s=p.read_text()
 if '<a href="work.html#case-studies">Case studies</a>' not in s:s=s.replace('<h4>Explore</h4>','<h4>Explore</h4><a href="work.html#case-studies">Case studies</a>',1)
 p.write_text(s)
contact=(DIST/'contact.html').read_text()
if 'id="caseInquiryContext"' not in contact:
 contact=contact.replace('<form class="contact-panel reveal" id="contactForm" novalidate>','<form class="contact-panel reveal" id="contactForm" novalidate><p class="case-inquiry-context" id="caseInquiryContext" hidden></p><input type="hidden" name="project" id="inquiryProject">')
(DIST/'contact.html').write_text(contact)
print('Rendered and linked 8 case-study pages. Original pages and project descriptions retained.')
