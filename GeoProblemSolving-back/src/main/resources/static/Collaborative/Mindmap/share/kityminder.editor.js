/*!
 * ====================================================
 * kityminder-editor - v1.0.67 - 2020-01-08
 * https://github.com/fex-team/kityminder-editor
 * GitHub: https://github.com/fex-team/kityminder-editor 
 * Copyright (c) 2020 ; Licensed 
 * ====================================================
 */

(function () {
var _p = {
    r: function(index) {
        if (_p[index].inited) {
            return _p[index].value;
        }
        if (typeof _p[index].value === "function") {
            var module = {
                exports: {}
            }, returnValue = _p[index].value(null, module.exports, module);
            _p[index].inited = true;
            _p[index].value = returnValue;
            if (returnValue !== undefined) {
                return returnValue;
            } else {
                for (var key in module.exports) {
                    if (module.exports.hasOwnProperty(key)) {
                        _p[index].inited = true;
                        _p[index].value = module.exports;
                        return module.exports;
                    }
                }
            }
        } else {
            _p[index].inited = true;
            return _p[index].value;
        }
    }
};

//src/editor.js
_p[0] = {
    value: function(require, exports, module) {
        /**
     * 运行时
     */
        var runtimes = [];
        function assemble(runtime) {
            runtimes.push(runtime);
        }
        function KMEditor(selector) {
            this.selector = selector;
            for (var i = 0; i < runtimes.length; i++) {
                if (typeof runtimes[i] == "function") {
                    runtimes[i].call(this, this);
                }
            }
        }
        KMEditor.assemble = assemble;
        assemble(_p.r(7));
        assemble(_p.r(8));
        assemble(_p.r(9));
        return module.exports = KMEditor;
    }
};

//src/expose-editor.js
/**
 * @fileOverview
 *
 * 打包暴露
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[1] = {
    value: function(require, exports, module) {
        return module.exports = kityminder.Editor = _p.r(0);
    }
};

//src/hotbox.js
_p[2] = {
    value: function(require, exports, module) {
        return module.exports = window.HotBox;
    }
};

//src/lang.js
_p[3] = {
    value: function(require, exports, module) {}
};

//src/minder.js
_p[4] = {
    value: function(require, exports, module) {
        return module.exports = window.kityminder.Minder;
    }
};

//src/runtime/clipboard-mimetype.js
/**
 * @Desc: 新增一个用于处理系统ctrl+c ctrl+v等方式导入导出节点的MIMETYPE处理，如系统不支持clipboardEvent或者是FF则不初始化改class
 * @Editor: Naixor
 * @Date: 2015.9.21
 */
_p[5] = {
    value: function(require, exports, module) {
        function MimeType() {
            /**
		 * 私有变量
		 */
            var SPLITOR = "\ufeff";
            var MIMETYPE = {
                "application/km": "￿"
            };
            var SIGN = {
                "\ufeff": "SPLITOR",
                "￿": "application/km"
            };
            /**
		 * 用于将一段纯文本封装成符合其数据格式的文本
		 * @method process 			private
		 * @param  {MIMETYPE} mimetype 数据格式
		 * @param  {String} text     原始文本
		 * @return {String}          符合该数据格式下的文本
		 * @example
		 * 			var str = "123";
		 * 			str = process('application/km', str); // 返回的内容再经过MimeType判断会读取出其数据格式为application/km
		 * 			process('text/plain', str); // 若接受到一个非纯文本信息，则会将其转换为新的数据格式
		 */
            function process(mimetype, text) {
                if (!this.isPureText(text)) {
                    var _mimetype = this.whichMimeType(text);
                    if (!_mimetype) {
                        throw new Error("unknow mimetype!");
                    }
                    text = this.getPureText(text);
                }
                if (mimetype === false) {
                    return text;
                }
                return mimetype + SPLITOR + text;
            }
            /**
		 * 注册数据类型的标识
		 * @method registMimeTypeProtocol  	public
		 * @param  {String} type 数据类型
		 * @param  {String} sign 标识
		 */
            this.registMimeTypeProtocol = function(type, sign) {
                if (sign && SIGN[sign]) {
                    throw new Error("sing has registed!");
                }
                if (type && !!MIMETYPE[type]) {
                    throw new Error("mimetype has registed!");
                }
                SIGN[sign] = type;
                MIMETYPE[type] = sign;
            };
            /**
		 * 获取已注册数据类型的协议
		 * @method getMimeTypeProtocol  	public
		 * @param  {String} type 数据类型
		 * @param  {String} text|undefiend  文本内容或不传入
		 * @return {String|Function} 
		 * @example 
		 * 			text若不传入则直接返回对应数据格式的处理(process)方法
		 * 			若传入文本则直接调用对应的process方法进行处理，此时返回处理后的内容
		 * 			var m = new MimeType();
		 * 			var kmprocess = m.getMimeTypeProtocol('application/km');
		 * 			kmprocess("123") === m.getMimeTypeProtocol('application/km', "123");
		 * 			
		 */
            this.getMimeTypeProtocol = function(type, text) {
                var mimetype = MIMETYPE[type] || false;
                if (text === undefined) {
                    return process.bind(this, mimetype);
                }
                return process(mimetype, text);
            };
            this.getSpitor = function() {
                return SPLITOR;
            };
            this.getMimeType = function(sign) {
                if (sign !== undefined) {
                    return SIGN[sign] || null;
                }
                return MIMETYPE;
            };
        }
        MimeType.prototype.isPureText = function(text) {
            return !~text.indexOf(this.getSpitor());
        };
        MimeType.prototype.getPureText = function(text) {
            if (this.isPureText(text)) {
                return text;
            }
            return text.split(this.getSpitor())[1];
        };
        MimeType.prototype.whichMimeType = function(text) {
            if (this.isPureText(text)) {
                return null;
            }
            return this.getMimeType(text.split(this.getSpitor())[0]);
        };
        function MimeTypeRuntime() {
            if (this.minder.supportClipboardEvent && !kity.Browser.gecko) {
                this.MimeType = new MimeType();
            }
        }
        return module.exports = MimeTypeRuntime;
    }
};

//src/runtime/clipboard.js
/**
 * @Desc: 处理editor的clipboard事件，只在支持ClipboardEvent并且不是FF的情况下工作
 * @Editor: Naixor
 * @Date: 2015.9.21
 */
_p[6] = {
    value: function(require, exports, module) {
        function ClipboardRuntime() {
            var minder = this.minder;
            var Data = window.kityminder.data;
            if (!minder.supportClipboardEvent || kity.Browser.gecko) {
                return;
            }
            var fsm = this.fsm;
            var receiver = this.receiver;
            var MimeType = this.MimeType;
            var kmencode = MimeType.getMimeTypeProtocol("application/km"), decode = Data.getRegisterProtocol("json").decode;
            var _selectedNodes = [];
            /*
		 * 增加对多节点赋值粘贴的处理
		 */
            function encode(nodes) {
                var _nodes = [];
                for (var i = 0, l = nodes.length; i < l; i++) {
                    _nodes.push(minder.exportNode(nodes[i]));
                }
                return kmencode(Data.getRegisterProtocol("json").encode(_nodes));
            }
            var beforeCopy = function(e) {
                if (document.activeElement == receiver.element) {
                    var clipBoardEvent = e;
                    var state = fsm.state();
                    switch (state) {
                      case "input":
                        {
                            break;
                        }

                      case "normal":
                        {
                            var nodes = [].concat(minder.getSelectedNodes());
                            if (nodes.length) {
                                // 这里由于被粘贴复制的节点的id信息也都一样，故做此算法
                                // 这里有个疑问，使用node.getParent()或者node.parent会离奇导致出现非选中节点被渲染成选中节点，因此使用isAncestorOf，而没有使用自行回溯的方式
                                if (nodes.length > 1) {
                                    var targetLevel;
                                    nodes.sort(function(a, b) {
                                        return a.getLevel() - b.getLevel();
                                    });
                                    targetLevel = nodes[0].getLevel();
                                    if (targetLevel !== nodes[nodes.length - 1].getLevel()) {
                                        var plevel, pnode, idx = 0, l = nodes.length, pidx = l - 1;
                                        pnode = nodes[pidx];
                                        while (pnode.getLevel() !== targetLevel) {
                                            idx = 0;
                                            while (idx < l && nodes[idx].getLevel() === targetLevel) {
                                                if (nodes[idx].isAncestorOf(pnode)) {
                                                    nodes.splice(pidx, 1);
                                                    break;
                                                }
                                                idx++;
                                            }
                                            pidx--;
                                            pnode = nodes[pidx];
                                        }
                                    }
                                }
                                var str = encode(nodes);
                                clipBoardEvent.clipboardData.setData("text/plain", str);
                            }
                            e.preventDefault();
                            break;
                        }
                    }
                }
            };
            var beforeCut = function(e) {
                if (document.activeElement == receiver.element) {
                    if (minder.getStatus() !== "normal") {
                        e.preventDefault();
                        return;
                    }
                    var clipBoardEvent = e;
                    var state = fsm.state();
                    switch (state) {
                      case "input":
                        {
                            break;
                        }

                      case "normal":
                        {
                            var nodes = minder.getSelectedNodes();
                            if (nodes.length) {
                                clipBoardEvent.clipboardData.setData("text/plain", encode(nodes));
                                minder.execCommand("removenode");
                            }
                            e.preventDefault();
                            break;
                        }
                    }
                }
            };
            var beforePaste = function(e) {
                if (document.activeElement == receiver.element) {
                    if (minder.getStatus() !== "normal") {
                        e.preventDefault();
                        return;
                    }
                    var clipBoardEvent = e;
                    var state = fsm.state();
                    var textData = clipBoardEvent.clipboardData.getData("text/plain");
                    switch (state) {
                      case "input":
                        {
                            // input状态下如果格式为application/km则不进行paste操作
                            if (!MimeType.isPureText(textData)) {
                                e.preventDefault();
                                return;
                            }
                            break;
                        }

                      case "normal":
                        {
                            /*
						 * 针对normal状态下通过对选中节点粘贴导入子节点文本进行单独处理
						 */
                            var sNodes = minder.getSelectedNodes();
                            if (MimeType.whichMimeType(textData) === "application/km") {
                                var nodes = decode(MimeType.getPureText(textData));
                                var _node;
                                sNodes.forEach(function(node) {
                                    // 由于粘贴逻辑中为了排除子节点重新排序导致逆序，因此复制的时候倒过来
                                    for (var i = nodes.length - 1; i >= 0; i--) {
                                        _node = minder.createNode(null, node);
                                        minder.importNode(_node, nodes[i]);
                                        _selectedNodes.push(_node);
                                        node.appendChild(_node);
                                    }
                                });
                                minder.select(_selectedNodes, true);
                                _selectedNodes = [];
                                minder.refresh();
                            } else if (clipBoardEvent.clipboardData && clipBoardEvent.clipboardData.items[0].type.indexOf("image") > -1) {
                                var imageFile = clipBoardEvent.clipboardData.items[0].getAsFile();
                                var serverService = angular.element(document.body).injector().get("server");
                                return serverService.uploadImage(imageFile).then(function(json) {
                                    var resp = json.data;
                                    if (resp.errno === 0) {
                                        minder.execCommand("image", resp.data.url);
                                    }
                                });
                            } else {
                                sNodes.forEach(function(node) {
                                    minder.Text2Children(node, textData);
                                });
                            }
                            e.preventDefault();
                            break;
                        }
                    }
                }
            };
            /**
		 * 由editor的receiver统一处理全部事件，包括clipboard事件
		 * @Editor: Naixor
		 * @Date: 2015.9.24
		 */
            document.addEventListener("copy", beforeCopy);
            document.addEventListener("cut", beforeCut);
            document.addEventListener("paste", beforePaste);
        }
        return module.exports = ClipboardRuntime;
    }
};

//src/runtime/container.js
/**
 * @fileOverview
 *
 * 初始化编辑器的容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[7] = {
    value: function(require, exports, module) {
        /**
     * 最先执行的 Runtime，初始化编辑器容器
     */
        function ContainerRuntime() {
            var container;
            if (typeof this.selector == "string") {
                container = document.querySelector(this.selector);
            } else {
                container = this.selector;
            }
            if (!container) throw new Error("Invalid selector: " + this.selector);
            // 这个类名用于给编辑器添加样式
            container.classList.add("km-editor");
            // 暴露容器给其他运行时使用
            this.container = container;
        }
        return module.exports = ContainerRuntime;
    }
};

//src/runtime/fsm.js
/**
 * @fileOverview
 *
 * 编辑器状态机
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[8] = {
    value: function(require, exports, module) {
        var Debug = _p.r(10);
        var debug = new Debug("fsm");
        function handlerConditionMatch(condition, when, exit, enter) {
            if (condition.when != when) return false;
            if (condition.enter != "*" && condition.enter != enter) return false;
            if (condition.exit != "*" && condition.exit != exit) return;
            return true;
        }
        function FSM(defaultState) {
            var currentState = defaultState;
            var BEFORE_ARROW = " - ";
            var AFTER_ARROW = " -> ";
            var handlers = [];
            /**
         * 状态跳转
         *
         * 会通知所有的状态跳转监视器
         *
         * @param  {string} newState  新状态名称
         * @param  {any} reason 跳转的原因，可以作为参数传递给跳转监视器
         */
            this.jump = function(newState, reason) {
                if (!reason) throw new Error("Please tell fsm the reason to jump");
                var oldState = currentState;
                var notify = [ oldState, newState ].concat([].slice.call(arguments, 1));
                var i, handler;
                // 跳转前
                for (i = 0; i < handlers.length; i++) {
                    handler = handlers[i];
                    if (handlerConditionMatch(handler.condition, "before", oldState, newState)) {
                        if (handler.apply(null, notify)) return;
                    }
                }
                currentState = newState;
                debug.log("[{0}] {1} -> {2}", reason, oldState, newState);
                // 跳转后
                for (i = 0; i < handlers.length; i++) {
                    handler = handlers[i];
                    if (handlerConditionMatch(handler.condition, "after", oldState, newState)) {
                        handler.apply(null, notify);
                    }
                }
                return currentState;
            };
            /**
         * 返回当前状态
         * @return {string}
         */
            this.state = function() {
                return currentState;
            };
            /**
         * 添加状态跳转监视器
         * 
         * @param {string} condition
         *     监视的时机
         *         "* => *" （默认）
         *
         * @param  {Function} handler
         *     监视函数，当状态跳转的时候，会接收三个参数
         *         * from - 跳转前的状态
         *         * to - 跳转后的状态
         *         * reason - 跳转的原因
         */
            this.when = function(condition, handler) {
                if (arguments.length == 1) {
                    handler = condition;
                    condition = "* -> *";
                }
                var when, resolved, exit, enter;
                resolved = condition.split(BEFORE_ARROW);
                if (resolved.length == 2) {
                    when = "before";
                } else {
                    resolved = condition.split(AFTER_ARROW);
                    if (resolved.length == 2) {
                        when = "after";
                    }
                }
                if (!when) throw new Error("Illegal fsm condition: " + condition);
                exit = resolved[0];
                enter = resolved[1];
                handler.condition = {
                    when: when,
                    exit: exit,
                    enter: enter
                };
                handlers.push(handler);
            };
        }
        function FSMRumtime() {
            this.fsm = new FSM("normal");
        }
        return module.exports = FSMRumtime;
    }
};

//src/runtime/minder.js
/**
 * @fileOverview
 *
 * 脑图示例运行时
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[9] = {
    value: function(require, exports, module) {
        var Minder = _p.r(4);
        function MinderRuntime() {
            // 不使用 kityminder 的按键处理，由 ReceiverRuntime 统一处理
            var minder = new Minder({
                enableKeyReceiver: false,
                enableAnimation: true
            });
            // 渲染，初始化
            minder.renderTo(this.selector);
            minder.setTheme(null);
            minder.select(minder.getRoot(), true);
            minder.execCommand("text", "Main topic");
            // 导出给其它 Runtime 使用
            this.minder = minder;
        }
        return module.exports = MinderRuntime;
    }
};

//src/tool/debug.js
/**
 * @fileOverview
 *
 * 支持各种调试后门
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[10] = {
    value: function(require, exports, module) {
        var format = _p.r(11);
        function noop() {}
        function stringHash(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash += str.charCodeAt(i);
            }
            return hash;
        }
        /* global console */
        function Debug(flag) {
            var debugMode = this.flaged = window.location.search.indexOf(flag) != -1;
            if (debugMode) {
                var h = stringHash(flag) % 360;
                var flagStyle = format("background: hsl({0}, 50%, 80%); " + "color: hsl({0}, 100%, 30%); " + "padding: 2px 3px; " + "margin: 1px 3px 0 0;" + "border-radius: 2px;", h);
                var textStyle = "background: none; color: black;";
                this.log = function() {
                    var output = format.apply(null, arguments);
                    console.log(format("%c{0}%c{1}", flag, output), flagStyle, textStyle);
                };
            } else {
                this.log = noop;
            }
        }
        return module.exports = Debug;
    }
};

//src/tool/format.js
_p[11] = {
    value: function(require, exports, module) {
        function format(template, args) {
            if (typeof args != "object") {
                args = [].slice.call(arguments, 1);
            }
            return String(template).replace(/\{(\w+)\}/gi, function(match, $key) {
                return args[$key] || $key;
            });
        }
        return module.exports = format;
    }
};

