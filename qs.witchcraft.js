/**
 *  Witchcraft::QuickStarter for Developers
 * 
 *  @version 0.0.1
 *  @author  Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * 
 *  Copyright (c) 2011, Saneyuki Tadokoro
*/



/**
 *  Quick starter initialization
 * 
 *  @param   function Quick starter
*/
(function( Update ){
    try{
        Update.prototype = wic;
    } catch( e ){
        Update.prototype = {};
    }
    wic = new Update();
})



/**
 *  Quick starter prototype
*/
(function(){
    // Prepare for initializing this constructor.
    var self = this;
    
    
    /**
     *  Quick start
     * 
     *  This method loads initalization scripts at onload.
     * 
     *  Including 3 times retry function.
     * 
     *  @param  string url
     *  @param  function callback
    */
    self.quickStart = function( url, callback ){
        var listener = function(){
            self.sys.simpleRequire( url, callback );
        };
        
        if( window.attachEvent ){
            window.attachEvent( 'onload', listener );
        }
        else{
            window.addEventListener( 'load', listener, false );
        }
    };
    
    
    
    // Prepare for setting sys object
    if( typeof self.sys !== 'object' ) self.sys = {};
    
    
    
    /**
     *  Simply require JS file
     * 
     *  @param  string url
     *  @param  function callback
    */
    self.sys.simpleRequire = function( url, callback ){
        var elem = document.createElement( 'script' );
        elem.src = url;
        elem.type = 'text/javascript';
            
        if( callback ){
            elem.onload = function(){   // For successful listener
                callback( 'success' );
            };
            elem.onerror = function(){  // For error listener
                callback( 'error' );
            };
        }
            
        document.getElementsByTagName( 'head' ).item( 0 ).appendChild( elem );
    };
}); // Execute!