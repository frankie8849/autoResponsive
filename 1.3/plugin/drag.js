/**
 * @Description:    拖拽功能，依赖constrain、scroll两个dd组件
 * @Author:         dafeng.xdf[at]taobao.com
 * @Date:           2013.3.5
 * @Log:            1.2版本对drag重构
 */
KISSY.add(function (S,Constrain,Scroll,Util) {
    'use strict';
    var D = S.DOM,
        DD = S.DD, DDM = DD.DDM,
        DraggableDelegate = DD.DraggableDelegate,
        DroppableDelegate = DD.DroppableDelegate,
        prifixCls = 'ks-autoResponsive-dd-',
        placeHolderCls = prifixCls+'placeHolder',
        draggingCls = prifixCls+'dragging',
        placeHolderTPL = '<div class="'+placeHolderCls+'"></div>';

    /**
     * Drag
     * @param cfg
     * @constructor
     */
    function Drag(cfg) {
        var self = this;
        self.closeConstrain = cfg.closeConstrain || false; //是否关闭边界限制，默认开启
        self.selector = cfg.selector;                      //拖拽dom选择器
        self.handlers = cfg.handlers || [];                //拖拽操作代理dom
        self.threshold = cfg.threshold || 300;             //拖拽默认时间颗粒度
    }
    Drag.prototype={
        /**
         * drag插件初始化
         * @public 供宿主对象在插件初始化时调用
         * @param owner 为插件宿主
         */
        init: function (owner) {
            var self = this;
            /**
             * 获取宿主对象
             * @type {*}
             */
            self.owner = owner;
            /**
             * 强制更改owner配置为fixedAnim
             * @type {*}
             */
            self.owner.changeCfg({
                animType:'fixedAnim'
            });
            /**
             * 容器取自宿主配置
             * @type {*}
             */
            self.container = self.owner.userConfig.container;
            /**
             * 初始化拖拽代理对象
             * @type {DraggableDelegate}
             */
            self.dragDelegate = new DraggableDelegate({
                container:self.container,
                selector:self.selector,
                move:true,
                plugins:[new Constrain({
                    constrain: self.container
                }),new Scroll({
                    node: self.container
                })],
                handlers:self.handlers
            });
            /**
             * 初始化拖放对象
             * @type {DroppableDelegate}
             */
            self.dropDelegate = new DroppableDelegate({
                container:self.container,
                selector:self.selector
            });
            /**
             * 拖放自定义事件操作
             */
            self._bindOperate();
            S.log('drag init!');
        },
        /**
         * 动态改变配置
         */
        changCfg:function(cfg){
            var self = this;
            S.each(cfg,function(i,key){
                self.dragDelegate.set(key,i);
            });
        },
        stop:function(){
            var self = this;
            self.dragDelegate.set('disabled',true);
        },
        restore:function(){
            var self = this;
            self.dragDelegate.set('disabled',false);
        },
        _bindOperate:function(){
            var self = this;
            DDM.on('dragstart',self._debounce(self._dragStartOperate))
                .on('dragend',self._debounce(self._dragEndOperate))
                .on('dropover',self._debounce(self._dropOverOperate));
        },
        _dragStartOperate:function(e){
            var self = this,
                _drag = e.drag,
                _node =  _drag.get("node");
            self.select = _node[0];
            /**
             * 获取坐标对象
             * @type {*}
             */
            self.originPosition = self.select.autoResponsiveCoordinate;
            /**
             * 创建中间模块
             * @type {*}
             */
            self._renderPlaceHolder();
            /**
             * 设置select为拖起样式
             */
            D.addClass(self.select,draggingCls);
            /**
             * 覆盖宿主配置，对拖起元素略过不计
             */
            self.owner.changeCfg({
                exclude:draggingCls
            });
        },
        _dragEndOperate:function(){
            var self = this;
            /**
             * 拖动结束后设置拖起元素为中间元素的坐标
             */
            D.css(self.select,{
                left: D.css(self.placeHolder,'left'),
                top: D.css(self.placeHolder,'top')
            });
            /**
             * 插入占位元素之前
             */
            D.insertBefore(self.select,self.placeHolder);
            /**
             * 去掉中间元素
             */
            D.remove(self.placeHolder);
            /**
             * 复原拖起元素样式
             */
            D.removeClass(self.select,draggingCls);
        },
        _dropOverOperate:function(e){
            var self = this,
                _drop = e.drop,
                _node = _drop.get("node");
            /**
             * 中间展位元素插入over元素之前
             */
            D.insertBefore(self.placeHolder,_node);
            /**
             * 调用autoResponsive排序
             */
            self.owner.adjust();
        },
        _renderPlaceHolder:function(){
            var self = this;
            /**
             * 创建占位dom
             * @type {*}
             */
            self.placeHolder = D.create(placeHolderTPL);
            /**
             * 设置占位样式
             */
            D.css(self.placeHolder,{
                left:self.originPosition.x,
                top:self.originPosition.y,
                width: D.width(self.select),
                height: D.height(self.select)
            });
            /**
             * dom树插入占位元素
             */
            D.insertBefore(self.placeHolder,self.select);
        },
        _debounce:function(fn){
            var self = this,
                _threshold = self.threshold;
            return Util.debounce(fn,_threshold,self,true);
        }
    };
    return Drag;
}, {requires: ['dd/plugin/constrain','dd/plugin/scroll','../util','dd','dom','event']});
