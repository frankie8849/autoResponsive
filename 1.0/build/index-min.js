/*! autoResponsive - v1.0 - 2013-07-06 4:52:14 PM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.0/config",function(){"use strict";function e(){return{container:{value:n},selector:{value:n},filter:{value:n},fixedSelector:{value:n},priority:{value:n},gridWidth:{value:10},unitMargin:{value:{x:0,y:0}},closeAnim:{value:!1},duration:{value:1},easing:{value:"easeNone"},direction:{value:"left"},random:{value:!1},sortBy:{value:n},autoHeight:{value:!0},closeResize:{value:!1},autoInit:{value:!0},plugins:{value:[]},suspend:{value:!0},cache:{value:!1},resizeFrequency:{value:200},whensRecountUnitWH:{value:[]}}}var n="";return e}),KISSY.add("gallery/autoResponsive/1.0/anim",function(e){"use strict";function n(e){var n=this;n.cfg=e,n._init()}var t=e.DOM,i=e.Anim,r=" ",o=11>e.UA.ie;return e.augment(n,{_init:function(){var e=this,n=e.cfg;return n.closeAnim?(e.noneAnim(),void 0):(o||"right"==n.direction?e.fixedAnim():e.css3Anim(),void 0)},cssPrefixes:function(n,t){var i={};return e.each("-webkit- -moz- -o- -ms-  ".split(r),function(e){i[e+n]=t}),i},css3Anim:function(){var n=this,i=n.cfg;t.css(i.elm,e.merge(n.cssPrefixes("transform","translate("+i.x+"px,"+i.y+"px) "),n.cssPrefixes("transition-duration",i.duration+"s"))),i.owner.fire("afterUnitSort",{autoResponsive:{elm:i.elm,position:{x:i.x,y:i.y},frame:i.owner.frame}})},fixedAnim:function(){var e=this,n=e.cfg,t={top:n.y},r="left";"right"==n.direction&&(r="right"),t[r]=n.x,new i(n.elm,t,n.duration,n.easing,function(){n.owner.fire("afterUnitSort",{autoResponsive:{elm:n.elm,position:{x:n.x,y:n.y},frame:n.owner.frame}})}).run()},noneAnim:function(){var e=this,n=e.cfg;t.css(n.elm,{left:n.x,top:n.y}),n.owner.fire("afterUnitSort",{autoResponsive:{elm:n.elm,position:{x:n.x,y:n.y},frame:n.owner.frame}})}}),n},{requires:["dom","anim"]}),KISSY.add("gallery/autoResponsive/1.0/linkedlist",function(e){"use strict";function n(e){var n=this;n.length=0,n.head=null,n.tail=null,n.type=e.type||!0,n.query=[],n.init()}return e.augment(n,{init:function(){e.augment(Array,{shuffle:function(){for(var e,n,t=this.length;t;e=parseInt(Math.random()*t),n=this[--t],this[t]=this[e],this[e]=n);return this}})},add:function(e){var n=this;if(n.type)return n.query.push(e),void 0;var t={value:e,next:null,prev:null};0==n.length?n.head=n.tail=t:(n.tail.next=t,t.prev=n.tail,n.tail=t),n.length++},remove:function(e){var n=this;if(e>n.length-1||0>e)return null;var t=n.head,i=0;if(0==e)n.head=t.next,null==n.head?n.tail=null:n.head.previous=null;else if(e==n.length-1)t=n.tail,n.tail=t.prev,n.tail.next=null;else{for(;e>i++;)t=t.next;t.prev.next=t.next,t.next.prev=t.prev}n.length--},get:function(e){var n=this;return n.type?n.query[e]:n.node(e).value},node:function(e){var n=this;if(e>n.length-1||0>e)return null;for(var t=n.head,i=0;e>i++;)t=t.next;return t},update:function(e,n){var t=this;return t.type?(t.query[e]=n,void 0):(t.node(e).value=n,void 0)}}),n}),KISSY.add("gallery/autoResponsive/1.0/gridsort",function(e,n,t){"use strict";function i(){}var r=e.DOM,o="";return e.augment(i,{init:function(n,t){var i=this;i.cfg=n,n.owner=t,n.owner.doneQuery=[];var r=e.query(n.selector,n.container);switch(n.sortBy){case o:case"grid":default:i._gridSort(r);break;case"cell":i._cellSort(r)}},_filter:function(e){var n=this,t=n.cfg;if(t.filter!=o)return r.show(e),r.hasClass(e,t.filter)?(r.hide(e),!0):void 0},coordinate:function(e,n){var t=this.cfg,i=t.isRecountUnitWH;return(i||!n.__width)&&(n.__width=r.outerWidth(n),n.__height=r.outerHeight(n)),this._autoFit(e,n.__width,n.__height)},callAnim:function(e,t){var i=this,r=i.cfg;new n({elm:e,x:t[0],y:t[1],closeAnim:r.closeAnim,duration:r.duration,easing:r.easing,direction:r.direction,frame:r.owner.frame,owner:r.owner})},_cache:function(e){var n=this,t=!1,i=n.cfg;return i.priority==o?t:(i.cacheQuery||(i.cacheQuery=[]),r.hasClass(e,i.priority)||(t=!0,i.cacheQuery.push(e)),t)},clearCache:function(e,n){var t=this,i=t.cfg;i.cacheQuery&&(i.cacheQuery=[]),i.owner.curQuery=e,i.owner.itemsLen=n.length},asyncize:function(e){var n=this,t=n.cfg;t.owner.get("suspend")?setTimeout(function(){e.call(n)},0):e.call(n)},_render:function(e,n){var t=this,i=t.cfg;i.owner.fire("beforeUnitSort",{autoResponsive:{elm:n,frame:i.owner.frame}});var r=t.coordinate(e,n),o=r[1]+n.__height;o>(t._maxHeight||0)&&(t._maxHeight=o),t.asyncize(function(){t.callAnim(n,r)})},_gridSort:function(n){var t=this,i=t.cfg,r=t._getCols();t._setFrame(),i.random&&(n=n.shuffle()),i.owner.fire("beforeSort",{autoResponsive:{elms:n}}),e.each(n,function(e,n){i.cache&&i.owner.itemsLen>n||t._filter(e)||t._cache(e)||t._render(r,e)}),e.each(i.cacheQuery,function(e){t._render(r,e)}),t.clearCache(r,n),i.owner.fire("afterSort",{autoResponsive:{elms:n,curMinMaxColHeight:t._getMinMaxColHeight(),frame:i.owner.frame}}),t.setHeight()},_getMinMaxColHeight:function(){for(var e=this,n=e.cfg,t=1/0,i=n.owner.doneQuery,r=0;i.length>r;r++)0!=i[r]&&t>i[r]&&(t=i[r]);return{min:t,max:Math.max.apply(Math,i)}},_setFrame:function(){var e=this;e.cfg.owner.frame++},_cellSort:function(n){var t=this,i=[];e.each(n,function(){e.log("star from here!"),i.push(t._getCells())})},_getCells:function(){return this._getCols()},_getCols:function(){var e=this,n=e.cfg;if(n.owner.curQuery&&n.cache)return n.owner.curQuery;for(var i=new t({}),o=0,a=Math.ceil(r.outerWidth(n.container)/n.gridWidth);a>o;o++)i.add(0);return i},_getCur:function(e,n){for(var t=[null,1/0],i=n.query.length?n.query:n,r=0,o=i.length;o-e>r;r++){for(var a=0,u=r;r+e>u;u++)n.get(u)>a&&(a=n.get(u));t[1]>a&&(t=[r,a])}return t},_autoFit:function(e,n,t){for(var i=this,r=i.cfg,o=Math.ceil((n+r.unitMargin.x)/r.gridWidth),a=i._getCur(o,e),u=a[0];o+a[0]>u;u++)e.update(u,a[1]+t+r.unitMargin.y);return r.owner.doneQuery=e.query,[a[0]*r.gridWidth+r.unitMargin.x,a[1]+r.unitMargin.y]},setHeight:function(){var e=this,n=e.cfg;n.autoHeight&&r.height(n.container,(e._maxHeight||0)+n.unitMargin.y)}}),i},{requires:["./anim","./linkedlist","dom"]}),KISSY.add("gallery/autoResponsive/1.0/base",function(e,n,t,i){"use strict";function r(){var n=this;return r.superclass.constructor.apply(n,arguments),e.get(n.get("container"))?(n.fire("beforeInit",{autoResponsive:n}),n.get("autoInit")&&n.init(),n.fire("afterInit",{autoResponsive:n}),void 0):(e.log("can not init, lack of container!"),void 0)}var o=e.DOM,a=e.Event,u=window;return e.extend(r,i,{init:function(){var n=this;n._bindEvent(),n.initPlugin(),n.render(),e.log("init!")},initPlugin:function(){var n=this;n.api={},e.each(n.get("plugins"),function(t){t.init(n),e.mix(n.api,t.api)})},render:function(){var n=this,i=n.getAttrVals();n.frame=n.frame||0,arguments[0]&&e.each(arguments[0],function(e,n){i[n]=e}),e.mix(i,n.api),n.gridSort=n.gridSort||new t,n.gridSort.init(i,n)},_bind:function(n){var t=this,i=t.get("whensRecountUnitWH");t.get("closeResize")||a.on(u,"resize",function(){n.call(t,{isRecountUnitWH:e.inArray("resize",i)})})},_bindEvent:function(){var n=this;n._bind(e.buffer(function(){n.render(arguments),n.fire("resize")},n.get("resizeFrequency"),n))},adjust:function(n){var t=this,i=t.get("whensRecountUnitWH");t.__isAdjusting=1,t.render({isRecountUnitWH:n||e.inArray("adjust",i)}),t.__isAdjusting=0},isAdjusting:function(){return this.__isAdjusting||0},priority:function(e){var n=this;n.render({priority:e})},filter:function(e){var n=this;n.render({filter:e})},margin:function(e){var n=this;n.render({unitMargin:e})},direction:function(e){var n=this;n.render({direction:e})},random:function(){var e=this;e.render({random:!0})},option:function(e){var n=this;n.render(e)},append:function(e){var n=this;o.append(e,n.get("container")),n.render({cache:!0})},prepend:function(e){var n=this;o.prepend(e,n.get("container")),n.render()}},{ATTRS:new n}),r},{requires:["./config","./gridsort","base","dom","event"]}),KISSY.add("gallery/autoResponsive/1.0/plugin/hash",function(e){"use strict";function n(e){var n=this;n.prefix=e.prefix||"ks-",n.api={}}var t="&",i="=";return e.augment(n,{init:function(){var n=this;e.log("hash init!"),n.hasHash()&&n.parse()},hasHash:function(){return location.hash?!0:!1},parse:function(){var e=this;e.getParam()},getParam:function(){var n=this;n.hash=location.hash.split(t),e.each(n.hash,function(e){n.getPriority(e),n.getFilter(e)})},getPriority:function(n){var t=this,r=t.prefix+"priority";-1!=n.indexOf(r)&&e.mix(t.api,{priority:n.split(i)[1]})},getFilter:function(n){var t=this,r=t.prefix+"filter";-1!=n.indexOf(r)&&e.mix(t.api,{filter:n.split(i)[1]})}}),n},{requires:["event"]}),KISSY.add("gallery/autoResponsive/1.0/plugin/drag",function(e){"use strict";function n(){}var t=(e.Event,e.DD),i=t.DraggableDelegate,r=t.Droppable;return e.augment(n,{init:function(){e.log("drag init!")},_bindDrop:function(e){var n=this;"on"==n.drag&&new r({node:e}).on("dropenter",function(e){D.insertAfter(e.drag.get("node"),e.drop.get("node")),n.owner.render()})},_bindBrag:function(){var e=this;"on"==e.drag&&new i({container:e.container,selector:e.selector,move:!0}).on("dragstart",function(e){var n=e.drag.get("node")[0];this.p={left:n.offsetLeft,top:n.offsetTop}}).on("drag",function(){}).on("dragend",function(e){D.css(e.drag.get("node"),this.p)})}}),n},{requires:["event","dd"]}),KISSY.add("gallery/autoResponsive/1.0/plugin/loader",function(e){"use strict";function n(n){var t=this;n={load:"function"==typeof n.load?n.load:function(){e.log("AutoResponsive.Loader::constructor: the load function in user's config is undefined!","warn")},diff:n.diff||0,mod:"manual"==n.mod?"manual":"auto",qpt:15},t.config=n}function t(n,t,i,r){var o,a={},u=[],s=i.config,c=s.qpt||15;return a.start=function(){u=u.concat(e.makeArray(n));var s=function(){for(var e=+new Date;u.length>0&&50>new Date-e;){var l=u.splice(0,c);t.call(i,l)}return u.length>0?(o=setTimeout(s,25),void 0):(r&&r.call(i,n),a.stop(),a=null,void 0)};s()},a.stop=function(){o&&(clearTimeout(o),u=[])},a}var i=e.DOM,r=e.all,o=window,a=r(o),u=50;return e.augment(n,e.EventTarget,{init:function(n){var t=this,i=t.config,r=i.mod;t.owner=n,t.__bindMethods(),"manual"===r||(t.__onScroll=e.buffer(t.__doScroll,u,t),t.__onScroll(),t.start())},__doScroll:function(){var n=this,t=n.owner,r=n.config;if(e.log("AutoResponsive.Loader::__doScroll..."),!n.__loading){if(t.isAdjusting())return n.__onScroll(),void 0;var o=e.get(t.get("container"));if(o.offsetWidth){var u=i.offset(o).top,s=r.diff,c=t.getMinColHeight(),l=a.scrollTop(),f=a.height();s+l+f>=u+c&&n.load()}}},load:function(){function n(e,n){i.__loading=0,i.__addItems(e,function(){n&&n.call(i),i.__doScroll()})}function t(){i.stop()}var i=this,r=i.config,o=r.load;e.log("AutoResponsive.Loader::loading..."),i.__loading=1,o&&o(n,t)},__addItems:function(e,n){var i=this;t(e,i.__appendItems,i,function(){n&&n.call(i),i.fire("autoresponsive.loader.complete",{items:e})}).start()},__appendItems:function(n){var t=this,i=t.owner;n=e.makeArray(n),i.append(n)},__bindMethods:function(){var e=this,n=e.owner,t={min:0,max:0};n.on("afterSort",function(e){t=e.autoResponsive.curMinMaxColHeight}),n.getMaxColHeight=function(){return t.max},n.getMinColHeight=function(){return t.min}},start:function(){this.resume()},stop:function(){this.pause()},pause:function(){this.__destroyed||(a.detach("scroll",this.__onScroll),this.__onScroll.stop())},resume:function(){var e=this;e.__destroyed||(a.on("scroll",e.__onScroll),e.__started=1)},destroy:function(){this.__destroyed=1}}),n},{requires:["dom","event"]}),KISSY.add("gallery/autoResponsive/1.0/index",function(e,n,t,i,r){return n.Hash=t,n.Drag=i,n.Loader=r,n},{requires:["./base","./plugin/hash","./plugin/drag","./plugin/loader"]});