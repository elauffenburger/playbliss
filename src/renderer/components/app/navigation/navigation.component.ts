import Vue from "vue";
import Component from "vue-class-component";
import { Prop, Watch } from 'vue-property-decorator';

@Component({ name: "Navigation" })
export default class Navigation extends Vue {
  drawerOpen = false;

  @Prop()
  value?: boolean;

  @Watch("value")
  onOpenChanged(open: boolean) {
    this.drawerOpen = open;
  }

  @Watch("drawerOpen")
  onDrawerOpenChanged(open: boolean) {
    this.$emit("input", open);
  }
}
