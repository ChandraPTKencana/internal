import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';
export default defineNuxtRouteMiddleware(async (to) => {
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
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

  if (to?.name !== 'login') {
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