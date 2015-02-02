'use strict';

var TimelineController = [
  '$attrs', '$scope', '$element', '$log',
  ngTimelineController
];

/**
 * Controller functionality for BOTH ngTimeline and ngTimelineStep directives.
 *
 * NOTE: These controller instances are also registered with the $timeline
 * registry service...
 */
function ngTimelineController ( $attrs, $scope, $element, $log ) {

  var self      = this;
  var children  = [ ];

  self.id       = findID;
  self.parent   = function() { return $element.parent().controller('ngTimelineController'); };
  self.position = function() { return $scope.$eval($attrs.position) || 0; };
  self.duration = function() { return $scope.$eval($attrs.duration);      };
  self.target   = findTarget;
  self.add      = addChild;
  self.start    = buildTimelineTree;

  /**
   * Find appropriate ID to determine match to class animation,
   * state animation, or other...
   */
   function findID() {
    return $element.attr('id') || $element.attr('name') || $attrs.matchClass;
   }

  /**
   * Scan for appropriate target identifier in current
   * controller or in upstream controller
   */
  function findTarget() {
    var target = $attrs.target || $attrs.selector;
    if ( !target ) {
      // Scan upfield for fallback target...
      target = self.parent() ? self.parent().target() : null;
    }
    return target;
  }

  /**
   * Add 1..n children elements to current parent
   */
  function addChild( ctrl ) {
    //$log.debug("Timeline::add( " + ctrl.id() + " )");

    if ( children.indexOf(ctrl) == -1 ) {
      children.push( ctrl );
    }
    return self;
  }

  /**
   * Build a tree of all animation properties
   *
   * NOTE: this is a build method for ngTimeline; ngTimelineStep
   * directives override this default behavior.
   */
  function buildTimelineTree(element) {
    $log.debug("Timeline::buildBranch( " + self.id() + " )");

    var node = {
      parent   : self.parent(),
      position : self.position(),
      duration : self.duration(),
      children : [ ]
    };

    node.children = children.map(function(it){
      return {
        parent   : node,  // for linked-list
        position : it.position(),
        duration : it.duration(),
        children : it.start(element)
      };
    });

    return node;
  }

}