//src/tool/innertext.js
/**
 * @fileOverview
 *
 * innerText polyfill
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[12] = {
    value: function(require, exports, module) {
        if (!("innerText" in document.createElement("a")) && "getSelection" in window) {
            HTMLElement.prototype.__defineGetter__("innerText", function() {
                var selection = window.getSelection(), ranges = [], str, i;
                // Save existing selections.
                for (i = 0; i < selection.rangeCount; i++) {
                    ranges[i] = selection.getRangeAt(i);
                }
                // Deselect everything.
                selection.removeAllRanges();
                // Select `el` and all child nodes.
                // 'this' is the element .innerText got called on
                selection.selectAllChildren(this);
                // Get the string representation of the selected nodes.
                str = selection.toString();
                // Deselect everything. Again.
                selection.removeAllRanges();
                // Restore all formerly existing selections.
                for (i = 0; i < ranges.length; i++) {
                    selection.addRange(ranges[i]);
                }
                // Oh look, this is what we wanted.
                // String representation of the element, close to as rendered.
                return str;
            });
            HTMLElement.prototype.__defineSetter__("innerText", function(text) {
                /**
             * @Desc: 解决FireFox节点内容删除后text为null，出现报错的问题
             * @Editor: Naixor
             * @Date: 2015.9.16
             */
                this.innerHTML = (text || "").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
            });
        }
    }
};

//src/tool/jsondiff.js
/**
 * @fileOverview
 *
 *
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
_p[13] = {
    value: function(require, exports, module) {
        /*!
    * https://github.com/Starcounter-Jack/Fast-JSON-Patch
    * json-patch-duplex.js 0.5.0
    * (c) 2013 Joachim Wester
    * MIT license
    */
        var _objectKeys = function() {
            if (Object.keys) return Object.keys;
            return function(o) {
                var keys = [];
                for (var i in o) {
                    if (o.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            };
        }();
        function escapePathComponent(str) {
            if (str.indexOf("/") === -1 && str.indexOf("~") === -1) return str;
            return str.replace(/~/g, "~0").replace(/\//g, "~1");
        }
        function deepClone(obj) {
            if (typeof obj === "object") {
                return JSON.parse(JSON.stringify(obj));
            } else {
                return obj;
            }
        }
        // Dirty check if obj is different from mirror, generate patches and update mirror
        function _generate(mirror, obj, patches, path) {
            var newKeys = _objectKeys(obj);
            var oldKeys = _objectKeys(mirror);
            var changed = false;
            var deleted = false;
            for (var t = oldKeys.length - 1; t >= 0; t--) {
                var key = oldKeys[t];
                var oldVal = mirror[key];
                if (obj.hasOwnProperty(key)) {
                    var newVal = obj[key];
                    if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
                        _generate(oldVal, newVal, patches, path + "/" + escapePathComponent(key));
                    } else {
                        if (oldVal != newVal) {
                            changed = true;
                            patches.push({
                                op: "replace",
                                path: path + "/" + escapePathComponent(key),
                                value: deepClone(newVal)
                            });
                        }
                    }
                } else {
                    patches.push({
                        op: "remove",
                        path: path + "/" + escapePathComponent(key)
                    });
                    deleted = true;
                }
            }
            if (!deleted && newKeys.length == oldKeys.length) {
                return;
            }
            for (var t = 0; t < newKeys.length; t++) {
                var key = newKeys[t];
                if (!mirror.hasOwnProperty(key)) {
                    patches.push({
                        op: "add",
                        path: path + "/" + escapePathComponent(key),
                        value: deepClone(obj[key])
                    });
                }
            }
        }
        function compare(tree1, tree2) {
            var patches = [];
            _generate(tree1, tree2, patches, "");
            return patches;
        }
        return module.exports = compare;
    }
};

//src/tool/key.js
_p[14] = {
    value: function(require, exports, module) {
        var keymap = _p.r(15);
        var CTRL_MASK = 4096;
        var ALT_MASK = 8192;
        var SHIFT_MASK = 16384;
        function hash(unknown) {
            if (typeof unknown == "string") {
                return hashKeyExpression(unknown);
            }
            return hashKeyEvent(unknown);
        }
        function is(a, b) {
            return a && b && hash(a) == hash(b);
        }
        exports.hash = hash;
        exports.is = is;
        function hashKeyEvent(keyEvent) {
            var hashCode = 0;
            if (keyEvent.ctrlKey || keyEvent.metaKey) {
                hashCode |= CTRL_MASK;
            }
            if (keyEvent.altKey) {
                hashCode |= ALT_MASK;
            }
            if (keyEvent.shiftKey) {
                hashCode |= SHIFT_MASK;
            }
            // Shift, Control, Alt KeyCode ignored.
            if ([ 16, 17, 18, 91 ].indexOf(keyEvent.keyCode) === -1) {
                /**
             * 解决浏览器输入法状态下对keyDown的keyCode判断不准确的问题,使用keyIdentifier,
             * 可以解决chrome和safari下的各种问题,其他浏览器依旧有问题,然而那并不影响我们对特
             * 需判断的按键进行判断(比如Space在safari输入法态下就是229,其他的就不是)
             * @editor Naixor
             * @Date 2015-12-2
             */
                if (keyEvent.keyCode === 229 && keyEvent.keyIdentifier) {
                    return hashCode |= parseInt(keyEvent.keyIdentifier.substr(2), 16);
                }
                hashCode |= keyEvent.keyCode;
            }
            return hashCode;
        }
        function hashKeyExpression(keyExpression) {
            var hashCode = 0;
            keyExpression.toLowerCase().split(/\s*\+\s*/).forEach(function(name) {
                switch (name) {
                  case "ctrl":
                  case "cmd":
                    hashCode |= CTRL_MASK;
                    break;

                  case "alt":
                    hashCode |= ALT_MASK;
                    break;

                  case "shift":
                    hashCode |= SHIFT_MASK;
                    break;

                  default:
                    hashCode |= keymap[name];
                }
            });
            return hashCode;
        }
    }
};

//src/tool/keymap.js
_p[15] = {
    value: function(require, exports, module) {
        var keymap = {
            Shift: 16,
            Control: 17,
            Alt: 18,
            CapsLock: 20,
            BackSpace: 8,
            Tab: 9,
            Enter: 13,
            Esc: 27,
            Space: 32,
            PageUp: 33,
            PageDown: 34,
            End: 35,
            Home: 36,
            Insert: 45,
            Left: 37,
            Up: 38,
            Right: 39,
            Down: 40,
            Direction: {
                37: 1,
                38: 1,
                39: 1,
                40: 1
            },
            Del: 46,
            NumLock: 144,
            Cmd: 91,
            CmdFF: 224,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            "`": 192,
            "=": 187,
            "-": 189,
            "/": 191,
            ".": 190
        };
        // 小写适配
        for (var key in keymap) {
            if (keymap.hasOwnProperty(key)) {
                keymap[key.toLowerCase()] = keymap[key];
            }
        }
        var aKeyCode = 65;
        var aCharCode = "a".charCodeAt(0);
        // letters
        "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(letter) {
            keymap[letter] = aKeyCode + (letter.charCodeAt(0) - aCharCode);
        });
        // numbers
        var n = 9;
        do {
            keymap[n.toString()] = n + 48;
        } while (--n);
        module.exports = keymap;
    }
};

var moduleMapping = {
    "expose-editor": 1
};

function use(name) {
    _p.r([ moduleMapping[name] ]);
}
angular.module('kityminderEditor', [
    'ui.bootstrap',
	'ui.codemirror',
	'ui.colorpicker'
])
	.config(["$sceDelegateProvider", function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			// Allow same origin resource loads.
			'self',
			// Allow loading from our assets domain.  Notice the difference between * and **.
			'http://agroup.baidu.com:8910/**',
            'http://cq01-fe-rdtest01.vm.baidu.com:8910/**',
            'http://agroup.baidu.com:8911/**'
		]);
	}]);
