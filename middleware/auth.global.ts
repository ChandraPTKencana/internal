import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
import { useCommonStore } from '~/store/common';

export default defineNuxtRouteMiddleware(async (to) => {
  // console.log("from global middleware", to);
  const { authenticated, done_get_user_info } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie('token'); // get token from cookies
  // console.log(token.value, "token when route");

  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
  }



  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    return navigateTo('/');
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    abortNavigation();
    return navigateTo('/login');
  }
  
  if(to?.name !== 'login'){
    useCommonStore().loading_full = true;
  }

  if (to?.name !== 'login' && done_get_user_info.value == false) {
    const { checkUser } = useAuthStore();
    checkUser()
      .then((res) => {
      }).catch((error) => {
      })
      .finally(() => {
        return;
      });
  }
});