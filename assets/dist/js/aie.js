// Data back Explorer

// prepare docs
// const DA_doc = "./assets/dist/js/DA_collection.json";
// const DP_doc = "./assets/dist/js/DP_collection.json";
// const CARD_DOC = "./assets/dist/js/AIE_card_collection.json";

const CARD_DOC = "./assets/dist/JSON/card_collection.json";
const NI_DOC = "./assets/dist/JSON/NI_collection.json";
const OT_DOC = "./assets/dist/JSON/OT_collection.json";


$(document).ready(function() {

    loadData(NI_DOC, OT_DOC, CARD_DOC);
    setupInteraction();
});

// load two json documents and update the panel
function loadData(NI_doc, OT_doc, card_doc) {
    let classStr = panelLayout();

    // create NS navigator
    createNI(NI_doc, classStr);
    
    // create EL filter button group
    createOT(OT_doc, classStr);    
    
    // load card data
    createDisplay(card_doc);
}

// activate all the interactive components
function setupInteraction() {
    console.log("Now binding interactions");
    let classStr = panelLayout();
    let card_display = document.getElementById("card-display");
    card_display.style.height = `${window.innerHeight - card_display.offsetTop - 1}px`;
    let nav = NI_Nav.NavQueue.init(".btn-primary-group", {
        deltaY: 0.5*parseInt(document.querySelector("#card-display").getBoundingClientRect()["height"]),
        target: "#card-display"
    });

    // activate responsive responsive header + filter panel layout
    $(window).resize(function() {
        classStr = panelLayout();
        card_display.style.height = `${window.innerHeight - card_display.offsetTop - 1}px`;
        nav.dispose();

        if(classStr.length < 5){
            $("div.btn-primary-group").removeClass("btn-primary-group list-group").addClass("btn-primary-group-sm");
            $("div.btn-secondary-group").removeClass("btn-secondary-group").addClass("btn-secondary-group-sm");
            $("div.btn-secondary-group-sm > .btn").removeClass("btn-block text-left").addClass("text-center");

        } else {
            $("div.btn-primary-group-sm").removeClass("btn-primary-group-sm").addClass("btn-primary-group" + classStr);
            $("div.btn-secondary-group-sm").removeClass("btn-secondary-group-sm").addClass("btn-secondary-group" + classStr.replace(" list-group", ""));
            $("div.btn-secondary-group > .btn").removeClass("text-center").addClass("btn-block text-left");
        }

        nav = NI_Nav.NavQueue.init(".btn-primary-group", {
            deltaY: 0.5*parseInt(document.querySelector("#card-display").getBoundingClientRect()["height"]),
            target: "#card-display"
        });
    });

    $("header .title-bold").click(function () {
        if($(window).outerWidth() < 768) {
            $("#filter-panel").slideToggle(180);
        }

        if($(window).outerWidth() < 576) {
            $(".img-overlay").off("hover", "**" );
            $(".img-overlay").tooltip("disable");
        }
    });

    // activate search box
    $("input.form-control").focus( function() {
        $(".search-result").text("");
        if($(this).val().trim() == "Search")
            $(this).val("");
    });
    $("input.form-control").blur( function() { 
        if($(this).val().trim() == "")
            $(this).val("Search");
    });

    $(".nav-button").click(() => { searchFunc(nav); });
    $(".form-control").bind('keydown', function(eve){  
    　　var keyCode = eve.which || arguments.callee.caller.arguments[0];  
    　　if (keyCode == 13) { searchFunc(nav); $(".form-control").blur();}   //ignore space button
    });

    document.querySelectorAll(".btn-secondary-group button, .btn-secondary-group-sm button").forEach(node => {
        node.addEventListener("click", () => {
            nav.refresh();
            nav.scrollSpy();
        });
    });

    // hover full-screen button on card image
    $(".card-img-box").hover(fullScreenOver, fullScreenOut);
    $(".img-overlay").tooltip({title: "zoom in", placement: "top"});

    window.onbeforeunload = function() {
        let storage = window.sessionStorage;
        storage.clear();
    }

    // End **
}

// create NS components & display NS frame
function createNI(NI_doc, classStr) {
    // calc panel's position $ screen width measuring
    classStr = "btn-primary-group" + classStr;

    // create NS part
    let NI_Group = $("<div></div>").addClass(classStr).attr("id", "display-scroll");
    $("#filter-panel > .btn-panel").first().append(NI_Group);

    $.ajaxSettings.async = false;
    $.getJSON(NI_doc, function (json) {
        $.each(json, function (i, item){

            let NI_single = new NI_Nav(item);
            let NI_nav_btn = NI_single.drawNINav(); // create spy btn
            let NI_top = NI_single.drawNITop(); // create display part
            let NI_joint_tag = NI_single.getJointTag();
            let currentDisplayPart = $("<div></div>").attr("id", NI_joint_tag); // create spy panel
            
            NI_Group.append(NI_nav_btn);
            
            currentDisplayPart
            .append(NI_top)
            .append($("<div></div>").addClass("row row-cols-1 row-cols-sm-2 row-cols-lg-3").addClass("card-deck")); // create card deck  

            currentDisplayPart.appendTo("#card-display");
            NI_single.NICreatingComplete();
        });
    });
}

// construct DA_Nav class
// "DA_id": 100,
// "DA_num": 10,
// "DA_nav_tag": "biology",
// "DA_nav_color": "#8180DF",
// "DA_desc": "",
// "DA_class_object": [
//     {
//         "DA_class_id": "101",
//         "DA_class_tag": "whole body movement",
//         "DA_class_color": "#EB63BD"
//     }, ......
function NI_Nav(NI_object) {

    // color method
    this._color_hash = NI_Nav.ColorHash.init();
    this._created = 0; // nothing created: 0; both created: 1
    
    this._NI_id = NI_object["id"] || 200;
    this._NI_tag = NI_object["NI_tag"] || "navigator";
    this._NI_num = NI_object["total_num"] || 0;
    this._NI_desc = NI_object["NI_desc"] || "Interpretation for Narrative Intents. Interpretation for Narrative Intents. Interpretation for Narrative Intents. Interpretation for Narrative Intents. Interpretation for Narrative Intents.";
    // this._DA_sub_arr = NI_object["DA_class_object"] || [{"DA_class_id": "501", "DA_class_tag": "navigator sub class example", "DA_class_color": "#EBEDF6"}];
    
    this._NI_joint_tag = $.trim(this._NI_tag).split(" ").join("-");

    this._NI_color = [NI_object["main_color"], NI_object["grad_color"]] || ["#EBEDF6", "#FFFFFF"];
    this._color_hash.set_color(this._NI_id, this._NI_color);
}

// public color hash data sharing
NI_Nav.ColorHash = {
    
    _data: { 200: ["#EBEDF6", "#FFFFFF"] },

    init: function(){
        let color = {};

        color.set_color = function(key_id, color_arr) {
            key_id = key_id || 200;
            color_arr = color_arr || ["",""];
            
            if(color_arr[0]) {
                NI_Nav.ColorHash._data[key_id] = color_arr;
                return true;
            }
    
            return false;
        };

        color.get_color = function(key_id) {
            key_id = key_id || 200;
            if(NI_Nav.ColorHash._data.hasOwnProperty(key_id)) 
                return NI_Nav.ColorHash._data[key_id];
            else
                return undefined;
        };

        return color;
    }
}

