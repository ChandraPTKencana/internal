// const route = useRoute();
// const router = useRouter();
export const useDoms = () => {

    const loopGetParent=($el:HTMLElement,$el_data,$return=false)=>{
        if(!$el && $return) return -1;
        if(!$el && $return==false) return false;

        if($el.hasAttribute("data-"+$el_data)){
          return ($return ? $el.dataset[$el_data.toLowerCase()] : true);
        }else{
          if(!$el.parentElement) return -1;
          return loopGetParent($el.parentElement,$el_data,$return)
        }
    };

    return {
        loopGetParent,
    }
}