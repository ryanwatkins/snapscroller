/* NestedSnapScrollerSample.js */

enyo.kind({
  name: "NestedSnapScrollerSample",
  classes: "enyo-unselectable",
  components: [

    { name: "vsnapscroller", kind: "rwatkins.SnapScroller", classes: "vscroller",
      horizontal: "hidden", vertical: "scroll", // only scroll vertical
      components: [

        { name: "hsnapscroller", kind: "rwatkins.SnapScroller", classes: "hscroller",
          horizontal: "scroll", vertical: "hidden", // only scroll horizontal
          onSnap: "hscrollerSnapHandler",
          onSnapFinish: "hscrollerSnapFinishHandler",
          components: [
            { name: "slide-a", classes: "scroller-slide slide-a", content: "Slide A" },
            { name: "slide-b", classes: "scroller-slide slide-b", content: "Slide B" },
            { name: "slide-c", classes: "scroller-slide slide-c", content: "Slide C" },
            { name: "slide-d", classes: "scroller-slide slide-d", content: "Slide D" },
            { name: "slide-e", classes: "scroller-slide slide-e", content: "Slide E" }
          ]
        },

        { name: "slide-2", classes: "scroller-slide", content: "Slide 2" }
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
      this.$.hsnapscroller.prev();
    } else if (inSender.slide == "next") {
      this.$.hsnapscroller.next();
    } else {
      this.$.hsnapscroller.snapTo(inSender.slide);
      // this would do the same, but without animation
      // this.$.snapscroller.setIndex(inSender.slide);
    }
  },

  hscrollerSnapFinishHandler: function(inSender, inEvent) {
    this.log(this.$.hsnapscroller.getIndex());
    this.$.state.setContent("position: " + this.$.hsnapscroller.getIndex());
  },

  hscrollerSnapHandler: function(inSender, inEvent) {
    this.log(this.$.hsnapscroller.getIndex());
    this.$.state.setContent("position: " + this.$.hsnapscroller.getIndex());
  }

});