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
const $=id=>document.getElementById(id);
const textareas=[...document.querySelectorAll('textarea[data-index]')];
let answers=loadAnswers();
let saveTimers=new Map();

function blankAnswers(){return QUESTIONS.map(()=>"");}

function loadAnswers(){
  const blank=blankAnswers();
  try{
    const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    if(!raw)return blank;
    const source=Array.isArray(raw)?raw:(Array.isArray(raw.answers)?raw.answers:null);
    if(!source)return blank;
    source.slice(0,QUESTIONS.length).forEach((entry,i)=>{
      if(typeof entry==='string')blank[i]=entry;
      else if(entry&&typeof entry.text==='string')blank[i]=entry.text;
    });
    return blank;
  }catch(e){return blank;}
}

function saveAll(){
  localStorage.setItem(STORAGE_KEY,JSON.stringify({answers:answers.map(text=>({text}))}));
}

function setStatus(textarea,text){
  const status=textarea.parentElement.querySelector('.autosave');
  if(status)status.textContent=text;
}

textareas.forEach(textarea=>{
  const i=Number(textarea.dataset.index);
  textarea.value=answers[i]||'';
  textarea.addEventListener('input',()=>{
    answers[i]=textarea.value;
    setStatus(textarea,'Saving…');
    clearTimeout(saveTimers.get(i));
    saveTimers.set(i,setTimeout(()=>{
      saveAll();
      setStatus(textarea,'Autosaved on this device.');
    },250));
  });
  textarea.addEventListener('blur',()=>{
    answers[i]=textarea.value;
    saveAll();
    setStatus(textarea,'Autosaved on this device.');
  });
});

function buildText(){
  const lines=['MR. SATAN: THE RIVETHEAD INTERVIEW','The Vice City Sinner','','Exported: '+new Date().toLocaleString(),''];
  QUESTIONS.forEach((question,i)=>{
    const answer=(answers[i]||'').trim();
    lines.push('QUESTION '+String(i+1).padStart(2,'0'),question,'',answer||'[No answer]','','—','');
  });
  return lines.join('\n');
}

function toast(message){
  const t=$('toast');
  t.textContent=message;
  t.classList.add('show');
  clearTimeout(t._x);
  t._x=setTimeout(()=>t.classList.remove('show'),2200);
}

async function submitInterview(){
  textareas.forEach(textarea=>{answers[Number(textarea.dataset.index)]=textarea.value;});
  saveAll();
  const content=buildText();
  const file=new File([content],'Mr-Satan-Rivethead-Interview.txt',{type:'text/plain'});
  const button=$('submit');
  const status=$('submissionStatus');
  button.disabled=true;
  status.textContent='Preparing interview file…';
  try{
    if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){
      await navigator.share({title:'Mr. Satan — The Rivethead Interview',text:'Completed Vice City Sinner interview.',files:[file]});
      status.textContent='Shared. Your working copy is still saved on this device.';
    }else{
      const url=URL.createObjectURL(file);
      const a=document.createElement('a');
      a.href=url;
      a.download=file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),4000);
      status.textContent='Interview file downloaded.';
      toast('Interview downloaded.');
    }
  }catch(e){
    if(e&&e.name==='AbortError')status.textContent='Share canceled. Nothing was lost.';
    else{status.textContent='Could not create the interview file. Try again.';console.error(e);}
  }finally{button.disabled=false;}
}

$('interviewForm').addEventListener('submit',event=>{
  event.preventDefault();
  submitInterview();
});
})();
