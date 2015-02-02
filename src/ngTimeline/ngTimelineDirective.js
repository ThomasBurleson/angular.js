'use strict';

var TimelineDirective = ['$timeline', 'noopTimeline','$log', TimelineDirective ];


function TimelineDirective( $timeline, noopTimeline, $log ) {

  return {
    require   : 'ngTimeline',
    controller: 'ngTimelineController',
    link      : linkTimeline
  };

  function linkTimeline (scope, element, attrs, ctrl) {

    var parent  = element.parent().controller('ngTimeline');
    var isRoot  = !parent;

    parent = parent || noopTimeline;
    parent.add({ start : ctrl.start });

    if ( ctrl.id() ) {
      $timeline.register( ctrl.id(), ctrl );
    }

    if ( isRoot )  {
      $log.debug("Timeline::add( " + ctrl.id() + " )");
      $timeline.register( "$root",   parent );
    }

  }

}
