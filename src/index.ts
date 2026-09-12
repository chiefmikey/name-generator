import { createApp } from 'vue';

import App from './components/App.vue';
import { capturePageView, initAnalytics } from './lib/analytics';

initAnalytics();
capturePageView();

createApp(App).mount('#app');