NI_Nav.NavQueue = {

    // _btn_list: [],
    _content_list: [],

    // Example
    // let nav = NI_Nav.NavQueue.init(".btn-primary-group", {
    //     deltaY: 0.5*parseInt(document.querySelector("#card-display").getBoundingClientRect()["height"]),
    //     target: "#card-display"
    // });
    init: function(element, option = {}) {
        let nav = {};

        nav.element = element || ".list-group"; // nav btn ul

        nav._deltaY = parseInt(option["deltaY"]) || 0;
        nav._target = option["target"] || "body";
        nav._callback = option["callback"] || function() {return ;};

        nav._targetNode = document.querySelector(nav._target);

        nav.append = function(NI_object) {
            NI_object = NI_object instanceof NI_Nav ? NI_object : undefined;
            if(NI_object === undefined) return false;
            
            NI_Nav.NavQueue._object_list.push(NI_object);
        };

        nav.dispose = function() {
            nav._targetNode.removeEventListener("scroll", (e) => nav.scrollSpy(e));
            NI_Nav.NavQueue._content_list.length = 0;
            // nav.element = null;
            nav._deltaY = null;
            nav._target = null;
            nav._callback = null;
        };

        // listen to the scroll bar and page Y change
        nav.scrollSpy = function() {
            let activeId = "";
            let activeNode;
            let prev_passed = false;
            // console.log("Content List :", NI_Nav.NavQueue._content_list);
            NI_Nav.NavQueue._content_list.forEach((partNode, index, content_list) => {
                let Id = partNode.getAttribute("id");
                let btnNode = document.querySelector(`${nav.element} > .${Id}`);

                // console.log(`begin, ${Id} `, nav._targetNode.scrollTop >= partNode.offsetTop - nav._deltaY);
                if(nav._targetNode.scrollTop >= partNode.offsetTop - nav._deltaY) {
                    // the last one
                    if(btnNode && index === content_list.length-1) {
                        prev_passed = false;
                        activeNode = btnNode;
                        return ;
                    }

                    // already passed
                    prev_passed = true;
                    activeNode = btnNode;
                    // console.log("AAA", Id + " " + activeNode);
                } else if(prev_passed) {
                    prev_passed = false;
                    // console.log("BBB", Id + " " + activeNode);
                    return ;
                }
            });

            if(activeNode) {
                activeId = activeNode.getAttribute("id");
    
                document.querySelectorAll(`${element} > a:not(.disabled):not(.${activeId})`).forEach(node => nav._inactivateBtn(node));
                nav._activateBtn(activeNode);
            }
        }

        // active nav btn (node type)
        nav._activateBtn = function(NI_Nav_node) {
            if(NI_Nav_node.classList.contains("active"))
                return false;

            NI_Nav_node.classList.add("active");
            return true;
        }

        // inactivate nav btn (node type)
        nav._inactivateBtn = function(NI_Nav_node) {
            if(!NI_Nav_node.classList.contains("active"))
                return false;

            NI_Nav_node.classList.remove("active");
            return true;
        }

        // choose visible & useful contents
        nav.refresh = function() {
            NI_Nav.NavQueue._content_list = [...document.querySelectorAll(`${nav._target} > div:not(.hidden):not(.search-fail)`)];
        }

        nav.setDeltaY = function(value) {
            nav._deltaY = parseInt(value);
        }

        nav._targetNode.addEventListener("scroll", () => nav.scrollSpy());

        nav.refresh();
        nav.scrollSpy();

        return nav;
    }
} 

NI_Nav.prototype.getJointTag = function() {
    return this._NI_joint_tag;
}

NI_Nav.prototype.drawNINav= function() {
    let classString = "btn btn-block text-left";

    let NI_nav_btn = $("<a></a>").addClass([classString, this._NI_joint_tag].join(" "))
                    .text(this._NI_tag.replace(this._NI_tag[0], this._NI_tag[0].toUpperCase()) + ` (${this._NI_num})`)
                    .attr({type: "button", href: "#" + this._NI_joint_tag})
                    .prepend($("<span></span>").addClass("btn-id").css("background-color", this._NI_color[0]))
                    .append($("<span></span>").addClass("btn-sign").css("background", this._NI_color[0]));

    return NI_nav_btn;
}

NI_Nav.prototype.drawNITop = function() {
    let thisNI_Nav = this;

    // display title
    let NI_display_tag = thisNI_Nav._NI_tag ? thisNI_Nav._NI_tag : "Narrative Intents Tag";
    let display_title = $("<h2></h2>").addClass("display-title")
                        .text(NI_display_tag + " (" + thisNI_Nav._NI_num + ")")
                        .prepend($("<span></span>").css("background-color", thisNI_Nav._NI_color[0]));
    
    // integrated display top
    let display_top = $("<div></div>").addClass("deck-reminder")
                        .css({
                            "top": 0,
                            // "top": document.querySelector("#card-display").getBoundingClientRect().top,
                            // "background-color": "white",
                            // "z-index": 500
                        })
                        .append(display_title)
                        .append($("<p></p>").addClass("display-desc").text(thisNI_Nav._NI_desc))

    return display_top;
}

NI_Nav.prototype.NICreatingComplete = function() {
    // ......
    if(this._created <= 0) {
        this._created = new Date().getTime();
        this._interactionInit();
        return true;
    } else {
        console.warn(`DA tab & sticky top for "${this._NI_tag}" have already been created before.`);
        return false;
    }
}

NI_Nav.prototype._interactionInit = function () {
    if(this._created) {
        this._NI_btn = document.querySelector(`.btn-primary-group > .${this.getJointTag()}`);
        this._sticky_top = document.querySelector(`#${this._NI_joint_tag} > .deck-reminder`);
        this._display_deck = document.querySelector(`#${this._NI_joint_tag} > .card-deck`);

        // turn in/out of navigation list
        this._in_sticky = false;

        // record the previous DA_Nav object node
        this._prev_DA_Nav = undefined;
        
        // bind event listeners
        this._topEventBinding();
        this._scrollEventBinding();
    }
}

NI_Nav.prototype._recordPrevDA_Nav = function(DA_Nav_object) {

    if(!this.hasOwnProperty("_prev_DA_Nav")) {
        console.log("Either sticky top or DA button has been deployed yet.");
        return false;
    }

    DA_Nav_object = DA_Nav_object instanceof NI_Nav ? DA_Nav_object : undefined;

    this._prev_DA_Nav = DA_Nav_object;
    return true;
}

NI_Nav.prototype._getPrevDA_Nav = function() {
    if(!this.hasOwnProperty("_prev_DA_Nav")) {
        console.log("Either sticky top or DA button has been deployed yet.");
        return undefined;
    }

    return this._prev_DA_Nav;
}

NI_Nav.prototype._getStickyTop = function() {
    if(!this.hasOwnProperty("_sticky_top")) {
        console.log("The sticky top has not been deployed yet.");
        return undefined;
    }

    return this._sticky_top;
}

NI_Nav.prototype._getDisplayDeck = function() {
    if(!this.hasOwnProperty("_display_deck")) {
        console.log("The display has not been deployed yet.");
        return undefined;
    }

    return this._display_deck;
}

NI_Nav.prototype._getDisplayDesc = function() {
    if(!this.hasOwnProperty("_display_desc")) {
        console.log("The sticky top has not been deployed yet.");
        return undefined;
    }

    return this._display_desc;
}

NI_Nav.prototype._stickyToggle = function(option, callback) {
    option = option || undefined;
    callback = callback || undefined;
    
    if(!this.hasOwnProperty("_in_sticky")) {
        console.log("Either sticky top or DA button has been deployed yet.");
        return false;
    } else if(option === true) {
        this._in_sticky = true;
    } else if(option === false) {
        this._in_sticky = false;
    } else {
        this._in_sticky = !this._in_sticky;
    }

    if(callback !== undefined)
        callback();
    
    return true;
}

