import { bulgarianPhoneticLUT } from "./keymap";

var contextID = 0;

chrome.input.ime.onFocus.addListener(function (context) {
    contextID = context.contextID;
});

chrome.input.ime.onBlur.addListener(() => {
    contextID = 0;
});

chrome.input.ime.onKeyEvent.addListener((...args) => {
    const keyData = args[1];
    var handled = false;

    if (keyData.type == "keydown") {
        if (bulgarianPhoneticLUT[keyData.code]) {
            let shifted = keyData.capsLock != keyData.shiftKey;
            let emit = bulgarianPhoneticLUT[keyData.code][shifted ? 1 : 0];

            if (emit != null && contextID != 0) {
                chrome.input.ime.commitText(
                    {
                        contextID: contextID,
                        text: emit,
                    },
                    () => {
                        if (chrome.runtime.lastError) {
                            console.error(
                                "Error committing text:",
                                chrome.runtime.lastError
                            );
                            return;
                        }
                    }
                );
            }
            handled = true;
        }
    }
    return handled;
});
