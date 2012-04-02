/* App.js */

enyo.kind({
  name: "App",
  classes: "enyo-unselectable",
  components: [

    { name: "snapscroller", kind: "SnapScroller", classes: "scroller",

      horizontal: "scroll", vertical: "hidden", // only scroll horizontal
      onSnap: "scrollerSnapHandler",
      onSnapFinish: "scrollerSnapFinishHandler",
      // css required to stack items horizontally for scroll
      components: [
        { name: "slide-a", classes: "scroller-slide", content: "Slide A" },
        { name: "slide-b", classes: "scroller-slide", content: "Slide B" },
        { name: "slide-c", classes: "scroller-slide", content: "Slide C" }
      ]
    },

    { kind: "Button", content: "prev", slide: "prev", ontap: "buttonTapHandler" },
    { kind: "Button", content: "A", slide: "0", ontap: "buttonTapHandler" },
    { kind: "Button", content: "B", slide: "1", ontap: "buttonTapHandler" },
    { kind: "Button", content: "C", slide: "2", ontap: "buttonTapHandler" },
    { kind: "Button", content: "next", slide: "next", ontap: "buttonTapHandler" },
    { name: "state" }

  ],

  buttonTapHandler: function(inSender, inEvent) {
    if (inSender.slide == "prev") {
      this.$.snapscroller.prev();
    } else if (inSender.slide == "next") {
      this.$.snapscroller.next();
    } else {
      this.$.snapscroller.snapTo(inSender.slide);
      // this would do the same, but without animation
      // this.$.snapscroller.setIndex(inSender.slide);
    }
  },

  scrollerSnapFinishHandler: function(inSender, inEvent) {
    this.log(this.$.snapscroller.getIndex());
    this.$.state.setContent(this.$.snapscroller.getIndex());
  },

  scrollerSnapHandler: function(inSender, inEvent) {
    this.log(this.$.snapscroller.getIndex());
    this.$.state.setContent(this.$.snapscroller.getIndex());
  }

});