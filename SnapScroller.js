/* SnapScroller.js
 *
 * Copyright © 2012 Ryan Watkins <ryan@ryanwatkins.net>
 *
 * Permission to use, copy, modify, distribute, and sell this software
 * and its documentation for any purpose is hereby granted without
 * fee, provided that the above copyright notice appear in all copies
 * and that both that copyright notice and this permission notice
 * appear in supporting documentation. No representations are made
 * about the suitability of this software for any purpose. It is
 * provided "as is" without express or implied warranty.
 */

/**
 A Scroller control that 'snaps' to specific scroll positions

 */
enyo.kind({
  name: "SnapScroller",
  kind: "Scroller",

  //  preventDragPropagation: true,
  strategyKind: "TouchScrollStrategy",  // when work calms, look at more performant strategy options

  published: {
    /**
    Sets the index directly w/o animation or get the current state
    */
    index: 0,
    /**
    Num of px to reveal of the previous item in the list
    */
    peek: ""
  },

  events: {
    /**
    Event that fires when the user stops dragging and the scroller begins to snap to a position
    */
    onSnap: "",
    /**
    Event that fires when snapping to a position completes
    */
    onSnapFinish: ""
  },

  create: function() {

    // cache position values
    this.position = {
      start: null,
      current: null,
      previous: null,
      to: null
    };

    this.inherited(arguments);

    // make this go faster
    this.$.strategy.$.scrollMath.kFrictionDamping = 0.85;

    // TODO: detect if these get changed post-create
    if ((this.horizontal == 'scroll') ||
        (this.horizontal == 'auto') ||
        (this.horizontal == 'default') ) {
      this.scrollHorizontal = true;
    } else {
      this.scrollHorizontal = false;
    }
  },

  rendered: function() {
    this.inherited(arguments);
    this.peekChanged();
  },

  peekChanged: function() {
    var peek = this.getPeek();

    // TODO: a bit of a hack, as this would clobber existing styles
    var scroller = this.$.strategy.$.client;
    if (peek && scroller) {
      if (this.scrollHorizontal) {
        scroller.applyStyle("padding-left", ("" + peek + "px"));
        scroller.applyStyle("padding-right", ("" + peek + "px"));
      } else {
        scroller.applyStyle("padding-top", ("" + peek + "px"));
        scroller.applyStyle("padding-left", ("" + peek + "px"));
      }
    }
  },

  indexChanged: function() {
    var position = this.calculatePosition(this.index);
    if (position !== undefined) {
      this.directScrollTo(position);
    }
  },

  doScrollStart: function(inScrollerStrategy, inScrollMath) { // ?
    this.position.start = this.getCurrentPosition();
    this.position.previous = this.position.start;
  },

  doScroll: function(inScrollerStrategy, inScrollMath) { // ??
    this.position.current = this.getCurrentPosition();

    if (this.$.strategy.dragging) {
      this.cansnap = true;
    } else if (!this.snapping && this.cansnap) {
      this.cansnap = false;
      this.snap();
    } else {
      // ...
    }
  },

  doScrollStop: function(inScrollerStrategy, inScrollMath) {  // ?
    if (this.snapping) {
      var position = this.getCurrentPosition();
      this.snapping = false;
      // TODO: force scroll to exact px.

      if (position != this.position.to) {
        // this.log("delta: " + Math.abs(position - this.position.to));
        this.directScrollTo(this.position.to);
      }
      this.doSnapFinish();
    }
  },

  // scroll to a position for snapping animation
  snapScrollTo: function(inPosition) {
    this.snapping = true;
    this.position.to = inPosition;

    this.scrollHorizontal ? this.scrollTo(inPosition, 0) : this.scrollTo(0, inPosition);
  },

  // move the scroller directly to a position - used to cleanup end of scroll
  directScrollTo: function(inPosition) {
    if (this.scrollHorizontal) {
      this.setScrollLeft(inPosition);
    } else {
      this.setScrollTop(inPosition);
    }
  },

  snap: function() {
    var position = this.calculateSnapIndex();
    if (position !== undefined) {
      this.snapTo(position);
    }
  },

  // get the current scroll position
  getCurrentPosition: function() {
    var position = this.scrollHorizontal ? this.getScrollLeft() : this.getScrollTop();
    return position;
  },

  // calculate scroll position for a control index
  calculatePosition: function(inIndex) {
    var controls = this.getControls().slice(1);  // because the ScrollStrategy appears to be the first one ...
    var control = controls[inIndex];
    if (control && control.hasNode()) {
      var node = control.hasNode();
      var position = this.scrollHorizontal ?  node.offsetLeft : node.offsetTop;
      if (this.peek) { // account for peek
        position = position - this.peek;
      }
    }
    return position;
  },

  calculateSnapIndex: function() {
    var forward = ((this.position.current - this.position.previous) > 0);
    // calculate position to snap to
    var controls = this.getControls().slice(1);

    for (var l=0; l<controls.length; l++) {
      var node = controls[l].hasNode();
      var edge = this.scrollHorizontal ? node.offsetLeft : node.offsetTop;

      if (this.position.current < edge) {
        if (forward) {
          return l;
        } else {
          return (l-1);
        }
      }
    }
  },

  //* @public
  /**
  Scrolls to the position of the control at inIndex.
  */
  snapTo: function(inIndex) {
    this.prevIndex = this.index;

    var position = this.calculatePosition(inIndex);

    if (position !== undefined) {
      this.doSnap();
      this.index = parseInt(inIndex);
      if (this.index != this.oldIndex) {
        this.snapScrollTo(position);
      }
    }
  },

  prev: function() {
    !this.snapping && this.snapTo(this.index-1);
  },

  next: function() {
    !this.snapping && this.snapTo(this.index+1);
  }

});