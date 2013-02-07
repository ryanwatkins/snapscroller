/* VerticalSnapScrollerSample.js */

enyo.kind({
  name: "VerticalSnapScrollerSample",
  classes: "enyo-unselectable",
  components: [

    { name: "snapscroller", kind: "rwatkins.SnapScroller", classes: "scroller",
      horizontal: "hidden", vertical: "scroll", // only scroll vertical
      onSnap: "scrollerSnapHandler",
      onSnapFinish: "scrollerSnapFinishHandler",
      components: [
        { name: "slide-a", classes: "scroller-slide slide-a", content: "Slide A - Top" },
        { name: "slide-b", classes: "scroller-slide slide-b", content: "Slide B" },
        { name: "slide-c", classes: "scroller-slide slide-c", content: "Slide C" },
        { name: "slide-d", classes: "scroller-slide slide-d", content: "Slide D" },
        { name: "slide-e", classes: "scroller-slide slide-e", content: "Slide E - Bottom" }
      ]
    },

    { kind: "Button", content: "prev", slide: "prev", ontap: "buttonTapHandler" },
    { kind: "Button", content: "A", slide: "0", ontap: "buttonTapHandler" },
    { kind: "Button", content: "B", slide: "1", ontap: "buttonTapHandler" },
    { kind: "Button", content: "C", slide: "2", ontap: "buttonTapHandler" },
    { kind: "Button", content: "D", slide: "3", ontap: "buttonTapHandler" },
    { kind: "Button", content: "E", slide: "4", ontap: "buttonTapHandler" },
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
    }
  },

  scrollerSnapFinishHandler: function(inSender, inEvent) {
    this.log(this.$.snapscroller.getIndex());
    this.$.state.setContent("position: " + this.$.snapscroller.getIndex());
  },

  scrollerSnapHandler: function(inSender, inEvent) {
    this.log(this.$.snapscroller.getIndex());
    this.$.state.setContent("position: " + this.$.snapscroller.getIndex());
  }

});