angular.module('kityminderEditor').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('ui/directive/appendNode/appendNode.html',
    "<div class=\"km-btn-group append-group\"><div class=\"km-btn-item append-child-node\" ng-disabled=\"minder.queryCommandState('AppendChildNode') === -1\" ng-click=\"minder.queryCommandState('AppendChildNode') === -1 || execCommand('AppendChildNode')\" title=\"{{ 'appendchildnode' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'appendchildnode' | lang:'ui/command' }}</span></div><div class=\"km-btn-item append-parent-node\" ng-disabled=\"minder.queryCommandState('AppendParentNode') === -1\" ng-click=\"minder.queryCommandState('AppendParentNode') === -1 || execCommand('AppendParentNode')\" title=\"{{ 'appendparentnode' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'appendparentnode' | lang:'ui/command' }}</span></div><div class=\"km-btn-item append-sibling-node\" ng-disabled=\"minder.queryCommandState('AppendSiblingNode') === -1\" ng-click=\"minder.queryCommandState('AppendSiblingNode') === -1 ||execCommand('AppendSiblingNode')\" title=\"{{ 'appendsiblingnode' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'appendsiblingnode' | lang:'ui/command' }}</span></div></div>"
  );


  $templateCache.put('ui/directive/arrange/arrange.html',
    "<div class=\"km-btn-group arrange-group\"><div class=\"km-btn-item arrange-up\" ng-disabled=\"minder.queryCommandState('ArrangeUp') === -1\" ng-click=\"minder.queryCommandState('ArrangeUp') === -1 || minder.execCommand('ArrangeUp')\" title=\"{{ 'arrangeup' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'arrangeup' | lang:'ui/command' }}</span></div><div class=\"km-btn-item arrange-down\" ng-disabled=\"minder.queryCommandState('ArrangeDown') === -1\" ng-click=\"minder.queryCommandState('ArrangeDown') === -1 || minder.execCommand('ArrangeDown');\" title=\"{{ 'arrangedown' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'arrangedown' | lang:'ui/command' }}</span></div></div>"
  );


  $templateCache.put('ui/directive/collabPanel/collabPanel.html',
    "<div style=\"float: right\"><span class=\"glyphicon glyphicon-link\" aria-hidden=\"true\" title=\"Click it and start collaboration\" ng-show=\"!collaboration\" style=\"margin-left: 10px;cursor:pointer;margin-right: 30px\" ng-click=\"startCollab()\"></span> <span class=\"glyphicon glyphicon-globe\" aria-hidden=\"true\" title=\"Click it and stop collaboration\" ng-show=\"collaboration\" style=\"margin-left: 10px;cursor:pointer;margin-right: 30px\" ng-click=\"stopCollab()\"></span> <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\" title=\"Apply to draw the mind map\" ng-show=\"!draw\" style=\"cursor:pointer;margin-right: 20px\" ng-click=\"applyCtrl()\"></span> <span class=\"glyphicon glyphicon-refresh\" id=\"giveup-ctrl\" aria-hidden=\"true\" title=\"Give up to draw the mind map\" ng-show=\"draw\" style=\"cursor:pointer;margin-right: 20px\" ng-click=\"giveupCtrl()\"></span> <span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\" title=\"{{drawer}} is drawing the mind map\" style=\"margin-right: 10px\" ng-show=\"draw\"></span> <span ng-show=\"draw\" style=\"margin-right: 10px;margin-left: 10px\">{{leftApply}} people waiting for drawing.</span> <span data-toggle=\"modal\" data-target=\"#onlineUsers\" style=\"max-width: 500px; overflow: hidden; cursor: pointer\"><span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\" ng-repeat=\"user in participants\" title=\"{{user.name}}\" style=\"margin-left: 15px;margin-right: 5px\"></span>...</span><div class=\"modal fade\" id=\"onlineUsers\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\" style=\"color: black\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">Online participants</h4></div><div class=\"modal-body\"><div style=\"min-height: 100px\"><div style=\"float:left; cursor: pointer\" id=\"collaPanel\" ng-repeat=\"user in participants\" ng-click=\"gotoUserspace(user.id)\"><span class=\"glyphicon glyphicon-user\" style=\"margin-right: 5px\"></span><span>{{user.name}}</span></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div></div>"
  );


  $templateCache.put('ui/directive/colorPanel/colorPanel.html',
    "<div class=\"bg-color-wrap\"><span class=\"quick-bg-color\" ng-click=\"minder.queryCommandState('background') === -1 || minder.execCommand('background', bgColor)\" ng-disabled=\"minder.queryCommandState('background') === -1\"></span> <span color-picker class=\"bg-color\" set-color=\"setDefaultBg()\" ng-disabled=\"minder.queryCommandState('background') === -1\"><span class=\"caret\"></span></span> <span class=\"bg-color-preview\" ng-style=\"{ 'background-color': bgColor }\" ng-click=\"minder.queryCommandState('background') === -1 || minder.execCommand('background', bgColor)\" ng-disabled=\"minder.queryCommandState('background') === -1\"></span></div>"
  );


  $templateCache.put('ui/directive/expandLevel/expandLevel.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default expand\" title=\"{{ 'expandtoleaf' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" ng-click=\"minder.execCommand('ExpandToLevel', 9999)\"></button> <button type=\"button\" class=\"btn btn-default expand-caption dropdown-toggle\" title=\"{{ 'expandtoleaf' | lang:'ui' }}\" dropdown-toggle><span class=\"caption\">{{ 'expandtoleaf' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'expandtoleaf' | lang:'ui' }}</span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"level in levels\"><a href ng-click=\"minder.execCommand('ExpandToLevel', level)\">{{ 'expandtolevel' + level | lang:'ui/command' }}</a></li></ul></div>"
  );


  $templateCache.put('ui/directive/fileImport/fileImport.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default import\" title=\"{{ 'import' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" data-toggle=\"modal\" data-target=\"#importModal\" ng-click=\"updateMaplist()\"></button> <button type=\"button\" class=\"btn btn-default import-caption dropdown-toggle\" data-toggle=\"modal\" data-target=\"#importModal\" title=\"{{ 'import' | lang:'ui' }}\" ng-click=\"updateMaplist()\"><span class=\"caption\">{{ 'import' | lang:'ui' }}</span> <span class=\"sr-only\">{{ 'import' | lang:'ui' }}</span></button><div class=\"modal fade\" id=\"importModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\" style=\"width: 800px\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">Import mind map</h4></div><div class=\"modal-body\" style=\"font-size: 12px\"><div style=\"width: 95%; margin: auto; border: 1px solid gray\"><table class=\"table\" style=\"width: 90%; margin: auto\"><caption style=\"font-size: 14px;font-weight: 600;color:#333\">Open mindmap from resource center:</caption><thead><tr><th style=\"width: 30%\">Name</th><th style=\"width: 50%\">Description</th><th style=\"width: 20%\">Operation</th></tr></thead></table><div style=\"min-height:100px;max-height: 400px; overflow-y: auto\"><table class=\"table\" style=\"width: 90%;margin: auto\"><tbody><tr ng-repeat=\"item in mindmapRes\"><td style=\"width: 30%\">{{item.name}}</td><td style=\"width: 50%\">{{item.description}}</td><td style=\"width: 20%\"><span style=\"cursor:pointer\" class=\"glyphicon glyphicon-ok-circle\" title=\"Load this mindmap\" ng-click=\"mapLoad(item)\"></span> <span style=\"cursor:pointer; margin-left: 20px\" class=\"glyphicon glyphicon-remove-circle\" title=\"Delete this mindmap\" ng-click=\"deleteMap(item)\"></span></td></tr></tbody></table></div></div><div style=\"width: 90%; margin: auto;margin-top: 30px\"><span style=\"font-size: 14px;font-weight: 600\">Open mindmap from resource center:</span> <input type=\"file\" id=\"fileInput\" style=\"margin-top: 15px\"><button type=\"button\" class=\"btn btn-info\" style=\"margin-top: 15px\" ng-click=\"mapImport()\">Upload</button></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div></div>"
  );


  $templateCache.put('ui/directive/fileSave/fileSave.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default save\" title=\"{{ 'save' | lang:'ui' }}\" ng-class=\"{'active': isopen}\"></button> <button type=\"button\" class=\"btn btn-default save-caption dropdown-toggle\" title=\"{{ 'save' | lang:'ui' }}\" dropdown-toggle><span class=\"caption\">{{ 'save' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'save' | lang:'ui' }}</span></button><ul class=\"dropdown-menu\" role=\"menu\"><li data-toggle=\"modal\" data-target=\"#saveModal\"><a href>Save</a></li><li data-toggle=\"modal\" data-target=\"#saveasModal\"><a href>Save as</a></li></ul><div class=\"modal fade\" id=\"saveModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">Save mind map</h4></div><div class=\"modal-body\"><div style=\"margin: 10px 0\"><button type=\"button\" class=\"btn btn-info\" id=\"saveBtn\" ng-click=\"saveMapFun()\">Save to resource center</button> <button style=\"margin-left: 20px\" type=\"button\" id=\"downloadBtn\" ng-click=\"downloadMapFun()\" class=\"btn btn-info\">Download</button></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div><div class=\"modal fade\" id=\"saveasModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"myModalLabel\" aria-hidden=\"true\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button><h4 class=\"modal-title\" id=\"myModalLabel\">Save mind map</h4></div><div class=\"modal-body\"><div><span style=\"font-size: 16px; margin-right: 20px\">Save the current mind map as format:</span><select class=\"form-control\" style=\"width:100px; display: initial\" id=\"datatypeSelect\"><option>json</option><option>md</option><option>km</option><option>png</option></select></div><div class=\"input-group\" style=\"margin-top: 20px\"><span class=\"input-group-addon\">File name:</span> <input type=\"text\" class=\"form-control\" id=\"mindmapName\" placeholder=\"Please fill in the name\"></div><div style=\"margin-top: 20px\"><button type=\"button\" class=\"btn btn-info\" id=\"saveBtn\" ng-click=\"saveasMapFun()\">Save to resource center</button> <button style=\"float: right\" type=\"button\" id=\"downloadBtn\" ng-click=\"downloadMapFun()\" class=\"btn btn-info\">Download</button></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button></div></div></div></div></div>"
  );


  $templateCache.put('ui/directive/fontOperator/fontOperator.html',
    "<div class=\"font-operator\"><div class=\"dropdown font-family-list\" dropdown><div class=\"dropdown-toggle current-font-item\" dropdown-toggle ng-disabled=\"minder.queryCommandState('fontfamily') === -1\"><a href class=\"current-font-family\" title=\"{{ 'fontfamily' | lang: 'ui' }}\">{{ getFontfamilyName(minder.queryCommandValue('fontfamily')) || 'Font family' }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu font-list\"><li ng-repeat=\"f in fontFamilyList\" class=\"font-item-wrap\"><a ng-click=\"minder.execCommand('fontfamily', f.val)\" class=\"font-item\" ng-class=\"{ 'font-item-selected' : f == minder.queryCommandValue('fontfamily') }\" ng-style=\"{'font-family': f.val }\">{{ f.name }}</a></li></ul></div><div class=\"dropdown font-size-list\" dropdown><div class=\"dropdown-toggle current-font-item\" dropdown-toggle ng-disabled=\"minder.queryCommandState('fontsize') === -1\"><a href class=\"current-font-size\" title=\"{{ 'fontsize' | lang: 'ui' }}\">{{ minder.queryCommandValue('fontsize') || 'Font size' }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu font-list\"><li ng-repeat=\"f in fontSizeList\" class=\"font-item-wrap\"><a ng-click=\"minder.execCommand('fontsize', f)\" class=\"font-item\" ng-class=\"{ 'font-item-selected' : f == minder.queryCommandValue('fontsize') }\" ng-style=\"{'font-size': f + 'px'}\">{{ f }}</a></li></ul></div><span class=\"s-btn-icon font-bold\" ng-click=\"minder.queryCommandState('bold') === -1 || minder.execCommand('bold')\" ng-class=\"{'font-bold-selected' : minder.queryCommandState('bold') == 1}\" ng-disabled=\"minder.queryCommandState('bold') === -1\"></span> <span class=\"s-btn-icon font-italics\" ng-click=\"minder.queryCommandState('italic') === -1 || minder.execCommand('italic')\" ng-class=\"{'font-italics-selected' : minder.queryCommandState('italic') == 1}\" ng-disabled=\"minder.queryCommandState('italic') === -1\"></span><div class=\"font-color-wrap\"><span class=\"quick-font-color\" ng-click=\"minder.queryCommandState('forecolor') === -1 || minder.execCommand('forecolor', foreColor)\" ng-disabled=\"minder.queryCommandState('forecolor') === -1\">A</span> <span color-picker class=\"font-color\" set-color=\"setDefaultColor()\" ng-disabled=\"minder.queryCommandState('forecolor') === -1\"><span class=\"caret\"></span></span> <span class=\"font-color-preview\" ng-style=\"{ 'background-color': foreColor }\" ng-click=\"minder.queryCommandState('forecolor') === -1 || minder.execCommand('forecolor', foreColor)\" ng-disabled=\"minder.queryCommandState('forecolor') === -1\"></span></div><color-panel minder=\"minder\" class=\"inline-directive\"></color-panel></div>"
  );


  $templateCache.put('ui/directive/hyperLink/hyperLink.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\" style=\"cursor:not-allowed\"><button type=\"button\" class=\"btn btn-default hyperlink\" title=\"{{ 'link' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" style=\"cursor:not-allowed\" ng-disabled=\"minder.queryCommandState('HyperLink') === -1\"></button> <button type=\"button\" class=\"btn btn-default hyperlink-caption dropdown-toggle\" ng-disabled=\"minder.queryCommandState('HyperLink') === -1\" title=\"{{ 'link' | lang:'ui' }}\" style=\"cursor:not-allowed\" dropdown-toggle><span class=\"caption\">{{ 'link' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'link' | lang:'ui' }}</span></button></div>"
  );


  $templateCache.put('ui/directive/imageBtn/imageBtn.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\" style=\"cursor:not-allowed\"><button type=\"button\" class=\"btn btn-default image-btn\" title=\"{{ 'image' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" style=\"cursor:not-allowed\" ng-disabled=\"minder.queryCommandState('Image') === -1\"></button> <button type=\"button\" class=\"btn btn-default image-btn-caption dropdown-toggle\" ng-disabled=\"minder.queryCommandState('Image') === -1\" title=\"{{ 'image' | lang:'ui' }}\" style=\"cursor:not-allowed\" dropdown-toggle><span class=\"caption\">{{ 'image' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'image' | lang:'ui' }}</span></button></div>"
  );


  $templateCache.put('ui/directive/kityminderEditor/kityminderEditor.html',
    "<div class=\"minder-editor-container\"><div class=\"minder-editor\" style=\"top:0px\"></div><div class=\"km-note\" note-editor minder=\"minder\" ng-if=\"minder\"></div><div class=\"note-previewer\" note-previewer ng-if=\"minder\"></div><div class=\"navigator\" navigator minder=\"minder\" ng-if=\"minder\"></div></div>"
  );


  $templateCache.put('ui/directive/kityminderViewer/kityminderViewer.html',
    "<div class=\"minder-editor-container\"><div class=\"minder-viewer\"></div><div class=\"note-previewer\" note-previewer ng-if=\"minder\"></div><div class=\"navigator\" navigator minder=\"minder\" ng-if=\"minder\"></div></div>"
  );


  $templateCache.put('ui/directive/layout/layout.html',
    "<div class=\"readjust-layout\"><a ng-click=\"minder.queryCommandState('resetlayout') === -1 || minder.execCommand('resetlayout')\" class=\"btn-wrap\" ng-disabled=\"minder.queryCommandState('resetlayout') === -1\"><span class=\"btn-icon reset-layout-icon\"></span> <span class=\"btn-label\">{{ 'resetlayout' | lang: 'ui/command' }}</span></a></div>"
  );


  $templateCache.put('ui/directive/navigator/navigator.html',
    "<div class=\"nav-bar\"><div class=\"nav-btn zoom-in\" ng-click=\"minder.execCommand('zoomIn')\" title=\"{{ 'zoom-in' | lang : 'ui' }}\" ng-class=\"{ 'active' : getZoomRadio(zoom) == 0 }\"><div class=\"icon\"></div></div><div class=\"zoom-pan\"><div class=\"origin\" ng-style=\"{'transform': 'translate(0, ' + getHeight(100) + 'px)'}\" ng-click=\"minder.execCommand('zoom', 100);\"></div><div class=\"indicator\" ng-style=\"{\r" +
    "\n" +
    "             'transform': 'translate(0, ' + getHeight(zoom) + 'px)',\r" +
    "\n" +
    "             'transition': 'transform 200ms'\r" +
    "\n" +
    "             }\"></div></div><div class=\"nav-btn zoom-out\" ng-click=\"minder.execCommand('zoomOut')\" title=\"{{ 'zoom-out' | lang : 'ui' }}\" ng-class=\"{ 'active' : getZoomRadio(zoom) == 1 }\"><div class=\"icon\"></div></div><div class=\"nav-btn hand\" ng-click=\"minder.execCommand('hand')\" title=\"{{ 'hand' | lang : 'ui' }}\" ng-class=\"{ 'active' : minder.queryCommandState('hand') == 1 }\"><div class=\"icon\"></div></div><div class=\"nav-btn camera\" ng-click=\"minder.execCommand('camera', minder.getRoot(), 600);\" title=\"{{ 'camera' | lang : 'ui' }}\"><div class=\"icon\"></div></div><div class=\"nav-btn nav-trigger\" ng-class=\"{'active' : isNavOpen}\" ng-click=\"toggleNavOpen()\" title=\"{{ 'navigator' | lang : 'ui' }}\"><div class=\"icon\"></div></div></div><div class=\"nav-previewer\" ng-show=\"isNavOpen\"></div>"
  );


  $templateCache.put('ui/directive/noteBtn/noteBtn.html',
    "<div class=\"btn-group-vertical note-btn-group\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default note-btn\" title=\"{{ 'note' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" ng-click=\"addNote()\" ng-disabled=\"minder.queryCommandState('note') === -1\"></button> <button type=\"button\" class=\"btn btn-default note-btn-caption dropdown-toggle\" ng-disabled=\"minder.queryCommandState('note') === -1\" title=\"{{ 'note' | lang:'ui' }}\" dropdown-toggle><span class=\"caption\">{{ 'note' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'note' | lang:'ui' }}</span></button><ul class=\"dropdown-menu\" role=\"menu\"><li><a href ng-click=\"addNote()\">{{ 'insertnote' | lang:'ui' }}</a></li><li><a href ng-click=\"minder.execCommand('note', null)\">{{ 'removenote' | lang:'ui' }}</a></li></ul></div>"
  );


  $templateCache.put('ui/directive/noteEditor/noteEditor.html',
    "<div class=\"panel panel-default\" ng-init=\"noteEditorOpen = false\" ng-show=\"noteEditorOpen\"><div class=\"panel-heading\"><h3 class=\"panel-title\">Note</h3><span>（<a class=\"help\" href=\"https://www.zybuluo.com/techird/note/46064\" target=\"_blank\">Support GFM writing grammar</a>）</span> <i class=\"close-note-editor glyphicon glyphicon-remove\" ng-click=\"closeNoteEditor()\"></i></div><div class=\"panel-body\"><div ng-show=\"noteEnabled\" ui-codemirror=\"{ onLoad: codemirrorLoaded }\" ng-model=\"noteContent\" ui-codemirror-opts=\"{\r" +
    "\n" +
    "                gfm: true,\r" +
    "\n" +
    "                breaks: true,\r" +
    "\n" +
    "                lineWrapping : true,\r" +
    "\n" +
    "                mode: 'gfm',\r" +
    "\n" +
    "                dragDrop: false,\r" +
    "\n" +
    "                lineNumbers:true\r" +
    "\n" +
    "             }\"></div><p ng-show=\"!noteEnabled\" class=\"km-note-tips\">Please select one node to add notes</p></div></div>"
  );


  $templateCache.put('ui/directive/notePreviewer/notePreviewer.html',
    "<div id=\"previewer-content\" ng-show=\"showNotePreviewer\" ng-style=\"previewerStyle\" ng-bind-html=\"noteContent\"></div>"
  );


  $templateCache.put('ui/directive/operation/operation.html',
    "<div class=\"km-btn-group operation-group\"><div class=\"km-btn-item edit-node\" ng-disabled=\"minder.queryCommandState('text') === -1\" ng-click=\"minder.queryCommandState('text') === -1 || editNode()\" title=\"{{ 'editnode' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'editnode' | lang:'ui/command' }}</span></div><div class=\"km-btn-item remove-node\" ng-disabled=\"minder.queryCommandState('RemoveNode') === -1\" ng-click=\"minder.queryCommandState('RemoveNode') === -1 || minder.execCommand('RemoveNode');\" title=\"{{ 'removenode' | lang:'ui/command' }}\"><i class=\"km-btn-icon\"></i> <span class=\"km-btn-caption\">{{ 'removenode' | lang:'ui/command' }}</span></div></div>"
  );


  $templateCache.put('ui/directive/priorityEditor/priorityEditor.html',
    "<ul class=\"km-priority tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-priority-item tool-group-item\" ng-repeat=\"p in priorities\" ng-click=\"commandDisabled || minder.execCommand('priority', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getPriorityTitle(p) }}\"><div class=\"km-priority-icon tool-group-icon priority-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/progressEditor/progressEditor.html',
    "<ul class=\"km-progress tool-group\" ng-disabled=\"commandDisabled\"><li class=\"km-progress-item tool-group-item\" ng-repeat=\"p in progresses\" ng-click=\"commandDisabled || minder.execCommand('progress', p)\" ng-class=\"{ active: commandValue == p }\" title=\"{{ getProgressTitle(p) }}\"><div class=\"km-progress-icon tool-group-icon progress-{{p}}\"></div></li></ul>"
  );


  $templateCache.put('ui/directive/resourceEditor/resourceEditor.html',
    "<div class=\"resource-editor\"><div class=\"input-group\"><input class=\"form-control\" type=\"text\" ng-model=\"newResourceName\" ng-required ng-keypress=\"$event.keyCode == 13 && addResource(newResourceName)\" ng-disabled=\"!enabled\"> <span class=\"input-group-btn\"><button class=\"btn btn-default\" ng-click=\"addResource(newResourceName)\" ng-disabled=\"!enabled\">Add</button></span></div><div class=\"resource-dropdown clearfix\" id=\"resource-dropdown\"><ul class=\"km-resource\" ng-init=\"resourceListOpen = false\" ng-class=\"{'open': resourceListOpen}\"><li ng-repeat=\"resource in used\" ng-disabled=\"!enabled\" ng-blur=\"blurCB()\"><label style=\"background: {{resourceColor(resource.name)}}\"><input type=\"checkbox\" ng-model=\"resource.selected\" ng-disabled=\"!enabled\"> <span>{{resource.name}}</span></label></li></ul><div class=\"resource-caret\" click-anywhere-but-here=\"resourceListOpen = false\" is-active=\"resourceListOpen\" ng-click=\"resourceListOpen = !resourceListOpen\"><span class=\"caret\"></span></div></div></div>"
  );


  $templateCache.put('ui/directive/searchBox/searchBox.html',
    "<div id=\"search\" class=\"search-box clearfix\" ng-show=\"showSearch\"><div class=\"input-group input-group-sm search-input-wrap\"><input type=\"text\" id=\"search-input\" class=\"form-control search-input\" ng-model=\"keyword\" ng-keydown=\"handleKeyDown($event)\" aria-describedby=\"basic-addon2\"> <span class=\"input-group-addon search-addon\" id=\"basic-addon2\" ng-show=\"showTip\" ng-bind=\"'第 ' + curIndex + ' 条，共 ' + resultNum + ' 条'\"></span></div><div class=\"btn-group btn-group-sm prev-and-next-btn\" role=\"group\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"doSearch(keyword, 'prev')\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button> <button type=\"button\" class=\"btn btn-default\" ng-click=\"doSearch(keyword, 'next')\"><span class=\"glyphicon glyphicon-chevron-down\"></span></button></div><div class=\"close-search\" ng-click=\"exitSearch()\"><span class=\"glyphicon glyphicon-remove\"></span></div></div>"
  );


  $templateCache.put('ui/directive/searchBtn/searchBtn.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default search\" title=\"{{ 'search' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" ng-click=\"enterSearch()\"></button> <button type=\"button\" class=\"btn btn-default search-caption dropdown-toggle\" ng-click=\"enterSearch()\" title=\"{{ 'search' | lang:'ui' }}\"><span class=\"caption\">{{ 'search' | lang:'ui' }}</span> <span class=\"sr-only\">{{ 'search' | lang:'ui' }}</span></button></div>"
  );


  $templateCache.put('ui/directive/selectAll/selectAll.html',
    "<div class=\"btn-group-vertical\" dropdown is-open=\"isopen\"><button type=\"button\" class=\"btn btn-default select\" title=\"{{ 'selectall' | lang:'ui' }}\" ng-class=\"{'active': isopen}\" ng-click=\"select['all']()\"></button> <button type=\"button\" class=\"btn btn-default select-caption dropdown-toggle\" title=\"{{ 'selectall' | lang:'ui' }}\" dropdown-toggle><span class=\"caption\">{{ 'selectall' | lang:'ui' }}</span> <span class=\"caret\"></span> <span class=\"sr-only\">{{ 'selectall' | lang:'ui' }}</span></button><ul class=\"dropdown-menu\" role=\"menu\"><li ng-repeat=\"item in items\"><a href ng-click=\"select[item]()\">{{ 'select' + item | lang:'ui' }}</a></li></ul></div>"
  );


  $templateCache.put('ui/directive/styleOperator/styleOperator.html',
    "<div class=\"style-operator\"><a ng-click=\"minder.queryCommandState('clearstyle') === -1 || minder.execCommand('clearstyle')\" class=\"btn-wrap clear-style\" ng-disabled=\"minder.queryCommandState('clearstyle') === -1\"><span class=\"btn-icon clear-style-icon\"></span> <span class=\"btn-label\">{{ 'clearstyle' | lang: 'ui' }}</span></a><div class=\"s-btn-group-vertical\"><a class=\"s-btn-wrap\" href ng-click=\"minder.queryCommandState('copystyle') === -1 || minder.execCommand('copystyle')\" ng-disabled=\"minder.queryCommandState('copystyle') === -1\"><span class=\"s-btn-icon copy-style-icon\"></span> <span class=\"s-btn-label\">{{ 'copystyle' | lang: 'ui' }}</span></a> <a class=\"s-btn-wrap paste-style-wrap\" href ng-click=\"minder.queryCommandState('pastestyle') === -1 || minder.execCommand('pastestyle')\" ng-disabled=\"minder.queryCommandState('pastestyle') === -1\"><span class=\"s-btn-icon paste-style-icon\"></span> <span class=\"s-btn-label\">{{ 'pastestyle' | lang: 'ui' }}</span></a></div></div>"
  );


  $templateCache.put('ui/directive/templateList/templateList.html',
    "<div class=\"dropdown temp-panel\" dropdown on-toggle=\"toggled(open)\"><div class=\"dropdown-toggle current-temp-item\" ng-disabled=\"minder.queryCommandState('template') === -1\" dropdown-toggle><a href class=\"temp-item {{ minder.queryCommandValue('template') }}\" title=\"{{ minder.queryCommandValue('template') | lang: 'template' }}\"></a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu temp-list\"><li ng-repeat=\"(key, templateObj) in templateList\" class=\"temp-item-wrap\"><a ng-click=\"minder.execCommand('template', key);\" class=\"temp-item {{key}}\" ng-class=\"{ 'temp-item-selected' : key == minder.queryCommandValue('template') }\" title=\"{{ key | lang: 'template' }}\"></a></li></ul></div>"
  );


  $templateCache.put('ui/directive/themeList/themeList.html',
    "<div class=\"dropdown theme-panel\" dropdown><div class=\"dropdown-toggle theme-item-selected\" dropdown-toggle ng-disabled=\"minder.queryCommandState('theme') === -1\"><a href class=\"theme-item\" ng-style=\"getThemeThumbStyle(minder.queryCommandValue('theme'))\" title=\"{{ minder.queryCommandValue('theme') | lang: 'theme'; }}\">{{ minder.queryCommandValue('theme') | lang: 'theme'; }}</a> <span class=\"caret\"></span></div><ul class=\"dropdown-menu theme-list\"><li ng-repeat=\"key in themeKeyList\" class=\"theme-item-wrap\"><a ng-click=\"minder.execCommand('theme', key);\" class=\"theme-item\" ng-style=\"getThemeThumbStyle(key)\" title=\"{{ key | lang: 'theme'; }}\">{{ key | lang: 'theme'; }}</a></li></ul></div>"
  );


  $templateCache.put('ui/directive/topTab/topTab.html',
    "<tabset><tab heading=\"{{ 'idea' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('idea')\" select=\"setCurTab('idea')\"><undo-redo editor=\"editor\"></undo-redo><append-node minder=\"minder\"></append-node><arrange minder=\"minder\"></arrange><operation minder=\"minder\"></operation><hyper-link minder=\"minder\"></hyper-link><image-btn minder=\"minder\"></image-btn><note-btn minder=\"minder\"></note-btn><priority-editor minder=\"minder\"></priority-editor><progress-editor minder=\"minder\"></progress-editor><resource-editor minder=\"minder\"></resource-editor></tab><tab heading=\"{{ 'appearence' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('appearance')\" select=\"setCurTab('appearance')\"><template-list minder=\"minder\" class=\"inline-directive\"></template-list><theme-list minder=\"minder\"></theme-list><layout minder=\"minder\" class=\"inline-directive\"></layout><style-operator minder=\"minder\" class=\"inline-directive\"></style-operator><font-operator minder=\"minder\" class=\"inline-directive\"></font-operator></tab><tab heading=\"{{ 'view' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('view')\" select=\"setCurTab('view')\"><expand-level minder=\"minder\"></expand-level><select-all minder=\"minder\"></select-all><search-btn minder=\"minder\"></search-btn></tab><tab heading=\"{{ 'file' | lang: 'ui/tabs'; }}\" ng-click=\"toggleTopTab('file')\" select=\"setCurTab('file')\"><file-import minder=\"minder\"></file-import><file-save minder=\"minder\"></file-save></tab></tabset>"
  );


  $templateCache.put('ui/directive/undoRedo/undoRedo.html',
    "<div class=\"km-btn-group do-group\"><div class=\"km-btn-item undo\" ng-disabled=\"editor.history.hasUndo() == false\" ng-click=\"editor.history.hasUndo() == false || editor.history.undo();\" title=\"{{ 'undo' | lang:'ui' }}\"><i class=\"km-btn-icon\"></i></div><div class=\"km-btn-item redo\" ng-disabled=\"editor.history.hasRedo() == false\" ng-click=\"editor.history.hasRedo() == false || editor.history.redo()\" title=\"{{ 'redo' | lang:'ui' }}\"><i class=\"km-btn-icon\"></i></div></div>"
  );


  $templateCache.put('ui/dialog/hyperlink/hyperlink.tpl.html',
    "<div class=\"modal-header\"><h3 class=\"modal-title\">Links</h3></div><div class=\"modal-body\"><form><div class=\"form-group\" id=\"link-url-wrap\" ng-class=\"{true: 'has-success', false: 'has-error'}[urlPassed]\"><label for=\"link-url\">Link address：</label><input type=\"text\" class=\"form-control\" ng-model=\"url\" ng-blur=\"urlPassed = R_URL.test(url)\" ng-focus=\"this.value = url\" ng-keydown=\"shortCut($event)\" id=\"link-url\" placeholder=\"必填：以 http(s):// 或 ftp:// 开头\"></div><div class=\"form-group\" ng-class=\"{'has-success' : titlePassed}\"><label for=\"link-title\">Tips：</label><input type=\"text\" class=\"form-control\" ng-model=\"title\" ng-blur=\"titlePassed = true\" id=\"link-title\" placeholder=\"选填：鼠标在链接上悬停时提示的文本\"></div></form></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button> <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button></div>"
  );


  $templateCache.put('ui/dialog/imExportNode/imExportNode.tpl.html',
    "<div class=\"modal-header\"><h3 class=\"modal-title\">{{ title }}</h3></div><div class=\"modal-body\"><textarea type=\"text\" class=\"form-control single-input\" rows=\"8\" ng-keydown=\"shortCut($event);\" ng-model=\"value\" ng-readonly=\"type === 'export'\">\r" +
    "\n" +
    "    </textarea></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"type === 'import' && value == ''\">OK</button> <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button></div>"
  );


  $templateCache.put('ui/dialog/image/image.tpl.html',
    "<div class=\"modal-header\"><h3 class=\"modal-title\">Images</h3></div><div class=\"modal-body\"><tabset><tab heading=\"Upload images\" active=\"true\"><form><div class=\"form-group\"><input type=\"file\" name=\"upload-image\" id=\"upload-image\" class=\"upload-image\" accept=\".jpg,.JPG,jpeg,JPEG,.png,.PNG,.gif,.GIF\" onchange=\"angular.element(this).scope().uploadImage()\"><label for=\"upload-image\" class=\"btn btn-primary\"><span>File select&hellip;</span></label></div><div class=\"form-group\" ng-class=\"{'has-success' : titlePassed}\"><label for=\"image-title\">Tips：</label><input type=\"text\" class=\"form-control\" ng-model=\"data.title\" ng-blur=\"titlePassed = true\" id=\"image-title\" placeholder=\"Optional\"></div><div class=\"form-group\"><label for=\"image-preview\">Image preview:</label><img class=\"image-preview\" id=\"image-preview\" ng-src=\"{{ data.url }}\" title=\"{{ data.title }}\" alt=\"{{ data.title }}\"></div></form></tab><tab heading=\"Other images\"><form><div class=\"form-group\" ng-class=\"{true: 'has-success', false: 'has-error'}[urlPassed]\"><label for=\"image-url\">Links：</label><input type=\"text\" class=\"form-control\" ng-model=\"data.url\" ng-blur=\"urlPassed = data.R_URL.test(data.url)\" ng-focus=\"this.value = data.url\" ng-keydown=\"shortCut($event)\" id=\"image-url\" placeholder=\"http(s)://\"></div><div class=\"form-group\" ng-class=\"{'has-success' : titlePassed}\"><label for=\"image-title\">Tips：</label><input type=\"text\" class=\"form-control\" ng-model=\"data.title\" ng-blur=\"titlePassed = true\" id=\"image-title\" placeholder=\"Optional\"></div><div class=\"form-group\"><label for=\"image-preview\">Image preview:</label><img class=\"image-preview\" id=\"image-preview\" ng-src=\"{{ data.url }}\" alt=\"{{ data.title }}\"></div></form></tab></tabset></div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button> <button class=\"btn btn-warning\" ng-click=\"cancel()\">Cancel</button></div>"
  );

}]);

