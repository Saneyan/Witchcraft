/**
 *  Witchcraft::Window Removed Title-bar For Developers
 * 
 *  @version 0.2.8
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
 *  Window prototype
*/
(function(){
    // Prepare for initializing this constructor.
    var self = this;
    
    
    /**
     *  Window
     * 
     *  @param  object source
    */
    self.Window = function( source ){
        var win = self.window;
        
        /**
         *  First step
        */
        if( typeof source !== 'object' )
            source = {};

        // Set window ID
        if( source.id || source.id === 0 )
            this.id = source.id;
        else
            this.id = createRandomCode();

        // Set window theme
        if( typeof source.theme !== 'object' && win.hasTheme( source.themeName ) === true )
            this.theme = win.getTheme( source.themeName );
        else
            this.theme = win.getTheme( 'standard' );
        
        /**
         *  Second step
        */
        win.register( this.id, this );
        win.addLayer( this.id );
        
        // Set methods and properties
        // Must be defined this order.
        setSwap( this, source );
        setParts( this, source );
        setLimit( this, source );
        setControl( this, source );
        setEventListener( this, source );

        // Create basic parts.
        // Must be defined this order and be called here.
        this.parts.createBase();
        this.parts.createFrame();
        this.parts.createClientArea();

        // Set status method must be positioned at last second step
        setStatus( this, source );

        /**
         *  Third step
        */
        // Set size of window
        if( typeof source.maximized === 'boolean' )
            this.control.maximize();
        else if( typeof source.minimized === 'boolean' )
            this.control.minimized();
        else
            this.control.restore();
        
        this.control.activate();
    };
    
    
    
    /**
     *  Set swap
     * 
     *  @param  object data
     *  @param  object source
    */
    var setSwap = function( data, source ){
        var swap = data.swap = {
            width :  null,
            height : null,
            top :    null,
            left :   null,
            moveWidth :  null,
            moveHeight : null,
            moveTop :    null,
            moveLeft :   null,
            resizeWidth :  null,
            resizeHeight : null,
            resizeTop :    null,
            resizeLeft :   null
        };
    };




    /**
     *  Set event listener
     * 
     *  @param  object data
     *  @param  object source
    */
    var setEventListener = function( data, source ){
        
        /**
         *  Add a listener
         * 
         *  @param  string type
         *  @param  function listener
        */
        data.addListener = function( type, listener ){
            var evt = this.eventListeners;
            
            if( typeof type === 'string' && typeof listener === 'function' && typeof evt[ type ] === 'array' )
                evt[ type ][ evt.length ] = listener;
        };


        /**
         *  Remove a listener
         * 
         *  @param  string type
         *  @param  function listener
        */
        data.removeListener = function( type, listener ){
            var evt = this.eventListeners;
            
            if( typeof type === 'string' && typeof listener === 'function' && typeof evt[ type ] === 'array' ){
                for( var i = 0; evt[ type ][ i ]; i++ ){
                    if( evt[ type ][ i ] === listener )
                        evt[ type ].splice( i, i );
                }
            }
        };


        /**
         *  Call listeners
         * 
         *  @param  string type
        */
        data.callListeners = function( type ){
            var evt = this.eventListeners;
            
            if( typeof type === 'string' && typeof evt[ type ] === 'array' ){ 
                for( var i = 0; evt[ type ][ i ]; i++ )
                    evt[ type ][ i ]();
            }
        };

        
        /**
         *  Event listeners
        */
        data.eventListeners = {
                             // Calling listeners when...
            pageResize : [], // resized browser's page
            activate :   [], // activated
            deactivate : [], // deactivated
            resize :     [], // resized
            restore :    [], // restored
            maximize :   [], // maximized
            minimize :   [], // minimized
            fix :        [], // fixed
            unfix :      [], // unfixed
            close :      [], // closed
            move :       [], // moved
            movable :    [], // set movable
            resizable :  []  // set resizable
        };
    };
    


    /**
     *  Set control
     * 
     *  @param  object data
     *  @param  object source
    */
    var setControl = function( data, source ){
        // For private field
        var _private = {};
        
        // Default settings
        var _default = {
            closable :    true,
            movable :     true,
            resizable :   true,
            restorable :  true,
            maximizable : true,
            minimizable : true,
            fixable :     true,
            unfixable :   true
        };
        
        var fitStyle = function( v ){
            if( typeof v === 'number' )
                v += 'px';
            return v;
        };

        // Window control
        var ctrl = data.control = {
            
            /**
             *  Closable
            */
            set closable( v ){
                if( typeof v === 'boolean' )
                    _private.closable = v;
            },

            get closable(){
                return _private.closable;
            },


            /**
             *  Movable
            */
            set movable( v ){
                if( typeof v === 'boolean' )
                    _private.movable = v;
            },

            get movable(){
                return _private.movable;
            },


            /**
             *  Resizable
            */
            set resizable( v ){
                if( typeof v === 'boolean' )
                    _private.resizable = v;
            },

            get resizable(){
                return _private.resizable;
            },


            /**
             *  Resotorable
            */
            set restorable( v ){
                if( typeof v === 'boolean' )
                    _private.restorable = v;
            },

            get restorable(){
                return _private.restorable;
            },


            /**
             *  Maximizable
            */
            set maximizable( v ){
                if( typeof v === 'boolean' )
                    _private.maximizable = v;
            },

            get maximizable(){
                return _private.maximizable;
            },


            /**
             *  Minimizable
            */
            set minimizable( v ){
                if( typeof v === 'boolean' )
                    _private.minimizable = v;
            },

            get minimizable(){
                return _private.minimizable;
            },


            /**
             *  Fixable
            */
            set fixable( v ){
                if( typeof v === 'boolean' )
                    _private.fixable = v;
            },

            get fixable(){
                return _private.fixable;
            },


            /**
             *  Unfixable
            */
            set unfixable( v ){
                if( typeof v === 'boolean' )
                    _private.unfixable = v;
            },

            get unfixable(){
                return _private.unfixable;
            },
            
            
            /**
             *  Blur window
            */
            blur: function(){
                var win = self.window;
                var cur = win.getLayer( data.id );
                win.setLayer( data.id, cur - 1 );
                this.deactivate();
            },
            
            
            /**
             *  Focus window
            */
            focus: function(){
                this.activate();
            },


            /**
             *  Activate window
            */
            activate : function(){
                var win = self.window;
                if( win.activeWindowId === data.id && data.status.active === true )
                    return false;
                
                win.setActiveWindow( data.id );
            
                data.status.active = true;
                data.callListeners( 'activate' );
            },


            /**
             *  Deactivate window
            */
            deactivate : function(){
                data.status.active = false;
                data.callListeners( 'deactivate' );
            },


            /**
             *  Close
            */
            close : function(){
                var base = data.parts.base;
                data.callListeners( 'close' );
                base.parentNode.removeChild( base );
                delete self.window.registry[ data.id ];
            },


            /**
             *  Maximize
            */
            maximize : function(){
                if( data.status.size === 'maximized' )
                    return false;
                else
                    this.restore();

                var lim = data.limit;
                var swap = data.swap;
                var base = data.parts.base;

                // Width
                if( lim.maximizeWidth !== null ){
                    swap.width = base.offsetWidth;
                    base.style.width = fitStyle( lim.maximizeWidth );
                }
                else{
                    swap.width = null;  // Not saved
                }

                // Height
                if( lim.maximizeHeight !== null ){
                    swap.height = base.offsetHeight;
                    base.style.height = fitStyle( lim.maximizeHeight );
                }
                else{
                    swap.height = null;
                }

                // Top
                if( lim.maximizeTop !== null ){
                    swap.top = base.offsetTop;
                    base.style.top = fitStyle( lim.maximizeTop );
                }
                else{
                    swap.top = null;
                }

                // Left
                if( lim.maximizeLeft !== null ){
                    swap.left = base.offsetLeft;
                    base.style.left = fitStyle( lim.maximizeLeft );
                }
                else{
                    swap.left = null;
                }

                data.status.size = 'maximized';
                data.callListeners( 'maximize' );
            },


            /**
             *  Minimize
            */
            minimize : function(){
                if( data.status.size === 'minimized' )
                    return false;
                else
                    this.restore();

                var lim = data.limit;
                var swap = data.swap;
                var base = data.parts.base;

                // Width
                if( lim.minimizeWidth !== null ){
                    swap.width = base.offsetWidth;
                    base.style.width = fitStyle( lim.minimizeWidth );
                }
                else{
                    swap.width = null;
                }

                // Height
                if( lim.minimizeHeight !== null ){
                    swap.height = base.offsetHeight;
                    base.style.height = fitStyle( lim.minimizeHeight );
                }
                else{
                    swap.height = null;
                }

                // Top
                if( lim.minimizeTop !== null ){
                    swap.top = base.offsetTop;
                    base.style.top = fitStyle( lim.minimizeTop );
                }
                else{
                    swap.top = null;
                }

                // Left
                if( lim.minimizeLeft !== null ){
                    swap.left = base.offsetLeft;
                    base.style.left = fitStyle( lim.minimizeLeft );
                }
                else{
                    swap.left = null;
                }

                data.status.size = 'minimized';
                data.callListeners( 'minimize' );
            },


            /**
             *  Restore
            */
            restore : function(){
                if( data.status === 'restored' )
                    return false;
                
                var swap = data.swap;
                var base = data.parts.base;

                // Width
                if( swap.width !== null ){
                    base.style.width = fitStyle( swap.width );
                    swap.width = null;
                }

                // Height
                if( swap.height !== null ){
                    base.style.height = fitStyle( swap.height );
                    swap.height = null;
                }

                // Top
                if( swap.top !== null ){
                    base.style.top = fitStyle( swap.top );
                    swap.top = null;
                }

                // Left
                if( swap.left !== null ){
                    base.style.left = fitStyle( swap.left );
                    swap.left = null;
                }

                data.status.size = 'restored';
                data.callListeners( 'restore' );
            },
            
            
            /**
             *  Fix
            */
            fix : function(){
                data.callListeners( 'fix' );
            },


            /**
             *  Unfix
            */
            unfix : function(){
                data.callListeners( 'unfix' );
            },


            /**
             *  Move
            */
            move : function( x, y ){
                var status = data.status;
                status.top = y;
                status.left = x;
                
                data.callListeners( 'move' );
            },


            /**
             *  Resize
            */
            resize : function( x, y, type ){
                var swap = data.swap;
                var status = data.status;

                var widthPlus = swap.resizeWidth + ( swap.resizeX - x );
                var widthMinus = swap.resizeWidth - ( swap.resizeX - x );
                var heightPlus = swap.resizeHeight + ( swap.resizeY - y );
                var heightMinus = swap.resizeHeight - ( swap.resizeY - y );
                var left = swap.resizeLeft - ( swap.resizeX - x );
                var top = swap.resizeTop - ( swap.resizeY - y );

                switch( type ){
                    // Top
                    case 'top' :
                        status.height = heightPlus;
                        if( status.height === heightPlus )
                            status.top = top;
                        break;
                        
                    // Top left
                    case 'top-left' :
                        status.width = widthPlus;
                        status.height = heightPlus;
                        if( status.width === widthPlus )
                            status.left = left;
                        if( status.height === heightPlus )
                            status.top = top;
                        break;
                    
                    // Top right
                    case 'top-right' :
                        status.width = widthMinus;
                        status.height = heightPlus;
                        if( status.height === heightPlus )
                            status.top = top;
                        break;
                    
                    // Bottom
                    case 'bottom' :
                        status.height = heightMinus;
                        break;
                    
                    // Bottom left
                    case 'bottom-left' :
                        status.width = widthPlus;
                        status.height = heightMinus;
                        if( status.width === widthPlus )
                            status.left = left;
                        break;
                    
                    // Bottom right
                    case 'bottom-right' :
                        status.width = widthMinus;
                        status.height = heightMinus;
                        break;
                    
                    // Left
                    case 'left' :
                        status.width = widthPlus;
                        if( status.width === widthPlus )
                            status.left = left;
                        break;
                    
                    // Right
                    case 'right' :
                        status.width = widthMinus;
                        break;
                }
                
                data.callListeners( 'resize' );
            },


            /**
             *  Set movable
            */
            setMovable : function( e ){
                var moveLis = function( me ){
                    var mx = me ? me.pageX : event.x;
                    var my = me ? me.pageY : event.y;
                    var x = swap.moveLeft - ( swap.moveX - mx );
                    var y = swap.moveTop - ( swap.moveY - my );
                    data.control.move( x, y );
                };
                
                var upLis = function(){
                    removeListener( 'mousemove', moveLis );
                    removeListener( 'mouseup', upLis );
                    swap.moveWidth = 
                    swap.moveHeight = 
                    swap.moveTop = 
                    swap.moveLeft = 
                    swap.moveX = 
                    swap.moveY = null;
                };
                
                var base = data.parts.base;
                var swap = data.swap;
                
                swap.moveWidth = base.offsetWidth;
                swap.moveHeight = base.offsetHeight;
                swap.moveTop = base.offsetTop;
                swap.moveLeft = base.offsetLeft;
                swap.moveX = e ? e.pageX : event.x;
                swap.moveY = e ? e.pageY : event.y;
                
                addListener( 'mousemove', moveLis );
                addListener( 'mouseup', upLis );
                
                data.callListeners( 'movable' );
            },


            /**
             *  Set movable
            */
            setResizable : function( e, type ){
                var moveLis = function( re ){
                    var rx = re ? re.pageX : event.x;
                    var ry = re ? re.pageY : event.y;
                    data.control.resize( rx, ry, type );
                };

                var upLis = function(){
                    removeListener( 'mousemove', moveLis );
                    removeListener( 'mouseup', upLis );
                    swap.resizeWidth = 
                    swap.resizeHeight = 
                    swap.resizeTop = 
                    swap.resizeLeft = 
                    swap.resizeX = 
                    swap.resizeY = null;
                };
                
                var base = data.parts.base;
                var swap = data.swap;

                swap.resizeWidth = base.offsetWidth;
                swap.resizeHeight = base.offsetHeight;
                swap.resizeTop = base.offsetTop;
                swap.resizeLeft = base.offsetLeft;
                swap.resizeX = e ? e.pageX : event.x;
                swap.resizeY = e ? e.pageY : event.y;
                
                addListener( 'mousemove', moveLis );
                addListener( 'mouseup', upLis );
                
                data.callListeners( 'resizable' );
            },
            
            
            /**
             *  Set move area
            */
            setMoveArea : function( elem ){
                if( typeof elem !== 'object' )
                    return false;
                    
                addListener( 'mousedown', function( e ){
                    data.control.setMovable( e );
                }, elem );
            },
            
            
            /**
             *  Set resize area
            */
            setResizeArea : function( type, elem ){
                if( typeof elem !== 'object' )
                    return false;
                
                addListener( 'mousedown', function( e ){
                    data.control.setResizable( e, type );
                }, elem );
            }
        };

        for( var key in _default ){
            if( typeof source === 'object' && source[ key ] !== undefined )
                ctrl[ key ] = source[ key ];
            else
                ctrl[ key ] = _default[ key ];
        }
    };


    
    /**
     *  Set parts
     * 
     *  @param  object data
     *  @param  object source
    */
    var setParts = function( data, source ){
        var parts = data.parts = {

            /**
             *  Create base
            */
            createBase : function( parentNode ){
                var elem = document.createElement( 'div' );
                elem.className = data.theme.className.base;
                data.parts.base = elem;
            
                var listener = function(){
                    data.control.activate();
                };
            
                addListener( 'mousedown', listener, elem );
            
                if( parentNode )
                    parentNode.appendChild( elem );
                else
                    document.body.appendChild( elem );
                
                return elem;
            },
        
        
            /**
             *  Create frame
            */
            createFrame : function(){
                if ( !data.parts.base )
                    throw new Error( 'This window has no Base.' );
                
                var cn = data.theme.className;
                var base = data.parts.base;
                
                var setResize = function( type, elem ){
                    addListener( 'mousedown', function( e ){
                        data.control.setResizable( e );
                    }, elem );
                };
            
                // Top left
                var topLeft = document.createElement( 'div' );
                topLeft.className = cn.topLeftFrame;
                base.appendChild( topLeft );
                data.parts.topLeftFrame = topLeft;
                setResize( 'top-left', topLeft );
                
                // Top
                var top = document.createElement( 'div' );
                top.className = cn.topFrame;
                base.appendChild( top );
                data.parts.topFrame = top;
              
                // Top right
                var topRight = document.createElement( 'div' );
                topRight.className = cn.topRightFrame;
                base.appendChild( topRight );
                data.parts.topRightFrame = topRight;
                
                // Left
                var left = document.createElement( 'div' );
                left.className = cn.leftFrame;
                base.appendChild( left );
                data.parts.leftFrame = left;
                
                // Center
                var center = document.createElement( 'div' );
                center.className = cn.centerFrame;
                base.appendChild( center );
                data.parts.centerFrame = center;
                
                // Right
                var right = document.createElement( 'div' );
                right.className = cn.rightFrame;
                base.appendChild( right );
                data.parts.rightFrame = right;
                
                // Bottom left
                var bottomLeft = document.createElement( 'div' );
                bottomLeft.className = cn.bottomLeftFrame;
                base.appendChild( bottomLeft );
                data.parts.bottomLeftFrame = bottomLeft;
                
                // Bottom
                var bottom = document.createElement( 'div' );
                bottom.className = cn.bottomFrame;
                base.appendChild( bottom );
                data.parts.bottomFrame = bottom;
                
                // Bottom right
                var bottomRight = document.createElement( 'div' );
                bottomRight.className = cn.bottomRightFrame;
                base.appendChild( bottomRight );
                data.parts.bottomRightFrame = bottomRight;
            
                return {
                    top : top,
                    topLeft : topLeft,
                    topRight : topRight,
                    left : left,
                    center : center,
                    right : right,
                    bottom : bottom,
                    bottomLeft : bottomLeft,
                    bottomRight : bottomRight
                };
            },
        
        
            /**
             *  Create client area
            */
            createClientArea : function(){
                if( !data.parts.centerFrame )
                    throw new Error( 'This window has no Center Frame.' );
            
                var elem = document.createElement( 'div' );
                elem.className = data.theme.className.clientArea;
                data.parts.clientArea = elem;
                data.parts.centerFrame.appendChild( elem );
            
                return elem;
            }
        };
    };
    
    
    
    /**
     *  Set status
     * 
     *  @param  object data
     *  @param  object source
    */
    var setStatus = function( data, source ){
        // For private field
        var _private = {};
        
        // For default settings
        var _default = {
            width :   300,
            height :  300,
            top :     0,
            left :    0,
            active :  false,
            title :   'Untitled',
            size :    'restored',
            current : 'new'
        };

        // Window parameter
        var status = data.status = {

            /**
             *  Width
            */
            set width( v ){
                var rv = convert( v );
                var base = data.parts.base;
                
                if( rv === false || !base )
                    return false;

                var lim = data.limit;
                
                if( typeof rv === 'string' ){
                    base.style.width = rv;
                    _private.width = rv;
                }
                else if( typeof rv === 'number' 
                    && ( lim.maxWidth === null || rv <= lim.maxWidth )
                    && ( lim.minWidth === null || rv >= lim.minWidth )
                ){
                    base.style.width = rv + 'px';
                    _private.width = rv;
                }
            },

            get width(){
                return _private.width;
            },


            /**
             *  Height
            */
            set height( v ){
                var rv = convert( v );
                var base = data.parts.base;
                
                if( rv === false || !base )
                    return false;

                var lim = data.limit;
                
                if( typeof rv === 'string' ){
                    base.style.height = rv;
                    _private.height = rv;
                }
                else if( typeof rv === 'number' 
                    && ( lim.maxHeight === null || rv <= lim.maxHeight )
                    && ( lim.minHeight === null || rv >= lim.minHeight )
                ){
                    base.style.height = rv + 'px';
                    _private.height = rv;
                }
            },

            get height(){
                return _private.height;
            },


            /**
             *  Top
            */
            set top( v ){
                var rv = convert( v );
                var base = data.parts.base;

                if( rv === false || !base )
                    return false;

                var lim = data.limit;

                if( typeof rv === 'string' ){
                    base.style.top = rv;
                    _private.top = rv;
                }
                else if( typeof rv === 'number' 
                    && ( lim.maxTop === null || rv <= lim.maxTop )
                    && ( lim.minTop === null || rv >= lim.minTop )
                ){
                    base.style.top = rv + 'px';
                    _private.top = rv;
                }
            },
            
            get top(){
                return _private.top;
            },


            /**
             *  Left
            */
            set left( v ){
                var rv = convert( v );
                var base = data.parts.base;
                
                if( rv === false || !base )
                    return false;

                var lim = data.limit;
                
                if( typeof rv === 'string' ){
                    base.style.left = rv;
                    _private.left = rv;
                }
                else if( typeof rv === 'number' 
                    && ( lim.maxLeft === null || rv <= lim.maxLeft )
                    && ( lim.minLeft === null || rv >= lim.minLeft )
                ){
                    base.style.left = rv + 'px';
                    _private.left = rv;
                }
            },

            get left(){
                return _private.left;
            },


            /**
             *  Active status
            */
            set active( v ){
                if( typeof v === 'boolean' )
                    _private.active = v;
            },
            
            get active(){
                return _private.active;
            }
        };

        // Apply settings
        for( var key in _default ){
            if( typeof source === 'object' && source[ key ] !== undefined )
                status[ key ] = source[ key ];
            else
                status[ key ] = _default[ key ];
        }
    };



    /**
     *  Set limit
     * 
     *  @param  object data
     *  @param  object source
    */
    var setLimit = function( data, source ){
        // Private field
        var _private = {};
        
        // Default settings
        var _default = {
            maxWidth :  null,
            minWidth :  200,
            maxHeight : null,
            minHeight : 200,
            maxTop :    null,
            minTop :    null,
            maxLeft :   null,
            minLeft :   null,
            maximizeWidth :  '100%',
            maximizeHeight : '100%',
            maximizeTop :    0,
            maximizeLeft :   0,
            minimizeWidth :  100,
            minimizeHeight : 50,
            minimizeTop :    null,
            minimizeLeft :   null
        };

        // Size of limit
        var lim = data.limit = {
            
            /**
             *  Max width
            */
            set maxWidth( v ){
                if( typeof v === 'number' || v === null )
                    _private.maxWidth = v;
            },

            get maxWidth(){
                return _private.maxWidth;
            },


            /**
             *  Min width
            */
            set minWidth( v ){
                if( typeof v === 'number' || v === null )
                    _private.minWidth = v;
            },

            get minWidth(){
                return _private.minWidth;
            },


            /**
             *  Max height
            */
            set maxHeight( v ){
                if( typeof v === 'number' || v === null )
                    _private.maxHeight = v;
            },

            get maxHeight(){
                return _private.maxHeight;
            },


            /**
             *  Min height
            */
            set minHeight( v ){
                if( typeof v === 'number' || v === null )
                    _private.minHeight = v;
            },

            get minHeight(){
                return _private.minHeight;
            },


            /**
             *  Max top
            */
            set maxTop( v ){
                if( typeof v === 'number' || v === null )
                    _private.maxTop = v;
            },

            get maxTop(){
                return _private.maxTop;
            },


            /**
             *  Min top
            */
            set minTop( v ){
                if( typeof v === 'number' || v === null )
                    _private.minTop = v;
            },

            get minTop(){
                return _private.minTop;
            },
            
            
            /**
             *  Max left
            */
            set maxLeft( v ){
                if( typeof v === 'number' || v === null )
                    _private.maxLeft = v;
            },

            get maxLeft(){
                return _private.maxLeft;
            },


            /**
             *  Min left
            */
            set minLeft( v ){
                if( typeof v === 'number' || v === null )
                    _private.minLeft = v;
            },

            get minLeft(){
                return _private.minLeft;
            },
            
            
            /**
             *  Maximize width
            */
            set maximizeWidth( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.maximizeWidth = rv;
            },

            get maximizeWidth(){
                return _private.maximizeWidth;
            },
            
            
            /**
             *  Maximize height
            */
            set maximizeHeight( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.maximizeHeight = rv;
            },

            get maximizeHeight(){
                return _private.maximizeHeight;
            },
            
            
            /**
             *  Maximize top
            */
            set maximizeTop( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.maximizeTop = rv;
            },

            get maximizeTop(){
                return _private.maximizeTop;
            },
            
            
            /**
             *  Maximize left
            */
            set maximizeLeft( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.maximizeLeft = rv;
            },

            get maximizeLeft(){
                return _private.maximizeLeft;
            },
            
            
            /**
             *  Minimize width
            */
            set minimizeWidth( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.minimizeWidth = rv;
            },

            get minimizeWidth(){
                return _private.minimizeWidth;
            },
            
            
            /**
             *  Minimize height
            */
            set minimizeHeight( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.minimizeHeight = rv;
            },

            get minimizeHeight(){
                return _private.minimizeHeight;
            },
            
            
            /**
             *  Minimize top
            */
            set minimizeTop( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.minimizeTop = rv;
            },

            get minimizeTop(){
                return _private.minimizeTop;
            },
            
            
            /**
             *  Minimize left
            */
            set minimizeLeft( v ){
                var rv = convert( v );
                if( rv !== false )
                    _private.minimizeLeft = rv;
            },

            get minimizeLeft(){
                return _private.minimizeLeft;
            }
        };

        // Apply settings
        for( var key in _default ){
            if( typeof source === 'object' && source[ key ] !== undefined )
                lim[ key ] = source[ key ];
            else
                lim[ key ] = _default[ key ];
        }
    };


    
    self.window = {
        
        
        /**
         *  Get theme
        */
        getTheme : function( name ){
            if( typeof this.themes[ name ] !== 'object' )
                return false;
            return this.themes[ name ];
        },
        
        
        /**
         *  Add theme
        */
        addTheme : function( name, theme ){
            this.themes[ name ] = theme;
        },
        
        
        /**
         *  Remove theme
        */
        removeTheme : function( name ){
            delete this.themes[ name ];
        },
        
        
        /**
         *  Check if window manager has specific theme or not
        */
        hasTheme : function( name ){
            return this.themes.hasOwnProperty( name );
        },
        
        
        /**
         *  Get active window
        */
        getActiveWindow : function(){
            if( this.activeWindowId )
                return this.registry[ this.layers[ 0 ] ];
            else
                return false;
        },
        
        
        /**
         * Set active window
        */
        setActiveWindow : function( id ){
            var activeWindow = this.getActiveWindow();
            if( activeWindow )
                activeWindow.control.deactivate();
                    
            this.activeWindowId = id;
            this.setLayer( id, 0 );
        },
        
        
        /**
         *  Set window layer
        */
        setLayer : function( id, order ){
            var registry = this.registry,
                layers = this.layers;
            
            if( typeof order !== 'number' )
                order = 0;
            if( order > layers.length - 1 )
                order = layers.length - 1;
                
            if( order === this.getLayer( id ) )
                return;

            var before = this.getLayer( id );
            layers.splice( before, 1 );
            layers.splice( order, 0, id );

            for( var j = 0, i = layers.length - 1; i >= 0; j++, i-- ){
                registry[ layers[ j ] ].parts.base.style.zIndex = this.globalSettings.minZIndex + i;
            }
        },
        
        
        /**
         *  Get window layer
        */
        getLayer : function( id ){
            var layers = this.layers;

            for( var i = 0; layers.length > i; i++ ){
                if( layers[ i ] === id )
                    return i;
            }
            
            return -1;
        },
        
        
        /**
         *  Add window layer
        */
        addLayer : function( id ){
            this.layers.push( id );
        },
        
        
        /**
         *  Register window
        */
        register : function( id, data ){
            this.registry[ id ] = data;
        },
        
        
        /**
         *  Active window
        */
        activeWindowId : null,
        
        
        /**
         *  Window layers
        */
        layers : [],
        
        
        /**
         *  Registry
        */
        registry : {},
        
        
        /**
         *  Global settings
        */
        globalSettings : {
            minZIndex : 10
        },
        
        
        /**
         *  Themes
        */
        themes : {
            // Standard theme
            standard : {
                // CSS Selector 'ClassName'
                className : {
                    base :              'wic-window-standard-base',                 // Base
                    clientArea :        'wic-window-standard-client-area',          // Client area
                    topFrame :          'wic-window-standard-top-frame',            // Top frame
                    topLeftFrame :      'wic-window-standard-top-left-frame',       // Top left frame
                    topRightFrame :     'wic-window-standard-top-right-frame',      // Top right frame
                    leftFrame :         'wic-window-standard-left-frame',           // Left frame
                    centerFrame :       'wic-window-standard-center-frame',         // Center frame
                    rightFrame :        'wic-window-standard-right-frame',          // Right frame
                    bottomFrame :       'wic-window-standard-bottom-frame',         // Bottom frame
                    bottomLeftFrame :   'wic-window-standard-bottom-left-frame',    // Bottom left frame
                    bottomRightFrame :  'wic-window-standard-bottom-right-frame'    // Bottom right frame
                }
            }
        }
    };

    
    
    /**
     *  LOCAL AREA ONLY
     * 
     *  Add an event listener to target
     * 
     *  @param  string type
     *  @param  function listener
     *  @param  object target
     *  @param  boolean useCapture
    */
    var addListener = function( type, listener, target, useCapture ){
        if( !target )
            target = window;
        if( typeof useCapture !== 'boolean' )
            useCapture = false;
            
        if( target.addEventListener ){
            target.addEventListener( type, listener, useCapture );
        }
        else if( target.attachEvent ){
            if( target === window && type.match( /^click|mousedown$/ ) )
                target = document;
            target.attachEvent( 'on' + type, listener );
        }
    };
    
    
    
    /**
     *  LOCAL AREA ONLY
     * 
     *  Remove an event listener
     * 
     *  @param  string type
     *  @param  function listener
     *  @param  object target
     *  @param  boolean useCapture
    */
    var removeListener = function( type, listener, target, useCapture ){
        if( !target )
            target = window;
        if( typeof useCapture !== 'boolean' )
            useCaputre = false;
        
        if( target.addEventListener ){
            target.removeEventListener( type, listener, useCapture );
        }
        else if( target.detachEvent ){
            if( target === window && type.match( /^click|mousedown$/ ) )
                target = document;
            target.detachEvent( 'on' + type, listener );
        }
    };
    
    
    
    /**
     *  LOCAL AREA ONLY
     * 
     *  Converter
     * 
     *  @param  string | number v
     *  @return string | number
    */
    var convert = function( v ){
        var ret;

        if( typeof v === 'string' && v.match( /^[0-9]*.*$/ ) ){
            if( v.match( /^[0-9]*$/ ) !== null )
                ret = Number( v );
            else if( v.match( /.*px$/ ) !== null )
                ret = Number( v.slice( 0, v.length - 2 ) );
            else if( v.match( /.*%$/ ) !== null )
                ret = v;
        }
        else if( typeof v === 'number' )
            ret = v;
        else
            ret = false;

        return ret;
    };
    
    
    
    /**
     *  LOCAL AREA ONLY
     *
     *  Create random code
     * 
     *  @return number  < Random code >
    */
    var createRandomCode = function(){
        return ( new Date() ).getTime() + Math.random() * 100000;
    };
});
