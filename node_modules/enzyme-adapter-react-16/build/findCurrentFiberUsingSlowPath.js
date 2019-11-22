'use strict';

// Extracted from https://github.com/facebook/react/blob/7bdf93b17a35a5d8fcf0ceae0bf48ed5e6b16688/src/renderers/shared/fiber/ReactFiberTreeReflection.js#L104-L228
function findCurrentFiberUsingSlowPath(fiber) {
  var alternate = fiber.alternate;

  if (!alternate) {
    return fiber;
  }
  // If we have two possible branches, we'll walk backwards up to the root
  // to see what path the root points to. On the way we may hit one of the
  // special cases and we'll deal with them.
  var a = fiber;
  var b = alternate;
  while (true) {
    // eslint-disable-line
    var parentA = a['return'];
    var parentB = parentA ? parentA.alternate : null;
    if (!parentA || !parentB) {
      // We're at the root.
      break;
    }

    // If both copies of the parent fiber point to the same child, we can
    // assume that the child is current. This happens when we bailout on low
    // priority: the bailed out fiber's child reuses the current child.
    if (parentA.child === parentB.child) {
      var child = parentA.child;

      while (child) {
        if (child === a) {
          // We've determined that A is the current branch.
          return fiber;
        }
        if (child === b) {
          // We've determined that B is the current branch.
          return alternate;
        }
        child = child.sibling;
      }
      // We should never have an alternate for any mounting node. So the only
      // way this could possibly happen is if this was unmounted, if at all.
      throw new Error('Unable to find node on an unmounted component.');
    }

    if (a['return'] !== b['return']) {
      // The return pointer of A and the return pointer of B point to different
      // fibers. We assume that return pointers never criss-cross, so A must
      // belong to the child set of A.return, and B must belong to the child
      // set of B.return.
      a = parentA;
      b = parentB;
    } else {
      // The return pointers point to the same fiber. We'll have to use the
      // default, slow path: scan the child sets of each parent alternate to see
      // which child belongs to which set.
      //
      // Search parent A's child set
      var didFindChild = false;
      var _child = parentA.child;

      while (_child) {
        if (_child === a) {
          didFindChild = true;
          a = parentA;
          b = parentB;
          break;
        }
        if (_child === b) {
          didFindChild = true;
          b = parentA;
          a = parentB;
          break;
        }
        _child = _child.sibling;
      }
      if (!didFindChild) {
        _child = parentB.child;
        // Search parent B's child set

        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentB;
            b = parentA;
            break;
          }
          if (_child === b) {
            didFindChild = true;
            b = parentB;
            a = parentA;
            break;
          }
          _child = _child.sibling;
        }
        if (!didFindChild) {
          throw new Error('Child was not found in either parent set. This indicates a bug ' + 'in React related to the return pointer. Please file an issue.');
        }
      }
    }
  }
  if (a.stateNode.current === a) {
    // We've determined that A is the current branch.
    return fiber;
  }
  // Otherwise B has to be current branch.
  return alternate;
}

