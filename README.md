SnapScroller
============

SnapScroller - an Enyo 2.0 kind to Snap to scrolling positions

A simple scroller that 'snaps' to the position of its controls.  You can manually snapTo a specific control index to provide external control of the scroll position for a carousel-like effect.  If you correctly size your components you can also define a 'peek' value to show a portion of the previous and next elements rather than snapping all the way to the item position - allowing a clip of the next/prev items if creating a carousel-like component.
Specify the "horizontal" and "vertical" properties of a normal Scroller to define if it should snap vertically or horizontally.

This component does not handle all the cases of the Enyo 1.0 SnapScroller control.  It is intended for one main item in view at a time - may require additional work to correctly handle some other cases - comments and pull requests welcome!

See a variety of examples in "samples" directory.


NOTES:

- on Android 4.1+ sometimes there is 'wobble' when snapping into position
- overscroll on first/last can get sometimes 'stuck'
- you can sometimes get stuck 'between' controls


website sample : http://www.ryanwatkins.net/software/snapscroller

Tested platforms include: Android 2+, Chrome 17+, Safari 5.1+, Firefox 10+


Copyright © 2012-2013 Ryan Watkins <ryan@ryanwatkins.net>

Permission to use, copy, modify, distribute, and sell this software and its documentation for any purpose is hereby granted without fee, provided that the above copyright notice appear in all copies and that both that copyright notice and this permission notice appear in supporting documentation. No representations are made about the suitability of this software for any purpose. It is provided "as is" without express or implied warranty.
