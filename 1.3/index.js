/**
 * @Description: 目前先挂载base，effect效果插件，hash插件
 * @Author:      dafeng.xdf[at]taobao.com
 * @Date:        2013.3.5
 */
KISSY.add(function (S, AutoResponsive, Hash, Drag, Loader, Sort) {
    AutoResponsive.Hash = Hash;
    AutoResponsive.Drag = Drag;
    AutoResponsive.Loader = Loader;
    AutoResponsive.Sort = Sort;
    return AutoResponsive;
}, {requires: ['./base', './plugin/hash', './plugin/drag', './plugin/loader', './plugin/sort']});
