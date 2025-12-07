/*
 K Win script to switch the screen of all windows                                                                    *

 SPDX-FileCopyrightText: 2021 José Millán Soto <jmillan@kde-espana.org>

 SPDX-License-Identifier: GPL-2.0-or-later
 */

// QRect::contains seems not to work in JS
function contains(area, x, y) {
    return ((area.y <= y) && (area.y + area.height >= y) && (area.x <= x) && (area.x + area.width >= x));
}

function detectScreen(client, screenAreas) {
    /* Returns the screen in which a client is placed, it will consider that the window
     *       is located in an screen where the top left corner of the window is located. Should
     *       the top left corner not be located on any string, it will try to locate if the
     *       bottom right corner is located in a screen.
     *       If no screen can be detected, null will be returned. */
    var clientPosition = client.clientGeometry;

    var x = (clientPosition.right - clientPosition.left) / 2 + clientPosition.left
    var y = (clientPosition.bottom - clientPosition.top) / 2 + clientPosition.top

    for (var i = 0; i < screenAreas.length; i++) {
        if (contains(screenAreas[i], x, y)) {
            return i;
        }
    }

    return null;
}


function switchAllWindowsScreen() {
    try {
        console.debug("Hello world");
        var allWindows = workspace.stackingOrder;
        var screenAreas = [];

        for (var j = 0; j < workspace.screens.length; j++) {
            screenAreas.push(workspace.clientArea(KWin.ScreenArea, workspace.screens[j], workspace.currentDesktop));
        }

        for (var i = 0; i < allWindows.length; i++) {
            var client = allWindows[i];
            console.debug("A");
            if (client.moveableAcrossScreens) {
                var screen = detectScreen(client, screenAreas);
                if (screen != null) {
                    screen++;
                    if (screen >= workspace.screens.length) {
                        screen = 0;
                    }
                    workspace.sendClientToScreen(client, workspace.screens[screen]);
                }
            }
        }
    }catch(error){
        console.error("Error in switchAllWindowsScreen: " + error);
        if (error.stack) {
            console.error("Stack trace: " + error.stack);
        }
    }
}

registerShortcut("switchAllWindowsScreen", "Switch the screen to all windows", "Meta+Shift+P", switchAllWindowsScreen);
