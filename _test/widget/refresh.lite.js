module("widget/refresh.lite",{
    setup:function () {
        var html = '<div class="wrapper">' +
            '<ul class="data-list">' +
            '<li>测试数据1</li>' +
            '<li>测试数据2</li>' +
            '<li>测试数据3</li>' +
            '<li>测试数据4</li>' +
            '<li>测试数据5</li>' +
            '<li>测试数据6</li>' +
            '<li>测试数据7</li>' +
            '<li>测试数据8</li>' +
            '<li>测试数据9</li>' +
            '<li>测试数据10</li>' +
            '</ul> ' +
            '</div> ';

        $('body').append(html);
    },
    teardown: function () {
        $('.wrapper').remove();
    }
});

function createDom (dir, $wrapper, w) {
    var w = w || window,
    	$wrapper = $wrapper || w.$('.wrapper'),
        upBtn = '<div class="ui-refresh-up"></div> ',
        downBtn = '<div class="ui-refresh-down"></div> ';
    switch (dir) {
        case 'up':
            $wrapper.prepend(upBtn);
            break;
        case 'down':
            $wrapper.append(downBtn);
            break;
        case 'both':
            $wrapper.prepend(upBtn);
            $wrapper.append(downBtn);
            break;
    }
};

//test
test("只为加载css用",function(){
    expect(1);
    stop();
    ua.loadcss(["reset.css",  "loading.default.css", "widget/refresh/refresh.default.css"], function(){
        ok(true, '样式加载进来了！');
        start();
    });
});

test('down-上拉加载', function () { //refresh_lite只支持上拉
    createDom('down');
    expect(8);

    var $wrapper = $('.wrapper'),
        refresh = $wrapper.refresh({
            ready: function (dir, type) {
            	equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载中...", "label元素的文字内容正确");
            	ok(ua.isShown($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon')[0]), "icon显示");
                ok($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').hasClass("ui-loading"), "icon 样式正确");
                
                refresh.afterDataLoading();
                
                equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
                ok(!ua.isShown($wrapper.find('.ui-refresh-down').find('.ui-refresh-icon')[0]), "icon隐藏");
                ok(!$wrapper.find('.ui-refresh-down').find('.ui-refresh-icon').hasClass("ui-loading"), "icon 样式正确");
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;

    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "加载更多", "label元素的文字内容正确");
    
    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t-100
        }]
    });
    
    equals($wrapper.find('.ui-refresh-down').find('.ui-refresh-label').text(), "松开立即加载", "label元素的文字内容正确");
    
    ta.touchend(target);
});

test("参数options - statechange", function(){
    createDom('down');
    expect(4);

    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
        	ready: function(){
        		refresh.afterDataLoading();
                refresh.disable();
        	},
            statechange: function(e, $btn, state, dir){
                count++;
                switch(state){
                    case 'beforeload':
                        ok(true, "refresh即将加载！方向:"+dir);
                        break;
                    case 'loaded':
                        ok(true, "refresh取消加载！方向:"+dir);
                        break;
                    case 'loading':
                        ok(true, "refresh正在加载！方向:"+dir);
                        break;
                    case 'disable':
                        ok(true, "refresh被禁用了！方向:"+dir);
                        break;
                    default:
                        break;
                }
            }
        }).refresh('this'),
        target = $wrapper.get(0);

    var l = $(target).offset().left + 10;
    var t = $(target).offset().bottom -10;
    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t-200
        }]
    });

    ta.touchend(target);
});

