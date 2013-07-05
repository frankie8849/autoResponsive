/*
combined files : 

gallery/autoResponsive/1.0/config
gallery/autoResponsive/1.0/anim
gallery/autoResponsive/1.0/linkedlist
gallery/autoResponsive/1.0/gridsort
gallery/autoResponsive/1.0/base
gallery/autoResponsive/1.0/plugin/hash
gallery/autoResponsive/1.0/plugin/drag
autoResponsive/1.0/plugin/loader
gallery/autoResponsive/1.0/index

*/
/**
 * @Description:    网页自适应布局全局配置模块
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/config', function () {
    'use strict';
    var EMPTY = '';

    /**
     * @name config
     * @param {String}  container   外层容器
     * @param {String}  selector    生效选择器
     * @param {String}  filter      过滤选择器
     * @param {String}  priority    优先排序选择器
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {Object}  colMargin   单元格边距设置
     * @param {Boolean} animate     动画效果开关
     * @param {Number}  duration    动画缓动时间
     * @param {String}  easing      动画缓动算子
     * @param {Number}  colWidth    最小栅格单元设置px
     * @param {String}  direction   排序方向,可以选择right
     * @param {Boolean} random      随机顺序开关
     * @param {Boolean} autoHeight  容器高度自适应开关
     * @param {Boolean} async       动画队列异步开关
     */
    function Config() {
        return {
            container: {value: EMPTY},
            selector: {value: EMPTY},
            filter: {value: EMPTY},
            fixedSelector: {value: EMPTY},
            priority: {value: EMPTY},
            colWidth: {value: 10},
            colMargin: {value: {x: 0, y: 0}},
            animate: {value: true},
            duration: {value: 1},
            easing: {value: 'easeNone'},
            direction: {value: 'left'},
            random: {value: false},
            sort: {value: EMPTY},
            layout: {value: EMPTY},
            autoHeight: {value: true},
            resize: {value: true},
            init: {value: true},
            plugin: {value: []},
            async: {value: false},
            cache: {value: false},
            resizeFrequency: {value: 200} // 注意：写成resizeFrequency: 200形式，通过kissy的get方法获取的值为undefined
        };
    }

    return Config;
});
/**
 * @Description: 兼容css3和低版本浏览器动画效果
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/anim', function (S) {
    'use strict';
    var D = S.DOM, Anim = S.Anim, BLANK = ' ';

    /**
     * @name AutoAnim
     * @class css动画，采用帧重复
     * @constructor
     */
    function AutoAnim(cfg) {
        var self = this;
        S.mix(self, cfg);
        self.notSupport = S.UA.ie < 11 || self.direction == 'right';
        self._init();
    }

    S.augment(AutoAnim, {
        _init: function () {
            var self = this;
            if (!self.animate) {
                self.noneAnim();
                return;
            }
            self.notSupport ? self.fixedAnim() : self.css3Anim();
        },
        /**
         * css3动画
         */
        cssPrefixes: function (styleKey, styleValue) {
            var fixedRule = {};
            S.each('-webkit- -moz- -o- -ms-  '.split(BLANK), function (i) {
                fixedRule[i + styleKey] = styleValue;
            });
            return fixedRule;
        },
        css3Anim: function () {
            /**
             * css3效果代码添加
             */
            var self = this;
            D.css(self.elm, S.merge(
                self.cssPrefixes('transform', 'translate(' + self.x + 'px,' + self.y + 'px) '),
                self.cssPrefixes('transition-duration', self.duration + 's'))
            );
            /**
             * 单元素计算排序后触发
             */
            self._self.fire('afterElemSort', {
                autoResponsive: {
                    elm: self.elm,
                    position: {
                        x: self.x,
                        y: self.y
                    },
                    frame: self._self.frame
                }
            });
        },
        /**
         * 降级模拟css3动画
         */
        fixedAnim: function () {
            var self = this,
                cssRules = {'top': self.y},
                direction = 'left';
            if (self.direction == 'right') {
                direction = 'right';
            }
            cssRules[direction] = self.x;
            new Anim(self.elm, cssRules, self.duration, self.easing, function () {
                /**
                 * 单元素计算排序后触发
                 */
                self._self.fire('afterElemSort', {
                    autoResponsive: {
                        elm: self.elm,
                        position: {
                            x: self.x,
                            y: self.y
                        },
                        frame: self._self.frame
                    }
                });
            }).run();
        },
        /**
         * 无动画
         */
        noneAnim: function () {
            var self = this;
            D.css(self.elm, {
                left: self.x,
                top: self.y
            });
            /**
             * 单元素计算排序后触发
             */
            self._self.fire('afterElemSort', {
                autoResponsive: {
                    elm: self.elm,
                    position: {
                        x: self.x,
                        y: self.y
                    },
                    frame: self._self.frame
                }
            });
        }
    });
    return AutoAnim;
}, {requires: ['dom', 'anim']});

