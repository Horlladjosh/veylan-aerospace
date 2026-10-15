(() => {
 const button = document.querySelector('.menu-toggle');
 const nav = document.querySelector('#navigation');
 const label = button.querySelector('.menu-label');
 const media = window.matchMedia('(max-width: 800px)');
 function setMenu(open, restoreFocus = false) {
  button.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  label.textContent = open ? 'Close' : 'Menu';
  if (open) nav.querySelector('a').focus();
  else if (restoreFocus) button.focus();
 }
 button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
 nav.addEventListener('click', event => { if(event.target.closest('a')) setMenu(false); });
 document.addEventListener('keydown', event => {
  if (button.getAttribute('aria-expanded') !== 'true') return;
  if (event.key === 'Escape') setMenu(false, true);
  if (event.key === 'Tab') {
   const focusable = [button, ...nav.querySelectorAll('a')];
   const first = focusable[0], last = focusable[focusable.length - 1];
   if(event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
   else if(!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  }
 });
 media.addEventListener('change', () => setMenu(false));
 const form = document.querySelector('#enquiry');
 if(form){
  const equipment=form.querySelector('[name="equipment"]');
  const requested=new URLSearchParams(window.location.search).get('equipment');
  if(['camera','software','radio','other'].includes(requested))equipment.value=requested;
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!form.reportValidity())return;
   const values=new FormData(form),feedback=form.querySelector('.form-feedback');
   feedback.replaceChildren();
   const heading=document.createElement('h2');heading.textContent='Your test brief';
   const note=document.createElement('p');note.textContent='Review your equipment and test requirements below. This demonstration sends and saves nothing.';
   const list=document.createElement('dl');
   const items=[['Equipment',equipment.selectedOptions[0].textContent],['Description',values.get('equipmentDescription')],['Test objectives',values.get('objectives')],['Programme stage',values.get('stage')],['Requested support',values.get('support')]];
   for(const [label,value] of items){
    const row=document.createElement('div'),term=document.createElement('dt'),description=document.createElement('dd');
    term.textContent=label;description.textContent=value;row.append(term,description);list.append(row);
   }
   feedback.append(heading,note,list);feedback.hidden=false;feedback.focus();
  });
 }

})();