NI_Nav.prototype._inSticky = function() {
    return this._in_sticky;
}

// listen to sticky top
NI_Nav.prototype._topEventBinding = function () {

    let thisDA_Nav = this;
    let container = document.getElementById("card-display");
    let sticky_top = thisDA_Nav._getStickyTop();
    let display_deck = thisDA_Nav._getDisplayDeck();
    
    let stickySpy = function() {
        let deltaY = parseInt(0.67 * container.clientHeight);

        if(parseInt(sticky_top.getBoundingClientRect()["top"]) > parseInt(container.getBoundingClientRect()["top"])) {
            // if sticky top has a changing top value in container view && higher than top Y -> not in sticky, normally shown (1)
            
            // not in sticky
            if(thisDA_Nav._inSticky())
                thisDA_Nav._stickyToggle(false);
                
            // shown
            if(parseFloat(getComputedStyle(sticky_top, null)["opacity"]) === 0)
                sticky_top.style.opacity = "1";

            // normally
            if(sticky_top.classList.contains("active-sticky")){
                sticky_top.classList.remove("active-sticky");
            }
                
        } else if(parseInt(sticky_top.getBoundingClientRect()["top"]) === parseInt(container.getBoundingClientRect()["top"])) {
            
            // if sticky top surpasses deltaY in container view but still has a solid top value -> in sticky, decorated hidden (2.1)
            
            if(parseInt(display_deck.getBoundingClientRect()["top"]) >= parseInt(sticky_top.getBoundingClientRect()["bottom"]) - 1) {
                
                if(thisDA_Nav._inSticky()) 
                thisDA_Nav._stickyToggle(false);
                
                if(sticky_top.classList.contains("active-sticky"))
                sticky_top.classList.remove("active-sticky");
                
                return;
            }
            
            // in sticky
            if(!thisDA_Nav._inSticky()) 
            thisDA_Nav._stickyToggle(true);
            
            // hidden
             if(parseInt(display_deck.getBoundingClientRect()["bottom"]) - parseInt(container.getBoundingClientRect()["top"]) <= deltaY) {
                if(parseInt(getComputedStyle(sticky_top, null)["opacity"]) === 1)
                    $(sticky_top).fadeTo(240, 0);
                return ;
            }

            // decorated
            if(!sticky_top.classList.contains("active-sticky"))
                sticky_top.classList.add("active-sticky");
                
            // if sticky top has a solid top value -> in sticky, decorated shown (2)
            // shown
            if(parseFloat(getComputedStyle(sticky_top, null)["opacity"]) === 0){
                $(sticky_top).fadeTo(240, 1);
            }

        } else {
            // this sticky top has already been replaced by the next one -> not in sticky, decorated hidden (3)

            // not in sticky
            if(thisDA_Nav._inSticky())
                thisDA_Nav._stickyToggle(false);

            // decorated
            if(!sticky_top.classList.contains("active-sticky"))
                sticky_top.classList.add("active-sticky");


            if(sticky_top.style.opacity && parseInt(sticky_top.style.opacity) > 0)
                sticky_top.style.opacity = 0;
        }
    }

    container.addEventListener("scroll", stickySpy);
    // document.querySelectorAll(".btn-secondary-group > button, .btn-secondary-group li").forEach(btn => btn.addEventListener("click", stickySpy));
    stickySpy();
}

// listen to click action
NI_Nav.prototype._scrollEventBinding = function () {

    let thisDA_Nav = this;
    let targetId = thisDA_Nav.getJointTag();
    let targetElem = document.getElementById(targetId);
    // let thisBtn = thisDA_Nav._DA_btn;
    
    thisDA_Nav._NI_btn.addEventListener("click", () => {
        let targetTop = targetElem.offsetTop;
        $('#card-display').animate({scrollTop: targetTop}, 800, "easeInOutQuart");

        // if(!thisBtn.classList.contains("active")){
        //     document.querySelectorAll(".btn-primary-group > .active").forEach(node => node.classList.remove("active"));
        //     thisBtn.classList.add("active");
        // }
    });
}

NI_Nav.OT_fitting = function() {
    if($("#card-display > div:visible").length === 0) {
        $(".btn-primary-group > .btn.active").removeClass("active");
        $(".btn-primary-group-sm > .btn.active").removeClass("active");
        $(".search-fail").fadeIn("normal");
    } else {
        $(".search-fail").css("display", "none");
    }
}

// construct a sticky top class
function StickyTop(NI_object) {
    
    this._DA_Nav_arr = NI_object instanceof NI_Nav ? [NI_object, undefined] : [undefined, undefined];
    
    let sticky_top_object = this;
    let createStickyTop = function(DA_Nav_object) {
        let new_sticky_top = document.createElement("div");
        sticky_top_object.showDisplay(DA_Nav_object, new_sticky_top);
        return new_sticky_top;
    };

    let sticky_top = NI_object instanceof NI_Nav ? createStickyTop(sticky_top_object._DA_Nav_arr[0]._getStickyTop()) : document.createElement("div");
    sticky_top.classList.add("deck-reminder");
    this._sticky_top = sticky_top;
    this._shown = 0;
}

StickyTop.prototype.getStickyTop = function () {
    return this._sticky_top;
}

StickyTop.prototype.appendToDisplay = function(container, top) {
    container = container || document.getElementById("card-display");
    top = top || container.getBoundingClientRect()["y"] + container.ownerDocument.defaultView.pageYOffset;

    let width = container.getBoundingClientRect()["width"];
    this._sticky_top.style.cssText = ` position: fixed; width: ${width}px; z-index: 50; opacity: ${this._shown};`;

    // append to container
    container.appendChild(this._sticky_top);
    this._eventBinding(container);
}

StickyTop.prototype.showDisplay = function(DA_Nav_object, sticky_top_container) {

    DA_Nav_object = DA_Nav_object || undefined;
    sticky_top_container = sticky_top_container || this._sticky_top;
    sticky_top_container.innerHTML = "";

    if(DA_Nav_object === undefined)
        return this._DA_Nav_arr;

    let DA_sticky_top_elem = DA_Nav_object._getStickyTop();
    let display_title=DA_sticky_top_elem.querySelector(".display-title").cloneNode(true);
    let sub_label = DA_sticky_top_elem.querySelector(".display-sub-label").cloneNode(true);
    
    sticky_top_container.appendChild(display_title);
    sticky_top_container.appendChild(sub_label);

    this._DA_Nav_arr[1] = this._DA_Nav_arr[0];
    this._DA_Nav_arr[0] = DA_Nav_object;
    return this._DA_Nav_arr;
}

StickyTop.prototype.fadeTo = function(speed, opacity, callback) {
    speed = speed || "normal";
    opacity = opacity || 0;
    callback = callback || function(){};

    $(this._sticky_top).fadeTo(speed, opacity, callback);
}

