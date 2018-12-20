import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "StickyFrame"
})
export default class StickyFrame extends Vue {
  @Prop()
  position?: "top" | "bottom";

  mounted() {
    this.updateStyle();
  }

  update() {
    this.updateStyle();
  }

  updateStyle() {
    const outerWrapper = this.$refs["wrapper"] as HTMLElement;
    if (!outerWrapper) {
      return;
    }

    const contentWrapper = this.$refs["content-wrapper"] as HTMLElement;
    if (!contentWrapper) {
      return;
    }

    this.updatePosition(contentWrapper);
    this.updateHeight(outerWrapper, contentWrapper);
  }

  updatePosition(contentWrapper: HTMLElement) {
    if (!this.position) {
      return;
    }

    contentWrapper.style[this.position] = "0";
  }

  updateHeight(outerWrapper: HTMLElement, contentWrapper: HTMLElement) {
    const height = `${contentWrapper.scrollHeight}px`;
    outerWrapper.style.height = height;
    outerWrapper.style.maxHeight = height;
  }
}
