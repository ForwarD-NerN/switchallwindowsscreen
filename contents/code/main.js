/*
    KWin script to switch the screen of all windows

    SPDX-FileCopyrightText: 2021 José Millán Soto <jmillan@kde-espana.org>

    SPDX-License-Identifier: GPL-2.0-or-later
 */

// QRect::contains seems not to work in JS
function contains(area, x, y) {
    return ((area.top <= y) && (area.bottom >= y) && (area.left <= x) && (area.right >= x));
}

function detectScreen(client, screenAreas) {
    /* Returns the screen in which a client is placed, it will consider that the window
       is located in an screen where the top left corner of the window is located. Should
       the top left corner not be located on any string, it will try to locate if the
       bottom right corner is located in a screen.
       If no screen can be detected, null will be returned. */
    var clientPosition = client.geometry;

    for (var i = 0; i < screenAreas.length; i++) {      
        if (contains(screenAreas[i], clientPosition.left, clientPosition.top)) {
            return i;
        }
    }
    for (var i = 0; i < screenAreas.length; i++) {      
        if (contains(screenAreas[i], clientPosition.right, clientPosition.bottom)) {
            return i;
        }
    }

    return null;
}

function switchAllWindowsScreen() {
    var allWindows = workspace.clientList();
    var screenAreas = [];

    for (var j = 0; j < workspace.numScreens; j++) {
        screenAreas.push(workspace.clientArea(KWin.ScreenArea, j, 0));
    }

    for (var i = 0; i < allWindows.length; i++) {
        var client = allWindows[i];
        if (client.moveableAcrossScreens) {
            var screen = detectScreen(client, screenAreas);
            if (screen != null) {
                screen++;
                if (screen >= workspace.numScreens) {
                    screen = 0;
                }
                workspace.sendClientToScreen(client, screen);
            }
        }
    }
}


registerShortcut("switchAllWindowsScreen", "Switch the screen to all windows", "Meta+Shift+P", switchAllWindowsScreen);