StickyTop.prototype._eventBinding = function(container) {
    let thisStickyTop = this;
    let cardDisplay = document.getElementById(`card-display`);
    let displayToTop = cardDisplay.getBoundingClientRect().y + cardDisplay.ownerDocument.defaultView.pageYOffset;
    let displayVisibleHeight = parseInt(window.innerHeight) - parseInt(displayToTop);

    window.onresize = function() {
        let width = container.getBoundingClientRect()["width"];
        thisStickyTop._sticky_top.style.width = ` ${width}px`;
    }

    window.onscroll = function() {
        let current_DA_Nav = thisStickyTop._DA_Nav_arr[0];
        if(current_DA_Nav === undefined || current_DA_Nav._getDisplayDeck() === undefined || current_DA_Nav._getDisplayDesc() === undefined) {
            return false;
        }

        let current_display_deck = current_DA_Nav._getDisplayDeck();
        let current_display_desc= current_DA_Nav._getDisplayDesc();

        // console.log("A:", parseInt(current_display_desc.getBoundingClientRect()["top"]) > parseInt(displayToTop));
        // console.log("B:", parseInt(current_display_deck.getBoundingClientRect()["bottom"]) < (0.5*displayVisibleHeight) + parseInt(displayToTop));
        if((parseInt(current_display_desc.getBoundingClientRect()["top"]) > parseInt(displayToTop))  || (parseInt(current_display_deck.getBoundingClientRect()["bottom"]) < (0.7*displayVisibleHeight) + parseInt(displayToTop))){
            if(thisStickyTop._shown === 1){
                thisStickyTop._shown = 0;
                thisStickyTop.fadeTo(180, thisStickyTop._shown);
                // console.log("hide");
            }
        } else {
            if(thisStickyTop._shown === 0){
                thisStickyTop._shown = 1;
                thisStickyTop.fadeTo(160, thisStickyTop._shown);
                console.log("show", current_DA_Nav._NI_tag);
            }
        }
    }
}

// create EL components
// x > 0 .active
// x < 0 :not(.active)
// x == 0 .disabled
function createOT(OT_doc, classStr) {
    classStr = "btn-secondary-group" + classStr.replace(" list-group", "");
    let btnClassStr = "text-left btn-block";
    if(classStr.indexOf("sm") > 0) {
        btnClassStr = "text-center";
    }

    let OT_Group = $("<div></div>").addClass(classStr);
    $("#filter-panel > .btn-panel").last().append(OT_Group);
    $.getJSON(OT_doc, function(json) {
        // create EL components
        $.each(json, function(i, item) {
            let OT_single = new OT_Tab(item);
            let OT_btn = OT_single.drawOT(btnClassStr);

            OT_Group.append(OT_btn);
            OT_single.OTCreatingComplete();
        });
    });
}


// construct DP_filter class
//     "DP_id": 1,
//     "DP_tag": "illustrate characteristic",
//     "DA_sub_tag": "Depict Reality, Exaggerate Reality"
function OT_Tab(OT_object) {
    this._created = 0;  // if displayed on screen: > 0, if not: 0

    this._OT_id = OT_object["id"];
    this._OT_tag = OT_object["OT_tag"];
    this._OT_tag_abbr = OT_Tab.OT_abbr(this._OT_tag);
}

// Public method 
OT_Tab.prototype.drawOT = function(btnClassStr) {
    btnClassStr = btnClassStr || "text-left btn-block";
    let DP_btn = $("<button></button>")
                            .addClass("btn ot-tag " + btnClassStr)
                            .addClass("active")
                            .text(this._OT_tag)
                            .prepend($("<span></span>").addClass(this._OT_tag_abbr));

    return DP_btn;
}

// Public method
OT_Tab.prototype.OTCreatingComplete = function() {
    if(this._created <= 0) {
        this._created = new Date().getTime();
        this._interactionInit();
        return true;
    } else {
        console.warn(`OT tab ${this._OT_id} has already been created before.`);
        return false;
    }
}

// Private method
OT_Tab.prototype._interactionInit = function() {
    if(this._created) {
        this._OT_btn = document.querySelectorAll(".btn-secondary-group > .btn")[this._OT_id-201];
        
        // bind event listener
        this._eventBinding();
    }
}

// Private method
OT_Tab.prototype._eventBinding = function() {

    let thisOTTag = this;
    let deckChecking = function(option) {
        option = option || false; //false->get empty list; true -> get non empty list
        let checkedDeckList = [];
        document.querySelectorAll(".card-deck").forEach(deck => {
            let displayPart = deck.parentNode;
            if((!option) && (getComputedStyle(displayPart, null)["display"] === "none" || deck.querySelectorAll(".screened-out").length < deck.children.length)){
                return false;
            } else if(option && (getComputedStyle(displayPart, null)["display"] !== "none" || deck.querySelectorAll(".screened-out").length === deck.children.length)){
                return false;
            }

            checkedDeckList.push(displayPart.getAttribute("id"));
        });
        
        return checkedDeckList;
    }

    // bind hide/visible event to sub buttons
    let this_OT_abbr = thisOTTag._OT_tag_abbr;
    // thisOTTag._OT_btn.addEventListener("click", function() {
    //     let targetCards, changedDeckList;

    //     if(this.classList.contains("active")) {
    //         this.classList.toggle("active", false);
    //         targetCards = document.querySelectorAll(`.${this_OT_abbr}:not(.screened-out)`);
    //         targetCards.forEach(node => {
    //             node.classList.add("screened-out");
    //             $(node).fadeTo(420, 0).hide(1, () => {
    //                 if(node.querySelector(".card-inner").classList.contains("trans-3d"))
    //                 node.querySelector(".card-inner").classList.remove("trans-3d");
    //             }).fadeTo(1, 1);
    //         });

    //         changedDeckList = deckChecking(false); // new empty list
    //         changedDeckList.forEach((part, index, arr) => {
    //             document.querySelector(`.btn-primary-group > .${part}:not(.disabled)`).classList.add("disabled");
    //             if(document.querySelector(`.btn-primary-group > .${part}`).classList.contains("active"))
    //                 document.querySelector(`.btn-primary-group > .${part}`).classList.remove("active");
    //             $(`#${part}`).fadeOut(470, () => {
    //                 if(index === arr.length - 1) NI_Nav.OT_fitting();
    //             });

    //             if(!document.querySelector(`#card-display > #${part}`).classList.contains("hidden"))
    //                 document.querySelector(`#card-display > #${part}`).classList.add("hidden");
    //         });
            
    //     } else {
    //         this.classList.toggle("active", true);
    //         targetCards = document.querySelectorAll(`.${this_OT_abbr}.screened-out`);
    //         targetCards.forEach(node => node.classList.remove("screened-out"));
    //         $(targetCards).fadeIn(600);

    //         changedDeckList = deckChecking(true); // new non empty list
    //         changedDeckList.forEach((part, index) => {
    //             if(document.querySelector(`.btn-primary-group > .${part}`).classList.contains("disabled"))
    //                 document.querySelector(`.btn-primary-group > .${part}`).classList.remove("disabled");
    //             if(index === 0) 
    //                 NI_Nav.OT_fitting();
    //             $("#" + part).fadeIn(500);

    //             if(document.querySelector(`#card-display > #${part}`).classList.contains("hidden"))
    //                 document.querySelector(`#card-display > #${part}`).classList.remove("hidden");
    //         });
    //     }
    // });

    // bind hide/visible event to primary buttons
    thisOTTag._OT_btn.addEventListener("click", function () {
        let targetCards, changedDeckList;
        if(this.classList.contains("active")){
            this.classList.toggle("active", false);

            targetCards = document.querySelectorAll("#card-display ." + this_OT_abbr);

            targetCards.forEach(node => {
                node.classList.add("screened-out");
                $(node).fadeTo(420, 0).hide(1, () => {
                    if(node.querySelector(".card-inner") && node.querySelector(".card-inner").classList.contains("trans-3d"))
                        node.querySelector(".card-inner").classList.remove("trans-3d");
                }).fadeTo(1, 1);
            });

            changedDeckList = deckChecking(false); // new empty list
            changedDeckList.forEach((part, index, arr) => {
                document.querySelector(`.btn-primary-group > .${part}:not(.disabled)`).classList.add("disabled");
                if(document.querySelector(`.btn-primary-group > .${part}`).classList.contains("active"))
                    document.querySelector(`.btn-primary-group > .${part}`).classList.remove("active");
                $(`#${part}`).fadeOut(470, () => {
                    if(index === arr.length - 1)
                        NI_Nav.OT_fitting();
                });

                if(!document.querySelector(`#card-display > #${part}`).classList.contains("hidden"))
                    document.querySelector(`#card-display > #${part}`).classList.add("hidden");
            });

        } else {
            this.classList.toggle("active", true);

            targetCards = document.querySelectorAll("." + this_OT_abbr);

            targetCards.forEach(node => node.classList.remove("screened-out"));
            $(targetCards).fadeIn(600);

            changedDeckList = deckChecking(true); // new non empty list
            changedDeckList.forEach((part, index) => {
                if(document.querySelector(`.btn-primary-group > .${part}`).classList.contains("disabled"))
                    document.querySelector(`.btn-primary-group > .${part}`).classList.remove("disabled");
                if(index === 0) 
                    NI_Nav.OT_fitting();
                $("#" + part).fadeIn(500);

                if(document.querySelector(`#card-display > #${part}`).classList.contains("hidden"))
                    document.querySelector(`#card-display > #${part}`).classList.remove("hidden");
            });

            $("#card-display").animate({ scrollTop: '0px' }, 400);
            $("#card-display").animate({ scrollTop: '2.5px' }, 200);
            $("#card-display").animate({ scrollTop: '0px' }, 200);
        }
    })

    // $(DP_sub_ul).slideToggle(140 + 120 * (DP_sub_btn.length/1.75), function() {
    //     $(DP_btn).toggleClass("active");
    // });
}

