// Data back Explorer

// import Freezeframe from 'freezeframe';

// prepare docs
var NS_doc = "assets/dist/js/NS_collection.json";
var card_doc = "assets/dist/js/card_collection.json";
// var EL_doc = [
//     {"EL_id":"0", "EL_tag":"Elements of Visualization"}, 
//     {"EL_id":"1", "EL_tag":"Elements added to Visualization"}, 
//     {"EL_id":"2", "EL_tag":"Camera"}, 
//     {"EL_id":"3", "EL_tag":"Timeline"}
// ];
var EL_doc = "assets/dist/js/EL_collection.json";

//create color hash list
var color_hash = {}; 

$(document).ready(function() {

    loadData(NS_doc, EL_doc, card_doc);
    setupInteraction();
});

// load two json documents and update the panel
function loadData(NS_doc, EL_doc, card_doc) {
    var classStr = panelLayout();

    // create NS navigator
    createNS(NS_doc, classStr);
    
    // create EL filter button group
    createEL(EL_doc, 1, classStr);    
    
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
    $(".nav-button").click(searchFunc);
    $(".form-control").bind('keydown', function(eve){  
    　　var keyCode = eve.which || arguments.callee.caller.arguments[0];  
    　　if (keyCode == 13) { searchFunc();}   //ignore space button
    });

    // activate NS navigator
    $(".btn-primary-group > .btn").click(NS_scroller);
    $(".btn-primary-group-sm > .btn").click(NS_scroller);

    // activate scroll spy
    $(window).scroll(displaySpy);
    //activate the first part
    $(".btn-primary-group > .btn").first().trigger("click"); 
    $(".btn-primary-group-sm > .btn").first().trigger("click");

    // activate EL filter button group
    $(".btn-secondary-group > .btn").click(EL_filter);
    $(".btn-secondary-group-sm > .btn").click(EL_filter);

    // image lazy loading
    // $(".modal-body").ImgLoading({timeout: 1000});

    // activate 3D transition buttons within cards
    $(".card-bottom > button").click(cardOver);

    // open new example tag
    $(".card-footer a").click(function(){
        window.open($(this).attr("href"));
    });

    // card footer url
    $(".card-footer a").tooltip({title: "Click to watch full video in a new window", placement: "top"});

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

    echo.init({
        offset: 0,
        throttle: 250,
        unload: false,
        callback: function(element, op) {
            var status = ($($(element).parent()[0]).attr("class") == "card-img-box" ? "back" : "front");

            if(op === 'load' && status === "front"){
                $(element).prev(".card-frontPrev")[0].src = $($(element).prev(".card-frontPrev")[0]).attr("data-target");
                $($(element).parent()[0]).hover(function(){
                    $($(this).children(".card-frontPrev")[0]).fadeOut(10);
                }, function() {
                    $($(this).children(".card-frontPrev")[0]).fadeIn(160);
                });
            }

            if(op === 'load' && status === "back") {
                $($(element).next()[0]).tooltip({title: "Click to zoom in", placement: "top"});
                $($(element).parents(".card-img-box")[0]).hover(fullScreenOver, fullScreenOut);
                return;
            } 
    
            if(op === 'load' && $($(element).parent()[0]).attr("class") !== "modal-body") {
                const logo = new Freezeframe($(element));
                return;
            }
            
            if(op === 'unload') {
                element.src = "assets/media/fail_loading_light.svg";
            }
        }

    });

    // const logo = new Freezeframe('.front > .card-img');
    // $(".front > .card-img").onload(function(){
    //     var parentsSet = $(this).parentsUntil(".card-deck");
    //     var name = $(parentsSet[parentsSet.length - 1]).attr("name");
    //     const logo = new Freezeframe("[name=\'" + name + "\'] .front > .card-img");
    //     const logo = new Freezeframe(this);
    // });

    // hover full-screen button on card image
    // $(".card-img-box").hover(fullScreenOver, fullScreenOut);
    // $(".img-overlay").tooltip({title: "Click to zoom in", placement: "top"});


    // toggle modal
    $(".img-overlay").click(modalInfo)
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
    $('#zooming-modal').on('show.bs.modal', function() {
        var img = new Image();
        img.src = $(".modal-body > img").attr("data-echo");
        $(img).on("load", function(){$(".modal-body > img").replaceWith(img);});
    });


    // abandon right mouse click.
    if (window.Event) {document.captureEvents(Event.MOUSEUP); }

    function nocontextmenu() {
        event.cancelBubble = true 
        event.returnValue = false; 

        return false; 
    } 

    function norightclick(e) { 
        if (window.Event) { 
        if (e.which == 2 || e.which == 3) 
            return false; 
        } else if (event.button == 2 || event.button == 3) { 
            event.cancelBubble = true 
            event.returnValue = false; 
            return false; 
        } 
    } 

    // for IE5+ 
    document.oncontextmenu = nocontextmenu; 
    // for all others 
    document.onmousedown = norightclick; 
}