angular.module('kityminderEditor').service('commandBinder', function() {
	return {
		bind: function(minder, command, scope) {

			minder.on('interactchange', function() {
				scope.commandDisabled = minder.queryCommandState(command) === -1;
				scope.commandValue = minder.queryCommandValue(command);
				scope.$apply();
			});
		}
	};
});
angular.module('kityminderEditor')
	.provider('config',  function() {

		this.config = {
			// 右侧面板最小宽度
			ctrlPanelMin: 250,

			// 右侧面板宽度
			ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,

			// 分割线宽度
			dividerWidth: 3,

			// 默认语言
			defaultLang: 'zh-cn',

			// 放大缩小比例
			zoom: [10, 20, 30, 50, 80, 100, 120, 150, 200],

            // 图片上传接口
            imageUpload: 'server/imageUpload.php'
		};

		this.set = function(key, value) {
            var supported = Object.keys(this.config);
            var configObj = {};

            // 支持全配置
            if (typeof key === 'object') {
                configObj = key;
            }
            else {
                configObj[key] = value;
            }

            for (var i in configObj) {
                if (configObj.hasOwnProperty(i) && supported.indexOf(i) !== -1) {
                    this.config[i] = configObj[i];
                }
                else {
                    console.error('Unsupported config key: ', key, ', please choose in :', supported.join(', '));
                    return false;
                }
            }

            return true;
		};

		this.$get = function () {
			var me = this;

			return {
				get: function (key) {
                    if (arguments.length === 0) {
                        return me.config;
                    }

					if (me.config.hasOwnProperty(key)) {
						return me.config[key];
					}

					console.warn('Missing config key pair for : ', key);
					return '';
				}

			};
		}
	});
angular.module('kityminderEditor')
	.service('lang.zh-cn', function() {
		return {
			'zh-cn': {
				'template': {
					'default': 'Mind map',
					'tianpan': 'Spiral map',
					'structure': 'Structure chart',
					'filetree': 'Content chart',
					'right': 'Tree',
					'fish-bone': 'Fish-bone figure'
				},
				'theme': {
					'classic': 'Normal',
					'classic-compact': 'Compact',
					'snow': 'Snow',
					'snow-compact': 'Compact',
					'fish': 'Fish',
					'wire': 'Wire',
					'fresh-red': 'Normal',
					'fresh-soil': 'Normal',
					'fresh-green': 'Normal',
					'fresh-blue': 'Normal',
					'fresh-purple': 'Normal',
					'fresh-pink': 'Normal',
					'fresh-red-compat': 'Compact',
					'fresh-soil-compat': 'Compact',
					'fresh-green-compat': 'Compact',
					'fresh-blue-compat': 'Compact',
					'fresh-purple-compat': 'Compact',
					'fresh-pink-compat': 'Compact',
					'tianpan':'Normal',
					'tianpan-compact': 'Compact'
				},
				'maintopic': 'Main topic',
				'topic': 'Topic',
				'panels': {
					'history': 'History',
					'template': 'Template',
					'theme': 'Theme',
					'layout': 'Layout',
					'style': 'Style',
					'font': 'Font',
					'color': 'Color',
					'background': 'Background',
					'insert': 'Insert',
					'arrange': 'Arrange',
					'nodeop': 'Current',
					'priority': 'Priority',
					'progress': 'Progress',
					'resource': 'Resource',
					'note': 'Note',
					'attachment': 'Attachment',
					'word': 'Word'
				},
				'error_message': {
				// 	'title': '哎呀，脑图出错了',

				// 	'err_load': '加载脑图失败',
				// 	'err_save': '保存脑图失败',
				// 	'err_network': '网络错误',
				// 	'err_doc_resolve': '文档解析失败',
				// 	'err_unknown': '发生了奇怪的错误',
				// 	'err_localfile_read': '文件读取错误',
				// 	'err_download': '文件下载失败',
				// 	'err_remove_share': '取消分享失败',
				// 	'err_create_share': '分享失败',
				// 	'err_mkdir': '目录创建失败',
				// 	'err_ls': '读取目录失败',
				// 	'err_share_data': '加载分享内容出错',
				// 	'err_share_sync_fail': '分享内容同步失败',
				// 	'err_move_file': '文件移动失败',
				// 	'err_rename': '重命名失败',

				// 	'unknownreason': '可能是外星人篡改了代码...',
				// 	'pcs_code': {
				// 		3: "不支持此接口",
				// 		4: "没有权限执行此操作",
				// 		5: "IP未授权",
				// 		110: "用户会话已过期，请重新登录",
				// 		31001: "数据库查询错误",
				// 		31002: "数据库连接错误",
				// 		31003: "数据库返回空结果",
				// 		31021: "网络错误",
				// 		31022: "暂时无法连接服务器",
				// 		31023: "输入参数错误",
				// 		31024: "app id为空",
				// 		31025: "后端存储错误",
				// 		31041: "用户的cookie不是合法的百度cookie",
				// 		31042: "用户未登陆",
				// 		31043: "用户未激活",
				// 		31044: "用户未授权",
				// 		31045: "用户不存在",
				// 		31046: "用户已经存在",
				// 		31061: "文件已经存在",
				// 		31062: "文件名非法",
				// 		31063: "文件父目录不存在",
				// 		31064: "无权访问此文件",
				// 		31065: "目录已满",
				// 		31066: "文件不存在",
				// 		31067: "文件处理出错",
				// 		31068: "文件创建失败",
				// 		31069: "文件拷贝失败",
				// 		31070: "文件删除失败",
				// 		31071: "不能读取文件元信息",
				// 		31072: "文件移动失败",
				// 		31073: "文件重命名失败",
				// 		31079: "未找到文件MD5，请使用上传API上传整个文件。",
				// 		31081: "superfile创建失败",
				// 		31082: "superfile 块列表为空",
				// 		31083: "superfile 更新失败",
				// 		31101: "tag系统内部错误",
				// 		31102: "tag参数错误",
				// 		31103: "tag系统错误",
				// 		31110: "未授权设置此目录配额",
				// 		31111: "配额管理只支持两级目录",
				// 		31112: "超出配额",
				// 		31113: "配额不能超出目录祖先的配额",
				// 		31114: "配额不能比子目录配额小",
				// 		31141: "请求缩略图服务失败",
				// 		31201: "签名错误",
				// 		31202: "文件不存在",
				// 		31203: "设置acl失败",
				// 		31204: "请求acl验证失败",
				// 		31205: "获取acl失败",
				// 		31206: "acl不存在",
				// 		31207: "bucket已存在",
				// 		31208: "用户请求错误",
				// 		31209: "服务器错误",
				// 		31210: "服务器不支持",
				// 		31211: "禁止访问",
				// 		31212: "服务不可用",
				// 		31213: "重试出错",
				// 		31214: "上传文件data失败",
				// 		31215: "上传文件meta失败",
				// 		31216: "下载文件data失败",
				// 		31217: "下载文件meta失败",
				// 		31218: "容量超出限额",
				// 		31219: "请求数超出限额",
				// 		31220: "流量超出限额",
				// 		31298: "服务器返回值KEY非法",
				// 		31299: "服务器返回值KEY不存在"
				// 	}
				},
				'ui': {
					// 'shared_file_title': '[分享的] {0} (只读)',
					// 'load_share_for_edit': '正在加载分享的文件...',
					// 'share_sync_success': '分享内容已同步',
					// 'recycle_clear_confirm': '确认清空回收站么？清空后的文件无法恢复。',

					// 'fullscreen_exit_hint': '按 Esc 或 F11 退出全屏',

					// 'error_detail': '详细信息',
					// 'copy_and_feedback': '复制并反馈',
					// 'move_file_confirm': '确定把 "{0}" 移动到 "{1}" 吗？',
					// 'rename': '重命名',
					// 'rename_success': '{0} 重命名成功',
					// 'move_success': '{0} 移动成功到 {1}',

					'command': {
						'appendsiblingnode': 'Sibling node',
                        'appendparentnode': 'Parent node',
						'appendchildnode': 'Child node',
						'removenode': 'Remove',
						'editnode': 'Edit',
						'arrangeup': 'Up',
						'arrangedown': 'Down',
						'resetlayout': 'Reset',
						'expandtoleaf': 'Expand all',
						'expandtolevel1': 'Expand to level1',
						'expandtolevel2': 'Expand to level2',
						'expandtolevel3': 'Expand to level3',
						'expandtolevel4': 'Expand to level4',
						'expandtolevel5': 'Expand to level5',
						'expandtolevel6': 'Expand to level6',
						'fullscreen': 'Fullscreen',
						'outline': 'Outline'
					},

					'search':'Search',

					'save':'Save',
					
					'import':'Import',

					'expandtoleaf': 'Expand',

					'back': 'Back',

					'undo': 'Undo (Ctrl + Z)',
					'redo': 'Redo (Ctrl + Y)',

					'tabs': {
						'file':'File',
						'idea': 'Idea',
						'appearence': 'Appearence',
						'view': 'View'
					},

					'quickvisit': {
						'new': 'New (Ctrl + Alt + N)',
						'save': 'Save (Ctrl + S)',
						'share': 'Share (Ctrl + Alt + S)',
						'feedback': 'Feedback（F1）',
						'editshare': 'Edit'
					},

					'menu': {

						// 'mainmenutext': '百度脑图', // 主菜单按钮文本

						// 'newtab': '新建',
						// 'opentab': '打开',
						// 'savetab': '保存',
						// 'sharetab': '分享',
						// 'preferencetab': '设置',
						// 'helptab': '帮助',
						// 'feedbacktab': '反馈',
						// 'recenttab': '最近使用',
						// 'netdisktab': '百度云存储',
						// 'localtab': '本地文件',
						// 'drafttab': '草稿箱',
						// 'downloadtab': '导出到本地',
						// 'createsharetab': '当前脑图',
						// 'managesharetab': '已分享',

						// 'newheader': '新建脑图',
						// 'openheader': '打开',
						// 'saveheader': '保存到',
						// 'draftheader': '草稿箱',
						// 'shareheader': '分享我的脑图',
						// 'downloadheader': '导出到指定格式',
						// 'preferenceheader': '偏好设置',
						// 'helpheader': '帮助',
						// 'feedbackheader': '反馈'
					},

					// 'mydocument': '我的文档',
					// 'emptydir': '目录为空！',
					// 'pickfile': '选择文件...',
					// 'acceptfile': '支持的格式：{0}',
					// 'dropfile': '或将文件拖至此处',
					// 'unsupportedfile': '不支持的文件格式',
					// 'untitleddoc': '未命名文档',
					// 'overrideconfirm': '{0} 已存在，确认覆盖吗？',
					// 'checklogin': '检查登录状态中...',
					// 'loggingin': '正在登录...',
					// 'recent': '最近打开',
					// 'clearrecent': '清空',
					// 'clearrecentconfirm': '确认清空最近文档列表？',
					// 'cleardraft': '清空',
					// 'cleardraftconfirm': '确认清空草稿箱？',

					// 'none_share': '不分享',
					// 'public_share': '公开分享',
					// 'password_share': '私密分享',
					// 'email_share': '邮件邀请',
					// 'url_share': '脑图 URL 地址：',
					// 'sns_share': '社交网络分享：',
					// 'sns_share_text': '“{0}” - 我用百度脑图制作的思维导图，快看看吧！（地址：{1}）',
					// 'none_share_description': '不分享当前脑图',
					// 'public_share_description': '创建任何人可见的分享',
					// 'share_button_text': '创建',
					// 'password_share_description': '创建需要密码才可见的分享',
					// 'email_share_description': '创建指定人可见的分享，您还可以允许他们编辑',
					// 'ondev': '敬请期待！',
					// 'create_share_failed': '分享失败：{0}',
					// 'remove_share_failed': '删除失败：{1}',
					// 'copy': '复制',
					// 'copied': '已复制',
					// 'shared_tip': '当前脑图被 {0}  分享，你可以修改之后保存到自己的网盘上或再次分享',
					// 'current_share': '当前脑图',
					// 'manage_share': '我的分享',
					// 'share_remove_action': '不分享该脑图',
					// 'share_view_action': '打开分享地址',
					// 'share_edit_action': '编辑分享的文件',

					// 'login': '登录',
					// 'logout': '注销',
					// 'switchuser': '切换账户',
					// 'userinfo': '个人信息',
					// 'gotonetdisk': '我的网盘',
					// 'requirelogin': '请 <a class="login-button">登录</a> 后使用',
					// 'saveas': '保存为',
					// 'filename': '文件名',
					// 'fileformat': '保存格式',
					// 'save': '保存',
					// 'mkdir': '新建目录',
					// 'recycle': '回收站',
					// 'newdir': '未命名目录',

					'bold': 'Bold',
					'italic': 'Italic',
					'forecolor': 'Color',
					'fontfamily': 'Font family',
					'fontsize': 'Font size',
					'layoutstyle': 'Style',
					'node': 'Node',
					'saveto': 'Save as',
					'hand': 'Drag',
					'camera': 'Position',
					'zoom-in': 'Zoom in (Ctrl+)',
					'zoom-out': 'Zoom out(Ctrl-)',
					'markers': 'Markers',
					'resource': 'Resources',
					'help': 'Help',
					'preference': 'Preference',
					'expandnode': 'Expand',
					'collapsenode': 'Collapse',
					'template': 'Template',
					'theme': 'Theme',
					'clearstyle': 'Clear',
					'copystyle': 'Copy style',
					'pastestyle': 'Paste style',
					'appendsiblingnode': 'Sibling node',
					'appendchildnode': 'Child node',
					'arrangeup': 'Up',
					'arrangedown': 'Down',
					'editnode': 'Edit',
					'removenode': 'Remove',
					'priority': 'Priority',
					'progress': {
						'p1': 'Progress: 0',
						'p2': 'Progress: 1/8',
						'p3': 'Progress: 1/4',
						'p4': 'Progress: 3/8',
						'p5': 'Progress:',
						'p6': 'Progress: 5/8',
						'p7': 'Progress: 3/4',
						'p8': 'Progress: 7/8',
						'p9': 'Progress: 1',
						'p0': 'Clear'
					},
					'link': 'Links',
					'image': 'Images',
					'note': 'Notes',
                    'insertlink': 'Insert link',
                    'insertimage': 'Insert image',
                    'insertnote': 'Insert note',
					'removelink': 'Remove link',
					'removeimage': 'Remove image',
					'removenote': 'Remove note',
					'resetlayout': 'Reset layout',

					// 'justnow': '刚刚',
					// 'minutesago': '{0} 分钟前',
					// 'hoursago': '{0} 小时前',
					// 'yesterday': '昨天',
					// 'daysago': '{0} 天前',
					// 'longago': '很久之前',

					// 'redirect': '您正在打开连接 {0}，百度脑图不能保证连接的安全性，是否要继续？',
					// 'navigator': '导航器',

					// 'unsavedcontent': '当前文件还没有保存到网盘：\n\n{0}\n\n虽然未保存的数据会缓存在草稿箱，但是清除浏览器缓存会导致草稿箱清除。',

					// 'shortcuts': '快捷键',
					// 'contact': '联系与反馈',
					// 'email': '邮件组',
					// 'qq_group': 'QQ 群',
					// 'github_issue': 'Github',
					// 'baidu_tieba': '贴吧',

					// 'clipboardunsupported': '您的浏览器不支持剪贴板，请使用快捷键复制',

					// 'load_success': '{0} 加载成功',
					// 'save_success': '{0} 已保存于 {1}',
					// 'autosave_success': '{0} 已自动保存于 {1}',

					'selectall': 'Select all',
					'selectrevert': 'Invert selection',
					'selectsiblings': 'Select sibling node',
					'selectlevel': 'Select peer node',
					'selectpath': 'Select path',
					'selecttree': 'Select subtree'
				},
				'popupcolor': {
					'clearColor': 'Clear color',
					'standardColor': 'Standard color',
					'themeColor': 'Theme Color'
				},
				'dialogs': {
					'markers': {
						'static': {
							'lang_input_text': 'Text:',
							'lang_input_url': 'Url:',
							'lang_input_title': 'Title：',
							'lang_input_target': 'Target:'
						},
						'priority': 'Priority',
						'none': 'None',
						'progress': {
							'title': 'Progress',
							'notdone': 'Undone',
							'done1': 'Done 1/8',
							'done2': 'Done 1/4',
							'done3': 'Done 3/8',
							'done4': 'Done 1/2',
							'done5': 'Done 5/8',
							'done6': 'Done 3/4',
							'done7': 'Done 7/8',
							'done': 'Done'
						}
					},
					'help': {

					},
					'hyperlink': {},
					'image': {},
					'resource': {}
				},
				'hyperlink': {
					'hyperlink': 'Link...',
					'unhyperlink': 'Remove link'
				},
				'image': {
					'image': 'Image...',
					'removeimage': 'Remove image'
				},
				'marker': {
					'marker': 'Progress/priority...'
				},
				'resource': {
					'resource': 'Resource...'
				}
			}
		}
	});
