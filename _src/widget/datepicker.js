/**
 * @file 日历组件
 * @name Datepicker
 * @desc 日历组件, 可以用来作为日期选择器。
 * @import core/zepto.extend.js, core/zepto.ui.js, core/zepto.highlight.js
 */
(function ($, undefined) {
    var monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
            "07月", "08月", "09月", "10月", "11月", "12月"],
        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        tpl = '<div class="ui-datepicker-header">' +
            '<a class="ui-datepicker-prev" href="#"><%=prevText%></a>' +
            '<div class="ui-datepicker-title"><%=year%>年<%=month%></div>' +
            '<a class="ui-datepicker-next" href="#"><%=nextText%></a>' +
            '</div>',
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,
        //获取月份的天数
        _getDaysInMonth = function (year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },
        //获取月份中的第一天是所在星期的第几天
        _getFirstDayOfMonth = function (year, month) {
            return new Date(year, month, 1).getDay();
        };

    //@todo 支持各种格式
    $.datepicker = {
        parseDate:function (obj) {
            if ($.isDate(obj))return obj;
            return new Date(obj);
        },
        formatDate:function (date) {
            var formatNumber = $.datepicker.formatNumber;
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        },
        formatNumber:function (val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        }
    }

    function slideUpFrame(div, okcb, nocb){
        this.id = slideUpFrame.id = (slideUpFrame.id || 0) + 1;
        this.div = div;
        this.divHolder = div.parent();
        this.okcb = okcb;
        this.nocb = nocb;
        this._init();
    }
    $.extend(slideUpFrame.prototype, {
        _init : function(){
            var header;
            this.root = $('<div class="ui-slideup"><div class="header"></div><div class="frame"></div></div>');
            this.frame = $('.frame', this.root).append(this.div);
            header = $('.header', this.root);
            this.okcb && header.append('<a class="ok-btn" href="javascript:void(0)">Done</a>');
            this.nocb && header.append('<a class="no-btn" href="javascript:void(0)">Cancel</a>');
            this.open();
        },
        refresh: function(cb){
            var me = this;
            this.root.css({
                top: (window.innerHeight + window.pageYOffset) + 'px'
            }).appendTo(document.body).animate({
                translateY: '-'+this.root.height()+'px',
                translateZ: '0'
            }, 400, 'ease-out', function(){
                cb && cb.apply(me, [this]);
            });
        },
        open: function(){
            var me = this, count = slideUpFrame.openCount = ( slideUpFrame.openCount || 0) +1;
            if(count==1){
                $(document).on('touchmove.slideup', function(e){e.preventDefault()});
            }
            this.refresh(function(){
                me.root.on('click.slideup'+me.id, '.ok-btn, .no-btn', function(){
                    var ok = $(this).is('.ok-btn');
                    me[(ok?'ok':'no')+'cb'].apply(me)!==false && me.close();
                }).find('.ok-btn, .no-btn').highlight('ui-state-hover');
            });
        },
        close: function(cb){
            var me =this, count = slideUpFrame.openCount = slideUpFrame.openCount - 1;
            this.root.off('click.slideup'+this.id).animate({
                translateY: '0',
                translateZ: '0'
            }, 200, 'ease-out', function(){
                cb && cb();
                me.divHolder.append(me.div);
                me.root.remove();
                if(count==0){
                    $(document).off('touchmove.slideup');
                }
            }).find('.ok-btn, .no-btn').highlight();
        }
    });


    /**
     * @name $.ui.datepicker
     * @grammar $.ui.datepicker(options) ⇒ instance
     * @grammar datepicker(options) ⇒ self
     * @desc **Options**
     * - ''date'' {Date|String}: (可选，默认：today) 初始化日期
     * - ''firstDay'' {Number}: (可选，默认：1)  设置新的一周从星期几开始，星期天用0表示, 星期一用1表示, 以此类推.
     * - ''minDate'' {Date|String}: (可选，默认：null)  设置可以选择的最小日期
     * - ''maxDate'' {Date|String}: (可选，默认：null)  设置可以选择的最大日期
     * - ''container'' {selector}: (可选，默认：null)  当selector为input时，默认在input后面创建一个div存放datepicker，可以手动指定.
     * - ''gap'' {Boolean}: (可选，默认：true)  如果为true，星期条与天数列表之间有5px的间隙。否则没有。
     * - ''events'' 所有[Trigger Events](#datepicker_triggerevents)中提及的事件都可以在此设置Hander, 如init: function(e){}。
     *
     * **Demo**
     * <codepreview href="../gmu/_examples/widget/datepicker/datepicker.html">
     * ../gmu/_examples/widget/datepicker/datepicker.html
     * </codepreview>
     */
    $.ui.define('datepicker', {
        _data:{
            date:null, //默认日期
            firstDay:1, //星期天用0表示, 星期一用1表示, 以此类推.
            maxDate:null, //可以选择的日期范围
            minDate:null,
            container:null, //如果为非inline模式，且不想再input的下面直接生成结构那就指定container.
            gap:true//是否显示间隙，星期列表与天数列表之间
        },

        _init:function () {
            var data = this._data, el = this.root(), eventHandler = $.proxy(this._eventHandler, this);
            this.date(data.date || (!data._inline && el.val() ? $.datepicker.parseDate(el.val()) : null) || new Date())
                .minDate(data.minDate)
                .maxDate(data.maxDate)
                .refresh();
            data._container.addClass('ui-datepicker').on('click', eventHandler).highlight();
            if (!data._inline) {
                el.on('click', eventHandler);
                data._container.hide().on('swipeLeft swipeRight', eventHandler);
                $(window).on('ortchange', eventHandler);
            }else data._isShow = true;
            data._inited = true;
        },

        _setup:function () {
            var data = this._data, el = this.root();
            data._inline = !el.is('input');
            data._container = data._inline ? el : $(data.container || ($('<div></div>').appendTo(document.body)));
        },

        _create:function () {
            throw new Exception("此组件不支持render模式");
        },

        _eventHandler:function (e) {
            var match, me = this, data = me._data, root = data._container, target,
                cell;
            switch(e.type){
                case 'swipeLeft':
                case 'swipeRight':
                    me.goTo((e.type == 'swipeRight' ? '-' : '+') + '1M');
                    break;
                case 'ortchange':
                    return data._frame && data._frame.refresh();;
                    break;
                default:
                    target = e.target;
                    if(!data._inline && me._isFrom(target, me.root())){
                        me.root().blur();
                        this.toggle();
                        e.preventDefault();
                    } else if ((match = $(target).closest('.ui-datepicker-calendar tbody a', root.get(0))) && match.length) {
                        e.preventDefault();
                        cell = match.parent();
                        this.selectedDate(new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));
                        data._inline && this._commit();
                        this.refresh();
                    } else if ((match = $(target).closest('.ui-datepicker-prev, .ui-datepicker-next', root.get(0))) && match.length) {
                        e.preventDefault();
                        $.later(function(){
                            me.goTo((match.is('.ui-datepicker-prev') ? '-' : '+') + '1M');
                        });
                    }
            }
        },

        _generateHTML:function () {
            var data = this._data, html = '', thead, tbody, i, j, firstDay, day, leadDays, daysInMonth, rows,
                printDate, drawYear = data._drawYear, drawMonth = data._drawMonth, otherMonth, unselectable,
                tempDate = new Date(), today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()),
                minDate = this.minDate(), maxDate = this.maxDate(), selectedDate = this.selectedDate();

            firstDay = parseInt(data.firstDay, 10);
            firstDay = (isNaN(firstDay) ? 0 : firstDay);

            html += $.parseTpl(tpl, {
                prevText:'&lt;&lt;',
                nextText:'&gt;&gt;',
                year:data._drawYear,
                month:monthNames[data._drawMonth]
            });

            thead = '<thead><tr>';
            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;
                thead += '<th' + ((i + firstDay + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }
            thead += '</thead></tr>';

            tbody = '<tbody>';
            tbody += data.gap ? '<tr class="ui-datepicker-gap"><td colspan="7">&#xa0;</td></tr>' : '';
            daysInMonth = _getDaysInMonth(drawYear, drawMonth);
            leadDays = (_getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);
            for (i = 0; i < rows; i++) {
                tbody += '<tr>';
                for (j = 0; j < 7; j++) {
                    otherMonth = (printDate.getMonth() !== drawMonth);
                    unselectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
                    tbody += "<td class='" +
                        ((j + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
                        (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
                        (unselectable ? " ui-datepicker-unselectable ui-state-disabled" : "") + // highlight unselectable days
                        (otherMonth || unselectable ? '' :
                            (printDate.getTime() === selectedDate.getTime() ? " ui-datepicker-current-day" : "") + // highlight selected day
                                (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")
                            ) + "'" + // highlight today (if different)
                        (unselectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
                        (otherMonth ? "&#xa0;" : // display for other months
                            (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                                (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                                (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
                    printDate.setDate(printDate.getDate() + 1);
                }
                tbody += '</tr>';
            }
            tbody += '</tbody>';
            html += '<table  class="ui-datepicker-calendar">' + thead + tbody + '</table>';
            return html;
        },

        _isFrom:function (target, parent) {
            var ret = false, data = this._data;
            $.each(parent?parent:(this._el.add(data._container)), function () {
                if (this === target || $.contains(this, target)) {
                    ret = true;
                    return false;
                }
            });
            return ret;
        },

        _commit: function(){
            var data = this._data, date, dateStr = $.datepicker.formatDate(date = this.selectedDate());
            data._inline || this.root().val(dateStr);
            data.date = date;
            data._inited && this.trigger('valuecommit', [date, dateStr, this]);
            return this;
        },

        /**
         * @name open
         * @grammar open() ⇒ instance
         * @desc 显示组件
         */
        open:function () {
            var data = this._data, me = this, date = this.date();
            if (data._isShow)return this;
            data._isShow = true;
            date && this.selectedDate(date);
            this.refresh();
            data._frame = new slideUpFrame(data._container.show(), function(){
                me.close();
                me._commit();
                return false;
            }, function(){
                me.close();
                return false;
            });
            return this.trigger('open', this);
        },

        /**
         * @name close
         * @grammar close() ⇒ instance
         * @desc 隐藏组件
         */
        close:function () {
            var data = this._data, me = this, eventData;
            if (!data._isShow)return this;
            this.trigger(eventData = $.Event('beforeclose'), this);
            if(eventData.defaultPrevented)return this;
            data._isShow = false;
            data._frame.close(function(){
                data._container.hide();
                me.trigger('close');
            });
            data._frame = null;
            return me;
        },

        /**
         * @name toggle
         * @grammar toggle() ⇒ instance
         * @desc 切换组件的显示与隐藏
         */
        toggle:function () {
            var data = this._data;
            return this[data._isShow?'close':'open']();
        },

        /**
         * @name option
         * @grammar option(key[, value]) ⇒ instance
         * @desc 设置或获取Option，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        option:function (key, val) {
            var data = this._data, date;
            if (val !== undefined) {
                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        data[key] = val ? $.datepicker.parseDate(val) : null;
                        break;
                    case 'selectedDate':
                        val = $.datepicker.parseDate(val);
                        data._selectedYear = data._drawYear = val.getFullYear();
                        data._selectedMonth = data._drawMonth = val.getMonth();
                        data._selectedDay = val.getDate();
                        data._inited && this.trigger('select', [this.selectedDate(), this]);
                        break;
                    case 'date':
                        this.option('selectedDate', val);
                        this._commit();
                        break;
                    case 'gap':
                        data[key] = val;
                        break;
                }
                data._invalid = true;
                return this;
            }
            return key == 'selectedDate' ? new Date(data._selectedYear, data._selectedMonth, data._selectedDay) : data[key];
        },

        /**
         * @name maxDate
         * @grammar maxDate([value]) ⇒ instance
         * @desc 设置或获取maxDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        maxDate:function (val) {
            return this.option('maxDate', val);
        },

        /**
         * @name minDate
         * @grammar minDate([value]) ⇒ instance
         * @desc 设置或获取minDate，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        minDate:function (val) {
            return this.option('minDate', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前date，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        date:function (val) {
            return this.option('date', val);
        },

        /**
         * @name date
         * @grammar date([value]) ⇒ instance
         * @desc 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#datepicker_refresh)方法。
         */
        selectedDate:function (val) {
            return this.option('selectedDate', val);
        },

        /**
         * @name goTo
         * @grammar goTo(month, year) ⇒ instance
         * @grammar goTo(str) ⇒ instance
         * @desc 使组件显示某月，当第一参数为str可以+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         */
        goTo:function (month, year) {
            var data = this._data, offset, period, tmpDate, minDate = this.minDate(), maxDate = this.maxDate();
            if ($.isString(month) && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = data._drawMonth + (period == 'm' ? offset : 0);
                year = data._drawYear + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }
            tmpDate = new Date(year, month, 1);
            tmpDate = minDate && minDate>tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate: tmpDate;//不能跳到不可选的月份
            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();
            if(month!=data._drawMonth || year!=data._drawYear){
                this.trigger('changemonthyear', [data._drawMonth = month, data._drawYear = year]);
                data._invalid = true;
                data._isShow && this.refresh();
            }
            return this;
        },

        /**
         * @name refresh
         * @grammar refresh() ⇒ instance
         * @desc 当修改option后需要调用此方法。
         */
        refresh:function () {
            var data = this._data;
            if (!data._invalid) {
                return;
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight();
            data._container.empty().append(this._generateHTML());
            $('.ui-datepicker-calendar td:not(.ui-state-disabled), .ui-datepicker-header a', data._container).highlight('ui-state-hover');
            data._frame && data._frame.refresh();
            data._invalid = false;
            return this;
        },

        /**
         * @desc 销毁组件。
         * @name destroy
         * @grammar destroy()  ⇒ instance
         */
        destroy:function () {
            var data = this._data, eventHandler = this._eventHandler;
            if (!data._inline) {
                this.root().off('click', eventHandler);
                $(document).off('click.'+this.id());
                $(window).off('ortchange', eventHandler);
                data._container.on('swipeLeft swipeRight', eventHandler);
            }
            $('.ui-datepicker-calendar td:not(.ui-state-disabled)', data._container).highlight();
            data._container.remove();
            return this.$super('destroy');
        }

        /**
         * @name Trigger Events
         * @theme event
         * @desc 组件内部触发的事件
         *
         * ^ 名称 ^ 处理函数参数 ^ 描述 ^
         * | init | event | 组件初始化的时候触发，不管是render模式还是setup模式都会触发 |
         * | open | event, ui | 当组件显示后触发 |
         * | close | event, ui | 当组件隐藏后触发 |
         * | beforeclose | event, ui | 组件隐藏之前触发，可以通过e.preventDefault()来阻止 |
         * | select | event, date, ui | 选中日期的时候触发 |
         * | valuecommit | event, date, dateStr, ui | 当被设置日期后触发date为ate对象, dateStr为日期字符串|
         * | destory | event | 组件在销毁的时候触发 |
         */
    });
})(Zepto);