/**
 *  Witchcraft::Window
 * 
 *  @version 0.3.0
 *  @author  Saneyuki Tadokoro <post@saneyuki.gfunction.com>
 * 
 *  Copyright (c) 2011, 2012 Saneyuki Tadokoro
*/

var wic = {};
(function(){
    var ww = wic.window = {
        
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
                activeWindow.deactivate();
                    
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
                    base :              'window-standard-base',                 // Base
                    clientArea :        'window-standard-client-area',          // Client area
                    topFrame :          'window-standard-top-frame',            // Top frame
                    topLeftFrame :      'window-standard-top-left-frame',       // Top left frame
                    topRightFrame :     'window-standard-top-right-frame',      // Top right frame
                    leftFrame :         'window-standard-left-frame',           // Left frame
                    centerFrame :       'window-standard-center-frame',         // Center frame
                    rightFrame :        'window-standard-right-frame',          // Right frame
                    bottomFrame :       'window-standard-bottom-frame',         // Bottom frame
                    bottomLeftFrame :   'window-standard-bottom-left-frame',    // Bottom left frame
                    bottomRightFrame :  'window-standard-bottom-right-frame'    // Bottom right frame
                }
            }
        }
    };
    
    /**
     *  Window
     * 
     *  @param  object source
    */
    ww.create = function( source ){
        var data = {};
        
        /**
         *  First step
        */
        if( typeof source !== 'object' )
            source = {};

        // Set window ID
        if( source.id || source.id === 0 )
            data.id = source.id;
        else
            data.id = createRandomCode();

        // Set window theme
        if( typeof source.theme !== 'object' && ww.hasTheme( source.themeName ) === true )
            data.theme = ww.getTheme( source.themeName );
        else
            data.theme = ww.getTheme( 'standard' );
        
        /**
         *  Second step
        */
        ww.register( data.id, data );
        ww.addLayer( data.id );
        
        // Set all settings
        setSettings( data );

        // Create basic parts.
        // Must be defined this order and be called here.
        data.parts.createBase();
        data.parts.createFrame();
        data.parts.createClientArea();

        // Set status method must be positioned at last second step
        applySettings( data, source );
        
        // Activate window
        data.activate();
        
        return data;
    };
    
    /**
     *  Apply settings
    */
    var applySettings = function( data, source ){
        var $d = data;
        var $s = source;
        // For default settings
        var Default = {
            width :   300,
            height :  300,
            top :     0,
            left :    0,
            active :  false,
            size :    'restored',
            current : 'new',
            closable : true,
            movable : true,
            resizable : true,
            restorable : true,
            maximizable : true,
            minimizable : true,
            fixable : true,
            unfixable : true,
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
            
        if( $d.setClosable( $s.closable ) === false )
            $d.setClosable( Default.closable );
        
        if( $d.setMovable( $s.movable ) === false )
            $d.setMovable( Default.movable );
        
        if( $d.setResizable( $s.resizable ) === false )
            $d.setResizable( Default.resizable );
        
        if( $d.setRestorable( $s.restorable ) === false )
            $d.setRestorable( Default.restorable );
        
        if( $d.setMaximizable( $s.maximizable ) === false )
            $d.setMaximizable( Default.maximizable );
        
        if( $d.setMinimizable( $s.minimizable ) === false )
            $d.setMinimizable( Default.minimizable );
        
        if( $d.setFixable( $s.fixable ) === false )
            $d.setFixable( Default.fixable );
        
        if( $d.setUnfixable( $s.unfixable ) === false )
            $d.setUnfixable( Default.unfixable );
        
        if( $d.setMaxWidth( $s.maxWidth ) === false )
            $d.setMaxWidth( Default.maxWidth );
        
        if( $d.setMinWidth( $s.minWidth ) === false )
            $d.setMinWidth( Default.minWidth );
        
        if( $d.setMaxHeight( $s.maxHeight ) === false )
            $d.setMaxHeight( Default.maxHeight );
        
        if( $d.setMinHeight( $s.minHeight ) === false )
            $d.setMinHeight( Default.minHeight );
        
        if( $d.setMaxTop( $s.maxTop ) === false )
            $d.setMaxTop( Default.maxTop );
        
        if( $d.setMinTop( $s.minTop ) === false )
            $d.setMinTop( Default.minTop );
        
        if( $d.setMaxLeft( $s.maxLeft ) === false )
            $d.setMaxLeft( Default.maxLeft );
        
        if( $d.setMinLeft( $s.minLeft ) === false )
            $d.setMinLeft( Default.minLeft );
        
        if( $d.setMaximizeWidth( $s.maximizeWidth ) === false )
            $d.setMaximizeWidth( Default.maximzieWidth );
        
        if( $d.setMaximizeHeight( $s.maximizeHeight ) === false )
            $d.setMaximizeHeight( Default.maximzieHeight );
        
        if( $d.setMaximizeTop( $s.maximizeTop ) === false )
            $d.setMaximizeTop( Default.maximizeTop );
        
        if( $d.setMaximizeLeft( $s.maximzieLeft ) === false )
            $d.setMaximizeLeft( Default.maximizeLeft );
        
        if( $d.setMinimizeWidth( $s.minimizeWidth ) === false )
            $d.setMinimizeWidth( Default.minimizeWidth );
        
        if( $d.setMinimizeHeight( $s.minimizeHeight ) === false )
            $d.setMinimizeHeight( Default.minimizeHeight );
        
        if( $d.setMinimizeTop( $s.minimizeTop ) === false )
            $d.setMinimizeTop( Default.minimizeTop );
        
        if( $d.setMinimizeLeft( $s.minimizeLeft ) === false )
            $d.setMinimizeLeft( Default.minimizeLeft );
            
        if( $d.setWidth( $s.width ) === false )
            $d.setWidth( Default.width );
        
        if( $d.setHeight( $s.height ) === false )
            $d.setHeight( Default.height );
        
        if( $d.setTop( $s.top ) === false )
            $d.setTop( Default.top );
        
        if( $d.setLeft( $s.left ) === false )
            $d.setLeft( Default.left );
        
        if( $s.size === 'maximized' )
            $d.maximize();
        else if( $s.size === 'minimized' )
            $d.minimize();
        else
            $d.restore();
    };
    
    /**
     *  Set all methods and properties.
    */
    var setSettings = function( data ){
        // Set parts
        data.parts = {
        };
        
        // Set swap data
        data.swap = {
            width: null,
            height: null,
            top: null,
            left: null,
            moveWidth: null,
            moveHeight: null,
            moveTop: null,
            moveLeft: null,
            moveX: null,
            moveY: null,
            resizeWidth: null,
            resizeHeight: null,
            resizeTop: null,
            resizeLeft: null,
            resizeX: null,
            resizeY: null
        };
        
        // Event listeners
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
            readyMove :    [], // prepared for moving
            readyResize :  []  // prepared for resizing
        };
        
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
         *  Activate window
        */
        data.activate = function(){
            if( ww.activeWindowId === data.id && data.active === true )
                return false;
            
            ww.setActiveWindow( data.id );
            
            data.active = true;
            data.callListeners( 'activate' );
        };
        
        /**
         *  Deactivate window
        */
        data.deactivate = function(){
            data.active = false;
            data.callListeners( 'deactivate' );
        };
        
        /**
         *  Close
        */
        data.close = function(){
            if( data.closable === false )
                return false;
                
            var base = data.parts.base;
            data.callListeners( 'close' );
            base.parentNode.removeChild( base );
            delete ww.registry[ data.id ];
        };
        
        /**
         *  Maximzie
        */
        data.maximize = function(){
            if( data.size === 'maximized' || data.maximizable === false )
                return false;
            else
                this.restore();
            
            var swap = data.swap;
            var base = data.parts.base;
            
            // Width
            if( data.maximizeWidth !== null ){
                swap.width = base.offsetWidth;
                base.style.width = fitStyle( data.maximizeWidth );
            }
            else{
                swap.width = null;
            }
            
            // Height
            if( data.maximizeHeight !== null ){
                swap.height = base.offsetHeight;
                base.style.height = fitStyle( data.maximizeHeight );
            }
            else{
                swap.height = null;
            }
            
            // Top
            if( data.maximizeTop !== null ){
                swap.top = base.offsetTop;
                base.style.top = fitStyle( data.maximizeTop );
            }
            else{
                swap.top = null;
            }
            
            // Left
            if( data.maximizeLeft !== null ){
                swap.left = base.offsetLeft;
                base.style.left = fitStyle( data.maximizeLeft );
            }
            else{
                swap.left = null;
            }
            
            data.size = 'maximized';
            data.callListeners( 'maximize' );
        };
        
        /**
         *  Minimize
        */
        data.minimize = function(){
            if( data.size === 'minimized' || data.minimizable === false )
                return false;
            else
                this.restore();
            
            var swap = data.swap;
            var base = data.parts.base;
            
            if( data.minimizeWidth !== null ){
                swap.width = base.offsetWidth;
                base.style.width = fitStyle( data.minimizeWidth );
            }
            else{
                swap.width = null;
            }
            
            if( data.minimizeHeight !== null ){
                swap.height = base.offsetHeight;
                base.style.height = fitStyle( data.minimizeHeight );
            }
            else{
                swap.height = null;
            }
            
            if( data.minimizeTop !== null ){
                swap.top = base.offsetTop;
                base.style.top = fitStyle( data.minimizeTop );
            }
            else{
                swap.top = null;
            }
            
            if( data.minimizeLeft !== null ){
                swap.left = base.offsetLeft;
                base.style.left = fitStyle( data.minimizeLeft );
            }
            else{
                swap.left = null;
            }
            
            data.size = 'minimized';
            data.callListeners( 'minimize' );
        };
        
        /**
         *  Restore
        */
        data.restore = function(){
            if( data.size === 'restored' || data.restorable === false )
                return false;
            
            var swap = data.swap;
            var base = data.parts.base;
            
            if( swap.width !== null ){
                base.style.width = fitStyle( swap.width );
                swap.width = null;
            }
            
            if( swap.height !== null ){
                base.style.height = fitStyle( swap.height );
                swap.height = null;
            }
            
            if( swap.top !== null ){
                base.style.top = fitStyle( swap.top );
                swap.top = null;
            }
            
            if( swap.left !== null ){
                base.style.left = fitStyle( swap.left );
                swap.left = null;
            }
            
            data.size = 'restored';
            data.callListeners( 'restore' );
        };
        
        /**
         *  Fix
        */
        data.fix = function(){
            if( data.fixable === false )
                return false;
                
            data.callListeners( 'fix' );
        };
        
        /**
         *  Unfix
        */
        data.unfix = function(){
            if( data.unfixable === false )
                return false;
                
            data.callListeners( 'unfix' );
        };
        
        /**
         *  Move
        */
        data.move = function( x, y ){
            if( data.movable === false )
                return false;
                
            data.setLeft( x );
            data.setTop( y );
            data.callListeners( 'move' );
        };
        
        /**
         *  Resize
        */
        data.resize = function( x, y, type ){
            if( data.resizable === false )
                return false;
                
            var swap = data.swap;
            
            var marginX = swap.resizeX - x;
            var marginY = swap.resizeY - y;
            var widthPlus = swap.resizeWidth + marginX;
            var widthMinus = swap.resizeWidth - marginX;
            var heightPlus = swap.resizeHeight + marginY;
            var heightMinus = swap.resizeHeight - marginY;
            var left = swap.resizeLeft - marginX;
            var top = swap.resizeTop - marginY;
            
            // Top
            if( type === 'top' ){
                if( data.setHeight( heightPlus ) !== false )
                    data.setTop( top );
            }
            // Top left
            else if( type === 'top-left' ){
                if( data.setWidth( widthPlus ) !== false )
                    data.setLeft( left );
                if( data.setHeight( heightPlus ) !== false )
                    data.setTop( top );
            }
            // Top right
            else if( type === 'top-right' ){
                if( data.setHeight( heightPlus ) !== false )
                    data.setTop( top );
                data.setWidth( widthMinus );
            }
            // Left
            else if( type === 'left' ){
                if( data.setWidth( widthPlus ) !== false )
                    data.setLeft( left );
            }
            // Right
            else if( type === 'right' ){
                data.setWidth( widthMinus );
            }
            // Bottom
            else if( type === 'bottom' ){
                data.setHeight( heightMinus );
            }
            // Bottom left
            else if( type === 'bottom-left' ){
                if( data.setWidth( widthPlus ) !== false )
                    data.setLeft( left );
                data.setHeight( heightMinus );
            }
            // Bottom right
            else if( type === 'bottom-right' ){
                data.setWidth( widthMinus );
                data.setHeight( heightMinus );
            }
            
            data.callListeners( 'resize' );
        };
        
        /**
         *  Prepare for moving window
        */
        data.readyMove = function( e ){
            if( data.movable === false )
                return false;
                
            var swap = data.swap;
            var base = data.parts.base;
            
            var moveLis = function( me ){
                var mx = me ? me.pageX : event.x;
                var my = me ? me.pageY : event.y;
                var x = swap.moveLeft - ( swap.moveX - mx );
                var y = swap.moveTop - ( swap.moveY - my );
                data.move( x, y );
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
            
            swap.moveWidth = base.offsetWidth;
            swap.moveHeight = base.offsetHeight;
            swap.moveTop = base.offsetTop;
            swap.moveLeft = base.offsetLeft;
            swap.moveX = e ? e.pageX : event.x;
            swap.moveY = e ? e.pageY : event.y;
            
            addListener( 'mousemove', moveLis );
            addListener( 'mouseup', upLis );
            
            data.callListeners( 'readyMove' );
        };
        
        /**
         *  Prepare for resizing window
        */
        data.readyResize = function( e, type ){
            if( data.resizable === false )
                return false;
                
            var swap = data.swap;
            var base = data.parts.base;
            
            var moveLis = function( re ){
                var rx = re ? re.pageX : event.x;
                var ry = re ? re.pageY : event.y;
                data.resize( rx, ry, type );
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
            
            swap.resizeWidth = base.offsetWidth;
            swap.resizeHeight = base.offsetHeight;
            swap.resizeTop = base.offsetTop;
            swap.resizeLeft = base.offsetLeft;
            swap.resizeX = e ? e.pageX : event.x;
            swap.resizeY = e ? e.pageY : event.y;
            
            addListener( 'mousemove', moveLis );
            addListener( 'mouseup', upLis );
            
            data.callListeners( 'readyResize' );
        };
        
        /**
         *  Attach movement
        */
        data.attachMovement = function( elem ){
            if( typeof elem !== 'object' )
                return false;
            
            addListener( 'mousedown', function( e ){
                data.readyMove( e );
            }, elem );
        };
        
        /**
         *  Attach resizement
        */
        data.attachResizement = function( elem, type ){
            if( typeof elem !== 'object' )
                return false;
            
            addListener( 'mousedown', function( e ){
                data.readyResize( e, type );
            }, elem );
        };
        
        /**
         *  Create base
        */
        data.parts.createBase = function( parentNode ){
            if( data.parts.base )
                return false;
                
            var elem = document.createElement( 'div' );
            elem.className = data.theme.className.base;
            data.parts.base = elem;
            
            addListener( 'mousedown', function(){
                data.activate();
            }, elem );
            
            if( parentNode )
                parentNode.appendChild( elem );
            else
                document.body.appendChild( elem );
                
            return elem;
        };
        
        /**
         *  Create frame
        */
        data.parts.createFrame = function(){
            if( !data.parts.base || data.parts.topFrame )
                return false;
            
            var cn = data.theme.className;
            var base = data.parts.base;
            var attach = data.attachResizement;
            
            // Top left
            var topLeft = document.createElement( 'div' );
            topLeft.className = cn.topLeftFrame;
            base.appendChild( topLeft );
            data.parts.topLeftFrame = topLeft;
            attach( topLeft, 'top-left' );
            
            // Top
            var top = document.createElement( 'div' );
            top.className = cn.topFrame;
            base.appendChild( top );
            data.parts.topFrame = top;
            attach( top, 'top' );
            
            // Top right
            var topRight = document.createElement( 'div' );
            topRight.className = cn.topRightFrame;
            base.appendChild( topRight );
            data.parts.topRightFrame = topRight;
            attach( topRight, 'top-right' );
            
            // Left
            var left = document.createElement( 'div' );
            left.className = cn.leftFrame;
            base.appendChild( left );
            data.parts.leftFrame = left;
            attach( left, 'left' );
            
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
            attach( right, 'right' );
            
            // Bottom left
            var bottomLeft = document.createElement( 'div' );
            bottomLeft.className = cn.bottomLeftFrame;
            base.appendChild( bottomLeft );
            data.parts.bottomLeftFrame = bottomLeft;
            attach( bottomLeft, 'bottom-left' );
            
            // Bottom
            var bottom = document.createElement( 'div' );
            bottom.className = cn.bottomFrame;
            base.appendChild( bottom );
            data.parts.bottomFrame = bottom;
            attach( bottom, 'bottom' );
            
            // Bottom right
            var bottomRight = document.createElement( 'div' );
            bottomRight.className = cn.bottomRightFrame;
            base.appendChild( bottomRight );
            data.parts.bottomRightFrame = bottomRight;
            attach( bottomRight, 'bottom-right' );
            
            return {
                top: top,
                topLeft: topLeft,
                topRight: topRight,
                left: left,
                right: right,
                bottom: bottom,
                bottomLeft: bottomLeft,
                bottomRight: bottomRight
            };
        };
        
        /**
         *  Create client area
        */
        data.parts.createClientArea = function(){
            var parts = data.parts;
            if( !parts.centerFrame || parts.clientArea )
                return false;
            
            var elem = document.createElement( 'div' );
            elem.className = data.theme.className.clientArea;
            parts.clientArea = elem;
            parts.centerFrame.appendChild( elem );
            
            return elem;
        };
        
        /**
         *  Set width
        */
        data.setWidth = function( v ){
            var rv = convert( v );
            var base = data.parts.base;
            
            if( rv === false || !base )
                return false;
            
            if( typeof rv === 'string' ){
                base.style.width = rv;
                data.width = rv;
            }
            else if( typeof rv === 'number'
                && ( data.maxWidth === null || rv <= data.maxWidth )
                && ( data.minWidth === null || rv >= data.minWidth )
            ){
                base.style.width = rv + 'px';
                data.width = rv;
            }
            else{
                return false
            }
        };
        
        /**
         *  Set height
        */
        data.setHeight = function( v ){
            var rv = convert( v );
            var base = data.parts.base;
            
            if( rv === false || !base )
                return false;
            
            if( typeof rv === 'string' ){
                base.style.height = rv;
                data.height = rv;
            }
            else if( typeof rv === 'number' 
                && ( data.maxHeight === null || rv <= data.maxHeight )
                && ( data.minHeight === null || rv >= data.minHeight )
            ){
                base.style.height = rv + 'px';
                data.height = rv;
            }
            else{
                return false;
            }
        };
        
        /**
         *  Set top
        */
        data.setTop = function( v ){
            var rv = convert( v );
            var base = data.parts.base;
            
            if( rv === false || !base )
                return false;
            
            if( typeof rv === 'string' ){
                base.style.top = rv;
                data.top = rv;
            }
            else if( typeof rv === 'number'
                && ( data.maxTop === null || rv <= data.maxTop )
                && ( data.minTop === null || rv >= data.minTop )
            ){
                base.style.top = rv + 'px';
                data.top = rv;
            }
            else{
                return false;
            }
        };
        
        /**
         *  Set left
        */
        data.setLeft = function( v ){
            var rv = convert( v );
            var base = data.parts.base;
            
            if( rv === false || !base )
                return false;
            
            if( typeof rv === 'string' ){
                base.style.left = rv;
                base.left = rv;
            }
            else if( typeof rv === 'number' 
                && ( data.maxLeft === null || rv <= data.maxLeft )
                && ( data.minLeft === null || rv >= data.minLeft )
            ){
                base.style.left = rv + 'px';
                data.left = rv;
            }
            else{
                return false;
            }
        };
        
        /**
         *  Set closable
        */
        data.setClosable = function( v ){
            if( typeof v === 'boolean' )
                data.movable = v;
            else
                return false;
        }
        
        /**
         *  Set movable
        */
        data.setMovable = function( v ){
            if( typeof v === 'boolean' )
                data.movable = v;
            else
                return false;
        };
        
        /**
         *  Set resizable
        */
        data.setResizable = function( v ){
            if( typeof v === 'boolean' )
                data.resizable = v;
            else
                return false;
        };
        
        /**
         *  Set restorable
        */
        data.setRestorable = function( v ){
            if( typeof v === 'boolean' )
                data.restorable = v;
            else
                return false;
        };
        
        /**
         *  Set maximizable
        */
        data.setMaximizable = function( v ){
            if( typeof v === 'boolean' )
                data.maximizable = v;
            else
                return false;
        };
        
        /**
         *  Set minimizable
        */
        data.setMinimizable = function( v ){
            if( typeof v === 'boolean' )
                data.minimizable = v;
            else
                return false;
        };
        
        /**
         *  Set fixable
        */
        data.setFixable = function( v ){
            if( typeof v === 'boolean' )
                data.fixable = v;
            else
                return false;
        };
        
        /**
         *  Set unfixable
        */
        data.setUnfixable = function( v ){
            if( typeof v === 'boolean' )
                data.unfixable = v;
            else
                return false;
        };
        
        /**
         *  Set max width
        */
        data.setMaxWidth = function( v ){
            if( typeof v === 'number' || v === null )
                data.maxWidth = v;
            else
                return false;
        };
        
        /**
         *  Set min width
        */
        data.setMinWidth = function( v ){
            if( typeof v === 'number' || v === null )
                data.minWidth = v;
            else
                return false;
        };
        
        /**
         *  Set max height
        */
        data.setMaxHeight = function( v ){
            if( typeof v === 'number' || v === null )
                data.maxHeight = v;
            else
                return false;
        };
        
        /**
         *  Set min height
        */
        data.setMinHeight = function( v ){
            if( typeof v === 'number' || v === null )
                data.minHeight = v;
            else
                return false;
        };
        
        /**
         *  Set max top
        */
        data.setMaxTop = function( v ){
            if( typeof v === 'number' || v === null )
                data.maxTop = v;
            else
                return false;
        };
        
        /**
         *  Set min top
        */
        data.setMinTop = function( v ){
            if( typeof v === 'number' || v === null )
                data.minTop = v;
            else
                return false;
        };
        
        /**
         *  Set max left
        */
        data.setMaxLeft = function( v ){
            if( typeof v === 'number' || v === null )
                data.maxLeft = v;
            else
                return false;
        };
        
        /**
         *  Set min left
        */
        data.setMinLeft = function( v ){
            if( typeof v === 'number' || v === null )
                data.minLeft = v;
            else
                return false;
        };
        
        /**
         *  Set maximize width
        */
        data.setMaximizeWidth = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.maximizeWidth = rv;
            else
                return false;
        };
        
        /**
         *  Set maximize height
        */
        data.setMaximizeHeight = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.maximzieHeight = rv;
            else
                return false;
        };
        
        /**
         *  Set maximize top
        */
        data.setMaximizeTop = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.maximizeTop = rv;
            else
                return false;
        };
        
        /**
         *  Set maximzie left
        */
        data.setMaximizeLeft = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.maximizeLeft = rv;
            else
                return false;
        };
        
        /**
         *  Set minimize width
        */
        data.setMinimizeWidth = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.minimizeWidth = rv;
            else
                return false;
        };
        
        /**
         *  Set minimize height
        */
        data.setMinimizeHeight = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.minimizeHeight = rv;
            else
                return false;
        };
        
        /**
         *  Set minimize top
        */
        data.setMinimizeTop = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.minimizeTop = rv;
            else
                return false;
        };
        
        /**
         *  Set minimize left
        */
        data.setMinimizeLeft = function( v ){
            var rv = convert( v );
            if( rv !== false )
                data.minimizeLeft = rv;
            else
                return false;
        };
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
            useCapture = false;
        
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
     *  Fit style
     * 
     *  @param  number v
     *  @return string
    */
    var fitStyle = function( v ){
        if( typeof v === 'number' )
            v += 'px';
        return v;
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
})();