/**
 * @fileOverview
 *
 * UI 状态的 LocalStorage 的存取文件，未来可能在离线编辑的时候升级
 *
 * @author: zhangbobell
 * @email : zhangbobell@163.com
 *
 * @copyright: Baidu FEX, 2015
 */
angular.module('kityminderEditor')
    .service('memory', function() {

        function isQuotaExceeded(e) {
            var quotaExceeded = false;
            if (e) {
                if (e.code) {
                    switch (e.code) {
                        case 22:
                            quotaExceeded = true;
                            break;
                        case 1014:
                            // Firefox
                            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                                quotaExceeded = true;
                            }
                            break;
                    }
                } else if (e.number === -2147024882) {
                    // Internet Explorer 8
                    quotaExceeded = true;
                }
            }
            return quotaExceeded;
        }

        return {
            get: function(key) {
                var value = window.localStorage.getItem(key);
                return null || JSON.parse(value);
            },

            set: function(key, value) {
                try {
                    window.localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch(e) {
                    if (isQuotaExceeded(e)) {
                        return false;
                    }
                }
            },
            remove: function(key) {
                var value = window.localStorage.getItem(key);
                window.localStorage.removeItem(key);
                return value;
            },
            clear: function() {
                window.localStorage.clear();
            }
    }
});
angular.module('kityminderEditor')
    .service('minder.service',  function() {

        var callbackQueue = [];

        function registerEvent(callback) {
            callbackQueue.push(callback);
        }

        function executeCallback() {
            callbackQueue.forEach(function(ele) {
                ele.apply(this, arguments);
            })
        }

        return {
            registerEvent: registerEvent,
            executeCallback: executeCallback
        }
    });
angular.module('kityminderEditor')
    .service('resourceService', ['$document', function($document) {
    var openScope = null;

    this.open = function( dropdownScope ) {
        if ( !openScope ) {
            $document.bind('click', closeDropdown);
            $document.bind('keydown', escapeKeyBind);
        }

        if ( openScope && openScope !== dropdownScope ) {
            openScope.resourceListOpen = false;
        }

        openScope = dropdownScope;
    };

    this.close = function( dropdownScope ) {
        if ( openScope === dropdownScope ) {
            openScope = null;
            $document.unbind('click', closeDropdown);
            $document.unbind('keydown', escapeKeyBind);
        }
    };

    var closeDropdown = function( evt ) {
        // This method may still be called during the same mouse event that
        // unbound this event handler. So check openScope before proceeding.
        //console.log(evt, openScope);
        if (!openScope) { return; }

        var toggleElement = openScope.getToggleElement();
        if ( evt && toggleElement && toggleElement[0].contains(evt.target) ) {
            return;
        }

        openScope.$apply(function() {
            console.log('to close the resourcelist');
            openScope.resourceListOpen = false;
        });
    };

    var escapeKeyBind = function( evt ) {
        if ( evt.which === 27 ) {
            openScope.focusToggleElement();
            closeDropdown();
        }
    };
}])
angular.module('kityminderEditor').service('revokeDialog', ['$modal', 'minder.service', function($modal, minderService) {

    minderService.registerEvent(function() {

        // 触发导入节点或导出节点对话框
        var minder = window.minder;
        var editor = window.editor;
        // var parentFSM = editor.hotbox.getParentFSM();


        minder.on('importNodeData', function() {
            parentFSM.jump('modal', 'import-text-modal');

            var importModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function() {
                        return 'Import node';
                    },
                    defaultValue: function() {
                        return '';
                    },
                    type: function() {
                        return 'import';
                    }
                }
            });

            importModal.result.then(function(result) {
                try{
                    minder.Text2Children(minder.getSelectedNode(), result);
                } catch(e) {
                    alert(e);
                }
                parentFSM.jump('normal', 'import-text-finish');
                editor.receiver.selectAll();
            }, function() {
                parentFSM.jump('normal', 'import-text-finish');
                editor.receiver.selectAll();
            });
        });

        minder.on('exportNodeData', function() {
            parentFSM.jump('modal', 'export-text-modal');

            var exportModal = $modal.open({
                animation: true,
                templateUrl: 'ui/dialog/imExportNode/imExportNode.tpl.html',
                controller: 'imExportNode.ctrl',
                size: 'md',
                resolve: {
                    title: function() {
                        return 'Export node';
                    },
                    defaultValue: function() {
                        var selectedNode = minder.getSelectedNode(),
                            Node2Text = window.kityminder.data.getRegisterProtocol('text').Node2Text;

                        return Node2Text(selectedNode);
                    },
                    type: function() {
                        return 'export';
                    }
                }
            });

            exportModal.result.then(function(result) {
                parentFSM.jump('normal', 'export-text-finish');
                editor.receiver.selectAll();
            }, function() {
                parentFSM.jump('normal', 'export-text-finish');
                editor.receiver.selectAll();
            });
        });

    });

    return {};
}]);
/**
 * @fileOverview
 *
 *  与后端交互的服务
 *
 * @author: zhangbobell
 * @email : zhangbobell@163.com
 *
 * @copyright: Baidu FEX, 2015
 */
angular.module('kityminderEditor')
    .service('server', ['config', '$http',  function(config, $http) {

        return {
            uploadImage: function(file) {
                var url = config.get('imageUpload');
                var fd = new FormData();
                fd.append('upload_file', file);

                return $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            }
        }
    }]);
angular.module('kityminderEditor')
    .service('valueTransfer', function() {
        return {};
    });
angular.module('kityminderEditor')
    .filter('commandState', function() {
        return function(minder, command) {
            return minder.queryCommandState(command);
        }
    })
    .filter('commandValue', function() {
        return function(minder, command) {
            return minder.queryCommandValue(command);
        }
    });


angular.module('kityminderEditor')
	.filter('lang', ['config', 'lang.zh-cn', function(config, lang) {
		return function(text, block) {
			var defaultLang = config.get('defaultLang');

			if (lang[defaultLang] == undefined) {
				return '未发现对应语言包，请检查 lang.xxx.service.js!';
			} else {

				var dict = lang[defaultLang];
				block.split('/').forEach(function(ele, idx) {
					dict = dict[ele];
				});

				return dict[text] || null;
			}

		};
	}]);
angular.module('kityminderEditor')
    .controller('hyperlink.ctrl', ["$scope", "$modalInstance", "link", function ($scope, $modalInstance, link) {

        var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        $scope.R_URL = new RegExp(urlRegex, 'i');

        $scope.url = link.url || '';
        $scope.title = link.title || '';

        setTimeout(function() {
            var $linkUrl = $('#link-url');
            $linkUrl.focus();
            $linkUrl[0].setSelectionRange(0, $scope.url.length);
        }, 30);

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13) {
                $scope.ok();
            } else if (e.keyCode == 27) {
                $scope.cancel();
            }
        };

        $scope.ok = function () {
            if($scope.R_URL.test($scope.url)) {
                $modalInstance.close({
                    url: $scope.url,
                    title: $scope.title
                });
            } else {
                $scope.urlPassed = false;

                var $linkUrl = $('#link-url');
                $linkUrl.focus();
                $linkUrl[0].setSelectionRange(0, $scope.url.length);
            }
            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };

    }]);
angular.module('kityminderEditor')
    .controller('imExportNode.ctrl', ["$scope", "$modalInstance", "title", "defaultValue", "type", function ($scope, $modalInstance, title, defaultValue, type) {

        $scope.title = title;

        $scope.value = defaultValue;

        $scope.type = type;

        $scope.ok = function () {
            if ($scope.value == '') {
                return;
            }
            $modalInstance.close($scope.value);
            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };

        setTimeout(function() {
            $('.single-input').focus();

            $('.single-input')[0].setSelectionRange(0, defaultValue.length);

        }, 30);

        $scope.shortCut = function(e) {
            e.stopPropagation();

            //if (e.keyCode == 13 && e.shiftKey == false) {
            //    $scope.ok();
            //}

            if (e.keyCode == 27) {
                $scope.cancel();
            }

            // tab 键屏蔽默认事件 和 backspace 键屏蔽默认事件
            if (e.keyCode == 8 && type == 'export') {
                e.preventDefault();
            }

            if (e.keyCode == 9) {
                e.preventDefault();
                var $textarea = e.target;
                var pos = getCursortPosition($textarea);
                var str = $textarea.value;
                $textarea.value = str.substr(0, pos) + '\t' + str.substr(pos);
                setCaretPosition($textarea, pos + 1);
            }

        };

        /*
        * 获取 textarea 的光标位置
        * @Author: Naixor
        * @date: 2015.09.23
        * */
        function getCursortPosition (ctrl) {
            var CaretPos = 0;	// IE Support
            if (document.selection) {
                ctrl.focus ();
                var Sel = document.selection.createRange ();
                Sel.moveStart ('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
            }
            // Firefox support
            else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
                CaretPos = ctrl.selectionStart;
            }
            return (CaretPos);
        }

        /*
         * 设置 textarea 的光标位置
         * @Author: Naixor
         * @date: 2015.09.23
         * */
        function setCaretPosition(ctrl, pos){
            if(ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos,pos);
            } else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        }

    }]);
angular.module('kityminderEditor')
    .controller('image.ctrl', ['$http', '$scope', '$modalInstance', 'image', 'server', function($http, $scope, $modalInstance, image, server) {

        $scope.data = {
            list: [],
            url: image.url || '',
            title: image.title || '',
            R_URL: /^https?\:\/\/\w+/
        };

        setTimeout(function() {
            var $imageUrl = $('#image-url');
            $imageUrl.focus();
            $imageUrl[0].setSelectionRange(0, $scope.data.url.length);
        }, 300);


        // 搜索图片按钮点击事件
        $scope.searchImage = function() {
            $scope.list = [];

            getImageData()
                .success(function(json) {
                    if(json && json.data) {
                        for(var i = 0; i < json.data.length; i++) {
                            if(json.data[i].objURL) {
                                $scope.list.push({
                                    title: json.data[i].fromPageTitleEnc,
                                    src: json.data[i].middleURL,
                                    url: json.data[i].middleURL
                                });
                            }
                        }
                    }
                })
                .error(function() {

                });
        };

        // 选择图片的鼠标点击事件
        $scope.selectImage = function($event) {
            var targetItem = $('#img-item'+ (this.$index));
            var targetImg = $('#img-'+ (this.$index));

            targetItem.siblings('.selected').removeClass('selected');
            targetItem.addClass('selected');

            $scope.data.url = targetImg.attr('src');
            $scope.data.title = targetImg.attr('alt');
        };

        // 自动上传图片，后端需要直接返回图片 URL
        $scope.uploadImage = function() {
            var fileInput = $('#upload-image');
            if (!fileInput.val()) {
                return;
            }
            if (/^.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)$/.test(fileInput.val())) {
                var file = fileInput[0].files[0];
                return server.uploadImage(file).then(function (json) {
                    var resp = json.data;
                    if (resp.errno === 0) {
                        $scope.data.url = resp.data.url;
                    }
                });
            } else {
                alert("后缀只能是 jpg、gif 及 png");
            }
        };

        $scope.shortCut = function(e) {
            e.stopPropagation();

            if (e.keyCode == 13) {
                $scope.ok();
            } else if (e.keyCode == 27) {
                $scope.cancel();
            }
        };

        $scope.ok = function () {
            if($scope.data.R_URL.test($scope.data.url)) {
                $modalInstance.close({
                    url: $scope.data.url,
                    title: $scope.data.title
                });
            } else {
                $scope.urlPassed = false;

                var $imageUrl = $('#image-url');
                if ($imageUrl) {
                    $imageUrl.focus();
                    $imageUrl[0].setSelectionRange(0, $scope.data.url.length);
                }

            }

            editor.receiver.selectAll();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            editor.receiver.selectAll();
        };

        function getImageData() {
            var key = $scope.data.searchKeyword2;
            var currentTime = new Date();
            var url = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&fp=result&queryWord='+ key +'&cl=2&lm=-1&ie=utf-8&oe=utf-8&st=-1&ic=0&word='+ key +'&face=0&istype=2&nc=1&pn=60&rn=60&gsm=3c&'+ currentTime.getTime() +'=&callback=JSON_CALLBACK';

            return $http.jsonp(url);
        }
    }]);
