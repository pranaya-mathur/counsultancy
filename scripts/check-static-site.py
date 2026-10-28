from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.ids=set();self.refs=[];self.text=[];self.h1=0;self.hidden=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ['script','style']:self.hidden+=1
  if tag=='h1':self.h1+=1
  if a.get('id'):
   assert a['id'] not in self.ids,('Duplicate id',a['id'])
   self.ids.add(a['id'])
  if tag in ['a','link'] and a.get('href'):self.refs.append(a['href'])
  if tag in ['script','img'] and a.get('src'):self.refs.append(a['src'])
 def handle_endtag(self,tag):
  if tag in ['script','style']:self.hidden-=1
 def handle_data(self,text):
  if not self.hidden and text.strip():self.text.append(re.sub(r'\s+',' ',text).strip())
files={p.name:p for p in DIST.glob('*.html')}
pages={name:Page(p.read_text()) for name,p in files.items()}
refs=0
for name,page in pages.items():
 assert page.h1==1,(name,'h1 count',page.h1)
 for ref in page.refs:
  url=urlsplit(ref)
  if url.scheme or url.netloc:continue
  target=unquote(url.path) or name
  path=DIST/target
  assert path.is_file(),(name,'Missing local target',ref)
  if url.fragment:assert url.fragment in pages[target].ids,(name,'Missing anchor',ref)
  refs+=1
cases=json.loads((ROOT/'content/case-studies.json').read_text())
for case in cases:
 name='case-study-'+case['slug']+'.html'
 text=' '.join(pages[name].text)
 for key in ['headline','context','project','scenario','pilot','audience','walkthrough','cta']:
  values=case[key] if isinstance(case[key],list) else [case[key]]
  for value in values:assert value in text,(name,'Approved copy missing',value)
 assert 'href="'+name+'"' in (DIST/'work.html').read_text(),name
 assert all(anchor in pages[name].ids for anchor in ['business-context','the-project','illustrative-scenario','pilot-evaluation','who-it-is-for','private-walkthrough'])
 # Every project inquiry returns to the contact form, without an external action.
 assert 'contact.html?project='+case['slug'] in files[name].read_text()
for name in ['case-study-enclaveai.html','case-study-claimlens.html','case-study-parksight.html']:
 assert 'href="'+name+'"' in (DIST/'index.html').read_text(),name
assert 'id="caseInquiryContext"' in (DIST/'contact.html').read_text()
assert len(cases)==8
print(json.dumps({'html_pages':len(pages),'approved_case_studies':len(cases),'local_links_assets_and_anchors_checked':refs,'approved_copy_present':True,'homepage_case_links':3,'work_page_case_links':8},indent=2))
