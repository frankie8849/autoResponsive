/*! autoResponsive - v1.1 - 2013-07-08 1:27:06 PM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.1/plugin/hash",function(t){"use strict";function e(t){var e=this;e.prefix=t.prefix||"ks-",e.api={}}var i="&",n="=";return t.augment(e,{init:function(){var e=this;t.log("hash init!"),e.hasHash()&&e.parse()},hasHash:function(){return location.hash?!0:!1},parse:function(){var t=this;t.getParam()},getParam:function(){var e=this;e.hash=location.hash.split(i),t.each(e.hash,function(t){e.getPriority(t),e.getFilter(t)})},getPriority:function(e){var i=this,r=i.prefix+"priority";-1!=e.indexOf(r)&&t.mix(i.api,{priority:e.split(n)[1]})},getFilter:function(e){var i=this,r=i.prefix+"filter";-1!=e.indexOf(r)&&t.mix(i.api,{filter:e.split(n)[1]})}}),e},{requires:["event"]});