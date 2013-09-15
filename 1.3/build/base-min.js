/*! autoResponsive - v1.3 - 2013-09-15 5:11:33 PM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.3/anim",function(e){"use strict";function t(e){this.cfg=e,this._init()}var n=e.DOM,i=e.Anim,r=11>e.UA.ie,o=["-webkit-","-moz-","-ms-","-o-",""],a=r?"fixedAnim":"css3Anim";return e.augment(t,{_init:function(){this[this.cfg.animType?this.cfg.animType:a]()},cssPrefixes:function(e,t){for(var n={},i=0,r=o.length;r>i;i++)n[o[i]+e]=t;return n},css3Anim:function(){var t=this.cfg;n.css(t.elm,this.cssPrefixes("transform","translate("+("right"!==t.direction?t.x:t.owner.gridSort.containerWH-t.elm.__width-t.x)+"px,"+t.y+"px) ")),this._fireAfterUnitArrange(t),e.log("css3 anim success")},fixedAnim:function(){var t=this,n=t.cfg,r={top:n.y};return n.closeAnim?(this.noneAnim(),void 0):(r["right"==n.direction?"right":"left"]=n.x,new i(n.elm,r,n.duration,n.easing,function(){t._fireAfterUnitArrange(n)}).run(),e.log("kissy anim success"),void 0)},noneAnim:function(){var t=this.cfg;n.css(t.elm,{left:t.x,top:t.y}),this._fireAfterUnitArrange(t),e.log("maybe your anim is closed")},_fireAfterUnitArrange:function(e){e.owner.fire("afterUnitArrange",{autoResponsive:{elm:e.elm,position:{x:e.x,y:e.y},frame:e.owner.frame}})}}),t},{requires:["dom","anim"]}),KISSY.add("gallery/autoResponsive/1.3/linkedlist",function(e){"use strict";function t(e){var t=this;t.length=0,t.head=null,t.tail=null,t.type=e.type||!0,t.query=[],t.init()}return e.augment(t,{init:function(){e.augment(Array,{shuffle:function(){for(var e,t,n=this.length;n;e=parseInt(Math.random()*n),t=this[--n],this[n]=this[e],this[e]=t);return this}})},add:function(e){var t=this;if(t.type)return t.query.push(e),void 0;var n={value:e,next:null,prev:null};0==t.length?t.head=t.tail=n:(t.tail.next=n,n.prev=t.tail,t.tail=n),t.length++},remove:function(e){var t=this;if(e>t.length-1||0>e)return null;var n=t.head,i=0;if(0==e)t.head=n.next,null==t.head?t.tail=null:t.head.previous=null;else if(e==t.length-1)n=t.tail,t.tail=n.prev,t.tail.next=null;else{for(;e>i++;)n=n.next;n.prev.next=n.next,n.next.prev=n.prev}t.length--},get:function(e){var t=this;return t.type?t.query[e]:t.node(e).value},node:function(e){var t=this;if(e>t.length-1||0>e)return null;for(var n=t.head,i=0;e>i++;)n=n.next;return n},update:function(e,t){var n=this;return n.type?(n.query[e]=t,void 0):(n.node(e).value=t,void 0)},size:function(){return this.query.length||this.length}}),t}),KISSY.add("gallery/autoResponsive/1.3/gridsort",function(e,t,n){"use strict";function i(){}var r=e.DOM,o="";return i.prototype={init:function(t,n){this.cfg=t,t.owner=n;var i=e.query(t.selector,t.container);switch(t.sortBy){case o:case"grid":default:this._gridSort(i);break;case"cell":this._cellSort(i)}},_gridSort:function(t){var n=this.cfg,i=this._getCols();this._setFrame(),n.random&&(t=t.shuffle()),n.owner.fire("beforeLocate beforeArrange",{autoResponsive:{elms:t}});var r=[];n.exclude!==o&&r.push("_exclude"),n.filter!==o&&r.push("_filter"),n.priority!==o&&r.push("_priority");var a=r.length,s=t.length,u=n.cache?n.owner._lastPos:0,c=u,l=e.noop;if(0==a){n.owner.on("afterUnitArrange",l=function(){++c>=s&&(n.owner.detach("afterUnitArrange",l),c==s&&n.owner.fire("afterArrange",{autoResponsive:{elms:t,frame:n.owner.frame}}))});for(var f=u;s>f;f++)this._render(i,t[f])}else{var h=[];r.push("_tail");for(var d=u;s>d;d++)for(var g,v=0;a+1>v;v++){if(g=this[r[v]](h,d,t[d]),"number"==typeof g){h.splice(g,0,d);break}if("boolean"==typeof g&&g)break}c=0,n.owner.on("afterUnitArrange",l=function(){++c>=_&&(n.owner.detach("afterUnitArrange",l),c==_&&n.owner.fire("afterArrange",{autoResponsive:{elms:t,frame:n.owner.frame}}))});for(var p=0,_=h.length;_>p;p++)this._render(i,t[h[p]])}n.owner._lastPos=s;var m=this._getMinMaxColHeight();n.owner.fire("afterLocate",{autoResponsive:{elms:t,curMinMaxColHeight:m,frame:n.owner.frame}}),this.setHeight(m.max)},_getCols:function(){var e=this.cfg;if(this.containerWH=e.landscapeOrientation?r.outerHeight(e.container):r.outerWidth(e.container),e.owner.curQuery&&e.cache)return e.owner.curQuery;for(var t=new n({}),i=0,o=Math.ceil(this.containerWH/e.gridWidth);o>i;i++)t.add(0);return e.owner.curQuery=t},_setFrame:function(){this.cfg.owner.frame++},_exclude:function(e,t,n){var i=this.cfg;return r.hasClass(n,i.exclude)?!0:void 0},_filter:function(e,t,n){var i=this.cfg;return r.show(n),r.hasClass(n,i.filter)?(r.hide(n),!0):!1},_priority:function(e,t,n){e._priorityInsertPos===void 0&&(e._priorityInsertPos=0);var i=this.cfg;return r.hasClass(n,i.priority)?e._priorityInsertPos++:1/0},_tail:function(){return 1/0},_render:function(e,t){var n=this,i=n.cfg;i.owner.fire("beforeUnitLocate beforeUnitArrange",{autoResponsive:{elm:t,frame:i.owner.frame}});var r=n.coordinate(e,t);i.owner.fire("afterUnitLocate",{autoResponsive:{elm:t,frame:i.owner.frame}}),n.asyncize(function(){n.callAnim(t,r)})},coordinate:function(e,t){var n=this.cfg,i=n.isRecountUnitWH;return(i||!t.__width)&&(t.__width=r.outerWidth(t),t.__height=r.outerHeight(t)),this._autoFit(e,t.__width,t.__height)},_autoFit:function(e,t,n){for(var i,r=this.cfg,o=Math.ceil(((r.landscapeOrientation?n:t)+r.unitMargin.x)/r.gridWidth),a=this._getCur(o,e),s=a[0],u=o+a[0],c=a[1]+(r.landscapeOrientation?t:n)+r.unitMargin.y;u>s;s++)e.update(s,c);return i=[a[0]*r.gridWidth,a[1]],r.landscapeOrientation?i.reverse():i},_getCur:function(e,t){return this._skipALG(e,t)},_stepALG:function(e,t){for(var n=[null,1/0],i=0,r=t.size();r-e+1>i;i++){for(var o=0,a=i;i+e>a;a++)t.get(a)>o&&(o=t.get(a));n[1]>o&&(n=[i,o])}return n},_skipALG:function(e,t){for(var n=1/0,i=0,r=t.size(),o=0;(e>r?0:r-e)>=o;o++){for(var a,s=-1/0,u=0;e>u;u++)if(a=t.get(o+u),a>=n){if(o+=u+1,o>r-e){s=n;break}u=-1,s=-1/0}else a>s&&(s=a);n>s&&(n=s,i=o)}return[i,n]},asyncize:function(e){var t=this,n=t.cfg;n.owner.get("suspend")?setTimeout(function(){e.call(t)},0):e.call(t)},callAnim:function(e,n){var i=this.cfg;new t({elm:e,x:n[0],y:n[1],closeAnim:i.closeAnim,duration:i.duration,easing:i.easing,direction:i.direction,frame:i.owner.frame,owner:i.owner,animType:i.animType}),e.autoResponsiveCoordinate={x:n[0],y:n[1]}},_getMinMaxColHeight:function(){var e=this.cfg,t=1/0,n=e.owner.curQuery.query,i=Math.max.apply(Math,n);if(0==i)t=0;else for(var r=0,o=n.length;o>r;r++)0!=n[r]&&t>n[r]&&(t=n[r]);return{min:t,max:i}},setHeight:function(e){var t=this.cfg;t.autoHeight&&(t.landscapeOrientation?r.width(t.container,e):r.height(t.container,e))},_cellSort:function(t){var n=this,i=[];e.each(t,function(){e.log("star from here!"),i.push(n._getCells())})},_getCells:function(){return this._getCols()}},i},{requires:["./anim","./linkedlist","dom"]}),KISSY.add("gallery/autoResponsive/1.3/base",function(e,t,n){"use strict";function i(){return i.superclass.constructor.apply(this,arguments),e.get(this.get("container"))?(this.fire("beforeInit",{autoResponsive:this}),this.get("autoInit")&&this.init(),this.fire("afterInit",{autoResponsive:this}),void 0):(e.log("can not init, lack of container!"),void 0)}var r=e.DOM,o=e.Event,a=window,s="";return e.extend(i,n,{init:function(){this._bindEvent(),this.initPlugins(),this.render(),e.log("AutoResponsive init!")},initPlugins:function(){for(var e,t=0,n=this.get("plugins"),i=n.length;i>t;t++)e=n[t],e.init(this)},render:function(){var n=this.getAttrVals(),i=this.get("whensRecountUnitWH");n.isRecountUnitWH=!!i.length,this.frame=this.frame||0,arguments[0]&&e.each(arguments[0],function(e,t){n[t]=e}),this.gridSort=this.gridSort||new t,this.gridSort.init(n,this)},_bind:function(t){var n=this,i=n.get("whensRecountUnitWH");n.get("closeResize")||o.on(a,"resize",function(){t.call(n,{isRecountUnitWH:e.inArray("resize",i)})})},_bindEvent:function(){var t=this;t._bind(e.buffer(function(){var e=t.get("delayOnResize");t.fire("beforeResize"),-1!==e?setTimeout(function(){t.render(arguments)},e):t.render(arguments),t.fire("resize")},t.get("resizeFrequency"),t))},adjust:function(t){var n=this.get("whensRecountUnitWH");this.__isAdjusting=1,this.render({isRecountUnitWH:t||e.inArray("adjust",n)}),this.__isAdjusting=0,e.log("adjust success")},isAdjusting:function(){return this.__isAdjusting||0},priority:function(e){this.render({priority:e})},filter:function(e){this.render({filter:e})},margin:function(e){this.render({unitMargin:e})},direction:function(e){this.render({direction:e})},random:function(){this.render({random:!0})},changeCfg:function(t){var n=this;e.each(t,function(e,t){n.set(t,e)})},append:function(e){r.append(e,this.get("container")),this.render({cache:!0})},prepend:function(e){r.prepend(e,this.get("container")),this.render()}},{ATTRS:{container:{value:s},selector:{value:s},filter:{value:s},fixedSelector:{value:s},priority:{value:s},gridWidth:{value:10},unitMargin:{value:{x:0,y:0}},closeAnim:{value:!1},duration:{value:1},easing:{value:"easeNone"},direction:{value:"left"},random:{value:!1},sortBy:{value:s},autoHeight:{value:!0},closeResize:{value:!1},autoInit:{value:!0},plugins:{value:[]},suspend:{value:!0},cache:{value:!1},resizeFrequency:{value:200},whensRecountUnitWH:{value:[]},delayOnResize:{value:-1},landscapeOrientation:{value:!1},exclude:{value:s},animType:{value:s}}}),i},{requires:["./gridsort","base","dom","event"]});