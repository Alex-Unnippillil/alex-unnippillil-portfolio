(function(){
  const TAB_ID_KEY = 'scroll-focus-tab-id';
  function getTabId(){
    let id = sessionStorage.getItem(TAB_ID_KEY);
    if(!id){
      id = Date.now()+"-"+Math.random();
      sessionStorage.setItem(TAB_ID_KEY,id);
    }
    return id;
  }
  function stateKey(path){
    return getTabId()+":"+path;
  }
  function setup(){
    try{history.scrollRestoration='manual';}catch(e){}
    function save(){
      var active = document.activeElement;
      var data={x:window.scrollX,y:window.scrollY,focusId:active&&active.id?active.id:null};
      try{sessionStorage.setItem(stateKey(location.pathname+location.search),JSON.stringify(data));}catch(e){}
    }
    function restore(){
      var raw=sessionStorage.getItem(stateKey(location.pathname+location.search));
      if(!raw)return;
      try{
        var d=JSON.parse(raw);
        window.scrollTo(d.x||0,d.y||0);
        if(d.focusId){
          var el=document.getElementById(d.focusId);
          if(el) el.focus();
        }
      }catch(e){}
    }
    addEventListener('pagehide',save);
    addEventListener('pageshow',restore);
  }
  window.setupScrollFocusRestoration = setup;
})();
