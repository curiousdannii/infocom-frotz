// Infocom Frotz library functions
// For replacing some functions

const FROTZ_JS = {
    // Handle high pixel densities by faking it...
    emscripten_get_element_css_size(target, width, height) {
        target = findEventTarget(target)
        if (!target) {
            return -4
        }
        if (typeof target.requestedheight === 'number') {
            HEAPF64[((width)>>3)] = target.requestedwidth
            HEAPF64[((height)>>3)] = target.requestedheight
        }
        else {
            var rect = getBoundingClientRect(target)
            HEAPF64[((width)>>3)] = rect.width
            HEAPF64[((height)>>3)] = rect.height
        }
        return 0
    },

    emscripten_set_canvas_element_size(target, width, height){
        var canvas = findCanvasEventTarget(target)
        if (!canvas) {
            return -4
        }
        canvas.width = width
        canvas.height = height
        const screen_width = screen.width
        if (width > screen_width) {
            canvas.dpi_scale = width / screen_width
            canvas.requestedwidth = width
            canvas.requestedheight = height
            canvas.style.width = `${screen_width}px`
            canvas.style.height = `${screen_width * (height / width)}px`
        }
        else {
            canvas.requestedwidth = null
            canvas.requestedheight = null
            canvas.style.width = ''
            canvas.style.height = ''
        }
        return 0
    },

    $registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
        if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1552);
        target = findEventTarget(target);

        var touchEventHandlerFunc = (e) => {
            assert(e);
            var t, touches = {}, et = e.touches;
            // To ease marshalling different kinds of touches that browser reports (all touches are listed in e.touches,
            // only changed touches in e.changedTouches, and touches on target at a.targetTouches), mark a boolean in
            // each Touch object so that we can later loop only once over all touches we see to marshall over to Wasm.

            for (let t of et) {
                // Browser might recycle the generated Touch objects between each frame (Firefox on Android), so reset any
                // changed/target states we may have set from previous frame.
                t.isChanged = t.onTarget = 0;
                touches[t.identifier] = t;
            }
            // Mark which touches are part of the changedTouches list.
            for (let t of e.changedTouches) {
                t.isChanged = 1;
                touches[t.identifier] = t;
            }
            // Mark which touches are part of the targetTouches list.
            for (let t of e.targetTouches) {
                touches[t.identifier].onTarget = 1;
            }

            var touchEvent = JSEvents.touchEvent;
            HEAPF64[((touchEvent)>>3)] = e.timeStamp;
            HEAP8[touchEvent + 12] = e.ctrlKey;
            HEAP8[touchEvent + 13] = e.shiftKey;
            HEAP8[touchEvent + 14] = e.altKey;
            HEAP8[touchEvent + 15] = e.metaKey;
            var idx = touchEvent + 16;
            var targetRect = getBoundingClientRect(target);
            var numTouches = 0;
            for (let t of Object.values(touches)) {
                var idx32 = ((idx)>>2); // Pre-shift the ptr to index to HEAP32 to save code size
                HEAP32[idx32 + 0] = t.identifier;
                HEAP32[idx32 + 1] = t.screenX;
                HEAP32[idx32 + 2] = t.screenY;
                HEAP32[idx32 + 3] = t.clientX;
                HEAP32[idx32 + 4] = t.clientY;
                HEAP32[idx32 + 5] = t.pageX;
                HEAP32[idx32 + 6] = t.pageY;
                HEAP8[idx + 28] = t.isChanged;
                HEAP8[idx + 29] = t.onTarget;
                let x = t.clientX - (targetRect.left | 0)
                let y = t.clientY - (targetRect.top  | 0)
                if (typeof target.requestedwidth === 'number') {
                    x = x * target.dpi_scale
                    y = y * target.dpi_scale
                }
                HEAP32[idx32 + 8] = x;
                HEAP32[idx32 + 9] = y;

                idx += 48;

                if (++numTouches > 31) {
                break;
                }
            }
            HEAP32[(((touchEvent)+(8))>>2)] = numTouches;

            if (((a1, a2, a3) => dynCall_iiii(callbackfunc, a1, a2, a3))(eventTypeId, touchEvent, userData)) e.preventDefault();
        };

        var eventHandler = {
            target,
            allowsDeferredCalls: eventTypeString == 'touchstart' || eventTypeString == 'touchend',
            eventTypeString,
            callbackfunc,
            handlerFunc: touchEventHandlerFunc,
            useCapture,
        };
        return JSEvents.registerOrRemoveHandler(eventHandler);
    },

    // emscripten_set_main_loop_timing just errors because it's called at the wrong time
    emscripten_set_main_loop_timing() {},

    // We've already set the title
    emscripten_set_window_title() {},
}

addToLibrary(FROTZ_JS)