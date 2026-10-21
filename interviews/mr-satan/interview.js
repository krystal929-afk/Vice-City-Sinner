(function(){
'use strict';

const QUESTIONS=[
"Your dad once sat you down and listened to Boston with you, the whole album, start to finish, on purpose. And he kept doing that with all kinds of music. Tell me about those listening sessions. What did they teach you about music before you even knew you were learning anything?",
"Then came GWAR and the Ramones. What did they do to young George?",
"Take me back to your punk days. How old were you, where were you, what were you listening to, and what the hell did you look like? Don’t skip the details.",
"Your first DJ setup was tiny. What exactly were you working with, and what did you manage to make happen with it anyway?",
"Danny Bled took you under his wing. What did he teach you about DJing that you still carry into every set today?",
"All night, everyone’s eyes are on you. Then it’s 4 a.m., the room is emptying out, and you’re packing cables and leaving by yourself. What is that part of the night like?",
"I need the story behind ‘It Isn’t Going to Suck Itself: The George Rickman Story.’ Start at the beginning. I want the whole ridiculous history.",
"Tell me about the Cincinnati kink, punk, and rivethead scene you came up in. The clubs, the people, the personalities, and the nights you probably shouldn’t talk about but hopefully will.",
"Before Mr. Satan, there was DJ Nipples. Where the hell did that name come from, what was DJ Nipples like, and is he actually retired?",
"When did industrial and goth stop being music you liked and become part of how you understood yourself? And what does being a rivethead mean to you beyond what’s playing through the speakers?",
"Walk me through the rivethead uniform according to Mr. Satan. What’s essential, what’s optional, and what is an unforgivable crime against the scene?",
"When did you realize the Daddy Dom thing wasn’t just bedroom vocabulary, but genuinely part of how you relate to people? What does that role mean to you, and what do people completely misunderstand about it?",
"You’ve gone from punk kid to DJ Nipples to Mr. Satan. What are you trying to build now? And what would you tell the nervous baby bat standing outside their first industrial night wondering whether they belong there?",
"What’s something you genuinely believe that would make half the scene mad?"
];

const STORAGE_KEY='vcs-mr-satan-interview-v1';
const DB_NAME='vcs-mr-satan-audio';
const STORE='audio';
const $=id=>document.getElementById(id);
const screens=['intro','quiz','review','success'];
let state=loadState();
let index=Math.min(Math.max(state.index||0,0),QUESTIONS.length-1);
let mediaRecorder=null,mediaStream=null,chunks=[],recordStartedAt=0,timerId=null,audioUrl=null,dbPromise=null;

function blankState(){return{index:0,answers:QUESTIONS.map(()=>({text:'',audio:null}))};}
function loadState(){try{const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');if(!raw||!Array.isArray(raw.answers))return blankState();const next=blankState();next.index=Number.isFinite(raw.index)?raw.index:0;raw.answers.slice(0,QUESTIONS.length).forEach((a,i)=>{next.answers[i].text=typeof a.text==='string'?a.text:'';next.answers[i].audio=a.audio&&typeof a.audio==='object'?a.audio:null;});return next;}catch(e){return blankState();}}
function saveState(){state.index=index;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function show(id){screens.forEach(s=>$(s).hidden=s!==id);window.scrollTo({top:0,behavior:'smooth'});}
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),2200);}
function pad(n){return String(n).padStart(2,'0');}
function formatTime(ms){const s=Math.floor(ms/1000);return pad(Math.floor(s/60))+':'+pad(s%60);}
function formatBytes(bytes){if(!bytes)return'';if(bytes<1024*1024)return Math.max(1,Math.round(bytes/1024))+' KB';return(bytes/1024/1024).toFixed(1)+' MB';}
function safeExt(type){if(type.includes('mp4'))return'm4a';if(type.includes('ogg'))return'ogg';if(type.includes('wav'))return'wav';return'webm';}
function audioKey(i){return'q-'+(i+1);}

function openDb(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{if(!('indexedDB'in window)){reject(new Error('IndexedDB unavailable'));return;}const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});return dbPromise;}
async function putAudio(key,blob){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(blob,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}
async function getAudio(key){const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE,'readonly').objectStore(STORE).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error);});}
async function removeAudio(key){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}