/**
 * @Description: 集成一个双向链表方便操作
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/linkedlist', function (S) {
    'use strict';
    /**
     * @name LinkedList
     * @class 双向更新链表
     * @constructor
     */
    function LinkedList(cfg) {
        var self = this;
        self.length = 0;
        self.head = null;
        self.tail = null;
        self.type = cfg.type || true;
        self.query = [];
        self.init();
    }

    S.augment(LinkedList, {
        /**
         * 初始化，增加随机序列
         */
        init: function () {
            S.augment(Array, {
                shuffle: function () {
                    for (var j, x, i = this.length;
                         i;
                         j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                }
            });
        },
        /**
         * 新增节点
         */
        add: function (value) {
            var self = this;
            if (self.type) {
                self.query.push(value);
                return;
            }
            var node = {
                value: value,
                next: null,//前驱
                prev: null//后继
            };
            if (self.length == 0) {
                self.head = self.tail = node;
            } else {
                self.tail.next = node;
                node.prev = self.tail;
                self.tail = node;
            }
            self.length++;
        },
        /**
         * 删除节点
         */
        remove: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            if (index == 0) {
                self.head = node.next;
                if (self.head == null) {
                    self.tail = null;
                }
                else {
                    self.head.previous = null;
                }
            }
            else if (index == self.length - 1) {
                node = self.tail;
                self.tail = node.prev;
                self.tail.next = null;
            }
            else {
                while (i++ < index) {
                    node = node.next;
                }
                node.prev.next = node.next;
                node.next.prev = node.prev;
            }
            self.length--;
        },
        /**
         * 获取链表值
         */
        get: function (index) {
            var self = this;
            if (self.type) {
                return self.query[index];
            }
            return self.node(index).value;
        },
        /**
         * 返回链表节点
         */
        node: function (index) {
            var self = this;
            if (index > self.length - 1 || index < 0) {
                return null;
            }
            var node = self.head,
                i = 0;
            while (i++ < index) {
                node = node.next;
            }
            return node;
        },
        /**
         * 更新节点值
         */
        update: function (index, value) {
            var self = this;
            if (self.type) {
                self.query[index] = value;
                return;
            }
            self.node(index).value = value;
        }
    });
    return LinkedList;
});
/**
 * @Description:    计算排序
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Todo:           gridSort
 */
