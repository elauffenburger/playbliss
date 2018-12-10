import { Store, MutationPayload } from "vuex";
declare module "vuex" {
  export type SubscribeActionStore<T> = Store<T> & {
    subscribeAction: (cb: (action: MutationPayload, state: T) => void) => void;
  };
}
