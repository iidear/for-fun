(function(){
	var Todos = {
		status: 'all', // => all, active, complete
		data: [],
		lengthActive: function () {
			var i = 0;
			this.data.forEach(function(item) {
				if (!item.isComplete) {
					i++;
				}
			})
			return i;
		},
		addItem: function (item) {
			this.data.push(item);
		},
		delItem: function (id) {
			for (var i = 0,len = this.data.length; i < len; i++) {
				if (this.data[i].id == id) {
					this.data.splice(i, 1);
					return true;
				}
			}
		},
		edit: {
			'content': function (id, newContent) {
				Todos.data.some(function(item){
					if (item.id == id) {
						item.content = newContent;
						return true;
					}
				})
			},
			'status': function (id) {
				Todos.data.some(function(item){
					if (item.id == id) {
						item.isComplete = !item.isComplete;
						return true;
					}
				})
			}
		},
		clearComplete: function () {
			this.data = this.data.filter(function(item){
				return item.isComplete == false;
			})
		},
		statusAll: function (status) {
			isComplete = status == 'complete' ? true : false;
			this.data.forEach(function(item){
				item.isComplete = isComplete;
			})
		},
		isAllComplete: function () {
			return this.data.every(function(item){
				return item.isComplete
			})
		},
		isEmpty: function () {
			return !this.data.length;
		}
		
	};

	var View = {

		todo_container: document.getElementById('todo-items'),

		status_all_container: document.getElementById('completeAll'),

		activeNum: document.getElementById('todo-items-active'),

		// 核心逻辑
		// 每次修改时调用，重绘todos
		// 显示不同状态(all, active, complete)的todos
		// 更改对应的状态，items left , 箭头等
		show: function (status) {

			// 记住当前展示面板的状态 => all, active, complete
			var status = Todos.status;

			var items = Todos.data;
			if (status == 'active') {
				items = items.filter(function(item){
					return !item.isComplete
				})
			} else if (status == 'complete') {
				items = items.filter(function(item){
					return item.isComplete
				})
			}

			items = items.map(App.createItem);

			// 清除原来列表中内容
			while (View.todo_container.firstChild) {
				if (View.todo_container.firstChild.removeNode) { // IE
					View.todo_container.firstChild.removeNode();
				} else {
					View.todo_container.firstChild.remove();
				}
			}

			// 更新列表
			for (var i = items.length - 1; i >= 0; i--) {
				View.todo_container.appendChild(items[i]);
			}

			View.updateActiveNum();
			View.showFilterBtn();
			View.allClear();
			View.completeAll();
			View.showBtnClearCompleted();
		},
		updateActiveNum: function () {
			View.activeNum.innerHTML = Todos.lengthActive();
		},
		completeAll: function (status) {
			if (!Todos.isEmpty() && Todos.isAllComplete()) {
				View.status_all_container.className = 'status complete';
			} else {
				View.status_all_container.className = 'status';
			}
		},
		showFilterBtn: function () {
			var btn_showAll = document.getElementById('showAll'),
				btn_showActive = document.getElementById('showActive'),
				btn_showComplete = document.getElementById('showComplete');

			btn_showAll.className = 'btn';
			btn_showActive.className = 'btn';
			btn_showComplete.className = 'btn';

			if (Todos.status == 'all') {
				btn_showAll.className = 'btn cur';
			} else if (Todos.status == 'active') {
				btn_showActive.className = 'btn cur';
			} else if (Todos.status == 'complete') {
				btn_showComplete.className = 'btn cur';
			}
		},
		allClear: function () {
			if (Todos.isEmpty()) {
				document.getElementById('toggle').style.display = 'none';
				document.getElementById('completeAll').style.display = 'none';
			} else {
				document.getElementById('toggle').style.display = 'block';
				document.getElementById('completeAll').style.display = 'block';
			}
			
		},
		showBtnClearCompleted: function () {
			if (Todos.data.length == Todos.lengthActive()){
				document.getElementById('clearComplete').style.display = 'none';
			} else {
				document.getElementById('clearComplete').style.display = 'block';
			}
		}
	}

	var App = {
		_item_id: 0,
		createItem: function (item) {
			var li = document.createElement('li'),
				btnDone = document.createElement('span'),
				btnDel = document.createElement('span'),
				content = document.createElement('span');

			li.className = (item.isComplete ? ' complete': '');
			btnDone.className = 'item-btn-status';
			btnDel.innerHTML = 'x';
			btnDel.className = 'item-btn-del';
			content.innerHTML = item.content;
			content.className = 'item-content';

			btnDel.addEventListener('click', function() {
				Todos.delItem(item.id);
				if (li.removeNode) { // IE
					li.removeNode();
				} else {
					li.remove();
				}
				View.show();
			});

			btnDone.addEventListener('click', function() {
				Todos.edit['status'](item.id);

				if (item.isComplete) {
					li.className = li.className + ' complete';
				} else {
					// removeClass('complete')
					var classnames = li.className.split(' ');
					classnames.splice(classnames.indexOf('complete'), 1);
					li.className = classnames.join(' ');
				}

				View.show();
				
			})

			content.addEventListener('dblclick', function() {
				content.setAttribute('contenteditable', true);
				content.focus();

				content.addEventListener('blur', saveContent);
				content.addEventListener('keydown', handerKeyup);

				function handerKeyup (event) {
					if (event.keyCode == 13) {
						saveContent();
					}
				}
				function saveContent (event) {
					content.setAttribute('contenteditable', false);
					item.content = content.innerHTML;
					content.removeEventListener('blue', saveContent, true);
					content.removeEventListener('keyup', handerKeyup, true);
				}
			})

			// 使用了相邻选择器 ~ ，需将content节点放在前面
			li.appendChild(content);
			li.appendChild(btnDone);
			li.appendChild(btnDel);

			return li
		},
		onEnter: function () {
			document.addEventListener('keyup', function(event){
				if (event.keyCode == 13) {
					var input = document.getElementById('input-content');
					if (input.value == '') {
						return false;
					}

					var item = {
						id: App._item_id++,
						content: input.value,
						isComplete: false
					};

					Todos.addItem(item);
					View.show();

					input.value = '';

					
				}
			})
		},
		onCompleteAll: function () {
			document.getElementById('completeAll').addEventListener('click', function() {
				if (Todos.isAllComplete()) {
					Todos.statusAll('active');
				} else {
					Todos.statusAll('complete');
				}

				View.show();

			})
		},
		onShowAll: function () {
			document.getElementById('showAll').addEventListener('click', function(event) {
				Todos.status = 'all';
				View.show();
			})
		},
		onShowActive: function () {
			document.getElementById('showActive').addEventListener('click', function() {
				Todos.status = 'active';
				View.show();
			})
		},
		onShowComplete: function () {
			document.getElementById('showComplete').addEventListener('click', function(event) {
				Todos.status = 'complete';
				View.show();
			})
		},
		onClearComplete: function () {
			document.getElementById('clearComplete').addEventListener('click', function(event) {
				Todos.clearComplete();
				Todos.status = 'all';
				View.show();
			})
		},
		init: function () {
			this.onEnter();
			this.onShowAll();
			this.onShowComplete();
			this.onShowActive();
			this.onClearComplete();
			this.onCompleteAll();

			var storage = JSON.parse(localStorage.getItem('todos-js'));
			Todos.data = storage.data;
			Todos.status = storage.status;
			View.show();
		}
	}

	window.onload = function () {
		App.init();
	}

	window.onbeforeunload = function () {
		localStorage.setItem('todos-js', JSON.stringify({
			data: Todos.data,
			status: Todos.status
		}));
	}
})();