test("参数 － 不传threshold(list高度小于屏幕高度一半)", function(){
    createDom('down');
    expect(1);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
            ready: function(){
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 0);
            	ok(true, "ready 被触发");      
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left;
    var t = $(target).offset().top;
    var h = $wrapper.height();

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t + h/2 - 1
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t + h/2 - 1 - 100
        }]
    });

    ta.touchend(target);
    
    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: t + h/2 + 1
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: t + h/2 + 1 - 100
	        }]
	    });

	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test("参数 － 不传threshold(list高度大于屏幕高度一半)", function(){
    createDom('down');
    expect(1);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        html = '';
    for(var i = 0; i < 100; i++){
    	html += '<li>测试数据 ' + i + '</li>';
    }
    lis.append(html);
    
    var count = 0,
        refresh = $wrapper.refresh({
            ready: function(){
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 0);
            	ok(true, "ready 被触发");      
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left;
    var winHeight = window.innerHeight;
    var s = document.body.scrollHeight - winHeight;

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: s + winHeight/2 - 1
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: s + winHeight/2 - 1 - 100
        }]
    });

    ta.touchend(target);
    
    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: s + winHeight/2 + 1
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: s + winHeight/2 + 1 - 100
	        }]
	    });

	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test("参数 － 传threshold", function(){
    createDom('down');
    expect(1);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
        	threshold: 150,
            ready: function(){
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 0);
            	ok(true, "ready 被触发");      
            }
        }).refresh('this'),
        target = $wrapper.get(0);
   
    var l = $(target).offset().left;
    
    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: 149
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: 149 - 100
        }]
    });

    ta.touchend(target);
    
    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: 151
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: 151 - 100
	        }]
	    });

	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test("公共方法 － enable&disable", function(){
    createDom('down');
    expect(2);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
            ready: function(){
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 0);
            	ok(true, "ready 被触发");      
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;
    target.scrollTop = 0;
    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t -200
        }]
    });

    ta.touchend(target);
   
    setTimeout(function(){
    	refresh.disable('down');
        
        ta.touchstart(target, {
            touches:[{
                pageX: l,
                pageY: t
            }]
        });
        ta.touchmove(target, {
            touches:[{
                pageX: l,
                pageY: t -200
            }]
        });

        ta.touchend(target);
        
    	setTimeout(function(){
    		refresh.enable();

    	    ta.touchstart(target, {
    	        touches:[{
    	            pageX: l,
    	            pageY: t
    	        }]
    	    });
    	    ta.touchmove(target, {
    	        touches:[{
    	            pageX: l,
    	            pageY: t -200
    	        }]
    	    });

    	    ta.touchend(target);
    	    
    	    setTimeout(function(){
    	    	start();
    	    }, 10);
    	}, 10);
    },10);
});

test("交互 － 加载过程中不响应滑动动作", function(){
    createDom('down');
    expect(1);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
            ready: function(){
            	ok(true, "ready 被触发");    
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t -200
        }]
    });

    ta.touchend(target);
    
    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: t
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: t -200
	        }]
	    });

	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test("交互 － 滑动距离小于10px不响应", function(){
    createDom('down');
    expect(1);
    stop();
    
    var $wrapper = $('.wrapper'),
        lis = $wrapper.find('li'),
        count = 0,
        refresh = $wrapper.refresh({
            ready: function(){
            	setTimeout(function(){
            		refresh.afterDataLoading();
            	}, 0);
            	ok(true, "ready 被触发");      
            }
        }).refresh('this'),
        target = $wrapper.get(0);
    
    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t - 9
        }]
    });

    ta.touchend(target);
    
    setTimeout(function(){
    	ta.touchstart(target, {
	        touches:[{
	            pageX: l,
	            pageY: t
	        }]
	    });
	    ta.touchmove(target, {
	        touches:[{
	            pageX: l,
	            pageY: t - 11
	        }]
	    });

	    ta.touchend(target);
	    
	    setTimeout(function(){
	    	start();
	    }, 10);
    }, 10);
});

test('参数disablePlugin:true', function () {
    createDom('down');
    expect(1);
    stop();

    var $wrapper = $('.wrapper'),
        refresh = $wrapper.refresh({
        	disablePlugin: true,
            ready: function (dir, type) {
                ok(true, 'ready is triggered');
            }
        }).refresh('this'),
        target = $wrapper.get(0);
   
    var l = $(target).offset().left+10;
    var t = $(target).offset().bottom-10;

    ta.touchstart(target, {
        touches:[{
            pageX: l,
            pageY: t
        }]
    });
    ta.touchmove(target, {
        touches:[{
            pageX: l,
            pageY: t-100
        }]
    });
    ta.touchend(target);

	ok(true);
	start();

});

test("destroy", function(){
    ua.destroyTest(function(w,f){
    	var dl1 = w.dt.domLength(w);
        var el1= w.dt.eventLength();

    	var html = '<div class="wrapper"><ul class="data-list"><li>测试数据1</li></ul></div>';
    	w.$('body').append(html);
    	createDom('up', null, w);
    	
        var refresh = w.$(".wrapper").refresh("this");
        refresh.destroy();

        var el2= w.dt.eventLength();
        var ol = w.dt.objLength(refresh);
        var dl2 =w.dt.domLength(w);

        equal(dl1,dl2 - 1,"The dom is ok");
        equal(el1,el2,"The event is ok");
        ok(ol==0,"The gotop is destroy");
        this.finish();
    });
});