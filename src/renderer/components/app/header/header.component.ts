import Vue from "vue";
import Component from "vue-class-component";

@Component({ name: "Header" })
export default class Header extends Vue {
  navigateTo(path: string) {
    this.$router.push(path);
  }

  onClickToolbarIcon() {
    this.$emit('toolbarIconClicked');
  }

  onClickSettings() {
    this.$emit('settingsClicked');
  }
}