(() => {
 const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
 const body = document.body;
 let paused = reduce.matches || Boolean(navigator.connection?.saveData);
 const loadVideo = video => {
  if(!video || video.dataset.loaded) return;
  const source = video.querySelector('source');
  source.src = source.dataset.src;video.dataset.loaded='true';video.load();
 };
 const syncPlayback = () => body.classList.toggle('motion-paused',paused);
 syncPlayback();
 reduce.addEventListener('change',()=>{paused=reduce.matches;syncPlayback();schedule();});
 const dialog = document.querySelector('.flight-dialog');
 if(dialog) {
  const trigger=document.querySelector('.video-open');
  const film=dialog.querySelector('.film-video');
  trigger.addEventListener('click',()=>{
   loadVideo(film);dialog.showModal();body.classList.add('film-open');syncPlayback();
   film.play()?.catch(()=>{});
  });
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{film.pause();body.classList.remove('film-open');trigger.focus();syncPlayback();});
 }
 const story=document.querySelector('.sable-experience');
 const aircraft=document.querySelector('.experience-aircraft');
 const flightZone=document.querySelector('.experience-flight-zone');
 let aircraftPose={x:16,z:-12,scale:.95};
 const phaseButtons=Array.from(document.querySelectorAll('[data-phase]'));
 const phases=[
  ['Fit the system.','Configure the equipment bay around the sensor or onboard system you want to evaluate.','Fit the test equipment.'],
  ['Bring it back.','Bring the aircraft back, then inspect the airframe, equipment and connections before another flight.','Inspect the returned aircraft.'],
  ['Test it again.','Compare flight observations with the inspection findings. Adjust the equipment layout for the next test.','Update the next configuration.']
 ];
 let activePhase=-1;
 function setPhase(index) {
  if(index===activePhase)return;
  story.style.setProperty('--module-offset','0px');
  activePhase=index;
  story.dataset.stage=String(index);
  document.querySelector('#cycle-label').textContent=phases[index][2];
  document.querySelector('.experience-title').textContent=phases[index][0];
  document.querySelector('#experience-description').textContent=phases[index][1];
  phaseButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 }
 phaseButtons.forEach((button,index)=>button.addEventListener('click',()=>{
  if(reduce.matches){setPhase(index);return;}
  const top=story.getBoundingClientRect().top+window.scrollY;
  const distance=Math.max(1,story.offsetHeight-window.innerHeight);
  window.scrollTo({top:top+distance*(index+.25)/3,behavior:paused?'instant':'smooth'});
 }));
 if(flightZone)new ResizeObserver(()=>schedule()).observe(flightZone);
 const heading=document.querySelector('.reveal-sentence');
 let words=[];
 if(heading){
  Array.from(heading.childNodes).forEach(node=>{
   if(node.nodeType!==3)return;
   const fragment=document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(text=>{
    if(!text.trim())fragment.append(document.createTextNode(text));
    else{const word=document.createElement('span');word.className='word';word.textContent=text;fragment.append(word);words.push(word);}
   });node.replaceWith(fragment);
  });
 }
 const footerWord=document.querySelector('.footer-word');
 if(footerWord){
  const word=footerWord.querySelector('span');
  let lastWidth=0;
  const fitWord=()=>{
   const width=footerWord.clientWidth;
   if(!width||Math.abs(width-lastWidth)<.5)return;
   lastWidth=width;
   word.style.fontSize='100px';
   const measured=word.getBoundingClientRect().width;
   if(measured)word.style.fontSize=`${100*width/measured}px`;
  };
  document.fonts.ready.then(()=>{lastWidth=0;fitWord();});
  new ResizeObserver(fitWord).observe(footerWord);

 }
 const clamp=v=>Math.max(0,Math.min(1,v));
 let frame=0;
 function render() {
  frame=0;
  if(story){
   const rect=story.getBoundingClientRect();
   const progress=clamp(-rect.top/Math.max(1,story.offsetHeight-window.innerHeight));
   if(!reduce.matches)setPhase(Math.min(2,Math.floor(progress*3)));
   else if(activePhase<0)setPhase(0);
   story.querySelector('.experience-progress span').style.transform=`scaleX(${progress})`;
   if(!paused&&!reduce.matches){
    aircraftPose={x:16*(1-progress),z:-12+progress*24,scale:.95};
    const phaseProgress=(progress*3)%1;
    story.style.setProperty('--module-offset',`${activePhase===0?(1-clamp(phaseProgress*1.6))*-90:0}px`);
   }
   if(flightZone){
    const pose=reduce.matches?{x:0,z:0,scale:1}:aircraftPose;
    const radians=pose.z*Math.PI/180;
    const cosine=Math.abs(Math.cos(radians)),sine=Math.abs(Math.sin(radians));
    // Fit the full rotated SVG into its own row, clear of the heading and copy.
    const width=Math.max(0,Math.min(flightZone.clientWidth*.88/(cosine+sine),flightZone.clientHeight*.94/(sine+cosine)));
    aircraft.style.width=`${width}px`;
    aircraft.style.transform=`rotateX(${pose.x}deg) rotateZ(${pose.z}deg) scale(${pose.scale})`;
   }
  }
  if(heading){
   const rect=heading.getBoundingClientRect();
   const amount=reduce.matches?1:clamp((window.innerHeight*.85-rect.top)/(window.innerHeight*.55));
   words.forEach((word,i)=>word.classList.toggle('is-lit',amount>=(i+1)/words.length));
  }
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 schedule();
 const lab=document.querySelector('.aircraft-lab');
 if(lab){
  const panel=lab.querySelector('.aircraft-detail');
  const spots=Array.from(lab.querySelectorAll('.hotspot'));
  const content={
   integration:['Equipment bay','Fit the camera, sensor or onboard computer being evaluated. Veylan works with your team on mounting and installation requirements so the aircraft configuration is prepared around your equipment.'],
   power:['Integration points','Plan how your equipment connects to its power supply and recording system. Veylan supports the integration review; the connections and compatibility requirements are agreed for your installation.'],
   access:['Maintenance access','Reach the equipment installation after landing to inspect mountings and connections. Recovering the hardware lets your team investigate what happened in flight and make changes before the next test.']
  };
  let lastSpot=null;
  const close=()=>{delete lab.dataset.component;panel.hidden=true;spots.forEach(b=>b.setAttribute('aria-expanded','false'));lastSpot?.focus();};
  spots.forEach(button=>button.addEventListener('click',()=>{
   if(!panel.hidden&&lastSpot===button){close();return;}
   lastSpot=button;lab.dataset.component=button.dataset.detail;const text=content[button.dataset.detail];
   panel.querySelector('h3').textContent=text[0];panel.querySelector('p').textContent=text[1];
   panel.hidden=false;spots.forEach(b=>b.setAttribute('aria-expanded',String(b===button)));
   panel.querySelector('.detail-close').focus();
  }));
  panel.querySelector('.detail-close').addEventListener('click',close);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden)close();});
  const labAircraft=lab.querySelector('.lab-view .aircraft');
  const resetLab=()=>{labAircraft.style.transform='';};
  lab.addEventListener('pointerleave',resetLab);
  reduce.addEventListener('change',()=>{if(reduce.matches)resetLab();});
  lab.addEventListener('pointermove',event=>{
   if(paused||reduce.matches||event.pointerType!=='mouse')return;
   const bounds=lab.getBoundingClientRect();const x=(event.clientX-bounds.left)/bounds.width-.5;
   labAircraft.style.transform=`perspective(1000px) rotateX(23deg) rotateZ(${-14+x*10}deg)`;
  });
 }
 const mission=document.querySelector('.mission-experience');
 const missionButtons=Array.from(document.querySelectorAll('[data-mission-mode]'));
 if(mission){
  const slider=mission.querySelector('#flight-position');
  const play=mission.querySelector('.mission-play');
  const map=mission.querySelector('.mission-map');
  const missionViewport=window.matchMedia('(max-width: 520px)');
  const mapKeys={sensor:'Camera field of view',software:'Planned flight path',radio:'Ground receiver link'};
  const modes={
   sensor:['Does the image stay useful in motion?','A camera that works on a bench still needs to be tested with aircraft movement and vibration.','Illustrative flight view: camera field of view beneath a moving test aircraft.','Your camera and recording equipment.','An aircraft installation to evaluate the camera in motion.','Image stability and detail in the recordings after landing.','camera','Discuss a camera test'],
   software:['Does the aircraft follow the intended path?','Move from computer simulation to a supervised flight trial of your onboard software.','Illustrative flight view: an aircraft route alongside a planned flight path.','Your flight software and onboard computer.','A test aircraft with an agreed computer installation.','Recorded behaviour against the intended flight path.','software','Discuss a software test'],
   radio:['Can the equipment maintain its link?','Evaluate your radio installation as the aircraft moves relative to its ground receiver.','Illustrative flight view: a radio link between the aircraft and a ground receiver.','Your radio, antennas and ground receiver.','An aircraft installation for testing the radio in flight.','Connection recordings alongside aircraft position.','radio','Discuss a radio test']
  };
  let running=false,animation=0,lastTime=0,flightProgress=Number(slider.value);
  function layoutMission(){
   const mobile=missionViewport.matches;
   map.setAttribute('viewBox',mobile?'0 0 1000 650':'0 0 1000 440');
   map.querySelector('.mission-scene')?.setAttribute('transform',mobile?'translate(0 80)':'translate(0 0)');
   map.querySelector('.mission-plane-shape')?.setAttribute('transform',`rotate(90) scale(${mobile ? 0.22 : 0.14}) translate(-600 -600)`);
   map.querySelector('rect')?.setAttribute('height',mobile?'650':'440');
  }
  function drawMission(){
   const t=Number(slider.value)/100,u=1-t;
   const x=u*u*u*140+3*u*u*t*320+3*u*t*t*500+t*t*t*850;
   const y=u*u*u*170+3*u*u*t*80+3*u*t*t*280+t*t*t*150;
   const dx=3*u*u*180+6*u*t*180+3*t*t*350;
   const dy=3*u*u*(-90)+6*u*t*200+3*t*t*(-130);
   map.querySelector('.mission-aircraft').setAttribute('transform',`translate(${x} ${y}) rotate(${Math.atan2(dy,dx)*180/Math.PI})`);
   map.querySelector('.sensor-visual').setAttribute('transform',`translate(${x-420} ${y-170})`);
   map.querySelector('.radio-link').setAttribute('d',`M${x} ${y}L490 353`);
   mission.style.setProperty('--flight-complete',String(t));
   slider.setAttribute('aria-valuetext',`${Math.round(t*100)} percent through the illustrative flight`);
  }
  function stopMission(){
   running=false;cancelAnimationFrame(animation);lastTime=0;
   play.textContent=reduce.matches?(Number(slider.value)>=100?'Show start':'Show end'):(Number(slider.value)>=100?'Replay flight':'Play flight');
   play.setAttribute('aria-pressed','false');mission.classList.remove('is-playing');
  }
  function advance(time){
   if(!running)return;
   if(paused||reduce.matches||document.hidden){stopMission();return;}
   if(lastTime){flightProgress=Math.min(100,flightProgress+(time-lastTime)/140);slider.value=String(flightProgress);drawMission();}
   lastTime=time;
   if(Number(slider.value)>=100)stopMission();else animation=requestAnimationFrame(advance);
  }
  play.addEventListener('click',()=>{
   if(running){stopMission();return;}
   if(reduce.matches){slider.value=Number(slider.value)>=100?'0':'100';drawMission();stopMission();return;}
   if(Number(slider.value)>=100)slider.value='0';
   if(paused){paused=false;syncPlayback();}
   running=true;lastTime=0;flightProgress=Number(slider.value);play.textContent='Pause flight';play.setAttribute('aria-pressed','true');
   mission.classList.add('is-playing');animation=requestAnimationFrame(advance);
  });
  slider.addEventListener('input',()=>{stopMission();drawMission();});
  missionButtons.forEach(button=>button.addEventListener('click',()=>{
   const mode=button.dataset.missionMode;
   mission.dataset.mission=mode;
   const key=mission.querySelector('#mission-map-key');
   if(key)key.textContent=mapKeys[mode];
   mission.querySelector('#mission-title').textContent=modes[mode][0];
   mission.querySelector('#mission-description').textContent=modes[mode][1];
   mission.querySelector('#mission-map-title').textContent=modes[mode][2];
   mission.querySelector('#mission-bring').textContent=modes[mode][3];
   mission.querySelector('#mission-enable').textContent=modes[mode][4];
   mission.querySelector('#mission-review').textContent=modes[mode][5];
   const enquiry=mission.querySelector('.mission-enquiry');
   enquiry.href=`/contact/?equipment=${modes[mode][6]}`;enquiry.textContent=modes[mode][7];
   missionButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
   drawMission();
  }));
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)stopMission();},{threshold:.1}).observe(mission);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMission();});
  reduce.addEventListener('change',stopMission);
  missionViewport.addEventListener('change',layoutMission);
  layoutMission();
  drawMission();
  stopMission();
 }
 for(const buttons of [phaseButtons,missionButtons])buttons.forEach((button,index)=>button.addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  buttons[next].focus();buttons[next].click();
 }));
})();
