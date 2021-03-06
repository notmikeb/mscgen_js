/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgelementfactory", "./constants", "./csstemplates"], function(fact, C, csstemplates) {
    /**
     * sets up a skeleton svg, with the skeleton for rendering an msc ready
     *
     *  desc with id __msc_source - will contain the msc source
     *  defs
     *      a list of markers used as arrow heads (each with an own id)
     *      a stylesheet (without an id)
     *      __defs - placeholder to put the msc elements in
     *  __body - a stack of layers, from bottom to top:
     *      __background    -
     *      __arcspanlayer  - for inline expressions ("arc spanning arcs")
     *      __lifelinelayer - for the lifelines
     *      __sequencelayer - for arcs and associated text
     *      __notelayer     - for notes and boxes - the labels of arcspanning arcs
     *                        will go in here as well
     *      __watermark     - the watermark. Contra-intuitively this one
     *                        goes on top.
     * @exports renderskeleton
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */
    "use strict";

    var gDocument = {};

    function setupMarkers(pDefs, pMarkerDefs) {
        pMarkerDefs.forEach(function(pMarker){
            if (pMarker.type === "method"){
                pDefs.appendChild(fact.createMarkerPolygon(pMarker.name, pMarker.path, pMarker.color));
            } else {
                pDefs.appendChild(fact.createMarkerPath(pMarker.name, pMarker.path, pMarker.color));
            }
        });
        return pDefs;
    }

    function setupStyle(pOptions, pSvgElementId) {
        var lStyle = gDocument.createElement("style");
        lStyle.setAttribute("type", "text/css");
        lStyle.appendChild(
            gDocument.createTextNode(
                setupStyleElement(pOptions, pSvgElementId)
            )
        );
        return lStyle;
    }

    function setupDefs(pElementId, pMarkerDefs, pOptions) {
        /* definitions - which will include style, markers and an element
         * to put "dynamic" definitions in
         */
        var lDefs = fact.createDefs();
        lDefs.appendChild(setupStyle(pOptions, pElementId));
        lDefs = setupMarkers(lDefs, pMarkerDefs);
        lDefs.appendChild(fact.createGroup(pElementId + "__defs"));
        return lDefs;
    }

    function setupBody(pElementId) {
        var lBody = fact.createGroup(pElementId + "__body");

        lBody.appendChild(fact.createGroup(pElementId + "__background"));
        lBody.appendChild(fact.createGroup(pElementId + "__arcspanlayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__lifelinelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__sequencelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__notelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__watermark"));
        // lBody.appendChild(fact.createGroup(pElementId + "__onionskin", "onionskin"));
        return lBody;
    }

    function _init(pWindow) {
        fact.init(pWindow.document);
        return pWindow.document;
    }

    function _bootstrap(pWindow, pParentElementId, pSvgElementId, pMarkerDefs, pOptions) {

        gDocument = _init(pWindow);

        var lParent = gDocument.getElementById(pParentElementId);
        if (lParent === null) {
            lParent = gDocument.body;
        }
        var lSkeletonSvg = fact.createSVG(pSvgElementId, pSvgElementId);
        lSkeletonSvg.appendChild(setupDesc(pWindow, pSvgElementId, pOptions.source));
        lSkeletonSvg.appendChild(setupDefs(pSvgElementId, pMarkerDefs, pOptions));
        lSkeletonSvg.appendChild(setupBody(pSvgElementId));
        lParent.appendChild(lSkeletonSvg);

        return gDocument;
    }

    function setupDesc(pWindow, pSvgElementId, pSource) {
        var lDesc = fact.createDesc(pSvgElementId + "__msc_source");
        if (Boolean(pSource)){
            lDesc.appendChild(pWindow.document.createTextNode(
                "\n\n# Generated by mscgen_js - https://sverweij.github.io/mscgen_js\n" + pSource
            ));
        }
        return lDesc;
    }

    function distillAdditionalStyles(pOptions) {
        var lStyleString         = "";
        var lAdditionalTemplates = [];

        /* istanbul ignore if */
        if (!Boolean(pOptions)) {
            return "";
        }

        if (Boolean(pOptions.additionalTemplate)) {
            lAdditionalTemplates =
                csstemplates.additionalTemplates.filter(
                    function(tpl) {
                        return tpl.name === pOptions.additionalTemplate;
                    }
                );
            if (lAdditionalTemplates.length > 0) {
                lStyleString = lAdditionalTemplates[0].css;
            }
        }

        if (Boolean(pOptions.styleAdditions)) {
            lStyleString += pOptions.styleAdditions;
        }

        return lStyleString;
    }

    function setupStyleElement(pOptions, pSvgElementId) {
        return (csstemplates.baseTemplate + distillAdditionalStyles(pOptions))
            .replace(/<%=fontSize%>/g, C.FONT_SIZE)
            .replace(/<%=lineWidth%>/g, C.LINE_WIDTH)
            .replace(/<%=id%>/g, pSvgElementId);

    }
    return {
        /**
         * Sets up a skeleton svg document with id pSvgElementId in the dom element
         * with id pParentElementId, both in window pWindow. See the module
         * documentation for details on the structure of the skeleton.
         *
         * @param {string} pParentElementId
         * @param {string} pSvgElementId
         * @param {object} pMarkerDefs
         * @param {string} pStyleAdditions
         * @param {window} pWindow
         */
        bootstrap : _bootstrap,

        /**
         * Initializes the document to the document associated with the
         * given pWindow and returns it.
         *
         * @param {window} pWindow
         * @return {document}
         */
        init : _init

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
