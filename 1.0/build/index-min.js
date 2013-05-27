/*! autoResponsive - v1.0 - 2013-05-27 5:14:33 PM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.0/config",function(){"use strict";function e(){return{container:{value:t},selector:{value:t},filter:{value:t},fixedSelector:{value:t},priority:{value:t},colWidth:{value:10},colMargin:{value:{x:0,y:0}},animate:{value:"on"},duration:{value:1},easing:{value:"easeNone"},direction:{value:"left"},random:{value:"off"},sort:{value:t},layout:{value:t},drag:{value:"off"},autoHeight:{value:"on"},resize:{value:"on"},init:{value:"on"}}}var t="";return e}),KISSY.add("gallery/autoResponsive/1.0/anim",function(e){"use strict";function t(t){var n=this;e.mix(n,t),n._init()}var n=e.DOM,i=e.Anim,r=" ",a=11>e.UA.ie;return e.augment(t,{_init:function(){var e=this;return"off"==e.animate?(e.noneAnim(),void 0):(a||"right"==e.direction||"on"==e.drag?e.fixedAnim():e.css3Anim(),void 0)},addPlugin:function(){var t=this,n=t._self,i=r;return n.plug&&e.each(n.plug,function(e){i+=e.applicate(n.frame)}),i},cssPrefixes:function(t,n){var i={};return e.each("-webkit- -moz- -o- -ms-  ".split(r),function(e){i[e+t]=n}),i},css3Anim:function(){var t=this;n.css(t.elm,e.merge(t.cssPrefixes("transform","translate("+t.x+"px,"+t.y+"px)"+t.addPlugin()),t.cssPrefixes("transition-duration",t.duration+"s"))),t._self.fire("afterElemSort",{autoResponsive:{elm:t.elm,position:{x:t.x,y:t.y}}})},fixedAnim:function(){var e=this,t={top:e.y},n="left";"right"==e.direction&&(n="right"),t[n]=e.x,new i(e.elm,t,e.duration,e.easing,function(){e._self.fire("afterElemSort",{autoResponsive:{elm:e.elm,position:{x:e.x,y:e.y}}})}).run()},noneAnim:function(){var e=this;n.css(e.elm,{left:e.left,top:e.top}),e._self.fire("afterElemSort",{autoResponsive:{elm:e.elm,position:{x:e.x,y:e.y}}})}}),t},{requires:["dom","anim"]}),KISSY.add("gallery/autoResponsive/1.0/linkedlist",function(e){"use strict";function t(){this.length=0,this.head=null,this.tail=null}return e.augment(t,{add:function(e){var t={value:e,next:null,prev:null};0==this.length?this.head=this.tail=t:(this.tail.next=t,t.prev=this.tail,this.tail=t),this.length++},remove:function(e){if(e>this.length-1||0>e)return null;var t=this.head,n=0;if(0==e)this.head=t.next,null==this.head?this.tail=null:this.head.previous=null;else if(e==this.length-1)t=this.tail,this.tail=t.prev,this.tail.next=null;else{for(;e>n++;)t=t.next;t.prev.next=t.next,t.next.prev=t.prev}this.length--},get:function(e){return this.node(e).value},node:function(e){if(e>this.length-1||0>e)return null;for(var t=this.head,n=0;e>n++;)t=t.next;return t},update:function(e,t){this.node(e).value=t}}),t}),KISSY.add("gallery/autoResponsive/1.0/gridsort",function(e,t,n){"use strict";function i(t,n){var i=this;e.mix(i,e.merge(t,{_self:n})),i._init()}var r=e.DOM,a="",o=e.DD,s=o.DraggableDelegate,u=o.Droppable;return e.augment(Array,{shuffle:function(){for(var e,t,n=this.length;n;e=parseInt(Math.random()*n),t=this[--n],this[n]=this[e],this[e]=t);return this}}),e.augment(i,{_init:function(){var t=this;if(!t.selector)return e.log("lack selector"),void 0;var n=e.query(t.selector,t.container);switch(t.layout){case a:case"grid":default:t._gridSort(n);break;case"cell":t._cellSort(n)}},_filter:function(e){var t=this;return r.show(e),r.hasClass(e,t.filter)?(r.hide(e),!0):void 0},coordinate:function(e,t){return this._autoFit(e,r.outerWidth(t),r.outerHeight(t))},callAnim:function(e,n){var i=this;new t({elm:e,x:n[0],y:n[1],animate:i.animate,duration:i.duration,easing:i.easing,direction:i.direction,frame:i._self.frame,_self:i._self})},_cache:function(t){var n=this,i=!1;return n.priority==a?i:(!n.cacheQuery&&e.mix(n,{cacheQuery:[]}),r.hasClass(t,n.priority)||(i=!0,n.cacheQuery.push(t)),i)},_gridSort:function(t){var n=this,i=0,a=n._getCols();n._setFrame(),"on"==n.random&&(t=t.shuffle()),n._self.fire("beforeSort",{autoResponsive:{elms:t}}),e.each(t,function(e){if(!n._filter(e)&&!n._cache(e)){n._self.fire("beforeElemSort",{autoResponsive:{elm:e}});var t=n.coordinate(a,e);t[1]+r.outerHeight(e)>i&&(i=t[1]+r.outerHeight(e)),n.callAnim(e,t),n._bindDrop(e)}}),e.each(n.cacheQuery,function(e){n._self.fire("beforeElemSort",{autoResponsive:{elm:e}});var t=n.coordinate(a,e);t[1]+r.outerHeight(e)>i&&(i=t[1]+r.outerHeight(e)),n.callAnim(e,t),n._bindDrop(e)}),n._self.fire("afterSort",{autoResponsive:{elms:t}}),n._bindBrag(),n.setHeight(i)},_setFrame:function(){var e=this;e._self.frame++},_cellSort:function(t){var n=this,i=[];e.each(t,function(){e.log("star from here!"),i.push(n._getCells())})},_getCells:function(){return this._getCols()},_bindDrop:function(e){var t=this;"on"==t.drag&&new u({node:e}).on("dropenter",function(e){r.insertAfter(e.drag.get("node"),e.drop.get("node")),t._self.render()})},_bindBrag:function(){var e=this;"on"==e.drag&&new s({container:e.container,selector:e.selector,move:!0}).on("dragstart",function(e){var t=e.drag.get("node")[0];this.p={left:t.offsetLeft,top:t.offsetTop}}).on("drag",function(){}).on("dragend",function(e){r.css(e.drag.get("node"),this.p)})},_getCols:function(){for(var e=this,t=new n,i=0;Math.ceil(r.outerWidth(e.container)/e.colWidth)>i;i++)t.add(0);return t},_getCur:function(t,n){var i=[null,1/0];return e.each(n,function(e,r){var a=[];if(!(r+t>=n.length)){for(var o=r;r+t>o;o++)a.push(n.get(o));i[1]>Math.max.apply(Math,a)&&(i=[r,Math.max.apply(Math,a)])}}),i},_autoFit:function(e,t,n){for(var i=this,r=Math.ceil((t+i.colMargin.x)/i.colWidth),a=i._getCur(r,e),o=a[0];r+a[0]>o;o++)e.update(o,a[1]+n+i.colMargin.y);return[a[0]*i.colWidth+i.colMargin.x,a[1]+i.colMargin.y]},setHeight:function(e){var t=this;"on"==t.autoHeight&&r.height(t.container,e+t.colMargin.y)}}),i},{requires:["./anim","./linkedlist","dom","event","dd"]}),KISSY.add("gallery/autoResponsive/1.0/base",function(e,t,n,i){"use strict";function r(){var t=this;return r.superclass.constructor.apply(t,arguments),e.get(t.get("container"))?(t.plug=[],"on"==t.get("init")&&t.init(),t.fire("init",{autoResponsive:t}),void 0):(e.log("lack container!"),void 0)}var a=e.DOM,o=e.Event,s=window;return e.extend(r,i,{init:function(){var e=this;e._bindEvent(),e.render()},render:function(){var i=this,r=new t;i.frame=i.frame||0,e.each(r,function(e,t){r[t]=i.get(t)}),e.each(arguments,function(t){e.each(t,function(e,t){r[t]=e})}),new n(r,i)},_bind:function(e){var t=this;"on"==t.get("resize")&&o.on(s,"resize",function(){e.call(t)})},_bindEvent:function(){var t=this;t._bind(e.throttle(function(){t.render(),t.fire("resize")},200,t))},adjust:function(){var e=this;e.render()},priority:function(e){var t=this;t.render({priority:e})},filter:function(e){var t=this;t.render({filter:e})},margin:function(e){var t=this;t.render({colMargin:e})},direction:function(e){var t=this;t.render({direction:e})},random:function(){var e=this;e.render({random:"on"})},option:function(e){var t=this;t.render(e)},append:function(e){var t=this;a.append(e,t.get("container")),t.render()},prepend:function(e){var t=this;a.prepend(e,t.get("container")),t.render()},plugin:function(e){var t=this;console.log(e),t.plug.push(e)}},{ATTRS:new t}),r},{requires:["./config","./gridsort","base","dom","event"]}),KISSY.add("gallery/autoResponsive/1.0/plugin/effect",function(e){"use strict";function t(t){var n=this;e.mix(n,t),n._init()}var n="";return e.augment(t,{_init:function(){var e=this;e.router()},router:function(){var e=this;switch(e.effect){case"roll":e.roll();break;case"appear":e.appear();break;case"off":case"still":default:e.still()}},roll:function(){var t=this;e.mix(t,{applicate:function(e){return"rotate("+360*e+"deg)"}})},appear:function(){var t=this;e.mix(t,{type:"scale(1)"})},still:function(){var t=this;e.mix(t,{type:n})}}),t},{requires:["dom","anim"]}),KISSY.add("gallery/autoResponsive/1.0/index",function(e,t,n){return t.Effect=n,t},{requires:["./base","./plugin/effect"]});