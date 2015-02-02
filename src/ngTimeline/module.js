'use strict';

angular.module('ngTimeline', [])

  .value('ngTimelineNoopDriver'     , { step : angular.noop })
  .value('noopTimeline'             , { add : angular.noop })

  .factory('$timeline'              , $TimelineRegistry)
  .factory('$timelinePlayhead'      , $TimelinePlayhead)

  .controller('ngTimelineController', TimelineController)
  .directive('ngTimeline'           , TimelineDirective)
  .directive('ngTimelineStep'       , TimelineStepDirective)