KISSY.add('gallery/autoResponsive/1.0/gridsort', function (S, AutoAnim, LinkedList) {
    'use strict';
    var D = S.DOM, EMPTY = '';

    /**
     * @name GridSort
     * @class 栅格布局算法
     */
    function GridSort(cfg, _self) {
        var self = this;
        S.mix(self, S.merge(cfg, {
            _self: _self
        }));
        self.doneQuery = [];
        self._init();
    }
    S.augment(GridSort, {
        _init: function () {
            var self = this;
            var items = S.query(self.selector, self.container);
            switch (self.layout) {
                case EMPTY:
                case 'grid':
                default:
                    self._gridSort(items);
                    break;
                case 'cell':
                    self._cellSort(items);
                    break;
            }
        },
        _filter: function (elm) {
            var self = this;
            if (self.filter == EMPTY) {
                return;
            }
            ;
            D.show(elm);
            if (D.hasClass(elm, self.filter)) {
                D.hide(elm);
                return true;
            }
            ;
        },
        coordinate: function (curQuery, elm) {
            return this._autoFit(curQuery, D.outerWidth(elm), D.outerHeight(elm));
        },
        callAnim: function (elm, coordinate) {
            var self = this;
            new AutoAnim({
                elm: elm,
                x: coordinate[0],
                y: coordinate[1],
                animate: self.animate,
                duration: self.duration,
                easing: self.easing,
                direction: self.direction,
                frame: self._self.frame,
                _self: self._self
            });
        },
        _cache: function (elm) {
            var self = this, isCache = false;
            if (self.priority == EMPTY) {
                return  isCache;
            }
            if (!self.cacheQuery) {
                self.cacheQuery = [];
            }
            if (!D.hasClass(elm, self.priority)) {
                isCache = true;
                self.cacheQuery.push(elm);
            }
            return isCache;
        },
        /**
         * 清除缓存
         * 记录全局缓存
         */
        clearCache: function (curQuery, _items) {
            var self = this;
            if (self.cacheQuery) {
                self.cacheQuery = [];
            }
            self._self.curQuery = curQuery;
            self._self.itemLength = _items.length;
        },
        asyncize: function (handle) {
            var self = this;
            if (self._self.get('async')) {
                setTimeout(function () {
                    handle.call(self);
                }, 0);
            } else {
                handle.call(self);
            }
        },
        _gridSort: function (_items) {
            var self = this,
                _maxHeight = 0,
                curQuery = self._getCols();
            /**
             * 设置关键帧
             */
            self._setFrame();
            if (self.random) {
                _items = _items.shuffle();
            }
            /**
             * 排序之前触发beforeSort
             */
            self._self.fire('beforeSort', {
                autoResponsive: {
                    elms: _items
                }
            });
            S.each(_items, function (i, _key) {
                if (self.cache && _key < self._self.itemLength) {
                    return;
                }
                if (self._filter(i)) {
                    return;
                }
                if (self._cache(i)) {
                    return;
                }
                /**
                 * 遍历单个元素之前触发
                 */
                self._self.fire('beforeElemSort', {
                    autoResponsive: {
                        elm: i,
                        frame: self._self.frame
                    }
                });
                var coordinate = self.coordinate(curQuery, i);
                if (_maxHeight < coordinate[1] + D.outerHeight(i)) {
                    _maxHeight = coordinate[1] + D.outerHeight(i);
                }
                /**
                 * 调用动画
                 */
                self.asyncize(function () {
                    self.callAnim(i, coordinate);
                });
            });
            S.each(self.cacheQuery, function (i) {
                /**
                 * 遍历单个元素之后触发
                 */
                self._self.fire('beforeElemSort', {
                    autoResponsive: {
                        elm: i,
                        frame: self._self.frame
                    }
                });
                var coordinate = self.coordinate(curQuery, i);
                if (_maxHeight < coordinate[1] + D.outerHeight(i)) {
                    _maxHeight = coordinate[1] + D.outerHeight(i);
                }
                self.asyncize(function () {
                    self.callAnim(i, coordinate);
                });
            });
            /**
             * 清空缓存队列
             */
            self.clearCache(curQuery, _items);
            /**
             * 排序之后触发
             */
            self._self.fire('afterSort', {
                autoResponsive: {
                    elms: _items,
                    curMinMaxColHeight: self._getMinMaxColHeight(),
                    frame: self._self.frame
                }
            });
            self.setHeight(_maxHeight);
        },
        _getMinMaxColHeight:function(){
            var self = this,
                _min = Infinity,
                doneQuery = self.doneQuery;
            for(var i=0;i<doneQuery.length;i++){
                if(doneQuery[i]!=0 && doneQuery[i]<_min){
                    _min = doneQuery[i];
                }
            }
            return {
                min:_min,
                max:Math.max.apply(Math,doneQuery)
            };
        },
        _setFrame: function () {
            var self = this;
            self._self.frame++;
        },
        _cellSort: function (_items) {
            var self = this,
                _maxHeight = 0,
                _row = 0,
                curQuery = [];
            S.each(_items, function (i, key) {
                S.log('star from here!');
                curQuery.push(self._getCells());
                //self.callAnim(i,coordinate);
            });
        },
        _getCells: function () {
            return this._getCols();
        },
        _getCols: function () {
            var self = this;
            if (self._self.curQuery && self.cache) {
                return self._self.curQuery;
            } else {
                var curQuery = new LinkedList({});
                for (var i = 0; i < Math.ceil(D.outerWidth(self.container) / self.colWidth); i++) {
                    curQuery.add(0);
                }
                return curQuery;
            }
        },
        /**
         * 获取当前指针
         */
        _getCur: function (_num, curQuery) {
            var cur = [null, Infinity],
                _curQuery = curQuery.query.length ? curQuery.query : curQuery;
            S.each(_curQuery, function (i, key) {
                var _query = [];
                if (key + _num >= _curQuery.length) {
                    return;
                }
                for (var j = key; j < key + _num; j++) {
                    _query.push(curQuery.get(j));
                }
                if (cur[1] > Math.max.apply(Math, _query)) {
                    cur = [key, Math.max.apply(Math, _query)];
                }
            });
            return cur;
        },
        /**
         * 返回x，y轴坐标
         */
        _autoFit: function (curQuery, cW, cH) {
            var self = this,
                _num = Math.ceil((cW + self.colMargin.x) / self.colWidth),
                cur = self._getCur(_num, curQuery);
            for (var i = cur[0]; i < _num + cur[0]; i++) {
                curQuery.update(i, cur[1] + cH + self.colMargin.y);
            }
            self.doneQuery = curQuery.query;
            return [cur[0] * self.colWidth + self.colMargin.x, cur[1] + self.colMargin.y];
        },
        /**
         * 设置容器高度
         */
        setHeight: function (height) {
            var self = this;
            if (!self.autoHeight) {
                return;
            }
            D.height(self.container, height + self.colMargin.y);
        }
    });
    return GridSort;
}, {requires: ['./anim', './linkedlist', 'dom']});
/**
 * @Description:    网页自适应布局Base
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/base', function (S, Config, GridSort, Base) {
    'use strict';
    var D = S.DOM, E = S.Event, win = window;

    /**
     * @name AutoResponsive
     * @class 网页自适应布局
     * @constructor
     * @extends Base
     */
    function AutoResponsive() {
        var self = this;
        AutoResponsive.superclass.constructor.apply(self, arguments);
        if (!S.get(self.get('container'))) {
            S.log('can not init, lack of container!');
            return;
        }
        self.fire('beforeInit', {
            autoResponsive: self
        });
        if (self.get('init')) {
            self.init();
        }
        self.fire('afterInit', {
            autoResponsive: self
        });
    }
    S.extend(AutoResponsive, Base, {
        /**
         * 初始化组件
         * @return  排序实例
         */
        init: function () {
            var self = this;
            self._bindEvent();
            self.initPlugin();
            self.render();
            S.log('init!');
        },
        initPlugin: function () {
            var self = this;
            self.api = {};
            /**
             * 添加插件
             */
            S.each(self.get('plugin'), function (i) {
                i.init(self);
                S.mix(self.api, i.api);
            });
        },
        /**
         * 渲染排序结果
         */
        render: function () {
            var self = this,
                userCfg = self.getAttrVals();
            self.frame =  self.frame || 0;
            arguments[0] && S.each(arguments[0],function(i,_key){
                userCfg[_key] = i;
            });
            /**
             * 应用插件属性
             */
            S.mix(userCfg, self.api);
            new GridSort(userCfg, self);
        },
        /**
         * 绑定浏览器resize事件
         */
        _bind: function (handle) {
            var self = this;
            if (!self.get('resize')) {
                return;
            }
            E.on(win, 'resize', function (e) {
                handle.call(self);
            });
        },
        /**
         * 添加事件节流阀
         */
        _bindEvent: function () {
            var self = this;
            self._bind(S.buffer(function () {   // 使用buffer，不要使用throttle
                self.render();
                /**
                 * 浏览器改变触发resize事件
                 */
                self.fire('resize');
            }, self.get('resizeFrequency'), self));
        },
        /**
         * 重新布局调整
         */
        adjust: function () {
            var self = this;
            self.__isAdjusting = 1;
            self.render();
            self.__isAdjusting = 0;
        },
        isAdjusting: function(){
            return this.__isAdjusting || 0;
        },
        /**
         * 优先排序方法
         * @param {String} 选择器
         */
        priority: function (selector) {
            var self = this;
            self.render({
                priority: selector
            });
        },
        /**
         * 过滤方法
         * @param {String} 选择器
         */
        filter: function (selector) {
            var self = this;
            self.render({
                filter: selector
            });
        },
        /**
         * 调整边距
         * @param {Object} 边距
         */
        margin: function (margin) {
            var self = this;
            self.render({
                colMargin: margin
            });
        },
        /**
         * 方向设置
         * @param {String} 方向
         */
        direction: function (direction) {
            var self = this;
            self.render({
                direction: direction
            });
        },
        /**
         * 随机排序
         */
        random: function () {
            var self = this;
            self.render({
                random: true
            });
        },
        /**
         * 改变组件设置
         * @param {Object} 设置对象
         */
        option: function (option) {
            var self = this;
            self.render(option);
        },
        /**
         * append 方法,调用跟随队列优化性能
         * @param {Object} 节点对象
         */
        append: function (node) {
            var self = this;
            D.append(node, self.get('container'));
            self.render({
                cache: true
            });
        },
        /**
         * dom prepend 方法,耗费性能
         * @param {Object} 节点对象
         */
        prepend: function (node) {
            var self = this;
            D.prepend(node, self.get('container'));
            self.render();
        }
    }, { ATTRS: new Config()});
    return AutoResponsive;
}, {requires: ['./config', './gridsort', 'base', 'dom', 'event']});

