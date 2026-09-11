import { capturePageView, initAnalytics } from '@mikl/analytics/vanilla';
import { createApp } from 'vue';

import App from './components/App.vue';

initAnalytics();
capturePageView();

createApp(App).mount('#app');