// Static method
OT_Tab.OT_abbr = function(str) {
    str = str.toLowerCase() || "dynamic purpose";
    return "ot-" + $.trim(str).split(" ").join("-");
}


//create card display
// void return
function createDisplay(cards_doc) {
    console.log('start loading cards');
    $.getJSON(cards_doc, function(json) {

        // let doc_length = cards_doc.length;
        $.each(json, function(index, card_doc) {
            let { card_id, card_title, OT_tag, how, why, eg_arr } = card_doc;
            if(eg_arr.length == 0) {
                return false;
            }

            let NI_id_arr = [];
            eg_arr.forEach(eg => {
                NI_id_arr.push(eg["NI_tag_id"]);
            });
            NI_id_arr.sort();

            eg_arr.forEach(eg => {
                let { 
                    NI_tag_id, NI_tag, 
                    eg_id, eg_designer, eg_year, eg_source, eg_url
                    } = eg;
                    
                let NI_joint = $.trim(NI_tag).split(" ").join("-");
                let card = new AIE_Card({
                    card_id, card_title, OT_tag, how, why, 
                    NI_tag_id, NI_tag, NI_id_arr,
                    eg_id, eg_designer, eg_year, eg_source, eg_url
                });

                $(`#${NI_joint} > .card-deck`).append(card.drawCard());
                card.cardCreatingComplete();
            });

            // if(id == doc_length)
            //     console.log("All cards are loaded.");
        });
    });

    // deckDisplay();
    // scrollToTop();
}


// construct card class
// input card_object:Object()
// card_id	card_title	DA_nav_tag	DA_class_id	DA_class_tag	DA_desc	DP_tag	DP_sub_tag	DP_desc	eg_arr
function AIE_Card(card_object) {

    this._created = 0; // if displayed on screen: > 0, if not: 0
    this._current_eg_id = 0; // value range: 0, 1, 2

    this._card_id = card_object["card_id"] || 0;
    this._card_title = card_object["card_title"] || "Design Space";

    this._NI_tag_id = card_object["NI_tag_id"] || 0;
    this._NI_tag = card_object["NI_tag"] || "Narrative Intent Tag";
    this._NI_id_arr = card_object["NI_id_arr"];
    this._how = card_object["how"] || "";
    this._why = card_object["why"] || "";

    this._OT_tag = card_object["OT_tag"] || "Object type tag";
    // this.DP_code = this._DP_abr(DP_sub_tag);

    // this._eg_arr = card_object.eg_arr || [{"eg_id":"1000", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Mr. Designer", "eg_url":"https://www.dribbble.com"},{"eg_id":"1001", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Miss Designer", "eg_url":"https://www.dribbble.com"},{"eg_id":"1002", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Ms. Designer", "eg_url":"https://www.dribbble.com"}];
    this._eg_id = card_object["eg_id"];
    this._eg_designer = card_object["eg_designer"];
    this._eg_year = card_object["eg_year"];
    this._eg_source = card_object["eg_source"];
    this._eg_url = card_object["eg_url"];

    this._color_hash = NI_Nav.ColorHash.init();
    this._card_color_arr  = this._color_hash.get_color(this._NI_tag_id);
}

// Private method
// calc card header bg-color
// AIE_Card.prototype._colorSync = function() {
//     let DA_class_id = this._DA_class_id || 500;
//     let get_color = DA_Nav._color_hash.get_color;
//     let card_color = get_color(DA_class_id)
//     console.log(card_color);
//     return card_color || "#999999";
// }
// AIE_Card.prototype._colorSync = function(hash_list) {
//     let DA_class_id = this._DA_class_id || 500;
//     hash_list = hash_list || { 500 : "#999999" };
//     return hash_list[DA_class_id] || "#999999";
// }

// Private method
AIE_Card.prototype._OT_abbr = function() {
    let str = this._OT_tag.toLowerCase() || "dynamic purpose";
    return str.split(" ").join("-");
}

// Private method 
AIE_Card.prototype._getEgLength = function() {
    return this._eg_arr.length || 0;
}

// Private method
// record a card as 'created' after being put on screen
AIE_Card.prototype.cardCreatingComplete = function() {
    if(this._created <= 0) {
        this._created = new Date().getTime();
        this._interactionInit();
        return true;
    } else {
        console.warn(`Card No.${this._card_id} has already been created before.`);
        return false;
    }
}

// Private method
// initiate interactive parts
AIE_Card.prototype._interactionInit = function() {
    if(this._created) {
        this._Card = $(`[name='card_${this._eg_id}_${this._card_id}']`).get(0);
        let CardFront = $(this._Card).find(".front").get(0);
        let CardBack = $(this._Card).find(".back").get(0);

        this._FrontGif = $(CardFront).find(".card-frontImg");
        this._backGifZoomingBtn = $(CardBack).find(".img-overlay").get(0);

        this._CardTurningBtns = $(this._Card).find(".card-footer > .btn");

        // bind event listener
        this._eventBinding();
    }
}

AIE_Card.prototype._eventBinding = function() {

    let thisCard = this; // data object
    // let Card = thisCard._Card; // DOM object
    let CardInner = $(thisCard._Card).find(".card-inner");
    let frontImg = $(thisCard._FrontGif);
    let zoomingBtn = $(thisCard._backGifZoomingBtn);

    // bind with footer buttons
    this._CardTurningBtns.click(() => {
        CardInner.toggleClass("trans-3d");
    })

    // bind with modal window
    zoomingBtn.click(() => {
        $(".modal-body > img").attr("src", `./assets/back_gif/back_${thisCard._eg_id}.gif`);
        $("#zooming-modal").modal({
            backdrop: false,
            keyboard: false,
            focus: true,
            show: true
        });

    })

    // bind front img preview
    frontImg.hover(
        // hover in
        function() {
            frontImg.children(".front-prev").css("opacity", 0);
            frontImg.removeClass("inactive");
        },
        // hover out
        function() {
            let gif_path = $($(frontImg).children(".front-gif").get(0)).attr("src");
            frontImg.children(".front-prev").fadeTo("fast", 1, function() {
                frontImg.addClass("inactive");
                $(frontImg.children(".front-gif").get(0)).attr( "src", gif_path );
            });
        }
    );

}