/**
 * @Description:    hash回溯、功能路由
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/plugin/hash',function (S) {
    'use strict';
    var E = S.Event,
        win = window,
        AND = '&',
        EQUAL = '=';

    /**
     * @name hash
     * @class 自适应布局
     * @constructor
     */
    function Hash(cfg) {
        var self = this;
        self.prefix = cfg.prefix || 'ks-';
        self.api = {};
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Hash, {
        init: function (_self) {
            var self = this;
            S.log('hash init!');
            if (!self.hasHash()) {
                return;
            }
            self.parse();
        },
        hasHash: function () {
            return location.hash ? true : false;
        },
        parse: function () {
            var self = this;
            self.getParam();
        },
        /**
         * 解析hash
         * priority,filter
         */
        getParam: function () {
            var self = this;
            self.hash = location.hash.split(AND);
            S.each(self.hash, function (param) {
                self.getPriority(param);
                self.getFilter(param);
            });
        },
        getPriority: function (str) {
            var self = this,
                _priority = self.prefix + 'priority';
            if (str.indexOf(_priority) != -1) {
                S.mix(self.api, {
                    priority: str.split(EQUAL)[1]
                });
            }
        },
        getFilter: function (str) {
            var self = this,
                _filter = self.prefix + 'filter';
            if (str.indexOf(_filter) != -1) {
                S.mix(self.api, {
                    filter: str.split(EQUAL)[1]
                });
            }
        }
    });
    return Hash;
}, {requires: ['event']});
/**
 * @Description:    拖拽功能
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/plugin/drag',function (S) {
    'use strict';
    var E = S.Event, DD = S.DD,
        DraggableDelegate = DD.DraggableDelegate,
        Droppable = DD.Droppable;
    /**
     * @name Drag
     * @class 拖拽功能
     * @constructor
     */
    function Drag(cfg) {
    }
    /**
     *
     */
    S.augment(Drag, {
        init: function () {
            var self = this;
            S.log('drag init!');
        },
        _bindDrop: function (elm) {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new Droppable({
                node: elm
            }).on("dropenter", function (ev) {
                    D.insertAfter(ev.drag.get("node"), ev.drop.get("node"));
                    self._self.render();
                });
        },
        _bindBrag: function () {
            var self = this;
            if (self.drag != 'on') {
                return;
            }
            new DraggableDelegate({
                container: self.container,
                selector: self.selector,
                move: true
            }).on('dragstart',function (ev) {
                    var _target = ev.drag.get("node")[0];
                    this.p = {
                        left: _target.offsetLeft,
                        top: _target.offsetTop
                    };
                }).on('drag',function () {
                }).on('dragend', function (ev) {
                    D.css(ev.drag.get("node"), this.p);
                });
        }
    });
    return Drag;
}, {requires: ['event', 'dd']});
/**
 * @Description:    Loader
 * @Author:         dafeng.xdf[at]taobao.com zhuofeng.ls@taobao.com
 * @Date:           2013.03.05
 *
 * @Log:
 *    - 2013.07.03 zhuofeng.ls
 *      1.[!] fill loader detail functions.
 *
 *    - 2013.03.05 dafeng.xdf
 *      1.[+] build this file.
 */
