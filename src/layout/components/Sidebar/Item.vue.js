export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    }
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];
    const iconHref = "#" + icon;

    if (icon) {
      const iconNode = h("svg", { class: "svg-icon" }, [
        h("use", { attrs: { href: iconHref } })
      ]);
      vnodes.push(iconNode);
    }

    if (title) {
      const textNode = h("span", { slot: "title" }, title);
      vnodes.push(textNode);
    }
    return vnodes;
  }
};
