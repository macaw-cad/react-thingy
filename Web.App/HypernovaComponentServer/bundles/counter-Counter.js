exports.ids = ["counter-Counter"];
exports.modules = {

/***/ "./src/counter/Counter.tsx":
/*!*********************************!*\
  !*** ./src/counter/Counter.tsx ***!
  \*********************************/
/*! exports provided: Counter, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Counter", function() { return Counter; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-redux */ "./node_modules/react-redux/es/index.js");
/* harmony import */ var _sample_later__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sample/later */ "./src/sample/later.ts");
/* harmony import */ var _ApplicationContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ApplicationContext */ "./src/ApplicationContext.tsx");
/* harmony import */ var _Environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Environment */ "./src/Environment.ts");
/* harmony import */ var _CounterActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CounterActions */ "./src/counter/CounterActions.ts");






const Counter = () => {
  const applicationContext = Object(react__WEBPACK_IMPORTED_MODULE_0__["useContext"])(_ApplicationContext__WEBPACK_IMPORTED_MODULE_3__["ApplicationContext"]).applicationContext;
  const dispatch = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["useDispatch"])();
  const value = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["useSelector"])(state => state.counter.value);
  const isHydrated = Object(react_redux__WEBPACK_IMPORTED_MODULE_1__["useSelector"])(state => state.page.isHydrated);

  const onIncrement = () => dispatch(Object(_CounterActions__WEBPACK_IMPORTED_MODULE_5__["increment"])(1));

  const onDecrement = () => dispatch(Object(_CounterActions__WEBPACK_IMPORTED_MODULE_5__["decrement"])(1)); // componentDidRenderServerSide() is registered in the constructor when the component is rendered at server-side.
  // Registered functions are invoked by Hypernova server-side rendering immediately after the render() of the
  // toplevel Hypernova component is finished and the whole component tree is ready.
  // If this function does async calls, register them using addTask from applicationContext so the final rendering of
  // the toplevel Hypernova component does execute after the async calls initiated from this function are completed.


  const componentDidRenderServerSide = () => {
    doIncrement();
  };

  const doIncrement = () => {
    const laterContext = Object(_sample_later__WEBPACK_IMPORTED_MODULE_2__["later"])(1000, onIncrement);
    applicationContext.addTask(laterContext.promise);
  };

  if (_Environment__WEBPACK_IMPORTED_MODULE_4__["Environment"].isServer) {
    applicationContext.addComponentDidRenderServerSideFunc(componentDidRenderServerSide);
  }

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(() => {
    if (!isHydrated) {
      doIncrement();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", null, "Clicked: ", value, " times", ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    onClick: onIncrement
  }, "+"), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
    onClick: onDecrement
  }, "-")));
};
/* harmony default export */ __webpack_exports__["default"] = (Counter);

/***/ })

};;
//# sourceMappingURL=counter-Counter.js.map