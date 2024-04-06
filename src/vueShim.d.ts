declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{ [key: string]: any }, {}, any>;
  export default component;
}
