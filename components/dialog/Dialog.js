'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DomHandler = require('../utils/DomHandler');

var _DomHandler2 = _interopRequireDefault(_DomHandler);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _UniqueComponentId = require('../utils/UniqueComponentId');

var _UniqueComponentId2 = _interopRequireDefault(_UniqueComponentId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = exports.Dialog = function (_Component) {
    _inherits(Dialog, _Component);

    function Dialog(props) {
        _classCallCheck(this, Dialog);

        var _this = _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).call(this, props));

        _this.state = { visible: props.visible };
        _this.onClose = _this.onClose.bind(_this);
        _this.initDrag = _this.initDrag.bind(_this);
        _this.endDrag = _this.endDrag.bind(_this);
        _this.moveOnTop = _this.moveOnTop.bind(_this);
        _this.onCloseMouseDown = _this.onCloseMouseDown.bind(_this);
        _this.initResize = _this.initResize.bind(_this);
        return _this;
    }

    _createClass(Dialog, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.id = this.props.id || (0, _UniqueComponentId2.default)();
        }
    }, {
        key: 'positionOverlay',
        value: function positionOverlay() {
            var viewport = _DomHandler2.default.getViewport();
            if (_DomHandler2.default.getOuterHeight(this.container) > viewport.height) {
                this.content.style.height = viewport.height * .75 + 'px';
            }

            if (this.props.positionLeft >= 0 && this.props.positionTop >= 0) {
                this.container.style.left = this.props.positionLeft + 'px';
                this.container.style.top = this.props.positionTop + 'px';
            } else if (this.props.positionTop >= 0) {
                this.center();
                this.container.style.top = this.props.positionTop + 'px';
            } else {
                this.center();
            }
        }
    }, {
        key: 'onClose',
        value: function onClose(event) {
            this.hide();
            event.preventDefault();
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.setState({ visible: false });

            this.props.onHide();
            this.unbindMaskClickListener();
            this.unbindGlobalListeners();

            if (this.props.modal) {
                this.disableModality();
            }
        }
    }, {
        key: 'show',
        value: function show() {
            this.setState({ visible: true });
            this.container.style.zIndex = String(this.props.baseZIndex + _DomHandler2.default.generateZIndex());

            this.bindGlobalListeners();

            if (this.props.modal) {
                this.enableModality();
            }

            if (this.props.onShow) {
                this.props.onShow();
            }

            this.positionOverlay();
            _DomHandler2.default.fadeIn(this.container, 250);
        }
    }, {
        key: 'center',
        value: function center() {
            var elementWidth = _DomHandler2.default.getOuterWidth(this.container);
            var elementHeight = _DomHandler2.default.getOuterHeight(this.container);
            if (elementWidth === 0 && elementHeight === 0) {
                this.container.style.visibility = 'hidden';
                this.container.style.display = 'block';
                elementWidth = _DomHandler2.default.getOuterWidth(this.container);
                elementHeight = _DomHandler2.default.getOuterHeight(this.container);
                this.container.style.display = 'none';
                this.container.style.visibility = 'visible';
            }
            var viewport = _DomHandler2.default.getViewport();
            var x = (viewport.width - elementWidth) / 2;
            var y = (viewport.height - elementHeight) / 2;

            this.container.style.left = x + 'px';
            this.container.style.top = y + 'px';
        }
    }, {
        key: 'enableModality',
        value: function enableModality() {
            var _this2 = this;

            if (!this.mask) {
                this.mask = document.createElement('div');
                this.mask.style.zIndex = String(parseInt(this.container.style.zIndex, 10) - 1);
                _DomHandler2.default.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');

                if (this.props.closable && this.props.dismissableMask) {
                    this.maskClickListener = function (event) {
                        _this2.onClose(event);
                    };

                    this.mask.addEventListener('click', this.maskClickListener);
                }
                document.body.appendChild(this.mask);
                if (this.props.blockScroll) {
                    _DomHandler2.default.addClass(document.body, 'ui-overflow-hidden');
                }
            }
        }
    }, {
        key: 'disableModality',
        value: function disableModality() {
            if (this.mask) {
                document.body.removeChild(this.mask);
                if (this.props.blockScroll) {
                    _DomHandler2.default.removeClass(document.body, 'ui-overflow-hidden');
                }
                this.mask = null;
            }
        }
    }, {
        key: 'unbindMaskClickListener',
        value: function unbindMaskClickListener() {
            if (this.maskClickListener) {
                this.mask.removeEventListener('click', this.maskClickListener);
                this.maskClickListener = null;
            }
        }
    }, {
        key: 'moveOnTop',
        value: function moveOnTop() {
            var maskIndex = false;
            for (var prop in this.props.children) {
                if (this.props.children[prop] && this.props.children[prop].props !== undefined) {
                    var child = this.props.children[prop].props.appendTo;
                    if (child !== null || child !== undefined) {
                        maskIndex = true;
                    }
                }
            }
            if (!maskIndex) this.container.style.zIndex = String(_DomHandler2.default.generateZIndex());
        }
    }, {
        key: 'onCloseMouseDown',
        value: function onCloseMouseDown(event) {
            this.closeIconMouseDown = true;
        }
    }, {
        key: 'initDrag',
        value: function initDrag(event) {
            if (this.closeIconMouseDown) {
                this.closeIconMouseDown = false;
                return;
            }

            if (this.props.draggable) {
                this.dragging = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
                _DomHandler2.default.addClass(document.body, 'ui-unselectable-text');
            }
        }
    }, {
        key: 'onDrag',
        value: function onDrag(event) {
            if (this.dragging) {
                var deltaX = event.pageX - this.lastPageX;
                var deltaY = event.pageY - this.lastPageY;
                var leftPos = parseFloat(this.container.style.left) + deltaX;
                var topPos = parseFloat(this.container.style.top) + deltaY;

                if (leftPos >= this.props.minX) {
                    this.container.style.left = leftPos + 'px';
                }

                if (topPos >= this.props.minY) {
                    this.container.style.top = topPos + 'px';
                }

                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
            }
        }
    }, {
        key: 'endDrag',
        value: function endDrag(event) {
            if (this.props.draggable) {
                this.dragging = false;
                _DomHandler2.default.removeClass(document.body, 'ui-unselectable-text');
            }
        }
    }, {
        key: 'initResize',
        value: function initResize(event) {
            if (this.props.resizable) {
                this.preWidth = null;
                this.resizing = true;
                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
                _DomHandler2.default.addClass(document.body, 'ui-unselectable-text');
            }
        }
    }, {
        key: 'onResize',
        value: function onResize(event) {
            if (this.resizing) {
                var deltaX = event.pageX - this.lastPageX;
                var deltaY = event.pageY - this.lastPageY;
                var containerWidth = _DomHandler2.default.getOuterWidth(this.container);
                var containerHeight = _DomHandler2.default.getOuterHeight(this.container);
                var contentHeight = _DomHandler2.default.getOuterHeight(this.content);
                var newWidth = containerWidth + deltaX;
                var newHeight = containerHeight + deltaY;

                if (newWidth > this.props.minWidth) {
                    this.container.style.width = newWidth + 'px';
                }

                if (newHeight > this.props.minHeight) {
                    this.container.style.height = newHeight + 'px';
                    this.content.style.height = contentHeight + deltaY + 'px';
                }

                this.lastPageX = event.pageX;
                this.lastPageY = event.pageY;
            }
        }
    }, {
        key: 'bindGlobalListeners',
        value: function bindGlobalListeners() {
            if (this.props.draggable) {
                this.bindDocumentDragListener();
                this.bindDocumentDragEndListener();
            }

            if (this.props.resizable) {
                this.bindDocumentResizeListeners();
            }

            if (this.props.responsive) {
                this.bindDocumentResponsiveListener();
            }

            if (this.props.closeOnEscape && this.props.closable) {
                this.bindDocumentEscapeListener();
            }
        }
    }, {
        key: 'unbindGlobalListeners',
        value: function unbindGlobalListeners() {
            this.unbindDocumentDragListener();
            this.unbindDocumentDragEndListener();
            this.unbindDocumentResizeListeners();
            this.unbindDocumentResponsiveListener();
            this.unbindDocumentEscapeListener();
        }
    }, {
        key: 'bindDocumentDragListener',
        value: function bindDocumentDragListener() {
            var _this3 = this;

            this.documentDragListener = function (event) {
                _this3.onDrag(event);
            };
            document.addEventListener('mousemove', this.documentDragListener);
        }
    }, {
        key: 'unbindDocumentDragListener',
        value: function unbindDocumentDragListener() {
            if (this.documentDragListener) {
                document.removeEventListener('mousemove', this.documentDragListener);
                this.documentDragListener = null;
            }
        }
    }, {
        key: 'bindDocumentDragEndListener',
        value: function bindDocumentDragEndListener() {
            var _this4 = this;

            this.documentDragEndListener = function (event) {
                _this4.endDrag(event);
            };
            document.addEventListener('mouseup', this.documentDragEndListener);
        }
    }, {
        key: 'unbindDocumentDragEndListener',
        value: function unbindDocumentDragEndListener() {
            if (this.documentDragEndListener) {
                document.removeEventListener('mouseup', this.documentDragEndListener);
                this.documentDragEndListener = null;
            }
        }
    }, {
        key: 'bindDocumentResizeListeners',
        value: function bindDocumentResizeListeners() {
            var _this5 = this;

            this.documentResizeListener = function (event) {
                _this5.onResize(event);
            };

            this.documentResizeEndListener = function (event) {
                if (_this5.resizing) {
                    _this5.resizing = false;
                    _DomHandler2.default.removeClass(document.body, 'ui-unselectable-text');
                }
            };

            document.addEventListener('mousemove', this.documentResizeListener);
            document.addEventListener('mouseup', this.documentResizeEndListener);
        }
    }, {
        key: 'unbindDocumentResizeListeners',
        value: function unbindDocumentResizeListeners() {
            if (this.documentResizeListener && this.documentResizeEndListener) {
                document.removeEventListener('mousemove', this.documentResizeListener);
                document.removeEventListener('mouseup', this.documentResizeEndListener);
                this.documentResizeListener = null;
                this.documentResizeEndListener = null;
            }
        }
    }, {
        key: 'bindDocumentResponsiveListener',
        value: function bindDocumentResponsiveListener() {
            var _this6 = this;

            this.documentResponsiveListener = function (event) {
                var viewport = _DomHandler2.default.getViewport();
                var width = _DomHandler2.default.getOuterWidth(_this6.container);
                if (viewport.width <= _this6.props.breakpoint) {
                    if (!_this6.preWidth) {
                        _this6.preWidth = width;
                    }
                    _this6.container.style.left = '0px';
                    _this6.container.style.width = '100%';
                } else {
                    _this6.container.style.width = _this6.preWidth + 'px';
                    _this6.positionOverlay();
                }
            };

            window.addEventListener('resize', this.documentResponsiveListener);
        }
    }, {
        key: 'unbindDocumentResponsiveListener',
        value: function unbindDocumentResponsiveListener() {
            if (this.documentResponsiveListener) {
                window.removeEventListener('resize', this.documentResponsiveListener);
                this.documentResponsiveListener = null;
            }
        }
    }, {
        key: 'bindDocumentEscapeListener',
        value: function bindDocumentEscapeListener() {
            var _this7 = this;

            this.documentEscapeListener = function (event) {
                if (event.which === 27) {
                    if (parseInt(_this7.container.style.zIndex, 10) === _DomHandler2.default.getCurrentZIndex()) {
                        _this7.onClose(event);
                    }
                }
            };
            document.addEventListener('keydown', this.documentEscapeListener);
        }
    }, {
        key: 'unbindDocumentEscapeListener',
        value: function unbindDocumentEscapeListener() {
            if (this.documentEscapeListener) {
                document.removeEventListener('keydown', this.documentEscapeListener);
                this.documentEscapeListener = null;
            }
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.state.visible !== nextProps.visible) {
                if (nextProps.visible) this.show();else {
                    if (this.preventVisibleChangePropagation) this.preventVisibleChangePropagation = false;else this.hide();
                }
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.state.visible) {
                this.show();
                this.currentHeight = _DomHandler2.default.getOuterHeight(this.container);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.autoAlign && this.state.visible) {
                var height = _DomHandler2.default.getOuterHeight(this.container);
                if (height !== this.currentHeight) {
                    this.currentHeight = height;
                    this.positionOverlay();
                }
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.disableModality();
            this.unbindGlobalListeners();
            this.unbindMaskClickListener();
        }
    }, {
        key: 'renderCloseIcon',
        value: function renderCloseIcon() {
            if (this.props.closable) {
                return _react2.default.createElement(
                    'a',
                    { role: 'button', className: 'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all', onClick: this.onClose, onMouseDown: this.onCloseMouseDown },
                    _react2.default.createElement('span', { className: 'fa fa-fw fa-close' })
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderHeader',
        value: function renderHeader() {
            if (this.props.showHeader) {
                var closeIcon = this.renderCloseIcon();

                return _react2.default.createElement(
                    'div',
                    { className: 'ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top', onMouseDown: this.initDrag },
                    _react2.default.createElement(
                        'span',
                        { id: this.id + '_label', className: 'ui-dialog-title' },
                        this.props.header
                    ),
                    closeIcon
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderContent',
        value: function renderContent() {
            var _this8 = this;

            return _react2.default.createElement(
                'div',
                { ref: function ref(el) {
                        return _this8.content = el;
                    }, className: 'ui-dialog-content ui-widget-content', style: this.props.contentStyle },
                this.props.children
            );
        }
    }, {
        key: 'renderFooter',
        value: function renderFooter() {
            if (this.props.footer) {
                return _react2.default.createElement(
                    'div',
                    { className: 'ui-dialog-footer ui-widget-content' },
                    this.props.footer
                );
            } else {
                return null;
            }
        }
    }, {
        key: 'renderResizer',
        value: function renderResizer() {
            if (this.props.resizable) {
                return _react2.default.createElement('div', { className: 'ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se', style: { 'zIndex': '90' }, onMouseDown: this.initResize });
            } else {
                return null;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this9 = this;

            var className = (0, _classnames2.default)('ui-dialog ui-widget ui-widget-content ui-corner-all ui-shadow', this.props.className, {
                'ui-dialog-rtl': this.props.rtl,
                'ui-dialog-draggable': this.props.draggable
            });

            var style = Object.assign({
                display: this.state.visible ? 'block' : 'none',
                width: this.props.width,
                height: this.props.height,
                minWidth: this.props.minWidth
            }, this.props.style);

            var header = this.renderHeader();
            var content = this.renderContent();
            var footer = this.renderFooter();
            var resizer = this.renderResizer();

            var element = _react2.default.createElement(
                'div',
                { id: this.id, className: className, style: style, ref: function ref(el) {
                        _this9.container = el;
                    }, onMouseDown: this.moveOnTop, 'aria-labelledby': this.id + '_label', role: 'dialog' },
                header,
                content,
                footer,
                resizer
            );

            if (this.props.appendTo) {
                return _reactDom2.default.createPortal(element, this.props.appendTo);
            } else {
                return element;
            }
        }
    }]);

    return Dialog;
}(_react.Component);

Dialog.defaultProps = {
    id: null,
    header: null,
    footer: null,
    visible: false,
    width: 'auto',
    height: 'auto',
    modal: false,
    onHide: null,
    onShow: null,
    draggable: true,
    resizable: true,
    minWidth: 150,
    minHeight: 150,
    contentStyle: null,
    closeOnEscape: true,
    dismissableMask: false,
    rtl: false,
    closable: true,
    responsive: true,
    breakpoint: 640,
    style: null,
    className: null,
    showHeader: true,
    positionLeft: -1,
    positionTop: -1,
    appendTo: null,
    baseZIndex: 0,
    minX: 0,
    minY: 0,
    autoAlign: true
};
Dialog.propTypes = {
    id: _propTypes2.default.string,
    header: _propTypes2.default.any,
    footer: _propTypes2.default.any,
    visible: _propTypes2.default.bool,
    width: _propTypes2.default.string,
    height: _propTypes2.default.string,
    modal: _propTypes2.default.bool,
    onHide: _propTypes2.default.func.isRequired,
    onShow: _propTypes2.default.func,
    draggable: _propTypes2.default.bool,
    resizable: _propTypes2.default.bool,
    minWidth: _propTypes2.default.number,
    minHeight: _propTypes2.default.number,
    contentStyle: _propTypes2.default.object,
    closeOnEscape: _propTypes2.default.bool,
    dismissableMask: _propTypes2.default.bool,
    rtl: _propTypes2.default.bool,
    closable: _propTypes2.default.bool,
    responsive: _propTypes2.default.bool,
    breakpoint: _propTypes2.default.number,
    style: _propTypes2.default.object,
    className: _propTypes2.default.string,
    showHeader: _propTypes2.default.bool,
    positionLeft: _propTypes2.default.number,
    positionTop: _propTypes2.default.number,
    appendTo: _propTypes2.default.object,
    baseZIndex: _propTypes2.default.number,
    minX: _propTypes2.default.number,
    minY: _propTypes2.default.number,
    autoAlign: _propTypes2.default.bool
};