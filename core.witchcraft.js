/**
 *  Witchcraft::Core for Developers
 * 
 *  @version 0.0.2
 *  @author  Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * 
 *  Copyright (c) 2011, Saneyuki Tadokoro
*/



/**
 *  Update
 * 
 *  @param   function Update
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
 *  Core prototype
*/
(function(){
    // Prepare for initializing this constructor.
    var self = this;
    var verify = {};
    
    
    /**
     *  Encapsulation
     * 
     *  source object has
     *  {
     *      __init : function  < Initialize >
     *      __public : object  < Public field >
     *      __private : object  < Private field >
     *  }
     * 
     *  But you don't have to set these properties and methods.
     *  They're options.
     * 
     *  @param  object source
     *  @return object root.__public
    */
    self.encapsulation = function( source ){
        var root = {
            __public : source.__public,
            __private : source.__private
        };

        if( typeof source.__init === 'function' ){
            source.__init.apply( root, arguments );
        }

        return root.__public;
    };
    
    
    
    /**
     *  Monadize
     * 
     *  @param  function monad
     *  @return function monad
    */
    self.monadize = function( monad ){
        if( typeof monad !== 'function' )
            return false;
        
        monad.bind = function( method ){
            return method( monad() );
        };
        monad.push = function( method ){
            return monad.bind( monadize( function(){ return method } ) );
        };
        
        return monad;
    };
    
    
    
    // Prepare for setting sys object.
    if( typeof self.sys !== 'object' ){ self.sys = {} }
    verify.sys = {};
    
    
    
    /**
     *  Require JS file
     * 
     *  @param  string url
     *  @param  function callback
     *  @param  number retry
    */
    self.sys.require = function( url, callback, retry ){
        if( typeof url !== 'string' )
            return false;
            
        var elem = document.createElement( 'script' );
        elem.src = url;
        elem.type = 'text/javascript';
            
        if( !retry ) retry = 0;
            
        if( callback ){
            elem.onload = function(){   // For successful listener
                callback( 'success' );
            };
            elem.onerror = function(){  // For error listener
                if( retry > 0 ){
                    callback( 'retry' );
                    self.sys.require();
                }
                else {
                    callback( 'error' );
                }
            };
        }
            
        document.getElementsByTagName( 'head' ).item( 0 ).appendChild( elem );
    };
    
    
    
    /**
     *  Ajax
     * 
     *  option object has
     *  {
     *      methodType : 'GET' || 'POST'
     *      dataType : 'xml' || 'text'
     *      url : string
     *      data : string
     *      async : true || false
     *      callback : function
     *      done : function
     *      loading : function
     *      sent : function
     *      open : function
     *      unsent : function
     *      error : function
     *      username : string
     *      password : string
     *      headerLabel : string
     *      headerValue : string
     *  }
     * 
     *  @param  object option
     *  @return object XMLHttpRequest
    */
    self.sys.ajax = function( option ){
        var rv = verify.sys.ajax.apply( null, arguments );
        var xhr = self.sys.getXMLHttpRequest();
        
        if( !rv || !xhr )
            return false;
        
        var callback = function(){
            var response;
            
            if( rv.callback !== null )
                rv.callback( response, xhr.readyState, xhr.status );
            
            if( xhr.readyState == 4 && xhr.status == 200 && rv.done !== null ){
                // In text format
                if( rv.dataType == 'text' )
                    response = xhr.responseText;
                // In XML format
                else if( rv.dataType == 'xml' )
                    response = xhr.responseXml;
                // Selectable
                else 
                    response = xhr;
                // Callback
                rv.done( response, xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 4 && xhr.status != 200 && rv.error !== null ){
                rv.error( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 3 && xhr.status == 200 && rv.loading !== null ){
                rv.loading( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 2 && xhr.status == 200 && rv.sent !== null ){
                rv.sent( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 1 && rv.open !== null ){
                rv.open( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState === 0 && rv.unsent !== null ){
                rv.unsent( xhr.readyState, xhr.status );
            }
        };
        
        if( xhr.onload )
            xhr.onload = callback;
        else
            xhr.onreadystatechange = callback;
        
        if( rv.ready !== null )
            rv.ready();

        xhr.open( rv.methodType, rv.url, rv.async, rv.username, rv.password );
        
        if( rv.headerLabel && rv.headerValue )
            xhr.setRequestHeader( rv.headerLabel, rv.headerValue );
            
        xhr.send( rv.data );
        
        return xhr;
    };
    
    
    
    /**
     *  LOCAL AREA ONLY
     * 
     *  Verify self.sys.ajax method.
     * 
     *  @param  object option
     *  @return object || false  < If url isn't String, return false. >
    */
    verify.sys.ajax = function( option ){
        if( typeof option.url !== 'string' )
            return false;
            
        var o = option;
        // method Type
        o.methodType = typeof o.methodType === 'string' && o.methodType.match( /^GET|POST$/ ) !== null ? o.methodType : 'GET';
        // Data type
        o.dataType = typeof o.methodType === 'string' && o.methodType.match( /^xml|text$/ ) !== null ? o.dataType : 'text';
        // Data
        o.data = typeof o.data === 'string' ? o.url : null;
        // Async
        o.async = typeof o.async === 'boolean' ? o.async : true;
        // Callback
        o.callback = typeof o.callback === 'function' ? o.callback : null;
        // Username
        o.username = typeof o.username === 'string' ? o.username : undefined;
        // Password
        o.password = typeof o.password === 'string' ? o.password : undefined;
        // Header label
        o.headerLabel = typeof o.headerLabel === 'stirng' ? o.headerLabel : null;
        // Header value
        o.headerValue = typeof o.headerValue === 'string' ? o.headerValue : null;
        // Done
        o.done = typeof o.done === 'function' ? o.done : null;
        // Loading
        o.loading = typeof o.loading === 'function' ? o.loading : null;
        // Sent
        o.sent = typeof o.sent === 'function' ? o.sent : null;
        // Open
        o.open = typeof o.open === 'function' ? o.open : null;
        // Unsent
        o.unsent = typeof o.unsent === 'function' ? o.unsent : null;
        // Ready
        o.ready = typeof o.ready === 'function' ? o.ready : null;
        // Error
        o.error = typeof o.error === 'function' ? o.error : null;
        
        if( o.methodType === 'POST' ){
            if( o.headerLabel === null )
                o.headerLabel = 'Content-Type';
            if( o.headerValue === null )
                o.headerValue = 'application/x-www-form-urlencoded';
        }
        
        return o;
    };
    
    
    
    /**
     *  Pjax
     * 
     *  @description    Pjax method is now under constructor.
    */
    // self.sys.pjax = function(){};
    
    
    
    /**
     *  Get XmlHttpRequest
     * 
     *  @return object XMLHttpRequest
    */
    self.sys.getXMLHttpRequest = function(){
        var xhr;
        try{
            xhr = new XMLHttpRequest();
        } catch( e ){
            try{
                xhr = new ActiveXObject( 'Msxml2.XMLHTTP' );
            } catch( e ){
                try{
                    xhr = new ActiveXObject( 'Microsft.XMLHTTP' );
                }
                catch( e ){
                    xhr = false;
                }
            }
        }
        
        return xhr;
    };
    
    
    
    // Prepare for setting service object.
    if( typeof self.service !== 'object' ){ self.service = {} }
    
    // This is for share services.
    var services = {};
    
    
    /**
     *  Create service
     * 
     *  @param  number | string pid
     *  @param  function process
     *  @param  number delay
    */
    self.Service = function( pid, process, delay ){
        if( typeof process !== 'function' )
            return false;
        
        if( typeof delay !== 'number' )
            delay = 100;
            
        if( !pid )
            pid = ( new Date() ).getTime();
             
        this.pid = pid;
        this.delay = delay;
        this.process = process;
        this.status = 'stop';
        this.timerId = null;
        
        services[ pid ] = this;
    };
    
    
    self.Service.prototype = {
        
        /**
         *  Start service
        */
        start : function(){
            self.service.start( this.pid );
        },
        
        /**
         *  Stop service
        */
        stop : function( callback ){
            self.service.stop( this.pid, callback );
        },
        
        /**
         *  Restart service
        */
        restart : function(){
            self.service.restart( this.pid );
        }
    };
    
    
    
    /**
     *  Remove service
     * 
     *  @param  number | string pid
    */
    self.service.remove = function( pid ){
        var srvc = services[ pid ];
        if( !srvc )
            return false;
            
        var del = function(){
            delete services[ pid ];
        };
            
        if( srvc.status === 'running' )
            self.service.stop( pid, del );
        else
            del();
    };
    
    
    
    /**
     *  Start service
     * 
     *  @param  number | string pid
    */
    self.service.start = function( pid ){
        var srvc = services[ pid ];
        if( srvc.status === 'running' || !srvc )
            return false;
        
        var itvl = function(){ srvc.interval(); };
        srvc.interval = function(){ srvc.process(); };
        srvc.timerId = setInterval( itvl, srvc.delay );
        srvc.status = 'running';
    };
    
    
    
    /**
     *  Stop service
     * 
     *  @param  number | string pid
     *  @param  function callback
    */
    self.service.stop = function( pid, callback ){
        var srvc = services[ pid ];
        if( srvc.status === 'stop' || !srvc )
            return false;
        
        srvc.interval = function(){
            var res = srvc.process( 'stop' );
            if( res === true ){
                clearInterval( srvc.timerId );
                srvc.status = 'stop';
                
                if( typeof callback === 'function' )
                    callback();
            }
        };
        srvc.status = 'stopping';
    };
    
    
    
    /**
     *  Kill service
     * 
     *  @param  number | string pid
    */
    self.service.kill = function( pid ){
        var srvc = services[ pid ];
        if( srvc.status === 'stop' || !srvc )
            return false;
        
        clearInterval( srvc.timerId );
        srvc.status = 'stop';
    };
    
    
    
    /**
     *  Restart service
     * 
     *  @param  number | string pid
    */
    self.service.restart = function( pid ){
        var srvc = services[ pid ];
        var start = function(){
            self.service.start( pid, srvc.process, srvc.delay );
        };
        
        if( srvc.status === 'running' )
            self.service.stop( pid, start );
        else
            start();
    };
    
    
    
    /**
     *  Get status of service
     * 
     *  @param  number | string pid
    */
    self.service.getStatus = function( pid ){
        return services[ pid ].status;
    };
}); // Execute!
