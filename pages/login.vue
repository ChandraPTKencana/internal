<script lang="ts" setup>
definePageMeta({
    layout: "clear"
});

import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created
import { useErrorStore } from '~/store/error'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { trigger } = useErrorStore();

const { authenticated, loading } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const user = ref({
    username: '',
    password: '',
});

const field_errors = ref<Record<string, any>>({})
const router = useRouter();

const login = async () => {
    try {
        field_errors.value = {};

        await authenticateUser({ username: user.value.username, password: user.value.password }); // call authenticateUser and pass the user object
        // redirect to homepage if user is authenticated
        if (authenticated.value) {
            router.push('/');
        }
    } catch (error: any) {
        trigger(error, field_errors);
    }
    finally {
    }
};
</script>
<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-blue-500">Sign in to your account
            </h2>
        </div>
        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                    <div class="mt-2">
                        <input :disabled="loading" :class="loading ? 'bg-gray-300' : 'bg-white-500'" id="username" name="username" type="text" autocomplete="username" required
                            class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
                            v-model="user.username">
                        <div class="sm:text-sm text-red-500">
                            {{ field_errors.username }}
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div class="text-sm">
                            <!-- <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a> -->
                        </div>
                    </div>
                    <div class="mt-2">
                        <input :disabled="loading" :class="loading ? 'bg-gray-300' : 'bg-white-500'" id="password" name="password" type="password" autocomplete="current-password" required
                            class="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6"
                            v-model="user.password">
                        <div class="sm:text-sm text-red-500">
                            {{ field_errors.password }}
                        </div>
                    </div>
                </div>
                <div>
                    <button :disabled="loading" :class="loading ? 'bg-blue-300' : 'bg-blue-500'" @click.prevent="login"
                        class="flex w-full items-center justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <div :class="loading ? 'block' : 'hidden'" class=" mr-1">
                            <IconsLoading />
                        </div>
                        Sign in
                    </button>
                </div>
            </div>

            <!-- <p class="mt-10 text-center text-sm text-gray-500">
            Not a member?
            <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
            </p> -->
        </div>
    </div>
</template>