async function render(){
  if(mediaRecorder&&mediaRecorder.state==='recording')stopRecording();
  $('count').textContent=pad(index+1)+' / '+pad(QUESTIONS.length);
  $('fill').style.width=((index+1)/QUESTIONS.length*100)+'%';
  $('number').textContent=pad(index+1);
  $('question').textContent=QUESTIONS[index];
  $('answer').value=state.answers[index].text||'';
  $('prev').disabled=index===0;
  $('next').textContent=index===QUESTIONS.length-1?'Review answers →':'Save & next →';
  await renderAudio();
}

async function renderAudio(){
  if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl=null;}
  const meta=state.answers[index].audio;
  if(!meta){$('audioWrap').hidden=true;$('recordMeta').textContent='No recording yet.';$('recordLabel').textContent='Record voice';return;}
  try{const blob=await getAudio(audioKey(index));if(!blob){state.answers[index].audio=null;saveState();$('audioWrap').hidden=true;$('recordMeta').textContent='No recording yet.';return;}audioUrl=URL.createObjectURL(blob);$('audio').src=audioUrl;$('audioWrap').hidden=false;$('recordLabel').textContent='Record again';$('recordMeta').textContent='Saved · '+formatBytes(blob.size)+(meta.durationMs?' · '+formatTime(meta.durationMs):'');}catch(e){$('audioWrap').hidden=true;$('recordMeta').textContent='Recording storage is unavailable in this browser.';}
}

function saveText(){state.answers[index].text=$('answer').value;saveState();$('autosave').textContent='Autosaved on this device.';}
let saveTimer=null;
$('answer').addEventListener('input',()=>{$('autosave').textContent='Saving…';clearTimeout(saveTimer);saveTimer=setTimeout(saveText,250);});
$('answer').addEventListener('blur',saveText);

function supportedMime(){if(!window.MediaRecorder||!MediaRecorder.isTypeSupported)return'';return['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t=>MediaRecorder.isTypeSupported(t))||'';}
async function startRecording(){
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){toast('Voice recording is not supported in this browser.');return;}
  try{
    mediaStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    const mime=supportedMime();const opts={audioBitsPerSecond:64000};if(mime)opts.mimeType=mime;
    mediaRecorder=new MediaRecorder(mediaStream,opts);chunks=[];
    mediaRecorder.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data);};
    mediaRecorder.onstop=finishRecording;mediaRecorder.start(500);recordStartedAt=Date.now();
    $('record').classList.add('recording');$('recordLabel').textContent='Stop recording';$('recordMeta').textContent='Recording · 00:00';
    timerId=setInterval(()=>{$('recordMeta').textContent='Recording · '+formatTime(Date.now()-recordStartedAt);},500);
  }catch(e){toast(e&&e.name==='NotAllowedError'?'Microphone permission was not granted.':'Could not start the microphone.');cleanupStream();}
}
function stopRecording(){if(mediaRecorder&&mediaRecorder.state==='recording')mediaRecorder.stop();}
async function finishRecording(){
  clearInterval(timerId);timerId=null;const durationMs=Math.max(0,Date.now()-recordStartedAt);const type=(mediaRecorder&&mediaRecorder.mimeType)||(chunks[0]&&chunks[0].type)||'audio/webm';const blob=new Blob(chunks,{type});cleanupStream();$('record').classList.remove('recording');$('recordLabel').textContent='Record again';
  if(!blob.size){$('recordMeta').textContent='Nothing was recorded.';return;}
  try{await putAudio(audioKey(index),blob);state.answers[index].audio={type:blob.type,size:blob.size,durationMs,recordedAt:new Date().toISOString()};saveState();await renderAudio();toast('Voice answer saved.');}catch(e){$('recordMeta').textContent='Could not save this recording on the device.';}
}
function cleanupStream(){if(mediaStream){mediaStream.getTracks().forEach(t=>t.stop());mediaStream=null;}mediaRecorder=null;chunks=[];}
$('record').addEventListener('click',()=>{if(mediaRecorder&&mediaRecorder.state==='recording')stopRecording();else startRecording();});
$('deleteAudio').addEventListener('click',async()=>{try{await removeAudio(audioKey(index));}catch(e){}state.answers[index].audio=null;saveState();await renderAudio();toast('Recording deleted.');});

