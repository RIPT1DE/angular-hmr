// Hot Module Replacement
function identity(val) {
    return val;
}
export function bootloader(main, before, after) {
    if (typeof main === 'object') {
        var _main = main.main;
        before = main.before;
        after = main.after;
        main = _main;
    }
    before = before || identity;
    after = after || identity;
    var readyState = document.readyState;
    function __domReadyHandler() {
        document.removeEventListener('DOMContentLoaded', __domReadyHandler);
        after(main(before(readyState)));
    }
    switch (readyState) {
        case 'loading':
            document.addEventListener('DOMContentLoaded', __domReadyHandler);
            break;
        case 'interactive':
        case 'complete':
        default:
            after(main(before(readyState)));
    }
}
// create new host elements and remove the old elements
export function createNewHosts(cmps) {
    var components = Array.prototype.map.call(cmps, function (componentNode) {
        var newNode = document.createElement(componentNode.tagName);
        var parentNode = componentNode.parentNode;
        var currentDisplay = newNode.style.display;
        newNode.style.display = 'none';
        parentNode.insertBefore(newNode, componentNode);
        function removeOldHost() {
            newNode.style.display = currentDisplay;
            try {
                parentNode.removeChild(componentNode);
            }
            catch (e) { }
        }
        return removeOldHost;
    });
    return function removeOldHosts() {
        components.forEach(function (removeOldHost) { return removeOldHost(); });
    };
}
// remove old styles
export function removeNgStyles() {
    var docHead = document.head;
    var _styles = docHead.querySelectorAll('style');
    var styles = Array.prototype.slice.call(_styles);
    styles
        .filter(function (style) { return style.innerText.indexOf('_ng') !== -1; })
        .map(function (el) { return docHead.removeChild(el); });
}
// get input values
export function getInputValues() {
    var _inputs = document.querySelectorAll('input');
    var inputs = Array.prototype.slice.call(_inputs);
    return inputs.map(function (input) { return input.value; });
}
// set input values
export function setInputValues(_inputs) {
    var inputs = document.querySelectorAll('input');
    if (_inputs && inputs.length === _inputs.length) {
        _inputs.forEach(function (value, i) {
            var el = inputs[i];
            el.value = value;
            el.dispatchEvent(new CustomEvent('input', { detail: el.value }));
        });
        // clear array
        _inputs.length = 0;
    }
}
// get/set input values
export function createInputTransfer() {
    var _inputs = getInputValues();
    return function restoreInputValues() {
        return setInputValues(_inputs);
    };
}
//# sourceMappingURL=helpers.js.map