// *** CARD DRAWING PROCESS ***

// Public method
AIE_Card.prototype.drawCard = function() {

    let OT_code = this._OT_abbr();
    let innerCard = $("<div></div>").addClass("card-inner")
                    .append(this._cardFront())
                    .append(this._cardBack());

    // return a single card element
    return $("<div></div>").addClass("col mb-5 position-relative")
            .addClass("ot-" + OT_code)
            .attr("name", `card_${this._eg_id}_${this._card_id}`)
            .append(innerCard);
}

// Private method
AIE_Card.prototype._cardFront = function() {

    let front_elem = $("<div></div>").addClass("card shadow front");
    let card_header = this.__cardHeader();
    let front_gif = $("<img />").addClass("card-img front-gif")
                    .attr({
                        // src: "assets/media/loading_light.svg",
                        // "data-echo": "assets/front_gif/front_" + card_id + ".gif",
                        // "onerror": "assets/media/fail_loading_light.svg"
                        src: `./assets/front_gif/front_${this._card_id}.gif`
                    });
    let front_gif_prev = $("<img />").addClass("card-img front-prev")
                        .attr({
                            // src: "assets/media/loading_light.svg",
                            // "data-echo": "assets/front_gif/front_" + card_id + ".gif",
                            // "onerror": "assets/media/fail_loading_light.svg"
                            src: `./assets/front_prev/static_${this._card_id}.png`
                        });

    let front_card_img = $("<div></div>")
                        .addClass("card-frontImg inactive")
                        .append(front_gif)
                        .append(front_gif_prev)
                        .append(this.__NI_symbol());
                        
    let front_card_body = this.__cardFrontBody();
    let card_footer = this.__cardFooter(1);

    // return card front part
    // frontElem.append(card_header).append(prevImg).append(frontGif).append(card_body).append(card_footer);
    return front_elem.append(card_header).append(front_card_img).append(front_card_body).append(card_footer);
}

// Private method
AIE_Card.prototype._cardBack = function() {

    let back_elem = $("<div></div>").addClass("card shadow back");
    let card_header = this.__cardHeader();
    let back_gif_box = this.__cardBackImg();
    let back_card_body = this.__cardBackBody();
    let card_footer = this.__cardFooter(-1);

    // return card back part
    return back_elem
            .append(card_header)
            .append(back_gif_box)
            .append(back_card_body)
            .append(card_footer);
}

// Private method
AIE_Card.prototype.__cardHeader = function() {
    
    let card_color = this._card_color_arr[0];
    let header_elem = $("<div></div>").addClass("card-header");
    let head_title = $("<h4></h4>").text(this._card_title);
    let head_p = $("<p></p>").text(this._OT_tag);
    let head_symbol = $("<span></span>").addClass("header-symbol");

    // return card header
    return header_elem
            .css("background", card_color)
            .append(head_title)
            .append(head_p)
            .append(head_symbol);
        // .append($("<span></span>").css({
        //     background: "url(assets/media/in" + EL_abr(EL_tag) + ".svg) no-repeat",
        //     "background-size": "cover"
        // }));
}

// Private method
// x: >0 -> front, <=0 -> back
AIE_Card.prototype.__cardFooter = function(x) {

    x = x || 1;
    let card_bottom = $("<div></div>").addClass("card-footer");
    let card_footer_button = $("<button></button>").addClass("btn btn-sm rounded-pill");
    let counter = $("<span></span>").addClass("card-num").text("NO. " + this._card_id);

    card_bottom.append(counter);

    if(x > 0 ) {
        card_footer_button.text("View Examples");
        card_bottom.append(card_footer_button);
        // .append(counter);
    } else {
        card_footer_button.text("Back to Front");
        // let superLink = $("<a></a>").attr({"href": url, target: "_blank"}).addClass("text-decoration-none").text("URL");
        card_bottom.append(card_footer_button);
        // .append(superLink);
    }

    // return card footer
    return card_bottom;
}

// Private method
AIE_Card.prototype.__cardFrontBody = function() {

    let front_body_elem = $("<div></div>").addClass("card-body");
    // let approach_id = _prefixZero(this._DA_nav_id, 2);
    // let approach_title = `Approach : ${approach_id} ${this._card_title}`;
    // let purpose_id = _prefixZero(this._DP_sub_id, 2);
    // let purpose_title = `Purpose : ${purpose_id} ${this._DP_sub_tag}`;

    front_body_elem.append(
        $("<div></div>").addClass("card-subtitle").text("HOW")
    ).append(
        $("<p></p>").addClass("card-text").text(this._how)
    ).append(
        $("<div></div>").addClass("card-subtitle").text("WHY")
    )
    .append(
        $("<p></p>").addClass("card-text").text(this._why)
    );

    // return card front body
    return front_body_elem;
}

// Private method
AIE_Card.prototype.__cardBackBody = function() {

    let back_body_elem = $("<div></div>").addClass("card-body");
    let source = this._eg_source || "Mr. Designer";
    let year = this._eg_year || "2020";
    let designer = this._eg_designer || "Mr. Designer";
    let url = this._eg_url || "https://www.dribbble.com";
    let super_link = $("<a></a>").attr({"href": url, "target": "_blank"}).addClass("text-decoration-none").text("URL");
    let caption = $("<div></div>").addClass("caption")
                .append(this.__appendCaption("Source", source))
                .append(this.__appendCaption("Year", year))
                .append(this.__appendCaption("Designer", designer))
                .append($("<div></div>").append(super_link));
        
    // return card back body
    return back_body_elem.append(caption);
}


// *** CARD BACK DRAWING ***

// Private method
// current_eg_id -> start index : 0, 1, 2 ... ...
AIE_Card.prototype.__cardBackImg = function() {

    let back_img_box = $("<div></div>").addClass("card-img-box");
    // <img class="card-img back-gif" src="./assets/back_gif_s/back_1.gif" alt="Image loading error."></img>
    let back_img = $("<img />").addClass("card-img back-gif").attr({ src: `./assets/back_gif/back_${this._eg_id}.gif` });

    let cover = $("<div></div>")
                .addClass("img-cover")
                .append(
                    $("<div></div>").addClass("mask position-absolute")
                ).append(
                    $("<span></span>").addClass("img-overlay").attr("type", "button")
                );

    // return all gif within one carousel
    return back_img_box.append(back_img).append(cover).append(this.__NI_symbol());
}

// Private method
AIE_Card.prototype.__NI_symbol = function () {
    let this_NI_id = this._NI_tag_id;
    let NI_symbol_cover = $("<div></div>").addClass("NI-symbol");
    let this_color_arr = this._card_color_arr;
    let color_hash = this._color_hash;
    this._NI_id_arr.forEach(NI_id => {
        let single_symbol = $("<span></span>").addClass("NI-single-symbol");
        
        if(NI_id == this_NI_id) {
            single_symbol.css({ 
                "background-image": `linear-gradient(0deg, ${this_color_arr[0]} , ${this_color_arr[1]})`,
                "height": "1.25rem",
                "width": "1.25rem",
                "box-shadow": "0 0 4px #FFF30050"
            });
        } else {
            single_symbol.css("border", `1px solid ${color_hash.get_color(NI_id)[0]}`);
        }

        NI_symbol_cover.append(single_symbol);
    });
    return NI_symbol_cover;
}

