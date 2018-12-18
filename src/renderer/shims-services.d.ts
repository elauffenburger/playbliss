import Vue, { ComponentOptions } from "vue";
import { Services } from "./services";

declare module "vue/types/vue" {
  interface Vue {
    $services: Services;
  }
}

declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    services?: Services;
  }
}