// create NS components & display NS frame
function createNS(NS_doc, classStr) {
    // calc panel's position $ screen width measuring
    classStr = "btn-primary-group" + classStr;

    // create NS part
    var NS_Group = $("<div></div>").addClass(classStr)
        .attr("id", "display-scroll");
    $.ajaxSettings.async = false;
    $.getJSON(NS_doc, function (json) {
        $.each(json, function (i, item){
            let NS_tag = item.NS_tag.toLowerCase() || "narrative strategy";
            let NS_color = item.NS_color || "#505050";
            color_hash[NS_tag] = NS_color;      //create NS-color hash list
            let NS_num = item.NS_num || 0;
            let NS_desc = item.NS_desc || "Interpretation for Narrative strategy.";

            // color hash filling
            // color_hash[NS_tag] = NS_color; 

            // create spy panel

            var classString = "btn btn-block text-left";
            // if(i < 1) {classString = classString + " active";}

            NS_Group.append($("<a></a>").addClass(classString)
                .addClass(NS_tag)
                .text(NS_tag.replace(NS_tag[0], NS_tag[0].toUpperCase()) + " (" + NS_num +")")
                // .attr({type: "button", name: NS_tag})
                .attr({type: "button", href: "#" + NS_tag})
                .prepend($("<span></span>").addClass("btn-id").css("background-color", NS_color))
                .append($("<span></span>").addClass("btn-sign").css("background", NS_color)));

                
            // document.styleSheets[0].addRule('.btn-primary-group > .btn:nth-child(' + (i + 1) + '):before', 'background-color: ' + NS_color);   

            // create display part

            var currentDisplayPart = $("<div></div>").attr("id", NS_tag);  
            
            var display_title = $("<h2></h2>").addClass("display-title").text(NS_tag + " (" + NS_num + ")");
            display_title.prepend($("<span></span>").css("background-color", NS_color));
           
            currentDisplayPart.append(display_title)  // create display title
                .append($("<p></p>").addClass("display-desc").text(NS_desc)) // create display description
                .append($("<div></div>").addClass("card-deck"));  // create card deck

            // document.styleSheets[0].addRule('#' + NS_tag + ' > .display-title:before', 'background-color: ' + NS_color);
            currentDisplayPart.appendTo("#card-display");
        });

        // $("#card-display")
            // .append($("<p></p>").addClass("float-right").html("<a href=\"#\"><img src=\"assets/media/top.png\" style=\"width: 2.25rem; height: 2.25rem;\"></a>"))
            // .attr({"data-spy":"scroll", "data-target":"#display-scroll", "data-offset":182});
    });

    $("#filter-panel > .btn-panel").first().append(NS_Group);
}

// create EL components
// x > 0 .active
// x < 0 :not(.active)
// x == 0 .disabled
function createEL(EL_doc, x, classStr) {
    classStr = "btn-secondary-group" + classStr.replace(" list-group", "");
    var btnClassStr = " text-left btn-block";
    if(classStr.indexOf("sm") > 0) {
        btnClassStr = " text-center";
    }

    // EL_doc = EL_doc || [{"EL_id":"4", "EL_tag":"Editorial Layer"}];
    x = x || 1;

    $.ajaxSettings.async = false;
    $.getJSON(EL_doc, function(json) {
        // create EL components
        var EL_Group = $("<div></div>").addClass(classStr);
        $.each(json, function(i, item) {
            let EL_tag = item.EL_tag;
            let EL_code = EL_abr(item.EL_tag);

            EL_Group.append($("<button></button>").addClass("btn" + btnClassStr)
                .text(EL_tag)
                .prepend($("<span></span>"))
            );
            
            // document.styleSheets[0].addRule('.btn-secondary-group > .btn.' + EL_code + ':before', 'background-color: ' + 'url(assets\/media\/' + EL_code + '.svg) no-repeat');
            // document.styleSheets[0].addRule('.' + EL_code + ' .card-header > p:before', 'background-color: url(assets/media/in' + EL_code + '.svg) no-repeat');
        });
        $("#filter-panel > .btn-panel").last().append(EL_Group);
        
        // check NS situation
        if(x > 0) {
            $(".btn-secondary-group > .btn").addClass("active");
            $(".btn-secondary-group-sm > .btn").addClass("active");
        }
    });
}

