'use strict';

var $TimelineRegistry = [ '$rootElement', '$$qAnimate', "$log", TimelineRegistry ];


/**
 * Registration service from timelines
 */
function TimelineRegistry( $rootElement, $$qAnimate, $log ) {
  var self, cache = {};

  // Publish the Timeline Registry service
  return self = decorate( RegistryService, {

    /**
     * Register timeline node/construction information
     * Resolve pending promise if needed
     */
    register : function register(name, obj) {
      var current = cache[ name ];

      cache[ name ] = obj;
      if ( isDeferred(current) ) current.resolve(obj);
    },

    /**
     * Lookup timeline by name(s)
     */
    lookup : function lookup (names) {
      var results = [];

      names = angular.isArray(names) ? names : names.split(' ');
      angular.forEach(names, function(name) {
        if (cache[name]) {
          results.push(cache[name]);
        }
      });

      return (results.length == 1) ? results[0] : results;
    }
  });

  // **********************************
  // Internal Methods
  // **********************************


  /**
   * Easy, promise-based lookup of timeline (by ID)
   * This allows lookups to defer answer until timeline is registered
   */
  function RegistryService( element ) {
    var id = element;

    if ( !angular.isDefined(element) ) return null;
    if ( !angular.isString(element ) ) id = findElementID(element);

    return buildStartFor( self.lookup(id) );

    /**
     *
     */
    function buildStartFor( node ){
      return function start(element, driver, options) {

        if ( angular.isString(element) ) {
          $log.debug( "$timeline( '" + id + "' ).start( '" + element + "' )");
          element = $rootElement[0].querySelectorAll(element);
        }

        // Build a full timeline graph from specified target node...
        return !node ? false : updateLeaves( node.start(element), driver, options || { });
      }
    }

    /**
     * Updateleaves() will update each leaf node with a object returned
     * from the driver invocation
     *
     * @FiXME - refactor updateLeaves to be part of the driver functionality...
     */
    function updateLeaves( tree, driver, options )
    {
      tree.children = tree.children.map( function(it) {
        // prepare leaf node or descend branch
        return  !isLeaf(it) ? descendBranch(it) : prepareLeaf(it);
      });

      return tree;

      // ******************************
      // Internal methods
      // ******************************

      function isLeaf (it) {
        return !it.children && !!it.element;
      }

      function prepareLeaf( it ) {
        var unionOptions = angular.extend( it.options, { duration: it.duration, position:it.position }, options);
        return angular.extend( it, driver( it.element, unionOptions ));
      }

      function descendBranch(it) {
        return updateLeaves(it, driver, options);
      }

    }


    /**
     * If the element is a DOM node, attempt to find the registered
     * timeline by its classname.
     */
    function findElementID( element ) {
      return angular.element(element).attr("class").split(" ");
    }

  }

  /**
   * Async locator of timeline instance, yields if
   * not currently available.
   */
  function yieldToFind(id) {
    var deferred = $$qAnimate.defer();
        var found = self.lookup(id);

            found = found.length ? found[0] : null;

        if ( !found )               cached[id] = deferred;
        else if (isDeferred(found)) deferred = found;
        else                        deferred.resolve( found );

        return deferred.promise;
  }

  /**
   * Add special cache accessor functions
   */
  function decorate( fn, prototypes ) {
    for (var key in prototypes ) {
      fn[key] = prototypes[key];
    }
    return fn;
  }

  /**
   * Utility class to see if target is a Deferred
   */
  function isDeferred(target) {
    return target && angular.isDefined(target.resolve) && angular.isDefined(target.reject);
  }


}

