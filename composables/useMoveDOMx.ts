export const useMoveDOMx:any = function(_ref,items){

  


  // _ref.value.addEventListener('mousedown',mouseDown);
  // _ref.value.addEventListener('mouseup',mouseUp);
  // _ref.value.addEventListener('mouseleave',mouseUp);
  _ref.value.addEventListener('touchstart',touchStart,{passive: true});
  _ref.value.addEventListener('touchend',touchEnd,{passive: true});

  let idx = -1;
  let touch_timeout: null | ReturnType<typeof setTimeout>  = null;
  let touch_interval: null | ReturnType<typeof setInterval>  = null;
  let count_interval = 0;

  function mouseDown(e) {
    e.preventDefault();

    // result.condition = "start";

    // result.xAfter = e.clientX;
    // result.yAfter = e.clientY;


    e.currentTarget.addEventListener("mousemove",mouseMove);
  }

  function mouseMove(e) {
    // result.condition = "move";

    // result.xBefore = result.xAfter;
    // result.xAfter = e.clientX;
    // result.xRange = result.xAfter - result.xBefore;

    // result.yBefore = result.yAfter;
    // result.yAfter = e.clientY;
    // result.yRange = result.yAfter - result.yBefore;

  }

  function mouseUp(e){
    // result.condition = "end";

    // result.xAfter=0;
    // result.yAfter=0;

    // e.currentTarget.removeEventListener("mousemove",mouseMove);
  }

  function touchStart(e){
  //   // e= e || window.event;

  //   // result.condition = "start";

  //   // // e.preventDefault();

  //   // result.xAfter = e.changedTouches[0].pageX;
  //   // result.yAfter = e.changedTouches[0].pageY;
  //   let target =e.target; 
  //   console.log(target);
  //   console.log(e.currentTarget);
    
    // e.currentTarget.addEventListener("touchmove",touchMove);
    // console.log(e.target.parentElement.parentElement.parentElement.parentElement.hasAttribute("data-index"));
    // console.log(e.target.parentElement.parentElement.parentElement.parentElement.dataset.index);
    // console.log(e.composedPath());
    // e.currentTarget.addEventListener("touchend",touchEnd,{passive: true});
    // _ref.value.addEventListener('touchend',touchEnd,{passive: true});
    idx = loopGetDataIndex(e.target);
    touch_interval = setInterval(() => {
      count_interval+=100;
      console.log(count_interval);
      
    }, 100);
  }

  function touchMove(e){
    let target =e.target; 
    console.log(e);
    console.log(e.currentTarget);

    // result.condition = "move";

    // result.xBefore = result.xAfter;
    // result.xAfter = e.changedTouches[0].pageX;
    // result.xRange = result.xAfter - result.xBefore;

    // result.yBefore = result.yAfter;
    // result.yAfter = e.changedTouches[0].pageY;
    // result.yRange = result.yAfter - result.yBefore;

  }

  function touchEnd(e){
    clearInterval(touch_interval);
    console.log(count_interval);
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
    
    // console.log(e.currentTarget);
    
    // e= e || window.event;

    // result.condition = "end";

    // result.xAfter=0;
    // result.yAfter=0;

    // e.currentTarget.removeEventListener("touchmove",this.touchMove);
  }


  function loopGetDataIndex($el:Element){
    if(!$el||!$el.parentElement) return -1;
    if($el.parentElement.hasAttribute("data-index")){
      return $el.parentElement.dataset.index;
    }else{
      return loopGetDataIndex($el.parentElement)
    }
  }
  // return useFetch(request, { baseURL: config.public.baseURL, ...opts })
}