$('begin').addEventListener('click',async()=>{show('quiz');await render();});
$('prev').addEventListener('click',async()=>{saveText();if(index>0){index--;saveState();await render();window.scrollTo({top:0,behavior:'smooth'});}});
$('next').addEventListener('click',async()=>{saveText();if(index===QUESTIONS.length-1){buildReview();show('review');}else{index++;saveState();await render();window.scrollTo({top:0,behavior:'smooth'});}});
$('backToLast').addEventListener('click',async()=>{index=QUESTIONS.length-1;saveState();show('quiz');await render();});
$('editAgain').addEventListener('click',()=>{buildReview();show('review');});

function answerStatus(a){const hasText=!!a.text.trim(),hasAudio=!!a.audio;if(hasText&&hasAudio)return'Text + voice';if(hasAudio)return'Voice';if(hasText)return'Text';return'Blank';}
function buildReview(){const list=$('reviewList');list.innerHTML='';QUESTIONS.forEach((q,i)=>{const b=document.createElement('button');b.type='button';b.className='review-item';b.innerHTML='<span class="review-num">'+pad(i+1)+'</span><span class="review-q"></span><span class="review-status">'+answerStatus(state.answers[i])+'</span>';b.querySelector('.review-q').textContent=q;b.addEventListener('click',async()=>{index=i;saveState();show('quiz');await render();});list.appendChild(b);});}

async function createPackage(){
  if(!window.JSZip)throw new Error('ZIP library did not load');
  const zip=new JSZip();
  const exported={title:'Mr. Satan: The Rivethead Interview',publication:'The Vice City Sinner',exportedAt:new Date().toISOString(),questions:[]};
  const lines=['MR. SATAN: THE RIVETHEAD INTERVIEW','The Vice City Sinner','','Exported: '+new Date().toLocaleString(),''];
  for(let i=0;i<QUESTIONS.length;i++){
    const a=state.answers[i];let audioFile=null;
    if(a.audio){try{const blob=await getAudio(audioKey(i));if(blob){audioFile='audio/question-'+pad(i+1)+'.'+safeExt(blob.type||a.audio.type||'audio/webm');zip.file(audioFile,blob);}}catch(e){}}
    exported.questions.push({number:i+1,question:QUESTIONS[i],text:a.text||'',audioFile,audio:a.audio||null});
    lines.push('QUESTION '+pad(i+1),QUESTIONS[i],'',a.text.trim()?a.text.trim():'[No written answer]');if(audioFile)lines.push('[Voice answer: '+audioFile+']');lines.push('','—','');
  }
  zip.file('Mr-Satan-Rivethead-Interview.txt',lines.join('\n'));
  zip.file('Mr-Satan-Rivethead-Interview.json',JSON.stringify(exported,null,2));
  zip.file('README.txt','This private interview package was created at vicecitysinner.com. It contains Mr. Satan’s written responses and any voice recordings he chose to include.\n');
  return zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
}

async function submitPackage(){
  const btn=$('submit'),again=$('shareAgain');if(btn)btn.disabled=true;if(again)again.disabled=true;
  try{
    toast('Preparing interview package…');
    const blob=await createPackage();const file=new File([blob],'Mr-Satan-Rivethead-Interview.zip',{type:'application/zip'});
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Mr. Satan — The Rivethead Interview',text:'Completed Vice City Sinner interview package.',files:[file]});show('success');}
    else{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);show('success');toast('Interview ZIP downloaded.');}
  }catch(e){if(e&&e.name==='AbortError')toast('Share canceled. Nothing was lost.');else{toast('Could not prepare the package. Try again.');console.error(e);}}
  finally{if(btn)btn.disabled=false;if(again)again.disabled=false;}
}
$('submit').addEventListener('click',submitPackage);
$('shareAgain').addEventListener('click',submitPackage);
window.addEventListener('beforeunload',()=>{if(mediaRecorder&&mediaRecorder.state==='recording')stopRecording();if(audioUrl)URL.revokeObjectURL(audioUrl);cleanupStream();});
})();
