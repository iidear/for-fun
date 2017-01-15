## todo list

### 原生JS写todo list应用

### 实现效果

与ToDoMVC[http://todomvc.com/]一致

### 发现问题

1. IE中元素Node没有.remove()方法，用.removeNode()；

### 总结经验

1. **web应用是基于事件驱动的**

2. 拿到交互稿：

    1. 分析页面结构，划分区块；有初步的html结构，布局css样式

        * 页面: 标题todos + 输入框 + 列表 + 筛选按钮 + 多项控制按钮 + 数量显示

        * 列表项：状态 + 内容 + 删除按钮

    2. 分析页面中涉及的事件；初始化事件，与用户交互的事件

        * 输入框：输入新的todo (keyup.enter)

        * 列表项：更改状态(click)，编辑内容(dblclick)，删除(click)

        * 筛选按钮: 展示不同状态的列表项(click)

        * 改变所有todo的状态，清楚所有已完成项：click

        * 保存、获取记录：localStorage.setItem/getItem

    3. 分析交互事件对数据的影响，确定数据模型

        * 列表：增加、删除、修改单个元素，更改所有元素的状态，删除所有completed元素，获取active状态元素数目

    4. 分析交互事件对页面的改动；确定渲染方式

        * 输入新的todo => items left数量增加；页面处于all/active条件时，列表项增加；页面中只有completed项时，总状态改变；若是输入的第一项，出现列表面板、筛选面板

        * 列表项更改状态 => items left数量变化；页面处于active/completed条件时，列表项减少；若页面中该项状态唯一，总状态改变；若页面中原本只有该项为active，显示clear Completed按钮

        * 列表项删除 => 可能使列表面板、筛选面板隐藏；可能使items left数量改变；可能使clear Completed按钮隐藏；可能改变总状态 ...

        * **联动过于复杂；每次变化时重新渲染整个面板**

    5. MVC思路组织代码：注册事件 => 事件驱动数据改变 => 根据数据更新视图