angular.module('kityminderEditor')
    .directive('appendNode', ['commandBinder', function(commandBinder) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/appendNode/appendNode.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                commandBinder.bind(minder, 'appendchildnode', $scope)

                $scope.execCommand = function(command) {
                    minder.execCommand(command, 'Branch topic');
                    editText();
                };

                function editText() {
                    var receiverElement = editor.receiver.element;
                    var fsm = editor.fsm;
                    var receiver = editor.receiver;

                    receiverElement.innerText = minder.queryCommandValue('text');
                    fsm.jump('input', 'input-request');
                    receiver.selectAll();
                }
            }
        }
    }]);
angular.module('kityminderEditor')
    .directive('arrange', ['commandBinder', function(commandBinder) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/arrange/arrange.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                //commandBinder.bind(minder, 'priority', $scope);
            }
        }
    }]);
angular.module('kityminderEditor')
    .directive('collabPanel', ['Messages', 'RouteInfo', function (Messages, RouteInfo) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/collabPanel/collabPanel.html',
            scope: {
                participants: '=?',
                drawer: '=?',
                collaboration: '=?',
                draw: '=?',
                leftApply: '=?'
            },
            replace: true,
            link: function (scope) {

                scope.participants = [];  // 在线用户列表
                scope.drawer = "Nobody";    // 画图者
                var drawerId = "";
                scope.collaboration = false;  //是否协同
                scope.draw = false;           //是否请求画图
                scope.leftApply = -1;

                scope.applyCtrl = applyCtrl;
                scope.giveupCtrl = giveupCtrl;
                scope.startCollab = startCollab;
                scope.stopCollab = stopCollab;
                scope.gotoUserspace = gotoUserspace;

                function applyCtrl() {
                    if (Messages.isConnection() && scope.collaboration) {

                        var info = RouteInfo.getInfo();

                        if (info.userName != "" && info.userId != "") {

                            var socketContent = {
                                "messageType": "Authority",
                                "value": "Require",
                                "userName": info.userName,
                                "userId": info.userId
                            }
                            Messages.sendSock("collaboration", socketContent, function (data) {
                                if (data != {}) {

                                    if (data.messageType == "Authority") {
                                        scope.drawer = JSON.parse(data.controller).userName;
                                        drawerId = JSON.parse(data.controller).userId;
                                        //当等待队列为零，解除屏蔽操作
                                        if (drawerId == info.userId) {
                                            document.getElementById("edit-mask").style.display = "none";
                                            document.getElementById("giveup-ctrl").style.cursor = "pointer";
                                        }
                                        else{
                                            document.getElementById("giveup-ctrl").style.cursor = "not-allowed";
                                        }

                                        scope.participants = JSON.parse(data.userList);

                                        try {
                                            var requireList = JSON.parse(data.requireList);
                                            for (var i = 0; i < requireList.length; i++) {
                                                if (requireList[i].userId == info.userId) {
                                                    scope.leftApply = i;
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            scope.leftApply = -1;
                                        }
                                    } else if (data.messageType == "Left") {
                                        scope.drawer = JSON.parse(data.controller).userName;
                                        drawerId = JSON.parse(data.controller).userId;
                                        //当等待队列为零，解除屏蔽操作
                                        if (drawerId == info.userId) {
                                            document.getElementById("edit-mask").style.display = "none";
                                            document.getElementById("giveup-ctrl").style.cursor = "pointer";
                                        }
                                        else{
                                            document.getElementById("giveup-ctrl").style.cursor = "not-allowed";
                                        }

                                        scope.participants = JSON.parse(data.userList);

                                        try {
                                            var requireList = JSON.parse(data.requireList);
                                            for (var i = 0; i < requireList.length; i++) {
                                                if (requireList[i].userId == info.userId) {
                                                    scope.leftApply = i;
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            scope.leftApply = -1;
                                        }
                                    }
                                }
                            });

                            scope.draw = true;
                        }
                        else {
                            alert("Missing user information, please log in!");
                        }
                    }
                }

                function giveupCtrl() {
                    var info = RouteInfo.getInfo();
                    if (drawerId == info.userId) {
                        if (Messages.isConnection()) {

                            document.getElementById("edit-mask").style.display = ""; //屏蔽操作

                            var socketContent = {
                                "messageType": "Authority",
                                "value": "Release"
                            }
                            Messages.sendSock("collaboration", socketContent, function (data) {
                                if (data != {}) {

                                    if (data.messageType == "Authority") {

                                        scope.drawer = JSON.parse(data.controller).userName;
                                        drawerId = JSON.parse(data.controller).userId;
                                        scope.participants = JSON.parse(data.userList);

                                    } else if (data.messageType == "Left") {
                                        scope.drawer = JSON.parse(data.controller).userName;
                                        drawerId = JSON.parse(data.controller).userId;
                                        scope.participants = JSON.parse(data.userList);

                                        try {
                                            var requireList = JSON.parse(data.requireList);
                                            for (var i = 0; i < requireList.length; i++) {
                                                if (requireList[i].userId == info.userId) {
                                                    scope.leftApply = i;
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            scope.leftApply = 0;
                                        }
                                    }

                                }
                            });
                        }
                        scope.draw = false;
                    }
                }

                function startCollab() {

                    var info = RouteInfo.getInfo();

                    if (info.pageId != "" && info.userId != "" && info.userName != "") {
                        Messages.startWebsocket(info.pageId);

                        var socketContent = {
                            "messageType": "Join",
                            "userId": info.userId,
                            "userName": info.userName
                        }
                        Messages.sendSock("collaboration", socketContent, function (data) {

                            if (data != {}) {

                                if (data.messageType == "Join") {
                                    scope.drawer = JSON.parse(data.controller).userName;
                                    drawerId = JSON.parse(data.controller).userId;
                                    scope.participants = JSON.parse(data.userList);

                                    scope.collaboration = true;
                                    document.getElementById("edit-mask").style.display = ""; //屏蔽操作
                                }
                                else if (data.messageType == "Left") {
                                    scope.drawer = JSON.parse(data.controller).userName;
                                    drawerId = JSON.parse(data.controller).userId;
                                    scope.participants = JSON.parse(data.userList);

                                    try {
                                        var requireList = JSON.parse(data.requireList);
                                        for (var i = 0; i < requireList.length; i++) {
                                            if (requireList[i].userId == info.userId) {
                                                scope.leftApply = i;
                                            }
                                        }
                                    }
                                    catch (ex) {
                                        scope.leftApply = 0;
                                    }
                                }
                            }
                        });
                    }
                    else if(info.pageId != "" ){
                        alert("Missing page information!");
                    }
                    else{                        
                        alert("Missing user information, please log in!");
                    }
                }

                function stopCollab() {
                    Messages.endWebsocket();
                    scope.collaboration = false;
                    scope.draw = false;
                    scope.participants = [];
                    scope.drawer = "Nobody";
                    document.getElementById("edit-mask").style.display = "none"; //解除屏蔽操作
                }

                function gotoUserspace(userId) {
                    var info = RouteInfo.getInfo();
                    var url = "";
                    if(userId == info.userId){
                        url = "http://"+RouteInfo.getIPPort()+"/personalPage";
                    }
                    else {
                        url = "http://"+RouteInfo.getIPPort()+"/GeoProblemSolving/memberPage/"+userId;
                    }
                    window.location.href = url;
                }
            }
        }
    }]);
angular.module('kityminderEditor')
	.directive('colorPanel', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/colorPanel/colorPanel.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function(scope) {

				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.$on('colorPicked', function(event, color) {
                    event.stopPropagation();
					scope.bgColor = color;
					minder.execCommand('background', color);
				});

				scope.setDefaultBg = function() {
                    var currentNode = minder.getSelectedNode();
                    var bgColor = minder.getNodeStyle(currentNode, 'background');

                    // 有可能是 kity 的颜色类
                    return typeof bgColor === 'object' ? bgColor.toHEX() : bgColor;
                };

                scope.bgColor = scope.setDefaultBg() || '#fff';

			}
		}
	});
angular.module('kityminderEditor')
    .directive('expandLevel', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/expandLevel/expandLevel.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {

                $scope.levels = [1, 2, 3, 4, 5, 6];
            }
        }
    });
angular.module('kityminderEditor')
    .directive('fileImport', ['RouteInfo', function (RouteInfo) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/fileImport/fileImport.html',
            scope: {
                minder: '=',
                mindmapRes: '=?'
            },
            replace: true,
            link: function (scope) {
                scope.updateMaplist = updateMaplist;
                scope.mapImport = mapImport;
                scope.mapLoad = mapLoad;
                scope.deleteMap = deleteMap;

                function updateMaplist() {
                    var maps = [];

                    var info = RouteInfo.getInfo();
                    if (info.pageId != "") {

                        var folderId = info.pageId;
                        try {
                            $.ajax({
                                url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/folder/inquiry?folderId=' + folderId,
                                type: "GET",
                                async: false,
                                success: function (data) {
                                    if (data == "Fail") {
                                        console.log(data);
                                    }
                                    else if (data.files.length != undefined) {

                                        console.log("success!");
                                        for (var i = 0; i < data.files.length; i++) {
                                            maps.push(data.files[i]);
                                        }
                                        scope.mindmapRes = maps;
                                    }

                                },
                                error: function (err) {
                                    console.log("fail.");
                                }
                            });
                        }
                        catch (ex) {
                            console.log("fail")
                        }
                    }
                    else {
                        alert("Missing page information!");
                    }
                }

                function mapImport() {

                    var fileInput = document.getElementById('fileInput');
                    if (fileInput.files.length > 0 && fileInput.files.length != undefined) {

                        var file = fileInput.files[0], fileType = file.name.substr(file.name.lastIndexOf('.') + 1);

                        switch (fileType) {
                            case 'md':
                                fileType = 'markdown';
                                break;
                            case 'km':
                            case 'json':
                                fileType = 'json';
                                break;
                            default:
                                console.log("File not supported!");
                                alert('Only support data format(*.km, *.md, *.json)');
                                return;
                        }

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var content = reader.result;
                            editor.minder.importData(fileType, content).then(function (data) {
                                $(fileInput).val('');
                            });
                            // 导图信息初始化
                            mindmapInfo = {};
                        }
                        reader.readAsText(file);
                    }
                }

                function mapLoad(map) {
                    var fileType = map.name.replace(/.+\./, "");
                    switch (fileType) {
                        case 'md':
                            fileType = 'markdown';
                            break;
                        case 'km':
                        case 'json':
                            fileType = 'json';
                            break;
                        default:
                            console.log("File not supported!");
                            alert('only support data format(*.km, *.md, *.json)');
                            return;
                    }

                    try {

                        var url = "http://" + RouteInfo.getIPPort() + map.pathURL;
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", url, true);
                        xhr.onload = function (e) {
                            if (xhr.status == 200) {
                                var file = xhr.response;

                                editor.minder.importData(fileType, file).then(function (data) {
                                    $(fileInput).val('');
                                });

                                mindmapInfo = {
                                    name: map.name,
                                    resourceId: map.resourceId
                                }
                            }
                        };
                        xhr.send();
                    }
                    catch (ex) {
                        mindmapInfo = {};
                        console.log("import mindmap error");
                    }
                }

                function deleteMap(map) {
                    try {
                        var info = RouteInfo.getInfo();
                        if (info.pageId != "") {

                            var folderId = info.pageId;
                            $.ajax({
                                url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/folder/removeFile?fileId=' + map.resourceId + '&folderId=' + folderId,
                                type: "GET",
                                async: false,
                                success: function (data) {
                                    if (data == "Fail") {
                                    }
                                    else {
                                        alert("Delete the mindmap successfully");
                                        updateMaplist();
                                    }
                                },
                                error: function (err) {
                                    alert("Fail to delete the mindmap");
                                }
                            });
                        }
                    }
                    catch (ex) {
                        console.log("fail")
                    }
                }
            }
        }
    }]);
angular.module('kityminderEditor')
    .directive('fileSave', ['RouteInfo', function (RouteInfo) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/fileSave/fileSave.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function (scope) {
                scope.saveMapFun = saveMapFun;
                scope.saveasMapFun = saveasMapFun;
                scope.downloadMapFun = downloadMapFun;

                function saveMapFun() {
                    if (mindmapInfo != {} && mindmapInfo.name != undefined && mindmapInfo.resourceId != undefined
                        && mindmapInfo.name != "" && mindmapInfo.resourceId != "") {

                        var datatype = mindmapInfo.name.substring(mindmapInfo.name.lastIndexOf('.') + 1);

                        switch (datatype) {
                            case 'km':
                                exportType = 'json';
                                break;
                            case 'md':
                                exportType = 'markdown';
                                break;
                            default:
                                exportType = datatype;
                                break;
                        }

                        editor.minder.exportData(exportType).then(function (file) {

                            var info = RouteInfo.getInfo();
                            if (info.pageId != "" && info.userId != "") {

                                //thumbnail
                                editor.minder.exportData('png').then(function (content) {
                                    //压缩
                                    var canvas = document.createElement('canvas'),
                                        context = canvas.getContext('2d');
                                    // canvas对图片进行缩放
                                    canvas.width = 120;
                                    canvas.height = 120;

                                    var image = new Image()
                                    image.src = content;
                                    image.onload = function () {
                                        // 清除画布,图片压缩
                                        context.clearRect(0, 0, 120, 120);
                                        context.drawImage(image, 0, 0, 120, 120);

                                        var thumbnailUrl = canvas.toDataURL();
                                        var thumbnailBlob = getBlobBydataURI(thumbnailUrl);
                                        var thumbnailName = $('#mindmapName').val() + ".png";
                                        var thumbnailBlobFile = new File([thumbnailBlob], "thumbnail_" + thumbnailName);

                                        // 文件上传
                                        var blob = new Blob([file]);
                                        var filename = mindmapInfo.name;
                                        var fileBlob = new File([blob], filename);

                                        // 工具信息
                                        var toolInfo = {toolName:"Mind map", toolUrl:"/GeoProblemSolving/Collaborative/Mindmap/index.html"};

                                        var formData = new FormData();
                                        formData.append("resourceId", mindmapInfo.resourceId);
                                        formData.append("file", fileBlob);
                                        formData.append("uploaderId", info.userId);
                                        formData.append("folderId", info.pageId);
                                        formData.append("thumbnail", thumbnailBlobFile);
                                        formData.append("editToolInfo", JSON.stringify(toolInfo));

                                        try {
                                            $.ajax({
                                                url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/folder/uploadToFolder',
                                                type: "POST",
                                                data: formData,
                                                processData: false,
                                                contentType: false,
                                                success: function (data) {
                                                    if (data == "Size over" || data == "Fail" || data == "Offline") {
                                                        console.log(data);
                                                    }
                                                    else if (data.uploaded.length > 0) {
                                                        alert("Save this mind map successfully");
                                                    }
                                                },
                                                error: function (err) {
                                                    console.log("fail.");
                                                }
                                            });
                                        }
                                        catch (ex) {
                                            console.log("fail")
                                        }

                                    }
                                });
                            }
                            else if(info.pageId != "" ){
                                alert("Missing page information!");
                            }
                            else{                        
                                alert("Missing user information, please log in!");
                            }

                        });

                    }
                    else {
                        alert("Please click \"Save as\".");
                    }
                }

                function saveasMapFun() {
                    if ($('#mindmapName').val() != "" && $('#mindmapName').val() != undefined) {
                        var datatype = $('#datatypeSelect').val();

                        switch (datatype) {
                            case 'km':
                                exportType = 'json';
                                break;
                            case 'md':
                                exportType = 'markdown';
                                break;
                            default:
                                exportType = datatype;
                                break;
                        }

                        editor.minder.exportData(exportType).then(function (file) {

                            var info = RouteInfo.getInfo();
                            if (info.pageId != "" && info.userId != "") {
                                //thumbnail
                                editor.minder.exportData('png').then(function (content) {
                                    //压缩
                                    var canvas = document.createElement('canvas'),
                                        context = canvas.getContext('2d');
                                    // canvas对图片进行缩放
                                    canvas.width = 120;
                                    canvas.height = 120;

                                    var image = new Image()
                                    image.src = content;
                                    image.onload = function () {
                                        // 清除画布,图片压缩
                                        context.clearRect(0, 0, 120, 120);
                                        context.drawImage(image, 0, 0, 120, 120);

                                        var thumbnailUrl = canvas.toDataURL();
                                        var thumbnailBlob = getBlobBydataURI(thumbnailUrl);
                                        var thumbnailName = $('#mindmapName').val() + ".png";
                                        var thumbnailBlobFile = new File([thumbnailBlob], "thumbnail_" + thumbnailName);

                                        // 文件上传
                                        var blob = new Blob([file]);
                                        var filename = $('#mindmapName').val() + '.' + datatype;
                                        var fileBlob = new File([blob], filename);

                                        // 工具信息
                                        var toolInfo = {toolName:"Mind map", toolUrl:"/GeoProblemSolving/Collaborative/Mindmap/index.html"};

                                        var formData = new FormData();
                                        formData.append("file", fileBlob);
                                        formData.append("description", "Collaborative mindmap tool");
                                        formData.append("type", "toolData:Mindmap");
                                        formData.append("uploaderId", info.userId);
                                        formData.append("privacy", "private");
                                        formData.append("folderId", info.pageId);
                                        formData.append("thumbnail", thumbnailBlobFile);
                                        formData.append("editToolInfo", JSON.stringify(toolInfo));

                                        try {
                                            $.ajax({
                                                url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/folder/uploadToFolder',
                                                type: "POST",
                                                data: formData,
                                                processData: false,
                                                contentType: false,
                                                success: function (data) {
                                                    if (data == "Size over" || data == "Fail" || data == "Offline") {
                                                        console.log(data);
                                                    }
                                                    else if (data.uploaded.length > 0) {
                                                        alert("Save this mind map successfully");

                                                        mindmapInfo = {
                                                            name: filename,
                                                            resourceId: data.uploaded[0].resourceId
                                                        };
                                                    }
                                                },
                                                error: function (err) {
                                                    console.log("fail.");
                                                    mindmapInfo = {};
                                                }
                                            });
                                        }
                                        catch (ex) {
                                            console.log("fail")
                                            mindmapInfo = {};
                                        }
                                    }

                                });
                            }
                            else if(info.pageId != "" ){
                                alert("Missing page information!");
                            }
                            else{                        
                                alert("Missing user information, please log in!");
                            }

                        });
                    }
                }

                function downloadMapFun() {

                    if (mindmapInfo != {} && mindmapInfo.name != undefined && mindmapInfo.name != "") {

                        var datatype = mindmapInfo.name.substring(mindmapInfo.name.lastIndexOf('.') + 1);

                        switch (datatype) {
                            case 'km':
                                exportType = 'json';
                                break;
                            case 'md':
                                exportType = 'markdown';
                                break;
                            default:
                                exportType = datatype;
                                break;
                        }

                        editor.minder.exportData(exportType).then(function (content) {

                            // 文件下载
                            if (datatype == "png") {
                                var arr = content.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                                while (n--) {
                                    u8arr[n] = bstr.charCodeAt(n);
                                }

                                var blob = new Blob([u8arr], { type: mime }),
                                    url = URL.createObjectURL(blob);
                            }
                            else {
                                var blob = new Blob([content]),
                                    url = URL.createObjectURL(blob);
                            }

                            var a = document.createElement("a");
                            a.download = mindmapInfo.name;
                            a.href = url;
                            $("body").append(a);
                            a.click();
                            $(a).remove();
                        });

                    } else if ($('#mindmapName').val() != "" && $('#mindmapName').val() != undefined) {
                        datatype = $('#datatypeSelect').val();

                        switch (datatype) {
                            case 'km':
                                exportType = 'json';
                                break;
                            case 'md':
                                exportType = 'markdown';
                                break;
                            default:
                                exportType = datatype;
                                break;
                        }

                        editor.minder.exportData(exportType).then(function (content) {

                            // 文件下载
                            if (datatype == "png") {
                                var blob = getBlobBydataURI(content);
                                var url = URL.createObjectURL(blob);
                            }
                            else {
                                var blob = new Blob([content]),
                                    url = URL.createObjectURL(blob);
                            }

                            var a = document.createElement("a");
                            a.download = $('#mindmapName').val() + '.' + datatype;
                            a.href = url;
                            $("body").append(a);
                            a.click();
                            $(a).remove();
                        });
                    }
                    else {

                    }
                }

                function getBlobBydataURI(dataurl) {
                    var arr = dataurl.split(","),
                        mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]),
                        n = bstr.length,
                        u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    return new Blob([u8arr], { type: mime });
                }
            }
        }
    }]);
