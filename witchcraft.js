/**
 *  Witchcraft::Core for Developers
 * 
 *  @version 0.0.1
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
     *      header : string
     *  }
     * 
     *  @param  object option
     *  @return object XMLHttpRequest
    */
    self.sys.ajax = function( option ){
        var rv = verify.sys.ajax.apply( null, arguments );
        var xhr = self.sys.getHttpRequest();
        
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
            else if( xhr.readyState == 3 && xhr.status == 200 && rv.loading !== null ){
                rv.loading( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 2 && xhr.status == 200 && rv.sent !== null ){
                rv.sent( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState == 1 && xhr.status == 200 && rv.open !== null ){
                rv.open( xhr.readyState, xhr.status );
            }
            else if( xhr.readyState === 0 && xhr.status == 200 && rv.unsent !== null ){
                rv.unsent( xhr.readyState, xhr.status );
            }
            
            if( xhr.status != 200 && rv.error !== null ){
                // Error is occured.
                rv.error( xhr.readyState, xhr.status );
            }
        };
        
        if( xhr.onload )
            xhr.onload = callback;
        else
            xhr.onreadystatechange = callback;
        
        if( rv.ready !== null )
            rv.ready();

        xhr.open( rv.methodType, rv.url, rv.async, rv.username, rv.password );
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
        if( option.url !== 'string' )
            return false;
            
        var o = option;
        // method Type
        o.methodType = o.methodType.match(/^[GET|POST]/) !== null ? o.methodType : 'GET';
        // Data type
        o.dataType = o.dataType(/^[xml|text]/) !== null ? o.dataType : 'text';
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
        // Header
        o.header = typeof o.header === 'stirng' ? o.header : null;
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
    self.sys.getXmlHttpRequest = function(){
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
     *  Create independent service
     * 
     *  @param  number | string pid
     *  @param  function process
     *  @param  number delay
    */
    self.Service = function( pid, process, delay ){
        if( typeof process !== 'function' )
            return false;
        
        if( !pid )
            pid = ( new Date() ).getTime();
        if( typeof delay !== 'number' )
            delay = 100;
            
        this.pid = pid;
        this.delay = delay;
        this.process = process;
        this.status = 'stop';
        this.timerId = null;
    };
    
    
    self.Service.prototype = {
        
        /**
         *  Start independent service
        */
        start : function(){
            if( this.status === 'running' )
                return false;
            this.timerId = setInterval( this.process, this.delay );
            this.status = 'running';
        },
        
        /**
         *  Stop independent service
        */
        stop : function(){
            if( this.status === 'stop' )
                return false;
            clearInterval( this.timerId );
            this.status = 'stop';
        },
        
        /**
         *  Restart independent service
        */
        restart : function(){
            if( this.status === 'running' )
                this.stop();
            this.start();
        }
    };
    
    
    
    /**
     *  Create share service
     * 
     *  @param  number | string pid
     *  @param  function process
     *  @param  number delay
     *  @return object
    */
    self.service.create = function( pid, process, delay ){
        if( typeof process !== 'function' || services[ pid ] )
            return false;
            
        if( !pid )
            pid = ( new Date() ).getTime();
        if( typeof delay !== 'number' )
            delay = 100;
        
        var srvc = services[ pid ] = {
            pid : pid,
            process : process,
            delay : delay,
            status : 'stop',
            timerId : null
        };
        
        return srvc;
    };
    
    
    
    /**
     *  Remove share service
     * 
     *  @param  number | string pid
    */
    self.service.remove = function( pid ){
        var srvc = services[ pid ];
        if( !srvc )
            return false;
            
        if( srvc.status === 'running' )
            self.service.stop( pid );
            
        delete services[ pid ];
    };
    
    
    
    /**
     *  Start share service
     * 
     *  @param  number | string pid
    */
    self.service.start = function( pid ){
        var srvc = services[ pid ];
        if( srvc.status === 'running' || !srvc )
            return false;
        
        srvc.timerId = setInterval( srvc.process, srvc.delay );
        srvc.status = 'running';
    };
    
    
    
    /**
     *  Stop share service
     * 
     *  @param  number | string pid
    */
    self.service.stop = function( pid ){
        var srvc = services[ pid ];
        if( srvc.status === 'stop' || !srvc )
            return false;
            
        clearInterval( srvc.timerId );
        srvc.status = 'stop';
    };
    
    
    
    /**
     *  Restart share service
     * 
     *  @param  number | string pid
    */
    self.service.restart = function( pid ){
        var srvc = services[ pid ];
        if( srvc.status === 'running' )
            self.service.stop( pid );
        // Start service
        self.service.start( pid, srvc.process, srvc.delay );
    };
    
    
    
    /**
     *  Get status of share service
     * 
     *  @param  number | string pid
    */
    self.service.getStatus = function( pid ){
        return services[ pid ].status;
    };
}); // Execute!