KISSY.add('autoResponsive/1.0/plugin/loader', function (S) {
    'use strict';
    var D = S.DOM, $ = S.all, win = window, $win = $(win),

        SCROLL_TIMER = 50;

    /**
     * @name Loader
     * @class 加载器
     * @constructor
     */
    function Loader(cfg) {
        var self = this;

        // 用户配置修正
        cfg = {
            load: typeof cfg.load == 'function' ? cfg.load : function (success, end) {
                S.log('AutoResponsive.Loader::constructor: the load function in user\'s config is undefined!', 'warn');
            },
            diff: cfg.diff || 0,  // 数据砖块预载高度
            mod: cfg.mod == 'manual' ? 'manual' : 'auto',  // load触发模式
            qpt: 15 // 每次渲染处理的最大单元数量，如15表示每次最多渲染15个数据砖块，多出来的部分下个时间片再处理
        };

        self.config = cfg;
    }

    /**
     * 启用插件便开始解析
     */
    S.augment(Loader, S.EventTarget, {
        /**
         * loader插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param _self Base对象（即插件宿主对象）
         */
        init: function (_self) {
            var self = this,
                userCfg = self.config,
                mod = userCfg.mod;

            self._self = _self;

            self.__bindMethods();

            if (mod === 'manual') { // 手动触发模式 | 这种情况多是用户自定义load触发条件，如点击更多按钮时触发
                // nothing to do

            } else { // 自动触发模式

                self.__onScroll = S.buffer(self.__doScroll, SCROLL_TIMER, self);

                self.__onScroll(); // 初始化时立即检测一次，但是要等初始化 adjust 完成后.

                self.start();
            }

        },
        /**
         * 在自动触发模式下，监测屏幕滚动位置是否满足触发load数据的条件
         * @private
         */
        __doScroll: function () {
            var self = this,
                owner = self._self,
                userCfg = self.config;
            S.log('AutoResponsive.Loader::__doScroll...');
            if (self.__loading) {
                return;
            }
            // 如果正在调整中，等会再看；
            // 调整中的高度不确定，现在不适合判断是否到了加载新数据的条件
            if (owner.isAdjusting()) {
                // 恰好 __onScroll 是 buffered
                self.__onScroll();
                return;
            }

            var container = S.get(owner.get('container'));
            // in case that the container's current style is 'display: none'
            if (!container.offsetWidth) {
                return;
            }

            var offsetTop = D.offset(container).top,
                diff = userCfg.diff,
                minColHeight = owner.getMinColHeight(),
                scrollTop = $win.scrollTop(),
                height = $win.height();

            // 动态加载 | 低于预加载线(或被用户看到了)时触发加载
            if (diff + scrollTop + height >= offsetTop + minColHeight) {
                self.load();
            }
        },
        /**
         * 使用用户自定义load函数对数据进行loading
         * @public 在手动模式时可以供外部调用
         */
        load: function () {
            var self = this,
                userCfg = self.config,
                load = userCfg.load;

            S.log('AutoResponsive.Loader::loading...');

            self.__loading = 1;

            load && load(success, end);

            function success(items, callback) {
                self.__loading = 0;

                self.__addItems(items, function () {

                    callback && callback.call(self);

                    self.__doScroll(); // 加载完不够一屏再次检测
                });
            }

            function end() {
                self.stop();
            }
        },
        /**
         * 将指定函数（__appendItems）封装到时间片函数中
         * @private
         * @param items
         * @param callback
         * @returns {*}
         */
        __addItems: function (items, callback) {
            var self = this;

            // 创建一个新的时间片管理器（旧的如果任务还没处理完还会继续处理，直到处理完毕自动销毁）
            timedChunk(items, self.__appendItems, self, function () {

                callback && callback.call(self);

                // TODO revise...
                self.fire('autoresponsive.loader.complete', {
                    items: items
                });
            }).start();

        },
        /**
         * 向容器中插入新节点
         * @private
         * @param items
         */
        __appendItems: function (items) {
            var self = this,
                owner = self._self;

            items = S.makeArray(items);
            owner.append(items);
        },
        /**
         * 为Base对象挂载getMaxColHeight、getMinColHeight方法
         * @private
         */
        __bindMethods: function () {
            var self = this,
                owner = self._self,
                curMinMaxColHeight = {min: 0, max: 0};
            owner.on('afterSort', function (e) {
                curMinMaxColHeight = e.autoResponsive.curMinMaxColHeight;
            });
            owner.getMaxColHeight = function () {
                return curMinMaxColHeight.max;
            };
            owner.getMinColHeight = function () {
                return curMinMaxColHeight.min;
            };
        },
        /**
         * 启动loader数据load功能
         * @public
         */
        start: function () {
            this.resume();
        },
        /**
         * 停止loader数据load功能
         * @public
         */
        stop: function () {
            this.pause();
        },
        /**
         * 暂停loader数据load功能
         * @public
         */
        pause: function () {
            if (this.__destroyed)
                return;

            $win.detach('scroll', this.__onScroll);
            this.__onScroll.stop();
        },
        /**
         * 恢复（重新唤醒）loader数据load功能
         * @public
         */
        resume: function () {
            var self = this;
            if (self.__destroyed) {
                return;
            }
            $win.on('scroll', self.__onScroll);
            self.__started = 1;
        },
        /**
         * 停止loader所有工作，销毁loader对象
         * @public
         */
        destroy: function () {
            // TODO ...
            this.__destroyed = 1;
        }
//        Status: {INIT: 0, LOADING: 1, LOADED: 2, ERROR: 3, ATTACHED: 4}
    });

    /**
     * 时间片轮询函数
     * @param items
     * @param process
     * @param context
     * @param callback
     * @returns {{}}
     */
    function timedChunk(items, process, context, callback) {

        var monitor = {}, timer, todo = []; // 任务队列 | 每一个时间片管理函数（timedChunk）都维护自己的一个任务队列

        var userCfg = context.config,
            qpt = userCfg.qpt || 15;

        monitor.start = function () {

            todo = todo.concat(S.makeArray(items)); // 压入任务队列

            // 轮询函数
            var polling = function () {
                var start = +new Date;
                while (todo.length > 0 && (new Date - start < 50)) {
                    var task = todo.splice(0, qpt);
                    process.call(context, task);
                }

                if (todo.length > 0) { // 任务队列还有任务，放到下一个时间片进行处理
                    timer = setTimeout(polling, 25);
                    return;
                }

                callback && callback.call(context, items);

                // 销毁该管理器
                monitor.stop();
                monitor = null;
            };

            polling();
        };

        monitor.stop = function () {
            if (timer) {
                clearTimeout(timer);
                todo = [];
            }
        };

        return monitor;
    }

    return Loader;

}, {requires: ['dom', 'event']});
/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add('gallery/autoResponsive/1.0/index', function (S, AutoResponsive, Hash, Drag, Loader) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader']});