// Private method
AIE_Card.prototype.__appendCaption = function(key, content) {

    key = key || "Caption keyword";
    content = content || "Caption content."

    // return a single caption to the back of the card
    return `<div><span>${key}: </span>${content}</div>`;
}


// make 9 to 09
function _prefixZero(num, n) {
    num = num || 0;
    n = n || 2;
    return (Array(n).join(0) + num).slice(-n);
}

// activate / inactivate DP primary filter
function OT_filter() {

    // $("input.form-control").val("Search");
    // $(".search-result").fadeOut("fast", function(){
    //     $(this).text("");
    //     $(this).show(1);
    // });

    let DP_btn = this;
    let DP_sub_chosen = $(DP_btn).hasClass("active") ? ".active" : "";
    let DP_sub_ul = $(DP_btn).next().get(0);
    let DP_sub_btn = $(DP_sub_ul).children(DP_sub_chosen);
    $(DP_sub_ul).slideToggle(140 + 120 * (DP_sub_btn.length/1.75), function() {
        $(DP_btn).toggleClass("active");
    });
    $(DP_sub_btn).each(function(index, btn) {
        $(btn).trigger("click");
    });
}

//activate / inactivate DP sub filter
function OT_sub_filter() {

    console.log("sub_filter:", new Date().getTime());

    // $("input.form-control").val("Search");
    // $(".search-result").fadeOut("fast", function(){
    //     $(this).text("");
    //     $(this).show(1);
    // });

    let DP_sub_tag = $(this).attr("id");
    if($(this).hasClass("active")){

        $(this).removeClass("active");

        // turn back card
        // $(`.${EL_tag} > .back:visible .btn`).click();
        // $(`.${DP_sub_tag} > .card-inner.trans-3d`).removeClass("trans-3d");

        //check scroll panel
        if(DP_sub_tag) {
            console.log(-1);
            scrollCheck(DP_sub_tag, -1);
        }

    } else {

        // need rectification
        if($(".btn-primary-group > .btn.active").length == 0 || $(".btn-primary-group-sm > .btn.active").length == 0) {
            $(".btn-primary-group > .btn:first-child").addClass("active");
            $(".btn-primary-group-sm > .btn:first-child").addClass("active");
        }

        $(this).addClass("active");
        //check scroll panel  
        if(DP_sub_tag) {
            console.log(1);
            scrollCheck(DP_sub_tag, 1);
        }
    }

    // deckDisplay();
}

// check scroll panel and para descriptions
function scrollCheck(DP_sub_tag, x) {
    DP_sub_tag = DP_sub_tag || "";
    x = x || 1;

    if(x < 0) {
        // console.log("x<1", new Date().getTime())

        $(`#card-display .${DP_sub_tag}:visible`).addClass("to-fade");
        // $(".to-fade").each(function(index, elem) {
        //     console.log($(elem).attr("name"));
        // })
        $(".card-deck").each(function(index, elem){
            // elem: a single card deck
            let DA_tag = $($(elem).parent().get(0)).attr("id");
            
            if($(elem).children(':visible:not(.to-fade)').length === 0) {
                console.log("Here for ", DA_tag);
                $("#" + DA_tag).fadeOut("normal", () => {
                    OT_fitting(); 
                    // $(`.${DP_sub_tag} > .card-inner.trans-3d`).removeClass("trans-3d");
                    $(this).find(".card-inner.trans-3d").removeClass("trans-3d");
                });
                $("." + DA_tag).addClass("disabled");
            } else {
                $("#card-display ." + DP_sub_tag).fadeOut(400, function() {
                    $(this).find(".card-inner.trans-3d").removeClass("trans-3d");
                });
            }
            // $(elem).children(".to-fade").removeClass("to-fade");
        });
        
        $(".to-fade").removeClass("to-fade");

    } else {

        $("#card-display ." + DP_sub_tag).each(function(index, elem){
            // elem: a single card
            let targetSet = $(elem).parentsUntil("#card-display");
            let NS_tag = $(targetSet[targetSet.length-1]).attr("id");
            $(".disabled." + NS_tag).removeClass("disabled");

            $(`#${NS_tag}:hidden:not(.to-show)`).addClass("to-show");
            $(elem).fadeIn("slow");
        });
        OT_fitting();
        $(".to-show").fadeIn("normal", function(){
            $("#card-display > .to-show").removeClass("to-show");
        });
    }
    
    // NS_active_fitting();
}

// make DA fitting to display pattern
function OT_fitting() {
    if($("#card-display > div:not(.deck-reminder):visible").length === 0) {
        $(".btn-primary-group > .btn.active").removeClass("active");
        $(".btn-primary-group-sm > .btn.active").removeClass("active");
        $(".search-fail").fadeIn("normal");
    } else {
        $(".search-fail").css("display", "none");
    }
}

// avoid NS .disabled.active
function NI_active_fitting() {
    var targetSet = $(".btn-primary-group").find(".disabled.active") || $(".btn-primary-group-sm").find(".disabled.active");
    // length only equals 1 / 0
    if(targetSet.length > 0) {
        $(targetSet[0]).removeClass("active");
        var nextSet = $(targetSet[0]).nextAll(".btn:not(.disabled)");
        var preSet = $(targetSet[0]).prevAll(".btn:not(.disabled)");

        if(preSet.length > 0) {
            // $(preSet[0]).click();
            $(preSet[0]).trigger("click");
            return ;
        } else if(nextSet.length > 0) {
            // $(nextSet[0]).click();
        console.log("next");
        $(nextSet[0]).trigger("click");
            return ;
        } else {
        // $("#card-display").text("Sorry, you haven't chosen any Editorial Layers yet~");
            $(".btn-primary-group > .btn").removeClass("active");
            $(".btn-primary-group-sm > .btn").removeClass("active");
        }
    }
}

// NS buttons control #card-display
function NI_scroller() {
    // var screenH = $(window).height() - $("#card-display").offset().top;
    var targetId = $(this).attr("href");
    var target = $(targetId).position().top + $("#card-display").height() - $("#card-display").outerHeight();
    // $(this).parent().find(".active").removeClass("active");
    // $(this).addClass("active");
    $('html, body').animate({scrollTop: target}, 800, "easeInOutQuart");
    console.log(target);
}

// spy on display scrolling action
function displaySpy() {
    let screenH = $(window).height() - $("#card-display").offset().top; // if screen height is very limited - > bug $("#card-display").outerHeight() + $("#card-display").height();
    let DA_class = ".btn-primary-group";
    if($(DA_class).length <= 0)
        DA_class = ".btn-primary-group-sm";
    $("#card-display").children(":not(.search-fail)").each(function(i, item){
        let currentPosition = $(item).position().top - $(window).scrollTop();
        if($("." + $(item).attr("id")).is(":not(.active)") && (currentPosition < 0.5*screenH) && (($(item).height() + currentPosition) >= 0.5*screenH)) {
            $(`${DA_class} > .btn.active`).removeClass("active");
            $(`${DA_class} > .btn:not(.disabled).` + $(item).attr("id")).addClass("active");
            // $(".btn-primary-group-sm > .btn.active").removeClass("active");
            // $(".btn-primary-group-sm > .btn:not(.disabled)." + $(item).attr("id")).addClass("active");

            // deck-reminder info preloading
            // $(".deck-reminder").empty();
            // $($(item).find(".display-title").get(0)).clone(false).appendTo(".deck-reminder");
            // $($(item).find(".display-sub-label").get(0)).clone(false).appendTo(".deck-reminder");
            // console.log("once")
        }
    });
}

