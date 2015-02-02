'use strict';

var $NgStepDirective = ['$log', TimelineStepDirective];


function TimelineStepDirective($log) {
  var _count = 0;

  return {
    require   : ['^ngTimeline', 'ngTimelineStep'],
    controller: 'ngTimelineController',
    link      : linkStep
  };

  function linkStep(scope, element, attrs, ctrls) {
    var parent = ctrls[0];
    var stepController = ctrls[1];

    // Inject name into step...
    element.attr("name", "step_" + (++_count));
    stepController.start = buildTimelineStep;

    parent.add( stepController );

    /**
     * Build a tree leaf node of all timeline properties
     * NOTE: use lazy determination of all changes & the target element(s)
     */
    function buildTimelineStep(rootElement) {
      $log.debug("Timeline::buildLeaf( " + stepController.id() + " )");

      var results = [ ];
      var selector = stepController.target();
      var targets = selector ? rootElement[0].querySelectorAll(selector) : [ ];

      angular.forEach(targets, function(target){
        // Return 0..n items for each real target;
        // include attributes to animate or change on each target.

        results.push({
          position : stepController.position(),
          duration : stepController.duration(),
          element  : angular.isString(target) ? target : angular.element(target),
          options  : clonedAttrs()
        });
      });

      return results;
    }

    /**
     * Utility function to clone snapshot of current attribute values
     */
    function clonedAttrs() {
      var copy = {};
      angular.forEach(attrs, function(value, key) {
        if (key.charAt(0) != '$') {
          copy[key] = value;
        }
      });
      return copy;
    }

  }
}