module.exports = findCurrentFiberUsingSlowPath;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9maW5kQ3VycmVudEZpYmVyVXNpbmdTbG93UGF0aC5qcyJdLCJuYW1lcyI6WyJmaW5kQ3VycmVudEZpYmVyVXNpbmdTbG93UGF0aCIsImZpYmVyIiwiYWx0ZXJuYXRlIiwiYSIsImIiLCJwYXJlbnRBIiwicGFyZW50QiIsImNoaWxkIiwic2libGluZyIsIkVycm9yIiwiZGlkRmluZENoaWxkIiwic3RhdGVOb2RlIiwiY3VycmVudCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQSxTQUFTQSw2QkFBVCxDQUF1Q0MsS0FBdkMsRUFBOEM7QUFBQSxNQUNwQ0MsU0FEb0MsR0FDdEJELEtBRHNCLENBQ3BDQyxTQURvQzs7QUFFNUMsTUFBSSxDQUFDQSxTQUFMLEVBQWdCO0FBQ2QsV0FBT0QsS0FBUDtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsTUFBSUUsSUFBSUYsS0FBUjtBQUNBLE1BQUlHLElBQUlGLFNBQVI7QUFDQSxTQUFPLElBQVAsRUFBYTtBQUFFO0FBQ2IsUUFBTUcsVUFBVUYsV0FBaEI7QUFDQSxRQUFNRyxVQUFVRCxVQUFVQSxRQUFRSCxTQUFsQixHQUE4QixJQUE5QztBQUNBLFFBQUksQ0FBQ0csT0FBRCxJQUFZLENBQUNDLE9BQWpCLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDRDs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFJRCxRQUFRRSxLQUFSLEtBQWtCRCxRQUFRQyxLQUE5QixFQUFxQztBQUFBLFVBQzdCQSxLQUQ2QixHQUNuQkYsT0FEbUIsQ0FDN0JFLEtBRDZCOztBQUVuQyxhQUFPQSxLQUFQLEVBQWM7QUFDWixZQUFJQSxVQUFVSixDQUFkLEVBQWlCO0FBQ2Y7QUFDQSxpQkFBT0YsS0FBUDtBQUNEO0FBQ0QsWUFBSU0sVUFBVUgsQ0FBZCxFQUFpQjtBQUNmO0FBQ0EsaUJBQU9GLFNBQVA7QUFDRDtBQUNESyxnQkFBUUEsTUFBTUMsT0FBZDtBQUNEO0FBQ0Q7QUFDQTtBQUNBLFlBQU0sSUFBSUMsS0FBSixDQUFVLGdEQUFWLENBQU47QUFDRDs7QUFFRCxRQUFJTixnQkFBYUMsV0FBakIsRUFBMkI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQUQsVUFBSUUsT0FBSjtBQUNBRCxVQUFJRSxPQUFKO0FBQ0QsS0FQRCxNQU9PO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUlJLGVBQWUsS0FBbkI7QUFOSyxVQU9DSCxNQVBELEdBT1dGLE9BUFgsQ0FPQ0UsS0FQRDs7QUFRTCxhQUFPQSxNQUFQLEVBQWM7QUFDWixZQUFJQSxXQUFVSixDQUFkLEVBQWlCO0FBQ2ZPLHlCQUFlLElBQWY7QUFDQVAsY0FBSUUsT0FBSjtBQUNBRCxjQUFJRSxPQUFKO0FBQ0E7QUFDRDtBQUNELFlBQUlDLFdBQVVILENBQWQsRUFBaUI7QUFDZk0seUJBQWUsSUFBZjtBQUNBTixjQUFJQyxPQUFKO0FBQ0FGLGNBQUlHLE9BQUo7QUFDQTtBQUNEO0FBQ0RDLGlCQUFRQSxPQUFNQyxPQUFkO0FBQ0Q7QUFDRCxVQUFJLENBQUNFLFlBQUwsRUFBbUI7QUFFZEgsY0FGYyxHQUVKRCxPQUZJLENBRWRDLEtBRmM7QUFDakI7O0FBRUEsZUFBT0EsTUFBUCxFQUFjO0FBQ1osY0FBSUEsV0FBVUosQ0FBZCxFQUFpQjtBQUNmTywyQkFBZSxJQUFmO0FBQ0FQLGdCQUFJRyxPQUFKO0FBQ0FGLGdCQUFJQyxPQUFKO0FBQ0E7QUFDRDtBQUNELGNBQUlFLFdBQVVILENBQWQsRUFBaUI7QUFDZk0sMkJBQWUsSUFBZjtBQUNBTixnQkFBSUUsT0FBSjtBQUNBSCxnQkFBSUUsT0FBSjtBQUNBO0FBQ0Q7QUFDREUsbUJBQVFBLE9BQU1DLE9BQWQ7QUFDRDtBQUNELFlBQUksQ0FBQ0UsWUFBTCxFQUFtQjtBQUNqQixnQkFBTSxJQUFJRCxLQUFKLENBQVUsb0VBQ1osK0RBREUsQ0FBTjtBQUVEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsTUFBSU4sRUFBRVEsU0FBRixDQUFZQyxPQUFaLEtBQXdCVCxDQUE1QixFQUErQjtBQUM3QjtBQUNBLFdBQU9GLEtBQVA7QUFDRDtBQUNEO0FBQ0EsU0FBT0MsU0FBUDtBQUNEOztBQUVEVyxPQUFPQyxPQUFQLEdBQWlCZCw2QkFBakIiLCJmaWxlIjoiZmluZEN1cnJlbnRGaWJlclVzaW5nU2xvd1BhdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFeHRyYWN0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvYmxvYi83YmRmOTNiMTdhMzVhNWQ4ZmNmMGNlYWUwYmY0OGVkNWU2YjE2Njg4L3NyYy9yZW5kZXJlcnMvc2hhcmVkL2ZpYmVyL1JlYWN0RmliZXJUcmVlUmVmbGVjdGlvbi5qcyNMMTA0LUwyMjhcbmZ1bmN0aW9uIGZpbmRDdXJyZW50RmliZXJVc2luZ1Nsb3dQYXRoKGZpYmVyKSB7XG4gIGNvbnN0IHsgYWx0ZXJuYXRlIH0gPSBmaWJlcjtcbiAgaWYgKCFhbHRlcm5hdGUpIHtcbiAgICByZXR1cm4gZmliZXI7XG4gIH1cbiAgLy8gSWYgd2UgaGF2ZSB0d28gcG9zc2libGUgYnJhbmNoZXMsIHdlJ2xsIHdhbGsgYmFja3dhcmRzIHVwIHRvIHRoZSByb290XG4gIC8vIHRvIHNlZSB3aGF0IHBhdGggdGhlIHJvb3QgcG9pbnRzIHRvLiBPbiB0aGUgd2F5IHdlIG1heSBoaXQgb25lIG9mIHRoZVxuICAvLyBzcGVjaWFsIGNhc2VzIGFuZCB3ZSdsbCBkZWFsIHdpdGggdGhlbS5cbiAgbGV0IGEgPSBmaWJlcjtcbiAgbGV0IGIgPSBhbHRlcm5hdGU7XG4gIHdoaWxlICh0cnVlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBjb25zdCBwYXJlbnRBID0gYS5yZXR1cm47XG4gICAgY29uc3QgcGFyZW50QiA9IHBhcmVudEEgPyBwYXJlbnRBLmFsdGVybmF0ZSA6IG51bGw7XG4gICAgaWYgKCFwYXJlbnRBIHx8ICFwYXJlbnRCKSB7XG4gICAgICAvLyBXZSdyZSBhdCB0aGUgcm9vdC5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIElmIGJvdGggY29waWVzIG9mIHRoZSBwYXJlbnQgZmliZXIgcG9pbnQgdG8gdGhlIHNhbWUgY2hpbGQsIHdlIGNhblxuICAgIC8vIGFzc3VtZSB0aGF0IHRoZSBjaGlsZCBpcyBjdXJyZW50LiBUaGlzIGhhcHBlbnMgd2hlbiB3ZSBiYWlsb3V0IG9uIGxvd1xuICAgIC8vIHByaW9yaXR5OiB0aGUgYmFpbGVkIG91dCBmaWJlcidzIGNoaWxkIHJldXNlcyB0aGUgY3VycmVudCBjaGlsZC5cbiAgICBpZiAocGFyZW50QS5jaGlsZCA9PT0gcGFyZW50Qi5jaGlsZCkge1xuICAgICAgbGV0IHsgY2hpbGQgfSA9IHBhcmVudEE7XG4gICAgICB3aGlsZSAoY2hpbGQpIHtcbiAgICAgICAgaWYgKGNoaWxkID09PSBhKSB7XG4gICAgICAgICAgLy8gV2UndmUgZGV0ZXJtaW5lZCB0aGF0IEEgaXMgdGhlIGN1cnJlbnQgYnJhbmNoLlxuICAgICAgICAgIHJldHVybiBmaWJlcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hpbGQgPT09IGIpIHtcbiAgICAgICAgICAvLyBXZSd2ZSBkZXRlcm1pbmVkIHRoYXQgQiBpcyB0aGUgY3VycmVudCBicmFuY2guXG4gICAgICAgICAgcmV0dXJuIGFsdGVybmF0ZTtcbiAgICAgICAgfVxuICAgICAgICBjaGlsZCA9IGNoaWxkLnNpYmxpbmc7XG4gICAgICB9XG4gICAgICAvLyBXZSBzaG91bGQgbmV2ZXIgaGF2ZSBhbiBhbHRlcm5hdGUgZm9yIGFueSBtb3VudGluZyBub2RlLiBTbyB0aGUgb25seVxuICAgICAgLy8gd2F5IHRoaXMgY291bGQgcG9zc2libHkgaGFwcGVuIGlzIGlmIHRoaXMgd2FzIHVubW91bnRlZCwgaWYgYXQgYWxsLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBub2RlIG9uIGFuIHVubW91bnRlZCBjb21wb25lbnQuJyk7XG4gICAgfVxuXG4gICAgaWYgKGEucmV0dXJuICE9PSBiLnJldHVybikge1xuICAgICAgLy8gVGhlIHJldHVybiBwb2ludGVyIG9mIEEgYW5kIHRoZSByZXR1cm4gcG9pbnRlciBvZiBCIHBvaW50IHRvIGRpZmZlcmVudFxuICAgICAgLy8gZmliZXJzLiBXZSBhc3N1bWUgdGhhdCByZXR1cm4gcG9pbnRlcnMgbmV2ZXIgY3Jpc3MtY3Jvc3MsIHNvIEEgbXVzdFxuICAgICAgLy8gYmVsb25nIHRvIHRoZSBjaGlsZCBzZXQgb2YgQS5yZXR1cm4sIGFuZCBCIG11c3QgYmVsb25nIHRvIHRoZSBjaGlsZFxuICAgICAgLy8gc2V0IG9mIEIucmV0dXJuLlxuICAgICAgYSA9IHBhcmVudEE7XG4gICAgICBiID0gcGFyZW50QjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHJldHVybiBwb2ludGVycyBwb2ludCB0byB0aGUgc2FtZSBmaWJlci4gV2UnbGwgaGF2ZSB0byB1c2UgdGhlXG4gICAgICAvLyBkZWZhdWx0LCBzbG93IHBhdGg6IHNjYW4gdGhlIGNoaWxkIHNldHMgb2YgZWFjaCBwYXJlbnQgYWx0ZXJuYXRlIHRvIHNlZVxuICAgICAgLy8gd2hpY2ggY2hpbGQgYmVsb25ncyB0byB3aGljaCBzZXQuXG4gICAgICAvL1xuICAgICAgLy8gU2VhcmNoIHBhcmVudCBBJ3MgY2hpbGQgc2V0XG4gICAgICBsZXQgZGlkRmluZENoaWxkID0gZmFsc2U7XG4gICAgICBsZXQgeyBjaGlsZCB9ID0gcGFyZW50QTtcbiAgICAgIHdoaWxlIChjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQgPT09IGEpIHtcbiAgICAgICAgICBkaWRGaW5kQ2hpbGQgPSB0cnVlO1xuICAgICAgICAgIGEgPSBwYXJlbnRBO1xuICAgICAgICAgIGIgPSBwYXJlbnRCO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaGlsZCA9PT0gYikge1xuICAgICAgICAgIGRpZEZpbmRDaGlsZCA9IHRydWU7XG4gICAgICAgICAgYiA9IHBhcmVudEE7XG4gICAgICAgICAgYSA9IHBhcmVudEI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2hpbGQgPSBjaGlsZC5zaWJsaW5nO1xuICAgICAgfVxuICAgICAgaWYgKCFkaWRGaW5kQ2hpbGQpIHtcbiAgICAgICAgLy8gU2VhcmNoIHBhcmVudCBCJ3MgY2hpbGQgc2V0XG4gICAgICAgICh7IGNoaWxkIH0gPSBwYXJlbnRCKTtcbiAgICAgICAgd2hpbGUgKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkID09PSBhKSB7XG4gICAgICAgICAgICBkaWRGaW5kQ2hpbGQgPSB0cnVlO1xuICAgICAgICAgICAgYSA9IHBhcmVudEI7XG4gICAgICAgICAgICBiID0gcGFyZW50QTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQgPT09IGIpIHtcbiAgICAgICAgICAgIGRpZEZpbmRDaGlsZCA9IHRydWU7XG4gICAgICAgICAgICBiID0gcGFyZW50QjtcbiAgICAgICAgICAgIGEgPSBwYXJlbnRBO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNoaWxkID0gY2hpbGQuc2libGluZztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRpZEZpbmRDaGlsZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2hpbGQgd2FzIG5vdCBmb3VuZCBpbiBlaXRoZXIgcGFyZW50IHNldC4gVGhpcyBpbmRpY2F0ZXMgYSBidWcgJ1xuICAgICAgICAgICAgKyAnaW4gUmVhY3QgcmVsYXRlZCB0byB0aGUgcmV0dXJuIHBvaW50ZXIuIFBsZWFzZSBmaWxlIGFuIGlzc3VlLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmIChhLnN0YXRlTm9kZS5jdXJyZW50ID09PSBhKSB7XG4gICAgLy8gV2UndmUgZGV0ZXJtaW5lZCB0aGF0IEEgaXMgdGhlIGN1cnJlbnQgYnJhbmNoLlxuICAgIHJldHVybiBmaWJlcjtcbiAgfVxuICAvLyBPdGhlcndpc2UgQiBoYXMgdG8gYmUgY3VycmVudCBicmFuY2guXG4gIHJldHVybiBhbHRlcm5hdGU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEN1cnJlbnRGaWJlclVzaW5nU2xvd1BhdGg7XG4iXX0=
//# sourceMappingURL=findCurrentFiberUsingSlowPath.js.map