angular.module('kityminderEditor')
	.directive('fontOperator', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/fontOperator/fontOperator.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function(scope) {
				var minder = scope.minder;
				var currentTheme = minder.getThemeItems();

				scope.fontSizeList = [10, 12, 16, 18, 24, 32, 48];
                scope.fontFamilyList = [{
                    name: '宋体',
                    val: '宋体,SimSun'
                }, {
                    name: '微软雅黑',
                    val: '微软雅黑,Microsoft YaHei'
                }, {
                    name: '楷体',
                    val: '楷体,楷体_GB2312,SimKai'
                }, {
                    name: '黑体',
                    val: '黑体, SimHei'
                }, {
                    name: '隶书',
                    val: '隶书, SimLi'
                }, {
                    name: 'Andale Mono',
                    val: 'andale mono'
                }, {
                    name: 'Arial',
                    val: 'arial,helvetica,sans-serif'
                }, {
                    name: 'arialBlack',
                    val: 'arial black,avant garde'
                }, {
                    name: 'Comic Sans Ms',
                    val: 'comic sans ms'
                }, {
                    name: 'Impact',
                    val: 'impact,chicago'
                }, {
                    name: 'Times New Roman',
                    val: 'times new roman'
                }, {
                    name: 'Sans-Serif',
                    val: 'sans-serif'
                }];

                scope.$on('colorPicked', function(event, color) {
                    event.stopPropagation();

                    scope.foreColor = color;
                    minder.execCommand('forecolor', color);
                });

                scope.setDefaultColor = function() {
                    var currentNode = minder.getSelectedNode();
                    var fontColor = minder.getNodeStyle(currentNode, 'color');

                    // 有可能是 kity 的颜色类
                    return typeof fontColor === 'object' ? fontColor.toHEX() : fontColor;
                };

                scope.foreColor = scope.setDefaultColor() || '#000';

                scope.getFontfamilyName = function(val) {
                    var fontName = '';
                    scope.fontFamilyList.forEach(function(ele, idx, arr) {
                        if (ele.val === val) {
                            fontName = ele.name;
                            return '';
                        }
                    });

                    return fontName;
                }
			}
		}
	});
angular.module('kityminderEditor')
    .directive('hyperLink', ['$modal', function($modal) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/hyperLink/hyperLink.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.addHyperlink = function() {

                    var link = minder.queryCommandValue('HyperLink');

                    var hyperlinkModal = $modal.open({
                        animation: true,
                        templateUrl: 'ui/dialog/hyperlink/hyperlink.tpl.html',
                        controller: 'hyperlink.ctrl',
                        size: 'md',
                        resolve: {
                            link: function() {
                                return link;
                            }
                        }
                    });

                    hyperlinkModal.result.then(function(result) {
                        minder.execCommand('HyperLink', result.url, result.title || '');
                    });
                }
            }
        }
    }]);
angular.module('kityminderEditor')
    .directive('imageBtn', ['$modal', function($modal) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/imageBtn/imageBtn.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.addImage = function() {

                    var image = minder.queryCommandValue('image');

                    var imageModal = $modal.open({
                        animation: true,
                        templateUrl: 'ui/dialog/image/image.tpl.html',
                        controller: 'image.ctrl',
                        size: 'md',
                        resolve: {
                            image: function() {
                                return image;
                            }
                        }
                    });

                    imageModal.result.then(function(result) {
                        minder.execCommand('image', result.url, result.title || '');
                    });
                }
            }
        }
    }]);
angular.module('kityminderEditor')
	.directive('kityminderEditor', ['config', 'minder.service', 'revokeDialog', 'Messages', 'RouteInfo', function (config, minderService, revokeDialog, Messages, RouteInfo) {
		return {
			restrict: 'EA',
			templateUrl: 'ui/directive/kityminderEditor/kityminderEditor.html',
			replace: true,
			scope: {
				onInit: '&',
			},
			link: function (scope, element, attributes) {

				var $minderEditor = element.children('.minder-editor')[0];

				function onInit(editor, minder) {
					scope.onInit({
						editor: editor,
						minder: minder
					});

					minderService.executeCallback();
				}

				if (typeof (seajs) != 'undefined') {
					/* global seajs */
					seajs.config({
						base: './src'
					});

					define('demo', function (require) {
						var Editor = require('editor');

						var editor = window.editor = new Editor($minderEditor);

						if (window.localStorage.__dev_minder_content) {
							// editor.minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
						}

						// init map
						var info = RouteInfo.getInfo();
						if (info.resourceId != "") {
							// updateMaplist(info.resourceId);
							// function updateMaplist(resourceId) {
							// 	var map = {};
							// 	try {
							// 		$.ajax({
							// 			url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/resource/inquiry?key=resourceId&value=' + resourceId,
							// 			type: "GET",
							// 			async: false,
							// 			success: function (data) {
							// 				if (data !== "Fail" && data !== "None") {
							// 					map = data[0];
							// 					mapImport(map);
							// 				}
							// 			},
							// 			error: function (err) {
							// 				console.log("fail.");
							// 			}
							// 		});
							// 	}
							// 	catch (ex) {
							// 		console.log("fail")
							// 	}
							// }

							updateMaplist();
							function updateMaplist() {
								var map = {};
								try {
									$.ajax({
										url: 'http://' + RouteInfo.getIPPort() + '/GeoProblemSolving/folder/inquiry?folderId=' + info.pageId,
										type: "GET",
										async: false,
										success: function (data) {
											if (data == "Fail") {
												console.log(data);
											}
											else if (data.files.length != undefined) {
												for (var i = data.files.length - 1; i >= 0; i--) {
													if (data.files[i].type == "toolData:Mindmap") {
														map = data.files[i];
														mapImport(map);
														break;
													}
												}
											}

										},
										error: function (err) {
											console.log("fail.");
										}
									});
								}
								catch (ex) {
									console.log("fail")
								}
							}

							function mapImport(map) {
								try {
									var fileType = map.name.substr(map.name.lastIndexOf('.') + 1);

									switch (fileType) {
										case 'md':
											fileType = 'markdown';
											break;
										case 'km':
										case 'json':
											fileType = 'json';
											break;
										default:
											console.log("File not supported!");
											alert('Only support data format(*.km, *.md, *.json)');
											return;
									}

									var url = "http://" + RouteInfo.getIPPort() + map.pathURL;
									var xhr = new XMLHttpRequest();
									xhr.open("GET", url, true);
									xhr.onload = function (e) {
										if (xhr.status == 200) {
											var file = xhr.response;

											$("#loading").show();
											editor.minder.importData(fileType, file).then(function () {
												$("#loading").hide();
											});

											mindmapInfo = {
												name: map.name,
												resourceId: map.resourceId
											}
										}
									};
									xhr.send();
								}
								catch (err) {
									console.log(err);
								}
							}

						}
						
						editor.minder.on('contentchange', function () {
							// window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());							
						});

						function contentListening() {

							if (window.localStorage.__dev_minder_content !== JSON.stringify(editor.minder.exportJson())) {
								window.localStorage.__dev_minder_content = JSON.stringify(editor.minder.exportJson());								
							}

						}
						setInterval(contentListening, 1000);
						/*** for collaboration * end ***/

						window.minder = window.km = editor.minder;

						scope.editor = editor;
						scope.minder = minder;
						scope.config = config.get();

						//scope.minder.setDefaultOptions(scope.config);
						scope.$apply();

						onInit(editor, minder);
					});

					seajs.use('demo');

				} else if (window.kityminder && window.kityminder.Editor) {
					var editor = new kityminder.Editor($minderEditor);

					window.editor = scope.editor = editor;
					window.minder = scope.minder = editor.minder;

					scope.config = config.get();

					// scope.minder.setDefaultOptions(config.getConfig());

					onInit(editor, editor.minder);
				}

			}
		}
	}]);
angular.module('kityminderEditor')
    .directive('kityminderViewer', ['config', 'minder.service', function(config, minderService) {
        return {
            restrict: 'EA',
            templateUrl: 'ui/directive/kityminderViewer/kityminderViewer.html',
            replace: true,
            scope: {
                onInit: '&'
            },
            link: function(scope, element, attributes) {

                var $minderEditor = element.children('.minder-viewer')[0];

                function onInit(editor, minder) {
                    scope.onInit({
                        editor: editor,
                        minder: minder
                    });

                    minderService.executeCallback();
                }

                if (window.kityminder && window.kityminder.Editor) {
                    var editor = new kityminder.Editor($minderEditor);

                    window.editor = scope.editor = editor;
                    window.minder = scope.minder = editor.minder;

                    onInit(editor, editor.minder);
                }

            }
        }
    }]);
angular.module('kityminderEditor')
	.directive('layout', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/layout/layout.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function(scope) {

			}
		}
	});
/**
 * @fileOverview
 *
 * 左下角的导航器
 *
 * @author: zhangbobell
 * @email : zhangbobell@163.com
 *
 * @copyright: Baidu FEX, 2015 */
angular.module('kityminderEditor')
    .directive('navigator', ['memory', 'config', 'Messages', function (memory, config, Messages) {
        return {
            restrict: 'A',
            templateUrl: 'ui/directive/navigator/navigator.html',
            scope: {
                minder: '='
            },
            link: function (scope) {
                var markSocket = false; //if the change is from socket

                minder.setDefaultOptions({ zoom: config.get('zoom') });

                scope.isNavOpen = !memory.get('navigator-hidden');

                scope.getZoomRadio = function (value) {
                    var zoomStack = minder.getOption('zoom');
                    var minValue = zoomStack[0];
                    var maxValue = zoomStack[zoomStack.length - 1];
                    var valueRange = maxValue - minValue;

                    return (1 - (value - minValue) / valueRange);
                };

                scope.getHeight = function (value) {
                    var totalHeight = $('.zoom-pan').height();

                    return scope.getZoomRadio(value) * totalHeight;
                };

                // 初始的缩放倍数
                scope.zoom = 100;

                // 发生缩放事件时
                minder.on('zoom', function (e) {

                    scope.zoom = e.zoom;

                    // // websocket zoom
                    // if (!markSocket) {
                    //     var socketContent = {
                    //         "event": "zoom",
                    //         "value": e.zoom
                    //     }
                    //     Messages.get(socketContent);
                    //     markSocket = true;
                    // }
                });

                scope.toggleNavOpen = function () {
                    scope.isNavOpen = !scope.isNavOpen;
                    memory.set('navigator-hidden', !scope.isNavOpen);

                    if (scope.isNavOpen) {
                        bind();
                        updateContentView();
                        updateVisibleView();
                    } else {
                        unbind();
                    }
                };

                setTimeout(function () {
                    if (scope.isNavOpen) {
                        bind();
                        updateContentView();
                        updateVisibleView();
                    } else {
                        unbind();
                    }
                }, 0);



                function bind() {
                    minder.on('layout layoutallfinish', updateContentView);
                    minder.on('viewchange', updateVisibleView);
                }

                function unbind() {
                    minder.off('layout layoutallfinish', updateContentView);
                    minder.off('viewchange', updateVisibleView);
                }


                /**  以下部分是缩略图导航器 *
                 * */

                var $previewNavigator = $('.nav-previewer');

                // 画布，渲染缩略图
                var paper = new kity.Paper($previewNavigator[0]);

                // 用两个路径来挥之节点和连线的缩略图
                var nodeThumb = paper.put(new kity.Path());
                var connectionThumb = paper.put(new kity.Path());

                // 表示可视区域的矩形
                var visibleRect = paper.put(new kity.Rect(100, 100).stroke('red', '1%'));

                var contentView = new kity.Box(), visibleView = new kity.Box();

                /**
                 * 增加一个对天盘图情况缩略图的处理,
                 * @Editor: Naixor line 104~129
                 * @Date: 2015.11.3
                 */
                var pathHandler = getPathHandler(minder.getTheme());

                // 主题切换事件
                minder.on('themechange', function (e) {
                    pathHandler = getPathHandler(e.theme);
                });

                function getPathHandler(theme) {
                    switch (theme) {
                        case "tianpan":
                        case "tianpan-compact":
                            return function (nodePathData, x, y, width, height) {
                                var r = width >> 1;
                                nodePathData.push('M', x, y + r,
                                    'a', r, r, 0, 1, 1, 0, 0.01,
                                    'z');
                            }
                        default: {
                            return function (nodePathData, x, y, width, height) {
                                nodePathData.push('M', x, y,
                                    'h', width, 'v', height,
                                    'h', -width, 'z');
                            }
                        }
                    }
                }

                navigate();

                function navigate() {

                    function moveView(center, duration) {
                        var box = visibleView;
                        center.x = -center.x;
                        center.y = -center.y;

                        var viewMatrix = minder.getPaper().getViewPortMatrix();
                        box = viewMatrix.transformBox(box);

                        var targetPosition = center.offset(box.width / 2, box.height / 2);

                        minder.getViewDragger().moveTo(targetPosition, duration);
                    }

                    var dragging = false;

                    paper.on('mousedown', function (e) {
                        dragging = true;
                        moveView(e.getPosition('top'), 200);
                        $previewNavigator.addClass('grab');
                    });

                    paper.on('mousemove', function (e) {
                        if (dragging) {
                            moveView(e.getPosition('top'));
                        }
                    });

                    $(window).on('mouseup', function () {
                        dragging = false;
                        $previewNavigator.removeClass('grab');
                    });
                }

                function updateContentView() {

                    var view = minder.getRenderContainer().getBoundaryBox();

                    contentView = view;

                    var padding = 30;

                    paper.setViewBox(
                        view.x - padding - 0.5,
                        view.y - padding - 0.5,
                        view.width + padding * 2 + 1,
                        view.height + padding * 2 + 1);

                    var nodePathData = [];
                    var connectionThumbData = [];

                    minder.getRoot().traverse(function (node) {
                        var box = node.getLayoutBox();
                        pathHandler(nodePathData, box.x, box.y, box.width, box.height);
                        if (node.getConnection() && node.parent && node.parent.isExpanded()) {
                            connectionThumbData.push(node.getConnection().getPathData());
                        }
                    });

                    paper.setStyle('background', minder.getStyle('background'));

                    if (nodePathData.length) {
                        nodeThumb
                            .fill(minder.getStyle('root-background'))
                            .setPathData(nodePathData);
                    } else {
                        nodeThumb.setPathData(null);
                    }

                    if (connectionThumbData.length) {
                        connectionThumb
                            .stroke(minder.getStyle('connect-color'), '0.5%')
                            .setPathData(connectionThumbData);
                    } else {
                        connectionThumb.setPathData(null);
                    }

                    updateVisibleView();
                }

                function updateVisibleView() {
                    visibleView = minder.getViewDragger().getView();
                    visibleRect.setBox(visibleView.intersect(contentView));
                }

            }
        }
    }]);
angular.module('kityminderEditor')
    .directive('noteBtn', ['valueTransfer', function(valueTransfer) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/noteBtn/noteBtn.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.addNote =function() {
                    valueTransfer.noteEditorOpen = true;
                };
            }
        }
    }]);
