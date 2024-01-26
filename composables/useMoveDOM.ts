export const useMoveDOM:any = function(_ref,items){
  _ref.value.addEventListener('touchstart',touchStart,{passive: true});
  _ref.value.addEventListener('touchend',touchEnd,{passive: true});

  let idx = -1;
  let touch_interval: null | ReturnType<typeof setInterval>  = null;
  let count_interval = 0;

  function touchStart(e){
    idx = loopGetDataIndex(e.target);
    touch_interval = setInterval(() => {
      count_interval+=100;
    }, 100);
  }

  function touchEnd(e){
    clearInterval(touch_interval);
    let coor = e.changedTouches[0];
    let endIdx = -1;        
    if(count_interval > 400){      
      let target = document.elementFromPoint(coor.clientX,coor.clientY);
      endIdx = loopGetDataIndex(target);
      let old = items.value[idx];
      items.value.splice(idx,1);
      items.value.splice(endIdx,0,{...old});
    }
    count_interval = 0;
    idx = -1;    
  }

  function loopGetDataIndex($el:HTMLElement){
    if(!$el) return -1;
    if($el.hasAttribute("data-index")){
      return $el.dataset.index;
    }else{
      if(!$el.parentElement) return -1;
      return loopGetDataIndex($el.parentElement)
    }
  }
}