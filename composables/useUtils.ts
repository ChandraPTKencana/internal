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


    return {
        sayHello,
        pointFormat
    }
}