//create card display
// void return
function createDisplay(cards_doc) {
    console.log('start loading cards');
    $.ajaxSettings.async = false;
    $.getJSON(cards_doc, function(json) {
        $.each(json, function(id, card) {
            let card_NS = card.NS_tag.toLowerCase().split(",");
            let front_info = {"how": card.how, "why": card.why};
            let back_caption = {
                "title":card.eg_title,
                "source":card.eg_source,
                "year":card.eg_year,
                "category":card.eg_category,
                "subcategory":card.eg_subcategory
            };

            $.map(card_NS, function(NS) {
                $("#" + $.trim(NS) + " > .card-deck").append(drawCard(card.card_id, colorSync(card_NS, color_hash), card.ds_tag.toLowerCase(), card.EL_tag.toLowerCase(), card.eg_url, front_info, back_caption));
                if(card.card_id == 43) {
                    console.log("last card is loaded.");
                }
            });
        });
    });

    // deckDisplay();
    scrollToTop();
}

// create a single card
function drawCard(card_id, card_color, ds_tag, EL_tag, url, front_info, back_caption) {
    
    card_id = card_id || 0;
    ds_tag = ds_tag || "design space";
    EL_tag = EL_tag || "element layer";
    url = url || "#";
    front_info = front_info || {"how":"Interpretation", "why":"Interpretation"};
    back_caption = back_caption || {"title":"back title", "source":"back source", "year":"Year", "category":"Category", "subcategory":"Subcategory", "url":"# back link"};;
    let EL_code = EL_abr(EL_tag);

    return $("<div></div>").addClass("col-xl-3 col-lg-4 col-sm-12 mb-5 trans-3d")
        .addClass(EL_code)
        .attr("name", "card_"+card_id)
        .append(drawCardFront(card_id, card_color, ds_tag, EL_tag, url, front_info))
        .append(drawCardBack(card_id, card_color, ds_tag, EL_tag, url, back_caption));
}

// create card front-page
function drawCardFront(card_id, card_color, ds_tag, EL_tag, url, front_info) {
    var frontElem = $("<div></div>").addClass("card shadow front");
    var card_header = drawCardHeader(ds_tag, EL_tag, card_color);
    var frontGif = $("<img />").addClass("card-img")
        .attr({
            src: "assets/media/loading_light.svg",
            "data-echo": "assets/front_gif/front_" + card_id + ".gif",
            "onerror": "assets/media/fail_loading_light.svg"
        });
    // var frontGif = $("<img />").attr("src", "assets/media/front_" + card_id + ".gif").addClass("card-img");
    var prevImg = $("<img />").addClass("card-frontPrev")
        .attr({
            src: "assets/media/loading_light.svg",
            "data-target": "assets/front_gif_preview/front_" + card_id + ".png",
            "onerror": "assets/media/fail_loading_light.svg"
        });

    var frontImg = $("<div></div>").addClass("card-frontImg").append(prevImg).append(frontGif);

    var card_body = drawCardBody(1, card_id, front_info);
    var card_footer = drawCardFooter(1, card_id, url);

    // frontElem.append(card_header).append(prevImg).append(frontGif).append(card_body).append(card_footer);
    frontElem.append(card_header).append(frontImg).append(card_body).append(card_footer);
    return frontElem;
}

// create card back-page
function drawCardBack(card_id, card_color, ds_tag, EL_tag, url, back_caption) {
    var backElem = $("<div></div>").addClass("card shadow back");
    var card_header = drawCardHeader(ds_tag, EL_tag, card_color);
    var back_gif = $("<img />").addClass("card-img")
        .attr({
            src: "assets/media/loading_light.svg",
            "data-echo": "assets/back_gif_compressed/back_" + card_id + ".gif",
            "onerror": "assets/media/fail_loading_light.svg"
        });
    var backGif = $("<div></div>").addClass("card-img-box")
        .css("position", "relative")
        .append(back_gif)
        .append($("<span></span>").addClass("img-overlay")
            .attr({
                "type": "button",
                "data-toggle": "modal",
                "data-target": "#zooming-modal"
            })
        );
    var card_body = drawCardBody(-1, card_id, null, back_caption);
    var card_footer = drawCardFooter(-1, card_id, url);

    backElem.append(card_header).append(backGif).append(card_body).append(card_footer);
    return backElem;
}

