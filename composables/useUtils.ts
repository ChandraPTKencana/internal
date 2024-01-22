// const route = useRoute();
// const router = useRouter();
export const useUtils = () => {
    const sayHello = () => {
        // console.log(route)
        // console.log(router)
        // console.log(this.$router)

    };

    const pointFormat = (value:any) =>{
        if (!value) return 0
        return new Intl.NumberFormat('id-ID',{minimumFractionDigits: 0}).format(value);
    }

    let countClickList=0;
    let keyClickList=-1;
    let timeoutClickList: null | ReturnType<typeof setTimeout>  = null;
    const countClickListFn=(key:any,...fn:any[])=>{
        if(keyClickList != key){
            keyClickList = key;
            countClickList = 0;
            if(timeoutClickList) clearTimeout(timeoutClickList);
            timeoutClickList = null;
        }
        countClickList++;
        if(timeoutClickList==null){
            timeoutClickList = setTimeout(()=>{
    
                if(countClickList > fn.length){
                    countClickList = fn.length;
                }
                if(countClickList!==0){
                    if(countClickList > 1) fn[0]();
                    countClickList = countClickList-1;
                    fn[countClickList]();
                }
                
                countClickList=0;
                if(timeoutClickList) clearTimeout(timeoutClickList);
                timeoutClickList = null;
            },200);
        }



    };

    return {
        sayHello,
        pointFormat,
        countClickListFn
    }
}