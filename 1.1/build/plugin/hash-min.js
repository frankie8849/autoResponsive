/*! autoResponsive - v1.1 - 2013-07-06 9:03:16 PM
* Copyright (c) 2013 xudafeng; Licensed  */
KISSY.add("gallery/autoResponsive/1.1/plugin/hash",function(e){"use strict";function n(e){var n=this;n.prefix=e.prefix||"ks-",n.api={}}var t="&",i="=";return e.augment(n,{init:function(){var n=this;e.log("hash init!"),n.hasHash()&&n.parse()},hasHash:function(){return location.hash?!0:!1},parse:function(){var e=this;e.getParam()},getParam:function(){var n=this;n.hash=location.hash.split(t),e.each(n.hash,function(e){n.getPriority(e),n.getFilter(e)})},getPriority:function(n){var t=this,r=t.prefix+"priority";-1!=n.indexOf(r)&&e.mix(t.api,{priority:n.split(i)[1]})},getFilter:function(n){var t=this,r=t.prefix+"filter";-1!=n.indexOf(r)&&e.mix(t.api,{filter:n.split(i)[1]})}}),n},{requires:["event"]});