function drawCardHeader(ds_tag, EL_tag, card_color) {
    ds_tag = ds_tag.toLowerCase();
    EL_tag = EL_tag.toLowerCase();

    var headerElement = $("<div></div>").addClass("card-header");
    var headTitle = $("<h4></h4>").text(ds_tag.replace(ds_tag[0],ds_tag[0].toUpperCase()));
    var headP = $("<p></p>").text(EL_tag.replace(EL_tag[0],EL_tag[0].toUpperCase()));

    headerElement.append(headTitle)
        .append(headP)
        .css("background", card_color);
        // .append($("<span></span>").css({
        //     background: "url(assets/media/in" + EL_abr(EL_tag) + ".svg) no-repeat",
        //     "background-size": "cover"
        // }));

    return headerElement;
}

// x >= 0 means front page
// x <0 means back page
function drawCardBody(x, card_id, front_info, back_caption) {
    if(Object.prototype.toString.call(x) != "[object Number]"){
        return $("<div></div>").addClass("card-body").text("Failed to load.");}

    var bodyElement = $("<div></div>").addClass("card-body");
    if(x >= 0) {
        // front page 
        bodyElement.append($("<div>HOW</div>").addClass("card-subtitle"))
            .append($("<p></p>").addClass("card-text").text(front_info.how))
            .append($("<div>WHY</div>").addClass("card-subtitle"))
            .append($("<p></p>").addClass("card-text").text(front_info.why));
    } else {
        var caption = $("<div></div>").addClass("caption")
            .append(appendCaption("Source", back_caption.source))
            .append(appendCaption("Year", back_caption.year))
            .append(appendCaption("Category", back_caption.category))
            .append(appendCaption("Subcategory", back_caption.subcategory));
            // .append($("<a></a>").attr("href", back_caption.url).addClass("text-decoration-none").text("URL"));
            
        bodyElement.append("<h6>" + back_caption.title + "</h6>").append(caption);
    }

    return bodyElement;
}

// x >= 0 means front-page footer
// x <0 means back-page footer
function drawCardFooter(x, card_id, url) {
    var cardBottom = $("<div></div>").addClass("card-bottom");
    var button = $("<button></button>").addClass("btn btn-sm rounded-pill");

    if(x >= 0 ) {
        var counter = $("<span></span>").addClass("card-num").text("NO. " + card_id);
        button.text("Examples");
        cardBottom.append(counter).append(button);
    } else {
        var superLink = $("<a></a>").attr({"href": url, target: "_blank"}).addClass("text-decoration-none").text("URL");
        button.text("Back");
        cardBottom.append(superLink).append(button);
    }

    return cardBottom.addClass("card-footer");
}

function EL_abr(str) {
    str = str.toLowerCase() || "editorial layer";
    return str.substr(0, 2) + (str.split(" ")).length + str.substr(str.length-2);
}

// calc card header bg-color
function colorSync(NS_tag, hash_list) {
    NS_tag = NS_tag || ["narrative strategy"];
    hash_list = hash_list || {"narrative strategy":"#505050"};
    NS_arr = $.map(NS_tag, function(NS){
        NS = $.trim(NS);
        return hash_list[NS];
    });

    if(NS_arr.length == 1) {
        return NS_arr[0];
    }

    if(NS_arr.length == 2){
        return "transparent linear-gradient(90deg, " + NS_arr[0] + " 0%, " + NS_arr[0] + " 35%, " + NS_arr[1] + " 65% ," + NS_arr[1] + " 100%) 0% 0% no-repeat padding-box";
    }

    return "transparent linear-gradient(90deg, #706A91 0%, #706A91 25%, #CA5F5F 37%, #CA5F5F 62%, #E5897C 75%, #E5897C 100%) 0% 0% no-repeat padding-box";
}

function appendCaption(key, content) {
    return "<div><span>" + key + ": </span>" + content + "</div>";
}