angular.module('kityminderEditor')

	.directive('noteEditor', ['valueTransfer', function(valueTransfer) {
		return {
			restrict: 'A',
			templateUrl: 'ui/directive/noteEditor/noteEditor.html',
			scope: {
				minder: '='
			},
            replace: true,
			controller: ["$scope", function($scope) {
				var minder = $scope.minder;
				var isInteracting = false;
				var cmEditor;

				$scope.codemirrorLoaded =  function(_editor) {

					cmEditor = $scope.cmEditor = _editor;

					_editor.setSize('100%', '100%');
				};

				function updateNote() {
					var enabled = $scope.noteEnabled = minder.queryCommandState('note') != -1;
					var noteValue = minder.queryCommandValue('note') || '';

					if (enabled) {
						$scope.noteContent = noteValue;
					}

					isInteracting = true;
					$scope.$apply();
					isInteracting = false;
				}


				$scope.$watch('noteContent', function(content) {
					var enabled = minder.queryCommandState('note') != -1;

					if (content && enabled && !isInteracting) {
						minder.execCommand('note', content);
					}

					setTimeout(function() {
						cmEditor.refresh();
					});
				});


                var noteEditorOpen = function() {
                    return valueTransfer.noteEditorOpen;
                };

                // 监听面板状态变量的改变
                $scope.$watch(noteEditorOpen, function(newVal, oldVal) {
                    if (newVal) {
                        setTimeout(function() {
                            cmEditor.refresh();
                            cmEditor.focus();
                        });
                    }
                    $scope.noteEditorOpen = valueTransfer.noteEditorOpen;
                }, true);


                $scope.closeNoteEditor = function() {
                    valueTransfer.noteEditorOpen = false;
					editor.receiver.selectAll();
                };



				minder.on('interactchange', updateNote);
			}]
		}
	}]);
// TODO: 使用一个 div 容器作为 previewer，而不是两个
angular.module('kityminderEditor')

	.directive('notePreviewer', ['$sce', 'valueTransfer', function($sce, valueTransfer) {
		return {
			restrict: 'A',
			templateUrl: 'ui/directive/notePreviewer/notePreviewer.html',
			link: function(scope, element) {
				var minder = scope.minder;
				var $container = element.parent();
				var $previewer = element.children();
				scope.showNotePreviewer = false;

				marked.setOptions({
                    gfm: true,
                    tables: true,
                    breaks: true,
                    pedantic: false,
                    sanitize: true,
                    smartLists: true,
                    smartypants: false
                });


				var previewTimer;
				minder.on('shownoterequest', function(e) {

					previewTimer = setTimeout(function() {
						preview(e.node, e.keyword);
					}, 300);
				});
				minder.on('hidenoterequest', function() {
					clearTimeout(previewTimer);

                    scope.showNotePreviewer = false;
                    //scope.$apply();
				});

				var previewLive = false;
				$(document).on('mousedown mousewheel DOMMouseScroll', function() {
					if (!previewLive) return;
					scope.showNotePreviewer = false;
					scope.$apply();
				});

				element.on('mousedown mousewheel DOMMouseScroll', function(e) {
					e.stopPropagation();
				});

				function preview(node, keyword) {
					var icon = node.getRenderer('NoteIconRenderer').getRenderShape();
					var b = icon.getRenderBox('screen');
					var note = node.getData('note');

					$previewer[0].scrollTop = 0;

					var html = marked(note);
					if (keyword) {
						html = html.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
					}
					scope.noteContent = $sce.trustAsHtml(html);
					scope.$apply(); // 让浏览器重新渲染以获取 previewer 提示框的尺寸

					var cw = $($container[0]).width();
					var ch = $($container[0]).height();
					var pw = $($previewer).outerWidth();
					var ph = $($previewer).outerHeight();

					var x = b.cx - pw / 2 - $container[0].offsetLeft;
					var y = b.bottom + 10 - $container[0].offsetTop;

					if (x < 0) x = 10;
					if (x + pw > cw) x = b.left - pw - 10 - $container[0].offsetLeft;
					if (y + ph > ch) y = b.top - ph - 10 - $container[0].offsetTop;


					scope.previewerStyle = {
						'left': Math.round(x) + 'px',
						'top': Math.round(y) + 'px'
					};

					scope.showNotePreviewer = true;

					var view = $previewer[0].querySelector('.highlight');
					if (view) {
						view.scrollIntoView();
					}
					previewLive = true;

					scope.$apply();
				}
			}
		}
}]);
angular.module('kityminderEditor')
    .directive('operation', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/operation/operation.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                $scope.editNode = function() {

                    var receiverElement = editor.receiver.element;
                    var fsm = editor.fsm;
                    var receiver = editor.receiver;

                    receiverElement.innerText = minder.queryCommandValue('text');
                    fsm.jump('input', 'input-request');
                    receiver.selectAll();

                }

            }
        }
    });
angular.module('kityminderEditor')

    .directive('priorityEditor', ['commandBinder', function(commandBinder) {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/priorityEditor/priorityEditor.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;
                var priorities = [];

                for (var i = 0; i < 10; i++) {
                    priorities.push(i);
                }

	            commandBinder.bind(minder, 'priority', $scope);

	            $scope.priorities = priorities;

	            $scope.getPriorityTitle = function(p) {
		            switch(p) {
			            case 0: return 'Remove priority';
			            default: return 'Priority' + p;
		            }
	            }
            }

        }
    }]);
angular.module('kityminderEditor')
	.directive('progressEditor', ['commandBinder', function(commandBinder) {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/progressEditor/progressEditor.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function($scope) {
				var minder = $scope.minder;
				var progresses = [];

				for (var i = 0; i < 10; i++) {
					progresses.push(i);
				}

				commandBinder.bind(minder, 'progress', $scope);

				$scope.progresses = progresses;

				$scope.getProgressTitle = function(p) {
					switch(p) {
						case 0: return 'Remove progress';
						case 1: return 'Undone';
						case 9: return 'Done';
						default: return 'Done' + (p - 1) + '/8';

					}
				}
			}
		}
	}])
angular.module('kityminderEditor')
    .directive('resourceEditor', function () {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/resourceEditor/resourceEditor.html',
            scope: {
                minder: '='
            },
            replace: true,
            controller: ["$scope", function ($scope) {
                var minder = $scope.minder;

	            var isInteracting = false;

                minder.on('interactchange', function () {
                    var enabled = $scope.enabled = minder.queryCommandState('resource') != -1;
                    var selected = enabled ? minder.queryCommandValue('resource') : [];
                    var used = minder.getUsedResource().map(function (resourceName) {
                        return {
                            name: resourceName,
                            selected: selected.indexOf(resourceName) > -1
                        }
                    });
                    $scope.used = used;

	                isInteracting = true;
                    $scope.$apply();
	                isInteracting = false;
                });

                $scope.$watch('used', function (used) {
                    if (minder.queryCommandState('resource') != -1 && used) {
                        var resource = used.filter(function (resource) {
                            return resource.selected;
                        }).map(function (resource) {
                            return resource.name;
                        });

	                    // 由于 interactchange 带来的改变则不用执行 resource 命令
	                    if (isInteracting) {
		                    return;
	                    }
                        minder.execCommand('resource', resource);
                    }
                }, true);

                $scope.resourceColor = function (resource) {
                    return minder.getResourceColor(resource).toHEX();
                };

                $scope.addResource = function (resourceName) {
	                var origin = minder.queryCommandValue('resource');
                    if (!resourceName || !/\S/.test(resourceName)) return;

	                if (origin.indexOf(resourceName) == -1) {
		                $scope.used.push({
			                name: resourceName,
			                selected: true
		                });
	                }

                    $scope.newResourceName = null;
                };

            }]
        };
    })

    .directive('clickAnywhereButHere', ['$document', function ($document) {
        return {
            link: function(scope, element, attrs) {
                var onClick = function (event) {
                    var isChild = $('#resource-dropdown').has(event.target).length > 0;
                    var isSelf = $('#resource-dropdown') == event.target;
                    var isInside = isChild || isSelf;
                    if (!isInside) {
                        scope.$apply(attrs.clickAnywhereButHere)
                    }
                };

                scope.$watch(attrs.isActive, function(newValue, oldValue) {
                    if (newValue !== oldValue && newValue == true) {
                        $document.bind('click', onClick);
                    }
                    else if (newValue !== oldValue && newValue == false) {
                        $document.unbind('click', onClick);
                    }
                });
            }
        };
    }]);
angular.module('kityminderEditor')
    .directive('searchBox', function() {
        return {
            restrict: 'A',
            templateUrl: 'ui/directive/searchBox/searchBox.html',
            scope: {
                minder: '='
            },
            replace: true,
            controller: ["$scope", function ($scope) {
                var minder = $scope.minder;
                var editor = window.editor;
                $scope.handleKeyDown = handleKeyDown;
                $scope.doSearch = doSearch;
                $scope.exitSearch = exitSearch;
                $scope.showTip = false;
                $scope.showSearch = false;

                // 处理输入框按键事件
                function handleKeyDown(e) {
                    if (e.keyCode == 13) {
                        var direction = e.shiftKey ? 'prev' : 'next';
                        doSearch($scope.keyword, direction);
                    }
                    if (e.keyCode == 27) {
                        exitSearch();
                    }
                }

                function exitSearch() {
                    $('#search-input').blur();
                    $scope.showSearch = false;
                    minder.fire('hidenoterequest');
                    editor.receiver.selectAll();
                }

                function enterSearch() {
                    $scope.showSearch = true;
                    setTimeout(function() {
                        $('#search-input').focus();
                    }, 10);

                    if ($scope.keyword) {
                        $('#search-input')[0].setSelectionRange(0, $scope.keyword.length);
                    }
                }

                $('body').on('keydown', function(e) {
                    if (e.keyCode == 70 && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
                        enterSearch();

                        $scope.$apply();
                        e.preventDefault();
                    }
                });

                minder.on('searchNode', function() {
                    enterSearch();
                });


                var nodeSequence = [];
                var searchSequence = [];


                minder.on('contentchange', makeNodeSequence);

                makeNodeSequence();


                function makeNodeSequence() {
                    nodeSequence = [];
                    minder.getRoot().traverse(function(node) {
                        nodeSequence.push(node);
                    });
                }

                function makeSearchSequence(keyword) {
                    searchSequence = [];

                    for (var i = 0; i < nodeSequence.length; i++) {
                        var node = nodeSequence[i];
                        var text = node.getText().toLowerCase();
                        if (text.indexOf(keyword) != -1) {
                            searchSequence.push({node:node});
                        }
                        var note = node.getData('note');
                        if (note && note.toLowerCase().indexOf(keyword) != -1) {
                            searchSequence.push({node: node, keyword: keyword});
                        }
                    }
                }


                function doSearch(keyword, direction) {
                    $scope.showTip = false;
                    minder.fire('hidenoterequest');

                    if (!keyword || !/\S/.exec(keyword)) {
                        $('#search-input').focus();
                        return;
                    }

                    // 当搜索不到节点时候默认的选项
                    $scope.showTip = true;
                    $scope.curIndex = 0;
                    $scope.resultNum = 0;


                    keyword = keyword.toLowerCase();
                    var newSearch = doSearch.lastKeyword != keyword;

                    doSearch.lastKeyword = keyword;

                    if (newSearch) {
                        makeSearchSequence(keyword);
                    }

                    $scope.resultNum = searchSequence.length;

                    if (searchSequence.length) {
                        var curIndex = newSearch ? 0 : (direction === 'next' ? doSearch.lastIndex + 1 : doSearch.lastIndex - 1) || 0;
                        curIndex = (searchSequence.length + curIndex) % searchSequence.length;

                        setSearchResult(searchSequence[curIndex].node, searchSequence[curIndex].keyword);

                        doSearch.lastIndex = curIndex;

                        $scope.curIndex = curIndex + 1;

                        function setSearchResult(node, previewKeyword) {
                            minder.execCommand('camera', node, 50);
                            setTimeout(function () {
                                minder.select(node, true);
                                if (!node.isExpanded()) minder.execCommand('expand', true);
                                if (previewKeyword) {
                                    minder.fire('shownoterequest', {node: node, keyword: previewKeyword});
                                }
                            }, 60);
                        }
                    }
                }


            }]
        }
    });
angular.module('kityminderEditor')
    .directive('searchBtn', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/searchBtn/searchBtn.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function (scope) {
                scope.enterSearch = enterSearch;

                function enterSearch() {
                    minder.fire('searchNode');
                }
            }
        }
    });
angular.module('kityminderEditor')
    .directive('selectAll', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/selectAll/selectAll.html',
            scope: {
                minder: '='
            },
            replace: true,
            link: function($scope) {
                var minder = $scope.minder;

                $scope.items = ['revert', 'siblings', 'level', 'path', 'tree'];

                $scope.select = {
                    all: function() {
                        var selection = [];
                        minder.getRoot().traverse(function(node) {
                            selection.push(node);
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    },
                    revert: function() {
                        var selected = minder.getSelectedNodes();
                        var selection = [];
                        minder.getRoot().traverse(function(node) {
                            if (selected.indexOf(node) == -1) {
                                selection.push(node);
                            }
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    },
                    siblings: function() {
                        var selected = minder.getSelectedNodes();
                        var selection = [];
                        selected.forEach(function(node) {
                            if (!node.parent) return;
                            node.parent.children.forEach(function(sibling) {
                                if (selection.indexOf(sibling) == -1) selection.push(sibling);
                            });
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    },
                    level: function() {
                        var selectedLevel = minder.getSelectedNodes().map(function(node) {
                            return node.getLevel();
                        });
                        var selection = [];
                        minder.getRoot().traverse(function(node) {
                            if (selectedLevel.indexOf(node.getLevel()) != -1) {
                                selection.push(node);
                            }
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    },
                    path: function() {
                        var selected = minder.getSelectedNodes();
                        var selection = [];
                        selected.forEach(function(node) {
                            while(node && selection.indexOf(node) == -1) {
                                selection.push(node);
                                node = node.parent;
                            }
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    },
                    tree: function() {
                        var selected = minder.getSelectedNodes();
                        var selection = [];
                        selected.forEach(function(parent) {
                            parent.traverse(function(node) {
                                if (selection.indexOf(node) == -1) selection.push(node);
                            });
                        });
                        minder.select(selection, true);
                        minder.fire('receiverfocus');
                    }
                };
            }
        }
    });
angular.module('kityminderEditor')
	.directive('styleOperator', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/styleOperator/styleOperator.html',
			scope: {
				minder: '='
			},
            replace: true
		}
	});
angular.module('kityminderEditor')
	.directive('templateList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/templateList/templateList.html',
			scope: {
				minder: '='
			},
            replace: true,
			link: function($scope) {
				$scope.templateList = kityminder.Minder.getTemplateList();

			}
		}
	});
angular.module('kityminderEditor')
	.directive('themeList', function() {
		return {
			restrict: 'E',
			templateUrl: 'ui/directive/themeList/themeList.html',
            replace: true,
			link: function($scope) {
				var themeList = kityminder.Minder.getThemeList();

				//$scope.themeList = themeList;

				$scope.getThemeThumbStyle = function (theme) {
					var themeObj = themeList[theme];
                    if (!themeObj) {
                        return;
                    }
					var style = {
						'color': themeObj['root-color'],
						'border-radius': themeObj['root-radius'] / 2
					};

					if (themeObj['root-background']) {
						style['background'] = themeObj['root-background'].toString();
					}

					return style;
				};

				// 维护 theme key 列表以保证列表美观（不按字母顺序排序）
				$scope.themeKeyList = [
					'classic',
					'classic-compact',
					'fresh-blue',
					'fresh-blue-compat',
					'fresh-green',
					'fresh-green-compat',
					'fresh-pink',
					'fresh-pink-compat',
					'fresh-purple',
					'fresh-purple-compat',
					'fresh-red',
					'fresh-red-compat',
					'fresh-soil',
					'fresh-soil-compat',
					'snow',
					'snow-compact',
					'tianpan',
					'tianpan-compact',
					'fish',
					'wire'
				];
			}
		}
	});
angular.module('kityminderEditor')
    .directive('topTab', function() {
       return {
           restrict: 'A',
           templateUrl: 'ui/directive/topTab/topTab.html',
           scope: {
               minder: '=topTab',
               editor: '='
           },
           link: function(scope) {

               /*
               *
               * 用户选择一个新的选项卡会执行 setCurTab 和 foldTopTab 两个函数
               * 用户点击原来的选项卡会执行 foldTopTop 一个函数
               *
               * 也就是每次选择新的选项卡都会执行 setCurTab，初始化的时候也会执行 setCurTab 函数
               * 因此用 executedCurTab 记录是否已经执行了 setCurTab 函数
               * 用 isInit 记录是否是初始化的状态，在任意一个函数时候 isInit 设置为 false
               * 用 isOpen 记录是否打开了 topTab
               *
               * 因此用到了三个 mutex
               * */
               var executedCurTab = false;
               var isInit = true;
               var isOpen = true;

               scope.setCurTab = function(tabName) {
                   setTimeout(function() {
                       //console.log('set cur tab to : ' + tabName);
                       executedCurTab = true;
                       //isOpen = false;
                       if (tabName != 'idea') {
                           isInit = false;
                       }
                   });
                };

               scope.toggleTopTab = function() {
                   setTimeout(function() {
                       if(!executedCurTab || isInit) {
                           isInit = false;

                           isOpen ? closeTopTab(): openTopTab();
                           isOpen = !isOpen;
                       }

                       executedCurTab = false;
                   });
               };

               function closeTopTab() {
                   var $tabContent = $('.tab-content');
                   var $minderEditor = $('.minder-editor');

                   $tabContent.animate({
                       height: 0,
                       display: 'none'
                   });

                   $minderEditor.animate({
                      top: '32px'
                   });
               }

               function openTopTab() {
                   var $tabContent = $('.tab-content');
                   var $minderEditor = $('.minder-editor');

                   $tabContent.animate({
                       height: '60px',
                       display: 'block'
                   });

                   $minderEditor.animate({
                       top: '92px'
                   });
               }
           }
       }
    });
angular.module('kityminderEditor')
    .directive('undoRedo', function() {
        return {
            restrict: 'E',
            templateUrl: 'ui/directive/undoRedo/undoRedo.html',
            scope: {
                editor: '='
            },
            replace: true,
            link: function($scope) {

            }
        }
    });
use('expose-editor');
})();