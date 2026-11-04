/* Vice City Sinner interview delivery. GitHub Pages has no server-side email.
   Basin is the delivery provider once an owner-created endpoint is configured.
   Until then a local download is provided, without claiming the email was sent.
   Endpoint URLs are intended for inclusion in public form HTML; no secret keys. */
(function(){
  'use strict';

  // Paste the exact Basin form endpoint here after owner setup and successful test.
  const BASIN_ENDPOINT='';
  const TO='satanica.lux@vicecitysinner.com';
  const MAX_BYTES=100*1024*1024;

  function validEndpoint(value){
    if(typeof value!=='string')return false;
    try{
      const u=new URL(value);
      return u.protocol==='https:'&&u.hostname==='usebasin.com'&&/^\\/f\\/[a-zA-Z0-9_-]+\\/?$/.test(u.pathname)&&!u.search&&!u.hash;
    }catch(e){return false;}
  }

  function download(file){
    const url=URL.createObjectURL(file);
    const link=document.createElement('a');
    link.href=url;
    link.download=file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),30000);
  }

  function ready(){return validEndpoint(BASIN_ENDPOINT);}

  async function submit(file,subject,description,options){
    options=options||{};
    if(!(file instanceof File))throw new Error('Could not prepare the interview file.');
    const endpoint=options.endpoint||BASIN_ENDPOINT;
    const backup=options.backup!==false;
    if(!validEndpoint(endpoint)){
      if(backup)download(file);
      return {accepted:false,reason:'not-configured',backup};
    }
    if(file.size>MAX_BYTES){
      if(backup)download(file);
      throw new Error('The file is too large for this form service. A backup was downloaded; email it to '+TO+'.');
    }

    const body=new FormData();
    body.append('name','Vice City Sinner interview');
    body.append('subject',subject);
    body.append('message',description||'Completed interview attached.');
    body.append('source_page',location.href);
    body.append('attachment',file,file.name);

    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),90000);
    try{
      const response=await fetch(endpoint,{method:'POST',body,headers:{Accept:'application/json'},signal:controller.signal});
      const data=await response.json().catch(()=>null);
      if(!response.ok||data&&data.success===false){
        throw new Error(data&&data.message?data.message:'The form service did not accept this submission.');
      }
      return {accepted:true};
    }catch(error){
      if(backup)download(file);
      throw new Error('Delivery could not be confirmed. '+(backup?'A backup was downloaded. ':'')+
        'Keep your answers and contact '+TO+' before retrying. '+(error.name==='AbortError'?'The request timed out.':''));
    }finally{
      clearTimeout(timeout);
    }
  }

  window.VCSInterviewDelivery={submit,download,ready,validEndpoint,destination:TO};
})();