//activate / inactivate EL filter
function EL_filter() {
    var EL_tag = EL_abr($(this).text().toLowerCase());
    if($(this).hasClass("active")){
        $(this).removeClass("active");
        $("#card-display ." + EL_tag).hide(300);
        setTimeout("scrollCheck(-1)", 300);   //check scroll panel
    } else {
        $(this).addClass("active");
        //check scroll panel
        $("#card-display ." + EL_tag).each(function(){
            var targetSet = $(this).parentsUntil("#card-display");
            var NS_tag = $(targetSet[targetSet.length-1]).attr("id");
            $(".disabled." + NS_tag).removeClass("disabled");
            $("#card-display ." + EL_tag).show(500);
            // setTimeout(function(){$("#card-display ." + EL_tag).show("slow");}, 300);
            $("#" + NS_tag + ":hidden").slideDown(420);

        });
    
        // setTimeout(function(){$("#card-display ." + EL_tag).show("fast"); console.log("oops");}, 300);
    }

    // turn back card
    $("#card-display .turned-over." + EL_tag + " > .front").css({"transform":"rotateY(0deg)"});
    $("#card-display .turned-over." + EL_tag + " > .back").css({"transform":"rotateY(-180deg)"});
    $("#card-display ." + EL_tag).removeClass("turned-over");

    // deckDisplay();
}

// check scroll panel and para descriptions
function scrollCheck(x) {
    $(".card-deck").each(function(){
        var NS_tag = $($(this).parent()[0]).attr("id");

        if(x < 0 && $(this).children('.trans-3d:visible').length == 0) {
            $("#" + NS_tag).slideUp("fast");
            $("." + NS_tag).addClass("disabled");
        } 
    });
    
    NS_active_fitting();
}