// listen to reminder div beneath each card-deck
function reminderSpy() {
    // const windowTop = parseInt(Math.round(window.pageYOffset));
    let nav = document.querySelector("header");
    // let displayHeight = window.innerHeight - nav.offsetHeight;
    let current_active_sticky =document.querySelector(".deck-reminder.active-sticky");
    let allReminders = Array.from(document.querySelectorAll(".deck-reminder"));
    allReminders.some(function(sticky, index, nodeList) {
        let reminderToHeader = parseInt(Math.round(sticky.getBoundingClientRect().top)) - nav.offsetHeight;
        

        if(sticky.classList.contains("active-sticky")) {
            if(sticky.getBoundingClientRect().bottom <= sticky.nextElementSibling.getBoundingClientRect().top + 5) {
                console.log("A");
                // console.log(index+1, reminderToHeader);
                sticky.classList.remove("active-sticky");
                $($(sticky).find(".display-desc").get(0)).slideDown(360);
            }
            return false;
        }

        // if(current_active_sticky && (reminderToHeader > (current_active_sticky.offsetHeight + sticky.offsetHeight))) {
        if(current_active_sticky && (reminderToHeader >= 1)) {
            // console.log("A");
            // sticky.classList.remove("active-sticky");
            // console.log(index+1, reminderToHeader);
            // console.log("B");
            $($(sticky).find(".display-desc").get(0)).slideDown(360);
            // return false;
        }

        // if(Math.abs(reminderToHeader) < 5) {
        if(Math.abs(reminderToHeader) < 1) {
            // console.log(index+1, reminderToHeader);
            // console.log("C");
            $($(sticky).find(".display-desc").get(0)).slideUp(360);
            sticky.classList.add("active-sticky");

            if(current_active_sticky) {
                current_active_sticky.classList.remove("active-sticky");
            }

            return true;
        }
    });
}

function searchFunc(nav_object) {
    var show_list = [];
    console.log("Ready to search.");
    var read = $("input.form-control").val().toString() || "";
    if(read.toLowerCase() == "search") read = "";
    readRegOrigin = read.replace(/[.,:;·'"\(\)\[\]\{\}\\\/\|]/g, " ").replace(/\s+/g, " ");
    readRegOrigin = $.each((readRegOrigin.split(" ")), function(item){return $.trim(item);});
    var readReg = readRegOrigin.filter(function(item, index, arr) {
        return arr.indexOf(item, 0) === index;
    });
    console.log("Search for:", readReg);

    if(readReg.length > 0 && (readReg[0] != ("" | " "))) {

        //transform string to regexExp
        var rex = new RegExp(readReg.join("|"), "ig");
        // $.ajaxSettings.async = false;
        $.getJSON(CARD_DOC, function(json) {

            const doc_length = json.length;
            let flag = false;

            //get to-be-hidden number array
            // $.ajaxSettings.async = false;
            $.each(json, function(doc_i, item) {
                let itemDoc, egDoc, eg_id;
                let { _, eg_arr } = item;
                // delete item["card_id"];
                itemDoc = (Object.values(item)).join(" ");

                eg_arr.forEach((eg, eg_i, eg_list) => {
                    egDoc = "";
                    eg_id = eg["eg_id"];
                    delete eg["NI_tag_id"], eg["eg_id"], eg["eg_url"];
                    egDoc = (Object.values(item)).join(" ");
                    eDoc = itemDoc + " " + egDoc;

                    if(itemDoc.search(rex) > -1) {
                        show_list.push(`card_${eg_id}_${doc_i+1}`);
                    }

                    if((doc_i == doc_length-1) && (eg_i == eg_list.length-1)) {
                        flag = true;
                        console.log("Search finished");
                    }
                });
            });

            if(flag && (show_list.length > 0)) {
                console.log(`${show_list.length} results were found.`);
                show_list.forEach(card_name => $(`[name="${card_name}"]`).addClass("as-result"));
                $("#card-display > div").fadeOut("normal", function() {

                    if($(this).is($("#card-display > div").last())) {
                        searchResultDisplay(nav_object);
                    }

                    // $(".search-result").text(`${show_list.length} result${show_list.length > 1 ? "s" : ""}`);
                });
            } else if(flag) {
                console.log("Nothing found.");
                $("#card-display > div").fadeOut("normal", function() {
                    $(".search-fail").fadeIn("fast");
                    $(".card-deck > div").fadeOut("normal");
                })
                // $(".search-result").text("0 result");
                $(".btn-primary-group > .btn").removeClass("active").addClass("disabled");
                $(".btn-primary-group-sm > .btn").removeClass("active").addClass("disabled");
            }
        });

    } else {

        $(".search-fail").fadeOut("normal");

        if($(".card-deck > div:visible").length == $(".card-deck > div").length) return ;

        $("#card-display > div").fadeOut("normal", function() {
            $(".card-deck > div").css("display", "block");
            $("#card-display > div").fadeIn("normal");
        });
        $(".btn-primary-group > .btn").removeClass("disabled");
        $(".btn-primary-group-sm > .btn").removeClass("disabled");
        $(".btn-secondary-group > .btn").addClass("active");
        $(".btn-secondary-group-sm > .btn").addClass("active");
        $(".search-result").text("");
    }

    scrollToTop();
}

// layout after searching
function searchResultDisplay(nav_object) {
    if(!nav_object) {
        return ;
    }

    $(".card-deck > div").css("display", "none");
    $("#card-display > div").addClass("hidden");

    $(".card-deck > .as-result").each(function(index, elem) {
        let targetSet = $(elem).parentsUntil("#card-display");
        let NI_tag = $(targetSet[targetSet.length-1]).attr("id");

        if($(`.${NI_tag}`).hasClass("disabled")) {
            $(`.${NI_tag}`).removeClass("disabled");
        }

        if($(`#${NI_tag}`).hasClass("hidden")) {
            $(`#${NI_tag}`).removeClass("hidden");
        }

        if(!$(`#${NI_tag}`).hasClass("as-result")) {
            $(`#${NI_tag}`).addClass("as-result");
        }
        $(elem).css("display", "block");
        nav_object.refresh();
    });

    $("#card-display > .as-result").fadeIn("normal", function(){
        $("#card-display > .as-result").removeClass("as-result");
        $("#card-display > div:hidden").each(function(index, container_elem) {
            let NI_tag = $(container_elem).attr("id");
            $("." + NI_tag).removeClass("active").addClass("disabled");
        });
        $(".card-deck > .as-result").removeClass("as-result");
    });
}


// set filter panel
function panelLayout() {
    let bannerHeight = $("header").outerHeight();
    let panel = $("#filter-panel");
    panel.css({
        // "position": "sticky",
        // "overflow-y": "auto",
        // "z-index": 500,
        "top": bannerHeight + 1
    });
    if($(window).outerWidth() >= 768) {
        panel.css("height", ($(window).outerHeight() - bannerHeight -1));
        return " list-group";
    } else {
        panel.css("height", "100%");
        return "-sm";
    }
}

// check NS - Card display relationship
function deckDisplay(list, idString) {
    idString = idString || "";
    list = list || [];


    $("#card-display > div").slideDown(1);
}


// fade in full-screen button
function fullScreenOver(){
    $($(this).children(".img-cover")[0]).fadeIn(180);
}

// fade out full-screen button
function fullScreenOut() {
    $($(this).children(".img-cover")[0]).fadeOut(240);
}

function scrollToTop() {
    $(".btn-primary-group > .btn").first().trigger("click");
    $("#card-display").animate({ scrollTop: '0px' }, 400);
    $("#card-display").animate({ scrollTop: '2.5px' }, 200);
    $("#card-display").animate({ scrollTop: '0px' }, 200);
}


// action easing for scrolling
jQuery.extend( jQuery.easing,
    {
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
});
