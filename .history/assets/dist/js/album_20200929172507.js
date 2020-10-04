// Data back Explorer

// import Freezeframe from 'freezeframe';

// prepare docs
var DA_doc = "./assets/dist/js/DA_collection.json";
var card_doc = "./assets/dist/js/AIE_card_collection.json";
var DP_doc = "./assets/dist/js/DP_collection.json";


$(document).ready(function() {

    loadData(DA_doc, DP_doc, card_doc);
    setupInteraction();
});

// load two json documents and update the panel
function loadData(DA_doc, DP_doc, card_doc) {
    var classStr = panelLayout();

    // create NS navigator
    createDA(DA_doc, classStr);
    
    // create EL filter button group
    createDP(DP_doc, classStr);    
    
    // load card data
    createDisplay(card_doc);
}

// activate all the interactive components
function setupInteraction() {
    console.log("Now binding interactions");
    // activate responsive responsive header + filter panel layout
    $(window).resize(function() {
        var classStr = panelLayout();
        if(classStr.length < 5){
            $("div.btn-primary-group").removeClass("btn-primary-group list-group").addClass("btn-primary-group-sm");
            $("div.btn-secondary-group").removeClass("btn-secondary-group").addClass("btn-secondary-group-sm");
            $("div.btn-secondary-group-sm > .btn").removeClass("btn-block text-left").addClass("text-center");
        } else {
            $("div.btn-primary-group-sm").removeClass("btn-primary-group-sm").addClass("btn-primary-group" + classStr);
            $("div.btn-secondary-group-sm").removeClass("btn-secondary-group-sm").addClass("btn-secondary-group" + classStr.replace(" list-group", ""));
            $("div.btn-secondary-group > .btn").removeClass("text-center").addClass("btn-block text-left");
        }
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

    $(".nav-button").click(searchFunc);
    $(".form-control").bind('keydown', function(eve){  
    　　var keyCode = eve.which || arguments.callee.caller.arguments[0];  
    　　if (keyCode == 13) { searchFunc(); $(".form-control").blur();}   //ignore space button
    });

    // activate NS navigator
    $(".btn-primary-group > .btn").click(DA_scroller);
    $(".btn-primary-group-sm > .btn").click(DA_scroller);

    // activate top info reminders
    // $(window).scroll(reminderSpy)；

    // activate scroll spy
    $(window).scroll(displaySpy);
    //activate the first part
    $(".btn-primary-group > .btn").first().addClass("active"); 
    $(".btn-primary-group-sm > .btn").first().addClass("active");

    // activate EL filter button group
    // $(".btn-secondary-group > .btn").click(DP_filter);
    // $(".btn-secondary-group-sm > .btn").click(DP_filter);
    // $(".btn-sub-list > li").click(DP_sub_filter);

    // image lazy loading
    // $(".modal-body").ImgLoading({timeout: 1000});

    // activate front-back transition buttons within cards
    // $(".card-bottom > button").click(cardOver);
    // $(".card-footer > button").click(cardTrans);

    // open new example tag
    // $(".card-footer a").click(function(){
    //     window.open($(this).attr("href"));
    // });

    // card footer url
    // $(".card-footer a").tooltip({title: "Click to watch full video in a new window", placement: "top"});

    // hover front gif 
    // image lazy loading
    // $(".card-img").load($(this).attr("data-target"), function() {
    //     $(this).attr("src", $(this).attr("data-target"));
    //     if($($(this).parent()[0]).attr("class") == "card-img-box") {
    //         $($(this).next()[0]).tooltip({title: "Click to zoom in", placement: "top"});
    //     } else {
    //         const logo = new Freezeframe($(this));
    //     }
    // });

    // function ImgLoading(status) {
    //     status = status || "front";
    //     var parent = $(this).parent()[0];
    //     var cls = $(this).attr("class");
    //     var img = new Image();
    //     img.src = $(this).attr("data-echo");
        // $(img).attr("onerror", $(this).attr("onerror"));
        
    //     loading
    //     if(img.complete) {
    //         callback.call(img);
    //         return;
    //     }

    //     loaded
        // if(img.onload) {
        //     $(img).addClass(cls);
        //     $(this).replaceWith(img);
    //         if(status == "front") {
    //             const logo = new Freezeframe($(this));
    //             return;
    //         }
    //         if(status == "back") {
    //             $($(this).next()[0]).tooltip({title: "Click to zoom in", placement: "top"});
    //             $(parent).hover(fullScreenOver, fullScreenOut);
    //             return;
    //         }
    //     };
    // }

    // $(window).on("load", function(){
    //     $(".front > img").each(function(){ImgLoading("front");});
    //     $(".back > img").each(function(){ImgLoading("back");});
    // });

    // echo.init({
    //     offset: 0,
    //     throttle: 250,
    //     unload: false,
    //     callback: function(element, op) {
    //         var status = ($($(element).parent()[0]).attr("class") == "card-img-box" ? "back" : "front");

    //         if(op === 'load' && status === "front"){
    //             $(element).prev(".card-frontPrev")[0].src = $($(element).prev(".card-frontPrev")[0]).attr("data-target");
    //             $($(element).parent()[0]).hover(function(){
    //                 $($(this).children(".card-frontPrev")[0]).fadeOut(10);
    //             }, function() {
    //                 $($(this).children(".card-frontPrev")[0]).fadeIn(160);
    //             });
    //         }

    //         if(op === 'load' && status === "back") {
    //             $($(element).next()[0]).tooltip({title: "Click to zoom in", placement: "top"});
    //             $($(element).parents(".card-img-box")[0]).hover(fullScreenOver, fullScreenOut);
    //             return;
    //         } 
    
    //         if(op === 'load' && $($(element).parent()[0]).attr("class") !== "modal-body") {
    //             const logo = new Freezeframe($(element));
    //             return;
    //         }
            
    //         if(op === 'unload') {
    //             element.src = "assets/media/fail_loading_light.svg";
    //         }
    //     }

    // });

    // const frontImg = new Freezeframe('.card-deck .card-img');
    // $(".card-deck .card-img").onload(function(){
    //     var parentsSet = $(this).parentsUntil(".card-deck");
    //     var name = $(parentsSet[parentsSet.length - 1]).attr("name");
    //     const logo = new Freezeframe("[name=\'" + name + "\'] .front > .card-img");
    //     const logo = new Freezeframe(this);
    // });

    // hover full-screen button on card image
    $(".card-img-box").hover(fullScreenOver, fullScreenOut);
    // $(".img-overlay").tooltip({title: "Click to zoom in", placement: "top"});


    // toggle modal
    $(".img-overlay")
    .click(modalInfo)
    .click(function () {
        $("#zooming-modal").modal({
            backdrop: false,
            keyboard: false,
            focus: true,
            show: true
        });
    });
    $("a.modal-title").tooltip({title: "Click to watch full video in a new window", placement: "top"});
    $("a.modal-title").click(function(){
        window.open($(this).attr("href"));
        $("a.modal-title").tooltip("hide");
    });

    let data_provider = "";
    $('#zooming-modal').on('shown.bs.modal', function() {
        let modalWindowCarousel = $("#carouselModal").get(0);
        data_provider = $(modalWindowCarousel).attr("data-provider");
    });

    $(".modal .carousel").on("slide.bs.carousel", function(event) {
        let aimCard = $(`[name="${data_provider}"]`).get(0);
        // console.log(data_provider);
        let aimCarousel = $(aimCard).find(".carousel").get(0);
        if(event.direction === "right") {
            $(aimCarousel).find("a.carousel-control-prev").click();
        } else if(event.direction === "left") {
            $(aimCarousel).find("a.carousel-control-next").click();
        }
    })




    // abandon right mouse click.

    // ** From here

    // if (window.Event) {document.captureEvents(Event.MOUSEUP); }

    // function nocontextmenu() {
    //     event.cancelBubble = true 
    //     event.returnValue = false; 

    //     return false; 
    // } 

    // function norightclick(e) { 
    //     if (window.Event) { 
    //     if (e.which == 2 || e.which == 3) 
    //         return false; 
    //     } else if (event.button == 2 || event.button == 3) { 
    //         event.cancelBubble = true 
    //         event.returnValue = false; 
    //         return false; 
    //     } 
    // } 

    // for IE5+ 
    // document.oncontextmenu = nocontextmenu; 
    // for all others 
    // document.onmousedown = norightclick; 

    // End **
}

// create NS components & display NS frame
function createDA(DA_doc, classStr) {
    // calc panel's position $ screen width measuring
    classStr = "btn-primary-group" + classStr;

    // create NS part
    var DA_Group = $("<div></div>").addClass(classStr)
        .attr("id", "display-scroll");
    $.ajaxSettings.async = false;
    $.getJSON(DA_doc, function (json) {
        $.each(json, function (i, item){

            
            let DA_single = new DA_Nav(item);
            let DA_nav_btn = DA_single.drawDANav(); // create spy btn
            let DA_top = DA_single.drawDATop(); // create display part
            let DA_joint_tag = DA_single.getJointTag();
            let currentDisplayPart = $("<div></div>").attr("id", DA_joint_tag); // create spy panel
            
            DA_Group.append(DA_nav_btn);
            
            currentDisplayPart
            .append(DA_top)
            .append($("<div></div>").addClass("row row-cols-1 row-cols-sm-2 row-cols-lg-3").addClass("card-deck")); // create card deck  

            currentDisplayPart.appendTo("#card-display");
            DA_single.DACreatingComplete();
        });

    });

    $("#filter-panel > .btn-panel").last().append(DA_Group);
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
function DA_Nav(DA_object) {

    // color method
    this._color_hash = DA_Nav.ColorHash.init();
    this._created = 0; // nothing created: 0; both created: 1
    
    this._DA_id = DA_object["DA_id"] || 500;
    this._DA_num = DA_object["DA_num"] || 0;
    this._DA_nav_tag = DA_object["DA_nav_tag"] || "navigator";
    this._DA_desc = DA_object["DA_desc"] || "Interpretation for Dynamic Approaches. Interpretation for Dynamic Approaches. Interpretation for Dynamic Approaches. Interpretation for Dynamic Approaches. Interpretation for Dynamic Approaches.";
    this._DA_sub_arr = DA_object["DA_class_object"] || [{"DA_class_id": "501", "DA_class_tag": "navigator sub class example", "DA_class_color": "#EBEDF6"}];
    
    this._DA_joint_tag = this._DA_nav_tag.split(" ").join("_");

    this._DA_nav_color = DA_object["DA_nav_color"] || "#EBEDF6";
    this._color_hash.set_color(this._DA_id, this._DA_nav_color);
}

// public color hash data sharing
DA_Nav.ColorHash = {
    
    _data: { 500: "#EBEDF6" },

    init: function(){
        let color = {};

        color.set_color = function(key_id, color_str) {
            key_id = key_id || 500;
            color_str = color_str || "";
            
            if(color_str) {
                if(color_str.indexOf("#") < 0)
                    color_str = "#" + color_str;
                if([3,4,7].indexOf(color_str.length) < 0)
                    return false;
                    
                DA_Nav.ColorHash._data[key_id] = color_str;
                return true;
            }
    
            return false;
        };

        color.get_color = function(key_id) {
            key_id = key_id || 500;
            if(DA_Nav.ColorHash._data.hasOwnProperty(key_id)) 
                return DA_Nav.ColorHash._data[key_id];
            else
                return undefined;
        };

        return color;
    }
}

DA_Nav.prototype.getJointTag = function() {
    return this._DA_joint_tag;
}

DA_Nav.prototype.drawDANav= function() {
    let classString = "btn btn-block text-left";

    let DA_nav_btn = $("<a></a>").addClass([classString, this._DA_joint_tag].join(" "))
                    .text(this._DA_nav_tag.replace(this._DA_nav_tag[0], this._DA_nav_tag[0].toUpperCase()) + ` (${this._DA_num})`)
                    .attr({type: "button", href: "#" + this._DA_joint_tag})
                    .prepend($("<span></span>").addClass("btn-id").css("background-color", this._DA_nav_color))
                    .append($("<span></span>").addClass("btn-sign").css("background", this._DA_nav_color));

    return DA_nav_btn;
}

DA_Nav.prototype.drawDATop = function() {
    let thisDA_Nav = this;

    // display color reminder
    let sub_label = $("<ul></ul>").addClass("display-sub-label");
    thisDA_Nav._DA_sub_arr.forEach(eg_object => {
        // add to color hash list
        let DA_class_id = eg_object["DA_class_id"] || (500 + index + 1);
        let DA_class_color = eg_object["DA_class_color"] || "#EBEDF6";
        thisDA_Nav._color_hash.set_color(DA_class_id, DA_class_color);
        // add sub label to display
        let DA_class_tag = eg_object.DA_class_tag;
        let DA_class_label = $("<li></li>")
                            .text(DA_class_tag)
                            .prepend($("<span></span>").css("background-color", DA_class_color));
        DA_class_label.appendTo(sub_label);
    });

    // display title
    let DA_display_tag = thisDA_Nav._DA_nav_tag ? "approaches: " + thisDA_Nav._DA_nav_tag.toLowerCase() : "approaches: dynamic approaches";
    let display_title = $("<h2></h2>").addClass("display-title")
                        .text(DA_display_tag + " (" + thisDA_Nav._DA_num + ")")
                        .prepend($("<span></span>").css("background-color", thisDA_Nav._DA_nav_color));
    
    // integrated display top
    let display_top = $("<div></div>").addClass("deck-reminder")
                        .css({
                            "top": document.querySelector("#card-display").getBoundingClientRect().top,
                            // "background-color": "white",
                            // "z-index": 500
                        })
                        .append(display_title)
                        .append($("<p></p>").addClass("display-desc").text(thisDA_Nav._DA_desc))
                        .append(sub_label);

    return display_top;
}

DA_Nav.prototype.DACreatingComplete = function() {
    // ......
    if(this._created <= 0) {
        this._created = new Date().getTime();
        this._interactionInit();
        return true;
    } else {
        console.warn(`DA tab & sticky top for "${this._DA_nav_tag}" have already been created before.`);
        return false;
    }
}

DA_Nav.prototype._interactionInit = function () {
    if(this._created) {
        this._DA_btn = document.querySelector(`.btn-primary-group > .${this.getJointTag()}`);
        this._sticky_top = document.querySelector(`#${this._DA_joint_tag} > .deck-reminder`);
        this._display_desc = this._sticky_top.querySelector(".display-desc");

        // record in/out of scroll Y position
        this._in_sticky = false;
        
        // bind event listeners
        this._topEventBinding();
        this._scrollEventBinding();
    }
}

DA_Nav.prototype._stickyToggle = function(option) {
    option = option || undefined;
    
    if(!this.hasOwnProperty("_in_sticky")) {
        console.log("Either sticky top or DA button has been deployed yet.");
        return false;
    } else if(option === undefined)
        this._in_sticky = !this._in_sticky;
    else if(option === true)
        this._in_sticky = true;
    else
        this._in_sticky = false;

    return true;
}

// listen to sticky top
DA_Nav.prototype._topEventBinding = function () {

    let thisDA_Nav = this;

    $(window).scroll(function(){
        // mark DA state
        if(parseInt(Math.round(window.scrollY)) === thisDA_Nav._sticky_top.offsetTop && !thisDA_Nav._isSticky()) {
            console.log("Yes! ", thisDA_Nav._DA_nav_tag);
            thisDA_Nav._stickyToggle(true);
        } else if(parseInt(Math.round(window.scrollY)) !== thisDA_Nav._sticky_top.offsetTop && thisDA_Nav._isSticky()) {
            console.log("No! ", thisDA_Nav._DA_nav_tag);
            thisDA_Nav._stickyToggle(false);
        }
    });
}

DA_Nav.prototype._isSticky = function() {
    return this._in_sticky;
}

// listen to scroll action
DA_Nav.prototype._scrollEventBinding = function () {

    

    return;
}

// create EL components
// x > 0 .active
// x < 0 :not(.active)
// x == 0 .disabled
function createDP(DP_doc, classStr) {
    classStr = "btn-secondary-group" + classStr.replace(" list-group", "");
    let btnClassStr = "text-left btn-block";
    if(classStr.indexOf("sm") > 0) {
        btnClassStr = "text-center";
    }

    let DP_Group = $("<div></div>").addClass(classStr);
    $("#filter-panel > .btn-panel").first().append(DP_Group);
    $.getJSON(DP_doc, function(json) {
        // create EL components
        $.each(json, function(i, item) {
            let DP_single = new DP_Tab(item);
            let { DP_primary_btn, DP_sub_ul } = DP_single.drawDP(btnClassStr);

            DP_Group.append(DP_primary_btn).append(DP_sub_ul);
            DP_single.DPCreatingComplete();
        });

    });
}


// construct DP_filter class
//     "DP_id": 1,
//     "DP_tag": "illustrate characteristic",
//     "DA_sub_tag": "Depict Reality, Exaggerate Reality"
function DP_Tab(DP_object) {
    this._created = 0;  // if displayed on screen: > 0, if not: 0

    this._DP_id = DP_object["DP_id"];
    this._DP_tag = DP_object["DP_tag"];

    let DP_sub_tag = DP_object["DP_sub_tag"].split(",");
    this._DP_sub_tags = DP_sub_tag.map(tag => tag = tag.trim());; // array
}

// Public method 
DP_Tab.prototype.drawDP = function(btnClassStr) {
    btnClassStr = btnClassStr || "text-left btn-block";
    let DP_sub_ul = $("<ul></ul>").addClass("btn-sub-list");
    let DP_sub_tags = this._DP_sub_tags;
    let DP_primary_btn = $("<button></button>")
                            .addClass("btn " + btnClassStr)
                            .addClass("active")
                            .text(this._DP_tag)
                            .prepend($("<span></span>"));

    DP_sub_tags.forEach(tag => {
        let DP_sub_li = $("<li></li>")
                        .addClass("active")
                        .attr("id", DP_Tab.DP_abr(tag))
                        .text(tag);

        DP_sub_li.appendTo(DP_sub_ul);
    });

    return { DP_primary_btn, DP_sub_ul };
}

// Public method
DP_Tab.prototype.DPCreatingComplete = function() {
    if(this._created <= 0) {
        this._created = new Date().getTime();
        this._interactionInit();
        return true;
    } else {
        console.warn(`DP tab ${this._DP_id} has already been created before.`);
        return false;
    }
}

// Private method
DP_Tab.prototype._DP_abr_list = function() {
    let DP_sub_tags = this._DP_sub_tags || [];
    let DP_abr_list = [];
    DP_sub_tags.forEach(tag => {
        tag = tag.toLowerCase() || "dynamic purpose";
        let tag_abr = tag.substr(0, 2) + (tag.split(/-|\s/)).length + tag.substr(tag.length-2);
        DP_abr_list.push(tag_abr);
    });

    return DP_abr_list;
}

// Private method
DP_Tab.prototype._interactionInit = function() {
    if(this._created) {
        this._DP_primary_btn = document.querySelectorAll(".btn-secondary-group > .btn")[this._DP_id-1];
        this._DP_sub_ul = document.querySelectorAll(".btn-secondary-group > .btn-sub-list")[this._DP_id-1];
        this._DP_sub_li = this._DP_sub_ul.querySelectorAll("li"); // NodeList object
        
        // bind event listener
        this._eventBinding();
    }
}

// Private method
DP_Tab.prototype._eventBinding = function() {

    let thisDPTag = this;
    let DP_abr_list = thisDPTag._DP_abr_list();
    let DP_sub_ul = thisDPTag._DP_sub_ul;
    let DP_sub_li = thisDPTag._DP_sub_li;

    // bind hide/visible event to sub buttons
    thisDPTag._DP_sub_li.forEach(li => {
        let this_DP_abr = li.getAttribute("id");
        li.addEventListener("click", function() {
            let targetCards;
            if(this.classList.contains("active")) {
                this.classList.toggle("active", false);
                targetCards = document.querySelectorAll(`.${this_DP_abr}:not(.screened-out)`);
                targetCards.forEach(node => {
                    node.classList.add("screened-out");
                    $(targetCards).fadeTo(400, 0).hide(1, () => {
                        if(node.querySelector(".card-inner").classList.contains("trans-3d"))
                            node.querySelector(".card-inner").classList.remove("trans-3d");
                    });
                });
                
            } else {
                this.classList.toggle("active", true);
                targetCards = document.querySelectorAll(`.${this_DP_abr}.screened-out`);
                targetCards.forEach(node => node.classList.remove("screened-out"));
                $(targetCards).show(1).fadeTo(600, 1);
            }
        });
    });

    // bind hide/visible event to primary buttons
    thisDPTag._DP_primary_btn.addEventListener("click", function () {
        let targetCards, this_joint_DP_abr;
        if(this.classList.contains("active")){
            this.classList.toggle("active", false);
            DP_sub_li.forEach(li => li.classList.toggle("active", false));

            this_joint_DP_abr = DP_abr_list.map(DP_abr => "." + DP_abr + ":not(.screened-out)").join(",");
            targetCards = document.querySelectorAll(this_joint_DP_abr);

            $(DP_sub_li).slideToggle(160 + 120 * (DP_sub_li.length/1.75), "easeInOutSine");
            targetCards.forEach(node => {
                node.classList.add("screened-out");
                $(node).fadeTo(400, 0).hide(1, () => {
                    if(node.querySelector(".card-inner").classList.contains("trans-3d"))
                        node.querySelector(".card-inner").classList.remove("trans-3d");
                });
            });

        } else {
            this.classList.toggle("active", true);
            DP_sub_li.forEach(li => li.classList.toggle("active", true));

            this_joint_DP_abr = DP_abr_list.map(DP_abr => "." + DP_abr + ".screened-out").join(",");
            targetCards = document.querySelectorAll(this_joint_DP_abr);

            $(DP_sub_li).slideToggle(160 + 160 * (DP_sub_li.length/1.75), "easeInOutSine");
            targetCards.forEach(node => node.classList.remove("screened-out"));
            $(targetCards).show(1).fadeTo(600, 1);
        }
    })

    // $(DP_sub_ul).slideToggle(140 + 120 * (DP_sub_btn.length/1.75), function() {
    //     $(DP_btn).toggleClass("active");
    // });
}

// Static method
DP_Tab.DP_abr = function(str) {
    str = str.toLowerCase() || "dynamic purpose";
    return str.substr(0, 2) + (str.split(/-|\s/)).length + str.substr(str.length-2);
}


//create card display
// void return
function createDisplay(cards_doc) {
    console.log('start loading cards');
    $.getJSON(cards_doc, function(json) {

        let doc_length = cards_doc.length;
        $.each(json, function(id, card_doc) {

            let card_DA = card_doc.DA_nav_tag.toLowerCase();
            let card_DA_joint = $.trim(card_DA).split(" ").join("_");
            let card = new AIE_Card(card_doc);
            
            $(`#${card_DA_joint} > .card-deck`).append(card.drawCard());
            card.cardCreatingComplete();

            if(id == doc_length)
                console.log("All cards are loaded.");
        });
    });

    // deckDisplay();
    scrollToTop();
}


// construct card class
// input card_object:Object()
// card_id	card_title	DA_nav_tag	DA_class_id	DA_class_tag	DA_desc	DP_tag	DP_sub_tag	DP_desc	eg_arr
function AIE_Card(card_object) {

    this._created = 0; // if displayed on screen: > 0, if not: 0
    this._current_eg_id = 0; // value range: 0, 1, 2

    this._card_id = card_object.card_id || 0;
    this._card_title = card_object.card_title || "Design Space";

    this._DA_nav_id = card_object.card_id || 0;
    this._DA_nav_tag = card_object.DA_nav_tag || "dynamic approaches tag";
    this._DA_class_id = card_object.DA_class_id || 500;
    this._DA_class_tag = card_object.DA_class_tag || "dynamic approaches sub tag";
    this._DA_desc = card_object.DA_desc || "Approach Interpretation";
    // this.DA_nav_color = this._colorSync(this.DA_class_id, DA_color_hash);

    this._DP_tag = card_object.DP_tag || "dynamic purposes";
    this._DP_sub_id =  card_object.DP_sub_tag.substr(0, 2).trim() || "00";
    this._DP_sub_tag = card_object.DP_sub_tag.substr(3).trim() || "Dynamic Purposes Sub Tag";
    this._DP_desc = card_object.DP_desc || "Purpose Interpretation";
    // this.DP_code = this._DP_abr(DP_sub_tag);

    this._eg_arr = card_object.eg_arr || [{"eg_id":"1000", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Mr. Designer", "eg_url":"https://www.dribbble.com"},{"eg_id":"1001", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Miss Designer", "eg_url":"https://www.dribbble.com"},{"eg_id":"1002", "eg_source":"Video.com", "eg_year":"2020", "eg_designer":"Ms. Designer", "eg_url":"https://www.dribbble.com"}];

    this._color_hash = DA_Nav.ColorHash.init();
    this._card_color  = this._color_hash.get_color(this._DA_class_id);
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
AIE_Card.prototype._DP_abr = function() {
    let str = this._DP_sub_tag.toLowerCase() || "dynamic purpose";
    return str.substr(0, 2) + (str.split(/-|\s/)).length + str.substr(str.length-2);
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
        this._Card = $(`[name='card_${this._card_id}']`).get(0);
        let CardFront = $(this._Card).find(".front").get(0);
        let CardBack = $(this._Card).find(".back").get(0);

        this._FrontGif = $(CardFront).find(".card-frontImg").get(0);
        // this._FrontTurningBtn = $(CardFront).find(".card-footer > .btn").get(0);
        
        this._BackCarousel = $(CardBack).find(".carousel").get(0);
        this._BackCaption = $(CardBack).find(".caption").get(0);
        // this._BackTurningBtn = $(CardBack).find(".card-footer > .btn").get(0);

        this._CarouselControlPrev = $(this._BackCarousel).find(".carousel-control-prev").get(0);
        this._CarouselControlNext = $(this._BackCarousel).find(".carousel-control-next").get(0);
        this._CarouselFullScreen = $(CardBack).find(".img-overlay").get(0);

        this._CardTurningBtns = $(this._Card).find(".card-footer > .btn");

        // bind event listener
        this._eventBinding();
    }
}

AIE_Card.prototype._eventBinding = function() {

    let thisCard = this; // data object
    let Card = thisCard._Card; // DOM object
    let CardInner = $(thisCard._Card).find(".card-inner").get(0);
    let modalWindowCarousel = $("#carouselModal").get(0); // carousel in modal frame
    let frontImg = $(thisCard._FrontGif).get(0);

    // bind with footer buttons
    $(thisCard._CardTurningBtns).click(function() {
        $(CardInner).toggleClass("trans-3d");
    });

    // bind with carousel
    $(thisCard._BackCarousel).on("slide.bs.carousel", function(event) {
        // event.direction = "left" / "right"
        let aim_eg_id = thisCard._carouselChangeId(event.direction);
        let aim_eg_info = thisCard._eg_arr[aim_eg_id];

        let aim_eg_designer = thisCard.__appendCaption("Designer", aim_eg_info["eg_designer"]);
        let aim_eg_year = thisCard.__appendCaption("Year", aim_eg_info["eg_year"]);
        let aim_eg_url = $("<a></a>").attr({"href": aim_eg_info["eg_url"], "target": "_blank"}).addClass("text-decoration-none").text("URL");
        
        let caption = thisCard._BackCaption;
        $(caption).fadeOut("fast", function() {
            $(caption).empty();
            $(caption)
            .append(aim_eg_designer)
            .append(aim_eg_year)
            .append($("<div></div>").append(aim_eg_url));
            $(caption).fadeIn("normal");
        });
    })

    // bind with modal window
    $(thisCard._CarouselFullScreen).on("click", function(event) {
        $(modalWindowCarousel).attr("data-provider", $(Card).attr("name"));
        let eg_info = thisCard._eg_arr;
        let current_eg_id = thisCard._current_eg_id;
        let carouselInner = $(modalWindowCarousel).find(".carousel-inner").get(0);
        $(carouselInner).empty();
        eg_info.forEach(function(eg, index, arr) {
            let gif_ori_path = `./assets/back_gif_compressed/back_${eg["eg_id"]}.gif`;
            let carouselImg = $("<img />")
                                .addClass("d-block")
                                .attr("src", gif_ori_path);

            let carouselItem = $("<div></div>").addClass("carousel-item").append(carouselImg);
            if(index === current_eg_id)
                carouselItem.addClass("active");

            carouselItem.appendTo(carouselInner);
        });
    });

    // bind with gif hover listener
    // const ffGif = new Freezeframe($(frontImg), {
    //     trigger: "hover",
    //     overlay: false,
    //     responsive: true,
    //     warnings: false
    // });

    // bind front img preview
    $(frontImg).hover(
        // hover in
        function() {
            $(frontImg).children(".front-prev").css("opacity", 0);
            $(frontImg).removeClass("inactive");
        },
        // hover out
        function() {
            let gif_path = $($(frontImg).children(".front-gif").get(0)).attr("src");
            $(frontImg).children(".front-prev").fadeTo("fast", 1, function() {
                $(frontImg).addClass("inactive");
                $($(frontImg).children(".front-gif").get(0)).attr( "src", gif_path );
            });
        }
    );

}

// Public method
// get carousel gif doc name array
// AIE_Card.prototype.getEgGifArray = function() {
//     let eg_gif_array = this._eg_arr.map(eg => {
//         let eg_id = eg["eg_id"] || 0;
//         return `back_${eg_id}.gif`;
//     });
//     return eg_gif_array;
// }

// Private method
// carousel backward/forward button response
// direction: right -> 1, left -> 0
AIE_Card.prototype._carouselChangeId = function(direction) {
    direction = direction || 1;
    // get current example ID
    let current_eg_id = this._current_eg_id;
    let eg_length = this._getEgLength();

    let aim_eg_id = current_eg_id;
    if(direction === "right")
        // prev_eg_id
        aim_eg_id = parseInt(((current_eg_id + eg_length - 1) % eg_length))
    else if(direction === "left")
        // next_eg_id
        aim_eg_id = parseInt((current_eg_id + 1) % eg_length);

    this._current_eg_id = aim_eg_id;
    //return a 'Map type' example
    return aim_eg_id; 
    // let aim_eg = this._eg_arr[aim_eg_id];

    // change caption info
    // ... ...
}


// *** CARD DRAWING PROCESS ***

// Public method
AIE_Card.prototype.drawCard = function() {

    let DP_code = this._DP_abr();
    let innerCard = $("<div></div>").addClass("card-inner")
                    .append(this._cardFront())
                    .append(this._cardBack());

    // return a single card element
    return $("<div></div>").addClass("col mb-5 position-relative")
            .addClass(DP_code)
            .attr("name", "card_" + this._card_id)
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
                        src: `./assets/front_gif_preview/front_${this._card_id}.gif`
                    });
    let front_gif_prev = $("<img />").addClass("card-img front-prev")
                        .attr({
                            // src: "assets/media/loading_light.svg",
                            // "data-echo": "assets/front_gif/front_" + card_id + ".gif",
                            // "onerror": "assets/media/fail_loading_light.svg"
                            src: `./assets/front_prev/static_${this._card_id}.jpg`
                        });
    // let prevImg = $("<img />").addClass("card-frontPrev")
    //     .attr({
    //         src: "assets/media/loading_light.svg",
    //         "data-target": "assets/front_gif_preview/front_" + card_id + ".png",
    //         "onerror": "assets/media/fail_loading_light.svg"
    //     });

    let front_card_img = $("<div></div>")
                        .addClass("card-frontImg inactive")
                        .append(front_gif)
                        .append(front_gif_prev);

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
    let back_gif_carousel = this.__cardBackCarousel(this._current_eg_id);
    let back_card_body = this.__cardBackBody(this._current_eg_id);
    let card_footer = this.__cardFooter(-1);

    // return card back part
    return back_elem
            .append(card_header)
            .append(back_gif_carousel)
            .append(back_card_body)
            .append(card_footer);
}

// Private method
AIE_Card.prototype.__cardHeader = function() {
    
    let DP_sub_tag = this._DP_sub_tag;
    let card_color = this._card_color;

    let header_elem = $("<div></div>").addClass("card-header");
    let head_title = $("<h4></h4>").text(this._card_title);
    let head_p = $("<p></p>").text(DP_sub_tag);

    // return card header
    return header_elem
            .css("background", card_color)
            .append(head_title)
            .append(head_p);
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

    if(x > 0 ) {
        card_footer_button.text("Examples");
        // let counter = $("<span></span>").addClass("card-num").text("NO. " + card_id);
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
    let approach_id = _prefixZero(this._DA_nav_id, 2);
    let approach_title = `Approach : ${approach_id} ${this._card_title}`;
    let purpose_id = _prefixZero(this._DP_sub_id, 2);
    let purpose_title = `Purpose : ${purpose_id} ${this._DP_sub_tag}`;

    front_body_elem.append(
        $("<div></div>").addClass("card-subtitle").text(approach_title)
    ).append(
        $("<p></p>").addClass("card-text").text(this._DA_desc)
    ).append(
        $("<div></div>").addClass("card-subtitle").text(purpose_title)
    )
    .append(
        $("<p></p>").addClass("card-text").text(this._DP_desc)
    );

    // return card front body
    return front_body_elem;
}

// Private method
AIE_Card.prototype.__cardBackBody = function(current_eg_id) {

    current_eg_id = current_eg_id || 0;
    let back_body_elem = $("<div></div>").addClass("card-body");
    let designer = this._eg_arr[current_eg_id]["eg_designer"] || "Mr. Designer";
    let year = this._eg_arr[current_eg_id]["eg_year"] || "2020";
    let url = this._eg_arr[current_eg_id]["eg_url"] || "https://www.dribbble.com";
    let super_link = $("<a></a>").attr({"href": url, "target": "_blank"}).addClass("text-decoration-none").text("URL");
    let caption = $("<div></div>").addClass("caption")
                .append(this.__appendCaption("Designer", designer))
                .append(this.__appendCaption("Year", year))
                .append($("<div></div>").append(super_link));
        
    // return card back body
    return back_body_elem.append(caption);
}


// *** CARD BACK DRAWING ***

// Private method
// current_eg_id -> start index : 0, 1, 2 ... ...
AIE_Card.prototype.__cardBackCarousel = function(current_eg_id) {

    current_eg_id = current_eg_id || 0;
    let back_img = $("<div></div>").addClass("card-img-box position-relative");

    let carousel = $("<div></div>")
                    .addClass("card-img carousel slide")
                    .attr({
                        "id": "eg-carousel-" + this._card_id,
                        "data-ride": "carousel",
                        "data-interval": "false"
                    });

    let cover = $("<div></div>")
                .addClass("img-cover")
                .append(
                    $("<div></div>").addClass("mask position-absolute")
                ).append(
                    $("<span></span>").addClass("img-overlay").attr("type", "button")
                );

    let carousel_inner = $("<div></div>").addClass("carousel-inner");
    this._eg_arr.forEach(function(eg, index, arr) {
        let eg_id = eg["eg_id"];
        // let eg_gif_path = `./assets/back_gif/back_${eg_id}.gif`;
        let eg_gif_path = `./assets/back_gif_compressed/back_${eg_id}.gif`;
        let carousel_item = $("<div></div>")
                            .addClass("carousel-item")
                            .append($("<img />").addClass("d-block").attr("src", eg_gif_path));

        if(index === current_eg_id)
            carousel_item.addClass("active");
        
        carousel_item.appendTo(carousel_inner);
    });
    carousel.append(carousel_inner);

    // direction: previous / next;
    let carousel_control = function(direction, card_id) {
        direction = direction.toLowerCase() || "next";
        let direc = direction.substr(0, 4);
        return $("<a></a>")
                .addClass("carousel-control-" + direc)
                .attr({
                    "href": "#eg-carousel-" + card_id,
                    "role": "button",
                    "data-slide": direc
                }).append(
                    $("<span></span>").addClass(`carousel-control-${direc}-icon`).attr("aria-hidden", "true")
                ).append(
                    $("<span></span>").addClass("sr-only").text(direction)
                );
    }

    let carousel_control_prev = carousel_control("previous", this._card_id);
    let carousel_control_next = carousel_control("next", this._card_id);

    // return all gif within one carousel
    return back_img.append(
            carousel.append(carousel_control_prev).append(carousel_control_next)
            ).append(cover);
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
function DP_filter() {

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
function DP_sub_filter() {

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
                    DP_fitting(); 
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
        DP_fitting();
        $(".to-show").fadeIn("normal", function(){
            $("#card-display > .to-show").removeClass("to-show");
        });
    }
    
    // NS_active_fitting();
}

// make DA fitting to display pattern
function DP_fitting() {
    if($("#card-display > div:visible").length === 0) {
        $(".btn-primary-group > .btn.active").removeClass("active");
        $(".btn-primary-group-sm > .btn.active").removeClass("active");
        $(".search-fail").fadeIn("normal");
    } else {
        $(".search-fail").css("display", "none");
    }
}

// avoid NS .disabled.active
function DA_active_fitting() {
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
function DA_scroller() {
    // var screenH = $(window).height() - $("#card-display").offset().top;
    var targetId = $(this).attr("href");
    var target = $(targetId).position().top + $("#card-display").height() - $("#card-display").outerHeight();
    // $(this).parent().find(".active").removeClass("active");
    // $(this).addClass("active");
    $('html, body').animate({scrollTop: target}, 800, "easeInOutQuart");
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

function searchFunc() {
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
        $.getJSON(card_doc, function(json) {

            const doc_length = json.length;
            let flag = false;

            //get to-be-hidden number array
            // $.ajaxSettings.async = false;
            $.each(json, function(i, item) {
                delete item.card_id;
                delete item.eg_arr;
                delete item.DA_class_id;
                
                let itemDoc = (Object.values(item)).join(" ");
                if(itemDoc.search(rex) > -1) {
                    show_list.push(`card_${i+1}`);
                }

                if(i === (doc_length-1)) {
                    flag = true;
                    console.log("Search finished");
                }
            });

            if(flag && (show_list.length > 0)) {
                console.log(`${show_list.length} results were found: `, show_list);
                show_list.forEach(card_name => $(`[name="${card_name}"]`).addClass("as-result"));
                $(".btn-sub-list:hidden").slideDown(function() {
                    $(".btn-secondary-group > .btn").addClass("active"); //activate DP
                    $(".btn-sub-list > li").addClass("active"); //activate DP
                });
                $("#card-display > div").fadeOut("normal", function() {

                    if($(this).is($("#card-display > div").last())) {
                        searchResultDisplay();
                    }

                    $(".search-result").text(`${show_list.length} result${show_list.length > 1 ? "s" : ""}`);
                });
            } else {
                console.log("Nothing found.");
                $("#card-display > div").fadeOut("normal", function() {
                    $(".search-fail").fadeIn("fast");
                    $(".card-deck > div").fadeOut("normal");
                })
                $(".search-result").text("0 result");
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
function searchResultDisplay() {

    $(".card-deck > div").css("display", "none");

    $(".card-deck > .as-result").each(function(index, elem) {
        let targetSet = $(elem).parentsUntil("#card-display");
        let NS_tag = $(targetSet[targetSet.length-1]).attr("id");

        $(".disabled." + NS_tag).removeClass("disabled");
        $(`#${NS_tag}:not(.as-result)`).addClass("as-result");
        $(elem).css("display", "block");
    });

    $("#card-display > .as-result").fadeIn("normal", function(){
        $("#card-display .as-result").removeClass("as-result");
        $("#card-display > div:hidden").each(function(index, NS_elem) {
            let NS_tag = $(NS_elem).attr("id");
            $("." + NS_tag).removeClass("active").addClass("disabled");
        });
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
//     $(".trans-3d").hide(1);
//     $.map(list, function(num) {
//         $(idString + " [name=\'card_" + num + "\']").show("fast"); 
//     });
//     $("#card-display > div").each(function(i, part) {
//         if($(part).find(".trans-3d:visible").length == 0) {
//             $(part).slideUp("fast");
//             $("." + $(part).attr("id") + ":not(disabled)").addClass("disabled");
//         } else {
//             $("." + $(part).attr("id")).removeClass("disabled");
//         }
//     });
//     $(".btn-primary-group a").removeClass("active");
//     $(".btn-primary-group a:not(.disabled):first-child").addClass("active");

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
}

// fill modal window info 
function modalInfo() {
    var untilMain = $(this).parentsUntil(".card-deck");
    var thisCard = $(untilMain[untilMain.length - 1]);
    // var bgColor = $(thisCard.find(".card-header")[0]).css("background");
    // var modalTitle = $(thisCard.find("h6")[0]).text();
    // var modalURL = $(thisCard.find("a")[0]).attr("href");
    var modalNum = $(thisCard).attr("name").substr(5);
    // var modalNum = $(thisCard.find(".card-num")[0]).text().substr(4);
    // var modalSource = $($(thisCard.find(".caption")[0]).children()[0]).text().replace("Source:", " - ");
    // $(".modal-content").css("background", bgColor);
    // $(".modal-title").text(modalTitle).attr("href", modalURL);
    // $(".modal-header > span").text(modalSource);
    // $(".modal-body > img").attr({
        // src: "assets/media/loading_light.svg",
        // "data-echo": "assets/back_gif/back_" + modalNum + ".gif",
        // "onerror": "assets/media/fail_loading_light.svg"
    //     src: "./assets/back_gif/" + modalNum + ".gif"
    // });
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
