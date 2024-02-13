<template>
    <div class="w-full h-full overflow-y-auto" > 
        <ClientOnly>
            <div v-html="txtNot"></div>
        </ClientOnly>
    </div>
    <button @click="callNotif(0)"> Call Notif </button>
    <button @click="callNotif(30000)"> Call 30 second </button>
</template>
<script lang="ts" setup>
const w_notification = ref(null);

const txtNot = ref("");

const timecount = ref(0);
let interval: null | ReturnType<typeof setInterval>  = null;

const callNotif = (timeout)=>{
    if(interval==null){
        interval = setInterval(() => {
            timecount.value += 1000;
            txtNot.value += timecount.value + 'x' +timeout + "<br/>";
            if(timecount.value >= timeout){
                timecount.value = 0;
                clearInterval(interval);
                interval= null;


                txtNot.value += "=====================================================<br/>";
                txtNot.value += "called<br/>";
                if ('Notification' in window) {
                    txtNot.value += "called in<br/>";
                    
                    if (Notification.permission === 'granted') {
        
                        // In your Vue component or page
                        if ('Notification' in window && 'serviceWorker' in navigator) {
                            navigator.serviceWorker.getRegistration().then(function(registration) {
                                if (registration) {
                                    registration.showNotification('Test Notification', {
                                        body: 'This is a test notification',
                                        icon: 'favicon.png',
                                        requireInteraction: true
                                    });
                                } else {
                                console.error('Service worker not registered.');
                                }
                            }).catch(function(error) {
                                console.error('Error checking service worker registration:', error);
                            });
                        } else {
                        console.error('Notifications or service workers not supported.');
                        }
                    
                    } else {
                        Notification.requestPermission();
                    }
                }
            }

        }, 1000);
    }
};

// onMounted(()=>{
//     // In your Vue component or page

//     if ('serviceWorker' in navigator) {
//         console.log("load");
//         navigator.serviceWorker.getRegistrations().then(function(registrations) {
//             for (const registration of registrations) {
//             registration.unregister().then(function() {
//                 console.log('Service worker unregistered:', registration.scope);
//             }).catch(function(error) {
//                 console.error('Failed to unregister service worker:', error);
//             });
//             }
//         }).catch(function(error) {
//             console.error('Error getting service worker registrations:', error);
//         });


//         navigator.serviceWorker.register('/stok/sw.js').then((registration) => {
//             console.log('Service Worker registered:', registration);
//         }).catch((error) => {
//             console.log('Service Worker registration failed:', error);
//         });
//     }
// })
</script>

