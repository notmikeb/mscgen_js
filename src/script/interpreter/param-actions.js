/* eslint max-params: 0 */
define([
    "./uistate",
    "../utl/paramslikker",
    "../utl/store",
    "../utl/domutl",
    "../utl/gaga",
    "../utl/maps"
],
function(uistate, params, store, dq, gaga, map) {
    "use strict";

    function setupGA (pDoNotTrack){
        gaga.gaSetup(!pDoNotTrack);
        gaga.g('create', '{{trackingid}}', '{{host}}');
        gaga.g('send', 'pageview');
    }

    function processParams(){
        var lParams = params.getParams(window.location.search);
        setupGA(map.sanitizeBooleanesque(lParams.donottrack));

        uistate.setDebug(map.sanitizeBooleanesque(lParams.debug));
        if (lParams.hasOwnProperty("debug")) {
            gaga.g('send', 'event', 'debug', map.sanitizeBooleanesque(lParams.debug));
        }

        if (uistate.getDebug()) {
            store.load(uistate);
        } else {
            store.loadSettings(uistate);
        }

        if (lParams.hasOwnProperty("mirrorentities")) {
            uistate.setMirrorEntities(map.sanitizeBooleanesque(lParams.mirrorentities));
            gaga.g('send', 'event', 'params.mirrorentities', lParams.mirrorentities);
        }

        if (lParams.hasOwnProperty("style")) {
            uistate.setStyle(lParams.style);
            gaga.g('send', 'event', 'params.style', lParams.style);
        }

        if (lParams.lang){
            uistate.setLanguage(lParams.lang);
            gaga.g('send', 'event', 'params.lang', lParams.lang);
        }

        if (lParams.msc) {
            uistate.setSource(lParams.msc);
            gaga.g('send', 'event', 'params.msc');
        } else if (uistate.getSource().length <= 0) {
            uistate.setSample();
        }
    }

    function tagAllLinks(){
        dq.attachEventHandler("a[href]", "click", function(e){
            var lTarget = "unknown";

            if (e.currentTarget && e.currentTarget.href){
                lTarget = e.currentTarget.href;
            }

            gaga.g('send', 'event', 'link', lTarget);
        });
    }

    return {
        processParams: processParams,
        tagAllLinks: tagAllLinks
    };
});
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
