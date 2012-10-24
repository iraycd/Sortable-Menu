
$("menuEditor").live('hover', function(){  
      
      $('#menuEditor').sortable({
        handle: '.menuTitle',
        cursor: 'hand',
        placeholder: 'ui-state-highlight-top',
        stop: function(e, ui){
              $("#nodeEdit").html(instructions); 
        }
      }).sortable("refresh").disableSelection();



    $(".all-sub-menu").sortable({
        connectWith: '.all-sub-menu',
        placeholder: 'ui-state-highlight-sub',
        dropOnEmpty: false,
        stop: function(e, ui){
              $("#nodeEdit").html(instructions); 
        }
    }).sortable( "refresh" ).disableSelection();      


function navClick(){
     $('div.menuTitle, div.s-menu-title').one('click', function(event){
         event.stopPropagation();
         var clickedId = $(this).parent().attr("id"); //id of clicked item
         $('div').removeClass("hLight");
         var clickedNode = event.target.nodeName; //item node name e.g DIV/UL
         
         if(clickedNode == 'DIV'){
            
             var clicked = $(event.target);  //the clicked item   
            var clickedText = clicked.text(); //clicked iten text e.g 'Home'
            clicked.addClass('hLight'); //add class to clicked item
            
            nodeEditor(clickedId, clickedText);
         }
         
         moveNodeUp();
         moveNodeDown();
         return false;   
     });
     
}
navClick();



});




function nodeEditor(clickedId, clickedText){
    
    var u = 'Up';
    var d = 'Down';
    var navUp = 'navUp';
    var navDown = 'navDown';
    if($("#"+clickedId).hasClass("p-menu")){
        u = 'Left';
        d = 'Right';
        navUp = 'navLeft';
        navDown = 'navRight';
    }
    
    var nodeEdit = '<a class="nodeUp '+navUp+'" id="nodeUp" name="'+clickedId+'" href="#">Move "'+clickedText+'" '+u+'</a><br>'; //add moveUp link to nodeEditor
    nodeEdit += '<a class="nodeDown '+navDown+'" id="nodeDown" name="'+clickedId+'" href="#">Move "'+clickedText+'" '+d+'</a><br>'; //add moveDown link to nodeEditor
    
    if($("#"+clickedId).hasClass("s-menu")){
        nodeEdit += '<a  class="navParent" id="topLevel" name="'+clickedId+'" href="#">Make "'+clickedText+'" a Parent</a><br>';
        var nodeEditMenu = $("#nodeEdit");  //nodeEditor DIV
        nodeEditMenu.html(nodeEdit); //add moveup/down links to node Editor
        makeParent(clickedId, clickedText); 
       
    }
    
    if($("#"+clickedId).hasClass("p-menu")){
        nodeEdit += '<span class="navChild">Make "'+clickedText+'" Child Of: </span>';
        nodeEdit += '<select id="parentNodes" size="1">';
        nodeEdit += '<option value="ps" selected="selected">-- Select Menu --</option>';
        $(".p-menu .menuTitle").each(function(){
            var t = $(this).text();
            var nId = $(this).parent().attr("id");
            if(nId != clickedId) {
                nodeEdit += '<option value="'+nId+'">'+t+'</option>';
            }
        });
        nodeEdit += '</select>';
        var nodeEditMenu = $("#nodeEdit");  //nodeEditor DIV
        nodeEditMenu.html(nodeEdit); //add moveup/down links to node Editor
        makeChild(clickedId, clickedText);
    }
    
     
};

function moveNodeUp(){
    $("#nodeEdit .nodeUp").on('click', function(){
         var n = $(this).attr("name");
         $("#"+n).prev().before($("#"+n)).sortable( "refreshPositions" );
         $("#"+n).click();
         return false; 
    });
};

function getOrder(){
    var menuOrder = new Array()
    var result = $('#menuEditor').sortable('toArray');
    menuOrder["main"] = result;
    for(i in result) {
        var res = $('#menuEditor #'+result[i]+' .all-sub-menu').sortable('toArray');
        menuOrder[result[i]] = res;
    }
    console.log(menuOrder);
    return false;
}

function moveNodeDown(){
    $("#nodeEdit .nodeDown").on('click', function(){
         var n = $(this).attr("name");
         $("#"+n).next().after($("#"+n)).sortable( "refreshPositions" );
         $("#"+n).click();
         return false; 
    });
};

function makeChild(clickedId, clickedText){
var parentNodes = $("#parentNodes");
parentNodes.change(function(){
    var subNodes = $("#"+clickedId).children("ul").children("li").length; //number of sub menu elements for the clicked parent
    if(subNodes == 1){
    console.log(clickedId+" ("+clickedText+") is being moved.");
    var moveToParent = $("#parentNodes option:selected").val();
    $("#"+clickedId).remove();
    var newNode = $('<li id="'+clickedId+'" class="s-menu"><div class="s-menu-title">'+clickedText+'</div></li>');
    newNode.insertBefore("#"+moveToParent+" .all-sub-menu .s-menu:last");
    $("#nodeEdit").html("");
    nodeEditor(clickedId, clickedText);
    moveNodeUp();
    moveNodeDown();
    } else {
        alert("A parent node can only be made a child node if it currently has no child nodes itself.");   
    }
});
return false; 
}
function makeParent(clickedId, clickedText){
    $("#topLevel").live('click', function(event){
        event.stopPropagation();
        var moveNode = $(this).attr("name"); //id of the node to be moved.
        $("#"+clickedId).remove();
        var newNode = $('<li id="'+clickedId+'" class="p-menu"><div class="menuTitle">'+clickedText+'</div><ul class="all-sub-menu"><li></li></ul></li>');
        newNode.insertAfter("#menuEditor .p-menu:last").hide().fadeIn("fast");
        $("#nodeEdit").html("");
        nodeEditor(clickedId, clickedText);
        moveNodeUp();
        moveNodeDown();
        return false;
    });
}
