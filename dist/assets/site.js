
const traceModes=[{name:'Enterprise RAG',flow:['Ask','Understand','Retrieve','Verify','Answer','Cite'],desc:'Search relevant organizational knowledge, check what was retrieved and produce an answer grounded in available evidence.'},{name:'Agentic Automation',flow:['Trigger','Plan','Use Tools','Check','Approve','Act'],desc:'Coordinate tasks across business systems while keeping sensitive actions behind the right approvals.'},{name:'AI Governance',flow:['Inspect','Evaluate Policy','Escalate','Decide','Record'],desc:'Evaluate AI traffic against defined rules and capture why a request was allowed, warned or blocked.'},{name:'Computer Vision',flow:['Capture','Detect','Interpret','Apply Rules','Alert'],desc:'Turn camera or image signals into events that teams can review and act upon.'}];
const tabs=document.getElementById('traceTabs'),flow=document.getElementById('traceFlow'),desc=document.getElementById('traceDesc');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const traceLogs=[
 ['Query received: policy question','Intent and scope identified','Relevant knowledge retrieved','Evidence checked against the question','Answer assembled from context','Source references attached'],
 ['Workflow trigger received','Task plan prepared','Tool request assembled','Result checked against the task','Sensitive action sent for approval','Authorized action completed'],
 ['AI interaction received','Policy rules evaluated','Sensitive action flagged for review','Decision selected: WARN · REVIEW','Reason and enforcement path recorded'],
 ['Camera signal received','Object detected in the scene','Event context interpreted','Operational rules evaluated','Reviewable alert prepared']
];
let selectedTrace=0,traceStep=0,traceTimer;
function paintTrace(){
 if(!flow)return;
 [...flow.children].forEach((el,i)=>{el.classList.toggle('is-active',i===traceStep);el.classList.toggle('is-done',i<traceStep)});
 const output=document.getElementById('runnerConsole');if(!output)return;output.replaceChildren();
 const logs=traceLogs[selectedTrace];
 for(let i=Math.max(0,traceStep-2);i<=traceStep;i++){
  const row=document.createElement('div');row.className='console-line';
  const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0')+' /';
  const message=document.createElement('span');message.textContent='↳ '+logs[i];
  row.append(number,message);output.append(row);
 }
}
function showTrace(index){
 selectedTrace=index;traceStep=reduceMotion?traceModes[index].flow.length-1:0;
 [...tabs.children].forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',String(i===index))});
 flow.replaceChildren();flow.style.setProperty('--step-count',traceModes[index].flow.length);
 for(const label of traceModes[index].flow){const step=document.createElement('span');step.className='trace-step';step.textContent=label;flow.append(step)}
 desc.textContent=traceModes[index].desc;
 document.getElementById('runnerPattern').textContent=['enterprise-rag','agentic-workflow','runtime-governance','edge-vision'][index];
 document.getElementById('runnerSteps').textContent=String(traceModes[index].flow.length).padStart(2,'0');paintTrace();
 clearInterval(traceTimer);
 if(!reduceMotion)traceTimer=setInterval(()=>{if(document.hidden)return;traceStep=(traceStep+1)%traceModes[selectedTrace].flow.length;paintTrace()},1650);
}
if(tabs&&flow&&desc){traceModes.forEach((m,i)=>{const b=document.createElement('button');b.className='trace-tab';b.type='button';b.textContent=m.name;b.addEventListener('click',()=>showTrace(i));tabs.appendChild(b)});showTrace(0)}
const root=document.documentElement,themeBtn=document.getElementById('themeBtn'),savedTheme=(()=>{try{return localStorage.getItem('enclave-theme')}catch(e){return null}})();if(savedTheme)root.dataset.theme=savedTheme;themeBtn.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=next;(()=>{try{localStorage.setItem('enclave-theme',next)}catch(e){}})()});const navShell=document.getElementById('navShell'),progress=document.getElementById('progressBar');function onScroll(){const h=document.documentElement,max=h.scrollHeight-h.clientHeight;progress.style.width=(max?h.scrollTop/max*100:0)+'%';navShell.classList.toggle('scrolled',h.scrollTop>8)}document.addEventListener('scroll',onScroll,{passive:true});onScroll();const menuBtn=document.getElementById('menuBtn'),navLinks=document.getElementById('navLinks');menuBtn.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰';menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu')});navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn.textContent='☰';menuBtn.setAttribute('aria-label','Open menu');menuBtn.setAttribute('aria-expanded','false')}));const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -45px'});document.querySelectorAll('.reveal,.reveal-stagger').forEach(el=>observer.observe(el));const glow=document.getElementById('cursorGlow');document.addEventListener('mousemove',e=>{glow.style.opacity='1';glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});document.addEventListener('mouseleave',()=>glow.style.opacity='0');
(function(){const canvas=document.getElementById('iconField'),hero=document.querySelector('.hero'),ctx=canvas?.getContext('2d');if(!canvas||!hero||!ctx)return;let inkColor,accentColor,W,H,DPR,icons=[],mouse={x:-9999,y:-9999};const shapes=['circle','square','diamond','plus','slash','ring','dot','arrow'],rand=s=>{const x=Math.sin(s)*10000;return x-Math.floor(x)};function build(){icons=[];let i=0;for(let y=35;y<H;y+=62){for(let x=35;x<W;x+=62){const a=rand(i*12.98),b=rand(i*78.23+4);if(a>.43)icons.push({x:x+(b-.5)*20,y:y+(a-.5)*20,s:shapes[Math.floor(b*shapes.length)],z:5+a*5,r:b*Math.PI});i++}}}function resize(){DPR=Math.min(devicePixelRatio||1,2);W=hero.offsetWidth;H=hero.offsetHeight;canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);build()}function draw(ic,p){ctx.save();ctx.translate(ic.x,ic.y);ctx.rotate(ic.r+p*.5);ctx.globalAlpha=.12+p*.7;ctx.strokeStyle=p>.05?accentColor:inkColor;ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=1.2;const z=ic.z*(1+p*.5);ctx.beginPath();if(ic.s==='circle'||ic.s==='ring'){ctx.arc(0,0,z*(ic.s==='ring'?.7:1),0,Math.PI*2);ctx.stroke()}else if(ic.s==='dot'){ctx.arc(0,0,z*.28,0,Math.PI*2);ctx.fill()}else if(ic.s==='square'){ctx.strokeRect(-z*.7,-z*.7,z*1.4,z*1.4)}else if(ic.s==='diamond'){ctx.moveTo(0,-z);ctx.lineTo(z,0);ctx.lineTo(0,z);ctx.lineTo(-z,0);ctx.closePath();ctx.stroke()}else if(ic.s==='plus'){ctx.moveTo(-z,0);ctx.lineTo(z,0);ctx.moveTo(0,-z);ctx.lineTo(0,z);ctx.stroke()}else if(ic.s==='slash'){ctx.moveTo(-z*.7,z*.7);ctx.lineTo(z*.7,-z*.7);ctx.stroke()}else{ctx.moveTo(-z,0);ctx.lineTo(z,0);ctx.moveTo(z*.3,-z*.5);ctx.lineTo(z,0);ctx.lineTo(z*.3,z*.5);ctx.stroke()}ctx.restore()}function render(){const styles=getComputedStyle(root);inkColor=styles.getPropertyValue('--ink');accentColor=styles.getPropertyValue('--accent');ctx.clearRect(0,0,W,H);icons.forEach(ic=>draw(ic,Math.max(0,1-Math.hypot(ic.x-mouse.x,ic.y-mouse.y)/150)));if(!reduceMotion)requestAnimationFrame(render)}hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect();mouse={x:e.clientX-r.left,y:e.clientY-r.top}});hero.addEventListener('mouseleave',()=>mouse={x:-9999,y:-9999});addEventListener('resize',resize);resize();render()})();
const CONTACT_EMAIL='pranaya.mathur@yahoo.com';const form=document.getElementById('contactForm'),status=document.getElementById('formStatus');if(form)form.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();status.textContent='Please complete the required fields.';return}const data=new FormData(form),name=data.get('name')||'',email=data.get('email')||'',org=data.get('organization')||'',interest=data.get('interest')||'',challenge=data.get('challenge')||'',subject=`Enclave inquiry — ${interest}${org?' · '+org:''}`,body=`Name: ${name}\nWork email: ${email}\nOrganization: ${org}\nExploring: ${interest}\n\nChallenge:\n${challenge}`,mailtoUrl=`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;status.textContent="Opening your email app to send this to us — if nothing opens, email us directly at "+CONTACT_EMAIL+".";window.location.href=mailtoUrl});

addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks.classList.contains('open')){navLinks.classList.remove('open');menuBtn.textContent='☰';menuBtn.setAttribute('aria-label','Open menu');menuBtn.setAttribute('aria-expanded','false');menuBtn.focus()}});

const terminalForm=document.getElementById('terminalForm'),terminalInput=document.getElementById('terminalInput'),terminalOutput=document.getElementById('terminalOutput');
const commandHistory=[];let historyIndex=0;
function terminalLine(value,kind='') {const line=document.createElement('div');line.className='terminal-line '+kind;line.textContent=value;terminalOutput.append(line)}
function runCommand(value){
 const raw=value.trim();if(!raw)return;
 const command=raw.toLowerCase().replace(/^(run|explore)\s+/,'');
 commandHistory.push(raw);historyIndex=commandHistory.length;
 if(command==='clear'){terminalOutput.replaceChildren();terminalLine('Workflow lab cleared. Type help to explore.','muted');terminalInput.value='';return}
 const entered=document.createElement('div');entered.className='terminal-log-command';entered.textContent='enclave/ops $ '+raw;terminalOutput.append(entered);
 const modes={rag:0,agents:1,governance:2,inspect:2,vision:3};
 if(command==='help'){
  terminalLine('Available commands','accent');
  [['rag','Enterprise knowledge retrieval'],['agents','Orchestrated tools and human approvals'],['governance','Policy checks and enforcement decisions'],['vision','Visual signals and operational rules'],['stack','Explore the engineering foundation'],['clear','Clear this terminal']].forEach(([name,detail])=>terminalLine('  '+name.padEnd(13,' ')+detail));
 }else if(Object.hasOwn(modes,command)){
  const mode=traceModes[modes[command]];
  terminalLine(mode.name.toUpperCase(),'accent');
  mode.flow.forEach((step,i)=>terminalLine('  '+String(i+1).padStart(2,'0')+'  '+step));
  terminalLine(mode.desc,'muted');
  terminalLine('Illustrative workflow — actual implementation depends on the project.','muted');
 }else if(command==='stack'){
  terminalLine('ENGINEERING FOUNDATION','accent');
  terminalLine('Python · FastAPI · React · Next.js · TypeScript');
  terminalLine('LangGraph · LangChain · stateful workflows');
  terminalLine('PostgreSQL · pgvector · FAISS · Qdrant · ChromaDB');
  terminalLine('OpenCV · YOLO · ONNX Runtime');
  terminalLine('Docker · AWS-oriented deployment patterns');
  terminalLine('Technology selection is project-specific.','muted');
 }else{terminalLine('Unknown command. Type help to see the available workflows.','muted')}
 terminalInput.value='';terminalOutput.scrollTop=terminalOutput.scrollHeight;
}
if(terminalForm){
 terminalForm.addEventListener('submit',e=>{e.preventDefault();runCommand(terminalInput.value)});
 document.querySelectorAll('[data-command]').forEach(button=>button.addEventListener('click',()=>runCommand(button.dataset.command)));
 terminalInput.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();historyIndex=Math.max(0,historyIndex-1);terminalInput.value=commandHistory[historyIndex]||''}else if(e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.min(commandHistory.length,historyIndex+1);terminalInput.value=commandHistory[historyIndex]||''}});
}

// Carry the chosen case study into the inquiry form without submitting anything.
(function caseProjectContext(){const context=document.getElementById('caseInquiryContext');if(!context)return;const names={'enclaveai':'EnclaveAI','claimlens':'ClaimLens','smart-rcm':'Smart RCM','parksight':'ParkSight','nyaysetu':'NyaySetu','yojana-ai':'Yojana AI','aimos':'AIMOS','clausesense':'ClauseSense'};const query=new URLSearchParams(location.search);const project=query.get('project');if(!Object.hasOwn(names,project||''))return;context.textContent='Project enquiry: '+names[project];context.hidden=false;document.getElementById('inquiryProject').value=names[project];const interest=document.getElementById('interest');if([...interest.options].some(option=>option.value===query.get('interest')))interest.value=query.get('interest')})();
