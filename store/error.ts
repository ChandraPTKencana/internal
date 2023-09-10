import { defineStore, storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useAlertStore } from '~/store/alert';
// interface ErrorPayloadInterface {
//   email: string;
//   password: string;
// }

export const useErrorStore = defineStore('error', {
  state: () => ({
    // authenticated: false,
    // loading: false,
  }),
  actions: {
    // async authenticateUser({ email, password }: UserPayloadInterface) {
    //   const { data, error, status, pending }: any = await useFetch('http://127.0.0.1:8800/internal/login', {
    //     method: 'post',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: {
    //       email,
    //       password,
    //     },
    //     timeout: 1000,
    //   });
    //   if (error) {
    //     switch (error.status) {
    //       case 404:
    //         console.error("The resource was not found.");
    //         break;
    //       case 500:
    //         console.error("An internal server error occurred.");
    //         break;
    //       default:
    //         console.log(status);
    //         console.log(error.value.statusCode);
    //     }
    //   }
    //   // if (error) {
    //   //   console.error(error.status);
    //   // } else {
    //   //   console.log(status); // 200
    //   // }

    //   this.loading = pending;
    //   // console.log(data);

    //   if (data.value) {

    //     const token = useCookie('token'); // useCookie new hook in nuxt 3
    //     token.value = data?.value?.data?.access_token; // set token to cookie
    //     console.log(token.value, "token when login");
    //     this.authenticated = true; // set authenticated  state value to true
    //   }

    //   // useFetch from nuxt 3
    //   // try {
    //   //   const { data, pending }: any = await useFetch('http://127.0.0.1:8000/internal/login', {
    //   //     method: 'post',
    //   //     headers: { 'Content-Type': 'application/json' },
    //   //     body: {
    //   //       email,
    //   //       password,
    //   //     },
    //   //     timeout: 1000,
    //   //   });
    //   //   this.loading = pending;
    //   //   console.log(data);

    //   //   if (data.value) {

    //   //     const token = useCookie('token'); // useCookie new hook in nuxt 3
    //   //     token.value = data?.value?.data?.access_token; // set token to cookie
    //   //     console.log(token.value, "token when login");
    //   //     this.authenticated = true; // set authenticated  state value to true
    //   //   }

    //   // } catch (error) {
    //   //   console.log("auth");
    //   //   console.log(error);

    //   //   // console.log(error, "auth");


    //   // }
    // },
    trigger(error: any, fields = {}) {
      let errorStatusCode = error.value.statusCode;

      const { show, status, message } = storeToRefs(useAlertStore());
      if (error.value.data == undefined || errorStatusCode == 404) {
        // console.log("trigger error", errorStatusCode);

        show.value = true;
        status.value = "Failed";
        message.value = "Aplikasi mengalami kegagalan mohon di informasikan ke bagian Terkait";
        return;
      }

      // 400 :	Bad Request
      // 401 :	Unauthorized
      // 403 :	Forbidden
      // 404 :	Not Found
      // 500 :	Internal Server Error
      // 503 :	Service Unavailable

      let errorMessage = error.value.data.message;

      if (errorStatusCode == 422) {
        this.setErrors(fields, error.value.data);
        return;
      }

      if (errorStatusCode == 400 || errorStatusCode == 403) {
        show.value = true;
        status.value = "Failed";
        message.value = errorMessage;
        return;
      }

      if (errorStatusCode == 401) {
        const token = useCookie('token');
        token.value = null;

        const { authenticated } = storeToRefs(useAuthStore());
        authenticated.value = false;

        const email = useCookie('email'); // useCookie new hook in nuxt 3
        email.value = null; // set token to cookie

        const scopes = useCookie('scopes'); // useCookie new hook in nuxt 3
        scopes.value = null;

        const router = useRouter();
        router.push('/login');
        return;
      }



      // if (error.response.status == 422) {
      //   commit('error/SET_ERRORS', error.response.data, { root: true });
      // }

      // if (error.response.status == 400 || error.response.status == 403) {
      //   commit('alert/SET_ALERT', {
      //     show: true,
      //     status: "Gagal",
      //     message: error.response.data.message
      //   }, { root: true });
      // }

      // if (error.response.status == 403) {
      //   // this.$router.push({path:"/dashboard"});
      // }

      // if (error.response.status == 401) {
      //   this.$auth.strategy.token.set("");
      //   this.$router.push({ path: "/" });
      // }

    },
    setErrors(m_fields: Record<string, any> = {}, r_fields = []) {
      m_fields = {};
      for (let field in r_fields) {
        m_fields.value[field] = r_fields[field][0];
      }
    }
  },
});