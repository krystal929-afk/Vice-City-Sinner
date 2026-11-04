/* Shared VCS interview delivery for static GitHub Pages.
   Submissions are sent through FormSubmit. The first submission to a
   recipient requires that recipient to confirm the activation email.
   The browser saves a local copy before handing the file to FormSubmit. */
(function(){
  'use strict';
  const ENDPOINT='https://formsubmit.co/satanica.lux@vicecitysinner.com';
  const MAX_FILE_BYTES=10*1024*1024;

  function download(file){
    const url=URL.createObjectURL(file);
    const link=document.createElement('a');
    link.href=url;
    link.download=file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),15000);
  }

  function hidden(form,name,value){
    const input=document.createElement('input');
    input.type='hidden';input.name=name;input.value=value;
    form.appendChild(input);
  }

  function submit(file,subject,interviewText){
    if(!(file instanceof File))throw new Error('Interview file could not be created.');
    if(file.size>MAX_FILE_BYTES){
      download(file);
      throw new Error('This interview is over the 10 MB email attachment limit. A backup was downloaded. Please email it manually to satanica.lux@vicecitysinner.com.');
    }
    // FormSubmit documents multipart file uploads via ordinary HTML POST.
    let transfer;
    try{
      transfer=new DataTransfer();
      transfer.items.add(file);
    }catch(e){
      download(file);
      throw new Error('This browser cannot attach files automatically. A copy was downloaded; please email it manually.');
    }
    const form=document.createElement('form');
    form.method='POST';
    form.action=ENDPOINT;
    form.enctype='multipart/form-data';
    form.acceptCharset='UTF-8';
    form.style.display='none';
    hidden(form,'_subject',subject);
    hidden(form,'_captcha','false');
    hidden(form,'_template','table');
    hidden(form,'_url',location.href);
    hidden(form,'interview',subject);
    hidden(form,'message',interviewText);
    const attachment=document.createElement('input');
    attachment.type='file';
    attachment.name='attachment';
    attachment.files=transfer.files;
    if(attachment.files.length!==1||attachment.files[0].size!==file.size){
      throw new Error('This browser could not attach the interview. Please download your copy instead.');
    }
    form.appendChild(attachment);
    document.body.appendChild(form);
    // Keep a local backup in case mail is blocked or activation is incomplete.
    download(file);
    form.submit();
  }

  window.VCSInterviewDelivery={submit,download};
})();