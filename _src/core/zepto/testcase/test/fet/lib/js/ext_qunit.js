var testingElement = {}, te = testingElement;
te.dom = [];
te.obj = [];
te.log = function ( url ) {
    var img = new Image(),
        key = 'tangram_sio_log_' + Math.floor( Math.random() * 2147483648 ).toString( 36 );

    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = function () {
        // 下面这句非常重要
        // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
        // 则在gif动画播放过程中，img会多次触发onload
        // 因此一定要清空
        img.onload = img.onerror = img.onabort = null;

        window[key] = null;

        // 下面这句非常重要
        // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
        // 因此这里一定要置为null
        img = null;
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    img.src = url;
};

te.isMTN = function () {
    return /platform=mtn/.test(location.search);
}

te.autoshot = function () {
    if (te.isMTN()) {
        setTimeout(function () {
            $J.getJSON("http://127.0.0.1:8800", "cmd=autoshot");
        }, 200);
    }


}
te.screenshot = function (casename, callback) {
    if (te.isMTN()) {
        $J.getJSON("http://127.0.0.1:8800", "cmd=screenshot&cn=" + casename, setTimeout(function () {
            callback()
        }, 200));
    }
};

te.killbrow = function (callback) {
    if (te.isMTN()) {
        $J.getJSON("http://127.0.0.1:8800", "cmd=killbrowser", setTimeout(function () {
            callback()
        }, 1000));
    }
};

te.exit = function (callback) {
    $J.getJSON("http://127.0.0.1:8800", "cmd=exit", setTimeout(function () {
        if (callback)callback()
    }, 1000));
};
/**
 * 重载QUnit部分接口实现批量执行控制功能
 */
(function () {
    if ( !QUnit )
        return;
    var d = QUnit.done, s = QUnit.testStart, td = QUnit.testDone, st = QUnit.start;
    top.window.tr = top.window.tr || {};

    var startTime;
    QUnit.start = function () {
        startTime = new Date().getTime();
        st.apply( this, arguments );
    }

    function _d( args /* failures, total */ ) {

        var failed = args[0];
        var allnum = failed + args[1];
        var title = parent.window.document.title;
        //存放全局的覆盖率信息
//                parent.window.covinfo[title] = window._$jscoverage;
        title = title.split( '.' ).join( '/' );
        top.window.tr[title] = failed + "," + allnum + ",_," + startTime + "," + new Date().getTime();
        //默认展开失败用例
                $J( 'li.fail ol' ).toggle();

        if ( parent && parent.brtest ) {
            parent.$J( parent.brtest ).trigger( 'done', [ new Date().getTime(), {
                failed:args[0],
                passed:args[1],
                detail:args[2]
            }, window._$jscoverage || null ] );
        }
    }

    function myTeardown() {
        if ( te ) {
            if ( te.dom && te.dom.length ) {
                for ( var i = 0; i < te.dom.length; i++ )
                    if ( te.dom[i] && te.dom[i].parentNode ) {
                        te.dom[i].parentNode.removeChild( te.dom[i] );
                    }

            }
            if ( te.obj && te.obj.length ) {
                for ( i = 0; i < te.obj.length; i++ )
                    if ( te.obj[i] && te.obj[i].dispose ) {
                        te.obj[i].dispose();
                    }

            }
            te.dom = [];
            te.obj = [];
        }
    }

    QUnit.testStart = function () {
        s.apply( this, arguments );
//        _mySetup();
    }
    QUnit.testDone = function () {
        td.call( this, arguments );
        myTeardown();
    }
    QUnit.done = function () {
        _d( arguments );
        d.apply( this, arguments );
    };
    
    //扩展断言 start
    approximateEqual = function(actual, expected, difference, message){
    	QUnit.ok(Math.abs(actual - expected) <= (difference || 1), message);
    };
    same = function(expected, actual, message) {
        var expectedKeyCount = 0, actualKeyCount = 0, key, passed = true
        for (key in expected) expectedKeyCount++
        for (key in actual) actualKeyCount++

        if (expectedKeyCount == actualKeyCount)
          for (key in expected)
            passed &= expected[key] == actual[key]
        else
          passed = false

          QUnit.ok(passed, message);
    };
    assertTrue = function(test, message) {
    	QUnit.ok(test === true, message);
    };
    assertFalse = function(test, message) {
    	QUnit.ok(test === false, message);
    };
    assertLength = function(expected, object, message) {
        var actual = object.length;
        QUnit.ok(expected === actual, message);
    };
    assertEqualCollection = function(expectedCollection, actualCollection, message) {
        var expected = expectedCollection, actual = actualCollection,
            passed = expected.length == actual.length

        if (typeof expected.get == 'function') expected = expected.get()
        if (typeof actual.get == 'function') actual = actual.get()

        if (passed) for (var i=0; i<expected.length; i++) passed &= expected[i] == actual[i]
        
        QUnit.ok(passed, message);
    };
    assertIn = function(property, object, message) {
    	QUnit.ok(property in object, message);
    };
    assertNot = function(test, message) {
    	QUnit.ok(!test, message);
    };
    assertNull = function(test, message) {
    	QUnit.ok(test === null, message);
    };
    assertUndefined = function(test, message) {
    	QUnit.ok(typeof test === 'undefined', message);
    };
    refuteIdentical = function(expected, actual, message) {
    	QUnit.ok(expected !== actual, message);
    };
	assertEqual = function(expected, actual, message) {
		result = expected == actual;
		message = message || (result ? "okay" : "failed");
	    QUnit.ok( result, result ? message + ": " + expected : message + ", expected: " + QUnit.jsDump.parse(expected) + " result: " + QUnit.jsDump.parse(actual) );
	};
    refute = function(test, message){
        QUnit.ok(!test, message);
    };
	refuteEqual = function(expected, actual, message) {
		QUnit.ok(expected != actual, message);
	};
	assertIdentical = function(expected, actual, message) {
		result = expected === actual;
		message = message || (result ? "okay" : "failed");
	    QUnit.ok( result, result ? message + ": " + expected : message + ", expected: " + QUnit.jsDump.parse(expected) + " result: " + QUnit.jsDump.parse(actual) );
	};
    isObjectEquals = function (obj1, obj2) {
        for (var key in obj1) {
            switch( typeof( obj1[key] ) ) {
                case 'object':
                    if ( !isObjectEquals( obj1[key], obj2[key] ) ) {
                        return false
                    }
                    break
                case 'function':
                    if (
                        typeof( obj2[key] ) == 'undefined' ||
                            ( obj1[key].toString() != obj2[key].toString() )
                        ) {
                        return false
                    }
                    break
                default:
                    if ( obj1[key] != obj2[key] ) {
                        return false
                    }
            }
        }
        for (key in obj2) {
            if (typeof( obj1[key] ) == 'undefined') {
                return false
            }
        }
        return true
    };
    assertEqualObject = function(expected, actual, message) {
    	result = this.isObjectEquals(expected, actual);
        QUnit.ok( result, result ? message + ": " + expected : message + ", expected: " + QUnit.jsDump.parse(expected) + " result: " + QUnit.jsDump.parse(actual) );
    };
})();

var test = function ( descript, src, callback ) {
    if ( typeof src == "function" ) {
        callback = src;
        QUnit.test( descript, src );
    } else if ( typeof src == "string" ) {
        QUnit.test( descript, function () {
            stop();
            var iframe = document.createElement( 'iframe' );
            iframe.id = "appIframe";
            iframe.src = src;
            document.body.appendChild( iframe );
            iframe.width = document.body.scrollWidth;
            iframe.height = document.body.scrollHeight;
            iframe.onload = function () {
                var win = iframe.contentWindow;
                var doc = win.document;
                this.onload = null;
                callback( win, doc );
               
            };
        } );
    }

};