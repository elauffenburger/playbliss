import { Store, MutationPayload } from "vuex";
declare module "vuex" {
  export class SubscribeActionStore<T> extends Store<T> {
    subscribeAction(cb: (action: MutationPayload, state: T) => void): void;
  }
}
