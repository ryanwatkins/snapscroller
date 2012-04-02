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

  //  preventDragPropagation: true, // ?
  strategyKind: "TouchScrollStrategy",  // - Native on iOS5+ / Android 3+, but lacks scrollStart / scrollStop ??

  published: {
    /**
    Sets the index directly w/o animation or get the current state
    */
    index: ""
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

//  handlers: {
//    onscroll: "scroll"
//  },

  position: {
    start: null,
    current: null,
    previous: null,
    to: null
  },

  create: function() {
    this.inherited(arguments);

    // make this go faster
    this.$.strategy.$.scrollMath.kFrictionDamping = 0.85;

    if ((this.horizontal == 'scroll') ||
        (this.horizontal == 'auto') ||
        (this.horizontal == 'default') ) {
      this.scrollHorizontal = true;
    } else {
      this.scrollHorizontal = false;
    }
  },

  indexChanged: function() {
		var position = this.calculatePosition(this.index);
		if (position !== undefined) {
			this.directScrollTo(position);
		}
  },

  doScrollStart: function(inScrollerStrategy, inScrollMath) { // ?
//    this.log(arguments);
    this.position.start = this.getCurrentPosition();
  },
  doScroll: function(inScrollerStrategy, inScrollMath) { // ??
//    this.log(arguments);
    this.position.current = this.getCurrentPosition();
    if (this.$.strategy.dragging) {
      this.cansnap = true;
    } else if (!this.snapping && this.cansnap) {
      this.cansnap = false;
      this.snap();
    } else {
      // ...
    }
    this.position.previous = this.position.current;
  },
  doScrollStop: function(inScrollerStrategy, inScrollMath) {  // ?
//    this.log(arguments);
    if (this.snapping) {
      this.snapping = false;
      // TODO: force scroll to exact px.
      var position = this.getCurrentPosition();
      if (position != this.position.to) {
        this.log("delta: " + Math.abs(position - this.position.to));
        this.directScrollTo(this.position.to);
      }
      this.doSnapFinish();
    }
  },

  // scroll to a position for snapping animation
  snapScrollTo: function(inPosition) {
    this.log(inPosition);
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
    this.log(position);
    if (position !== undefined) {
      this.snapTo(position);
    }
  },

  // get the current scroll position
  getCurrentPosition: function() {
    var position = this.scrollHorizontal ? this.getScrollLeft() : this.getScrollTop();
    // this.log(position);
    return position;
  },

  // calculate scroll position for a control index
  calculatePosition: function(inIndex) {
    var controls = this.getControls().slice(1);  // because the ScrollStrategy appears to be the first one ...
    var control = controls[inIndex];
//    this.log(control);
    if (control && control.hasNode()) {
      var node = control.hasNode();
      var position = this.scrollHorizontal ?  node.offsetLeft : node.offsetTop;
    }
//    this.log(position);
    return position;
  },

  calculateSnapIndex: function() {
    this.log();
    var forward = ((this.position.current - this.position.previous) > 0);
    // TODO: calculate position to snap to
    var controls = this.getControls().slice(1);

    for (var l=0; l<controls.length; l++) {
      var node = controls[l].hasNode();
      var edge = this.scrollHorizontal ? node.offsetLeft : node.offsetTop;

      this.log(this.position.current, edge, l);
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
    this.log(inIndex);
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
    // if we dont have scrollStop() yet this does not run
		!this.snapping && this.snapTo(this.index-1);
  },

  next: function() {
    // if we dont have scrollStop() yet this does not run
		!this.snapping && this.snapTo(this.index+1);
  }

});