// avoid NS .disabled.active
function NS_active_fitting() {
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

//turn card over 3d-transition 
function cardOver() {
    var target = $(this).parentsUntil(".trans-3d").last();
    // turn over to back
    if(target.hasClass("front")) {
        target.css({"transform":"rotateY(180deg)"});
        var back = target.next(".back");
        back.css({"transform":"rotateY(0deg)"});
        target.parent(".trans-3d").addClass("turned-over");
    }
    // turn over to front
    if(target.hasClass("back")) {
        target.css({"transform":"rotateY(-180deg)"});
        var front = target.prev(".front");
        front.css({"transform":"rotateY(0deg)"});
        target.parent(".trans-3d").removeClass("turned-over");
    }
}


// NS buttons control #card-display
function NS_scroller() {
    // var screenH = $(window).height() - $("#card-display").offset().top;
    var targetId = $(this).attr("href");
    var target = $(targetId).position().top + $("#card-display").height() - $("#card-display").outerHeight();
    $(this).parent().find(".active").removeClass("active");
    $(this).addClass("active");
    $('html, body').animate({scrollTop: target}, 500, "easeInOutQuart");
}

// spy on display scrolling action
function displaySpy() {
    var screenH = $(window).height() - $("#card-display").offset().top; // if screen height is very limited - > bug $("#card-display").outerHeight() + $("#card-display").height();
    $("#card-display > div").each(function(i, item){
    var currentPosition = $(item).position().top - $(window).scrollTop();
        if($("." + $(item).attr("id")).is(":not(.active)") && (currentPosition < 0.5*screenH) && (($(item).height() + currentPosition) >= 0.5*screenH)) {
            $(".btn-primary-group > .btn.active").removeClass("active");
            $(".btn-primary-group > .btn:not(.disabled)." + $(item).attr("id")).addClass("active");
            $(".btn-primary-group-sm > .btn.active").removeClass("active");
            $(".btn-primary-group-sm > .btn:not(.disabled)." + $(item).attr("id")).addClass("active");
        }
    });
}

function searchFunc() {
    var show_list = new Array();
    console.log("Ready to search.");
    var read = $("input.form-control").val().toString() || "";
    readReg = read.replace(/[.,:;·'"\(\)\[\]\{\}\\\/\|]/g, " ").replace(/\s+/g, " ");
    readReg = $.each((readReg.split(" ")), function(item){return $.trim(item);});
    console.log(read);

    if(readReg.length > 0 && (readReg[0] != ("" | " "))) {

        // trigger NS button if name the same
        if(readReg.length === 1 && $($("#" + read.toLowerCase()).parent()[0]).attr("id") === "card-display") {

            $("#" + read.toLowerCase()).find(".trans-3d").each(function() {
                var num = ($(this).attr("name")).substr(5); 
                show_list.push(num);
            });
            deckDisplay(show_list, "#" + read.toLowerCase());
            console.log("Search finished");
            
        } else {

            //transform string to regexExp
            var rex = new RegExp(readReg.join("|"), "ig");
            // var show_list = [];
            // $.ajaxSettings.async = false;
            $.getJSON(card_doc, function(json) {

                //get to-be-hidden number array
                // $.ajaxSettings.async = false;
                $.each(json, function(i, item) {
                    delete item.eg_url;
                    var num = item.card_id;
                    item = (Object.values(item)).join(" ");
                    if(item.search(rex) >= 0) {show_list.push(num);}
                    if(i == 42) {console.log("Search finished");}
                });

            }).done(function() {
                deckDisplay(show_list);
            });
        }

    } else {
        $(".card-deck > div").show("slow");
        $("#card-display > div").slideDown("fast");
        $(".btn-primary-group > .btn").removeClass("disabled");
        $(".btn-primary-group-sm > .btn").removeClass("disabled");
    }

    scrollToTop();
}

// set filter panel
function panelLayout() {
    var bannerHeight = $("header").outerHeight();
    var panel = $("#filter-panel");
    panel.css({
        // "position": "sticky",
        // "overflow-y": "auto",
        // "z-index": 500,
        "top": bannerHeight
    });
    if($(window).outerWidth() >= 768) {
        panel.css("height", ($(window).outerHeight() - bannerHeight));
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
    // $("#card-display > div").each(function(i, part) {
    //     var cardDeck = $(part).find(".card-deck")[0];
    //     console.log("5 - " + $(part).attr("id") + " " + $(cardDeck).find(".trans-3d:visible").length);
    //     console.log("6 - ", ($(cardDeck).find(".trans-3d:visible").length == 0) && $(part).is(":visible"));
    //     if(($(cardDeck).children(".trans-3d:visible").length == 0) && $(part).is(":visible")) {
    //         console.log("7 - " + $(part).attr("id") + " was hidden.");
    //         $(part).slideUp("fast");
    //         $("." + $(part).attr("id")).removeClass("active").addClass("disabled");
    //         return ;
    //     }
        
    //     console.log("8 - ", ($(cardDeck).find(".trans-3d:visible").length > 0) && $(part).is(":hidden"));
    //     if(($(cardDeck).find(".trans-3d:visible").length > 0) && $(part).is(":hidden")) {
    //         console.log("9 - " + $(part).attr("id") + " was shown.");
    //         $(part).slideDown();
    //         $("." + $(part).attr("id")).removeClass("disabled");
    //         return ;
    //     }
    // });

    $("#card-display > div").slideDown(1);
    $(".trans-3d").hide(1);
    $.map(list, function(num) {
        $(idString + " [name=\'card_" + num + "\']").show("fast"); 
    });
    $("#card-display > div").each(function(i, part) {
        if($(part).find(".trans-3d:visible").length == 0) {
            $(part).slideUp("fast");
            $("." + $(part).attr("id") + ":not(disabled)").addClass("disabled");
        } else {
            $("." + $(part).attr("id")).removeClass("disabled");
        }
    });
    $(".btn-primary-group a").removeClass("active");
    $(".btn-primary-group a:not(.disabled):first-child").addClass("active");

}


// fade in full-screen button
function fullScreenOver(){
    $($(this).children(".img-overlay")[0]).fadeIn(180);
}

// fade out full-screen button
function fullScreenOut() {
    $($(this).children(".img-overlay")[0]).fadeOut(240);
}

function scrollToTop() {
    $(".btn-primary-group > .btn").first().trigger("click");
}

// fill modal window info 
function modalInfo() {
    var untilMain = $(this).parentsUntil(".card-deck");
    var thisCard = $(untilMain[untilMain.length - 1]);
    var bgColor = $(thisCard.find(".card-header")[0]).css("background");
    var modalTitle = $(thisCard.find("h6")[0]).text();
    var modalURL = $(thisCard.find("a")[0]).attr("href");
    var modalNum = $(thisCard.find(".card-num")[0]).text().substr(4);
    // var modalSource = $($(thisCard.find(".caption")[0]).children()[0]).text().replace("Source:", " - ");
    $(".modal-content").css("background", bgColor);
    $(".modal-title").text(modalTitle).attr("href", modalURL);
    // $(".modal-header > span").text(modalSource);
    $(".modal-body > img").attr({
        src: "assets/media/loading_light.svg",
        "data-echo": "assets/back_gif/back_" + modalNum + ".gif",
        "onerror": "assets/media/fail_loading_light.svg"
    });
}


// action easing
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
