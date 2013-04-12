##GMU##
GMU是基于zepto的轻量级mobile UI组件库，符合jquery ui使用规范，提供webapp、pad端简单易用的UI组件。为了减小代码量，提高性能，组件再插件化，兼容iOS3+ / android2.1+，支持国内主流移动端浏览器，如safari, chrome, UC, qq等。
GMU由百度GMU小组开发，基于开源BSD协议，支持商业和非商业用户的免费使用和任意修改，您可以通过[get started](http://gmu.baidu.com/getstarted)快速了解。

###Quick Start###
+ **[官网]：**http://gmu.baidu.com/
+ **[API]：**http://gmu.baidu.com/doc

###GMU组件###
1. **扩展在zepto上的公用方法**
<table>
<thead>
<tr>
  <th>公共方法</th> <th>description</th>
</tr>
</thead>
<tbody>
  <tr>
    <td><a href="https://github.com/campaign/gmu/blob/master/_src/core/zepto.fix.js">zepto.fix</a></td>
    <td>通用fix方法，实现position:fix效果</td>
  </tr>
  <tr>
    <td><a href="https://github.com/campaign/gmu/blob/master/_src/core/zepto.highlight.js">zepto.highlight</a></td>
    <td>点击高亮效果</td>
  </tr>
  <tr>
    <td><a href="https://github.com/madrobby/zepto/blob/master/src/event.js#files">zepto.imglazyload</a></td>
    <td>图片延迟加载，支持iscroll中图片延迟加载</td>
  </tr>
  <tr>
    <td><a href="https://github.com/campaign/gmu/blob/master/_src/core/zepto.iscroll.js">zepto.iscroll</a></td>
    <td>将<a href="http://cubiq.org/iscroll-4">iScroll 4</a>进行精简，挂载到zepto中，通过<code>$('#iscroll').iScroll()</code>调用</td>
  </tr>
  <tr>
    <td><a href="https://github.com/campaign/gmu/blob/master/_src/core/zepto.position.js">zepto.position</a></td>
    <td>类似于jquery position，处理元素定位，支持at,my,of,with等参数</td>
  </tr>
  <tr>
      <td><a href="https://github.com/campaign/gmu/blob/master/_src/core/zepto.location.js">zepto.location</a></td>
      <td>基于百度定位接口，获取当前坐标</td>
    </tr>
</tbody>
</table>
2. **UI组件**
<table>
    <thead>
    <tr>
        <th>组件名</th>
        <th>描述</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/suggestion.js">suggestion</a></td>
        <td>搜索建议</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/quickdelete.js">quickdelete</a></td>
        <td>快速删除</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/tabs.js">tabs（包括插件tabs.swipe和tabs.ajax）</a></td>
        <td>tab切换</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/slider.js">slider（包括插件slider.dynamic）</a></td>
        <td>图片轮播</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/navigator.js">navigator（包括插件navigator.iscroll）</a></td>
        <td>导航栏</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/dialog.js">dialog（包括插件dialog.position）</a></td>
        <td>对话框</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/panel.js">panel</a></td>
        <td>面板切换</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/refresh.js">refresh（包括插件refresh.iscroll,refresh.iOS5,refresh.lite）</a></td>
        <td>点击刷新，拉动刷新</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/dropmenu.js">dropmenu（包括插件dropmenu.iscroll）</a></td>
        <td>下拉框</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/gotop.js">gotop（包括插件gotop.iscroll）</a></td>
        <td>返回顶部</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/progressbar.js">progressbar</a></td>
        <td>进度条</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/datepicker.js">datepicker</a></td>
        <td>日历</td>
    </tr>
    <tr>
        <td><a href="https://github.com/campaign/gmu/blob/master/_src/widget/button.js">button（包括插件button.input）</a></td>
        <td>按钮</td>
    </tr>
    </tbody>
</table>

###版本说明###
1. 2.0.3，基于[zepto 1.0rc1](http://zeptojs.com/)开发，包括14个通用UI组件及各组件相关插件   **latest version**

##反馈bug##
如果您有任何关于GMU或移动前端开发中的问题，可以在QQ群中讨论，也可以通过[git issue](https://github.com/campaign/gmu/issues)给我们反馈bug，我们会尽快解决。
当然，我们更欢迎您的fork，为GMU添砖加瓦。

###联系我们###
+ QQ：127405799
+ [Email]：gmu@baidu.com

