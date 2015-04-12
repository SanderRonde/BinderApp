var storage = chrome.storage.sync;
var val = "";
var theitems = [];
var tutoptions = 0;
var updateshit = 0;
var searchbindingsmode = 0;

var stored = "";
//Define storage

//Set to legit dimensions
var ca = chrome.app.window.current();
if (ca.getBounds().width !== 500 || ca.getBounds().height !== 100)
{
	ca.resizeTo(500,100);
}

//Do this quickly to prevent it looking weird because it waits 250ms
chrome.storage.sync.get("supasearch",function(items)
{
	if (items.supasearch == "yes")
	{
		$("#maininput").attr("size","56");
		$("#submitbutton").css("display","none");
	}
});

//Fix font size
storage.get(function (items) {
    if (items.fontsize) {
        if (items.fontsize == "16px") {
            $("html").css("font-size", "16px");
        }
        if (items.fontsize == "19px") {
            $("html").css("font-size", "19px");
        }
        if (items.fontsize.search("own") > -1) {
            //Custom font size
            var fontsizes = items.fontsize.split("own")[1];
            $("html").css("font-size", fontsizes);
        }
    }
    else {
        storage.set({ "fontsize": "19px" });
        $("html").css("font-size", "19px");
    }
});

//On very first run
storage.get("firstrun",function(items)
{

if (items.firstrun === undefined)
{
//First run
storage.set({"firstrun":"nope"});

//By clicking options, send to options page
tutoptions = 1;

var fa = chrome.app.window.current();
fa.resizeTo(700,755);

//Give some description of what this app is in the area where options normally is displayed
//First fix the top buttons
$("#closebutton").css("margin-left","680px");
   $("#minimizebutton").css("margin-left","660px");
   $("#helpbutton").css("margin-left","640px");
   $("#optionsbutton").css("margin-left", "620px");
   $("#fixedpart").css("background-color", "rgba(1,1,1,0)");

    //Make the HR less wide
   $("#thathr").css("width", "500px").css("margin-left", "0px");
   
    //Make the draggable area bigger
   $("#draggablearea").css("width", "700px");
   
   //Display the text
   $("#optionspart").html('<br><br><br><br><br><h1>Welcome to Binder</h1><br>Welcome to binder, this app lets you quickly acces a web site from your dekstop. One thing you can do bind this app to a keyboard shortcut, is to go to the chrome app launcher, and add this app as a desktop shortcut. Then right-click it and create a keyboard shortcut.<br>Now on to what this app does and how it can help you.<br>This app lets you open a specified web site after you enter a bit of text you assigned to it.<br>How does this work?<br>You open this app, and type in the word you bound to the web site and it will open the website for you. Additionally you can use "supasearch" to make the app immediately open the web site linked to the word you have in the input box, this removes the need for pressing enter or clicking the go button, but can cause some problems.<br>The problem will be that if you bind both "you" and "youtube", you can not get to "youtube" without triggering "you".<br><br>To configure these linked web sites, you can go to the options page. To get there you can click this button.<br><br>If you have any problems, click the help button (next to the options button) and hit reset to restore everything to the way it was on installing this app.<br><br><h1>Good luck</h1><br><button id="closethismessage">Close this message</button>')
   $("#optionspart").css("margin-left","5px").css("width","500").css("font-size","14px");

   //Background change
   $("body").css("background","url('Images/arrowbackgroundstuff.png')");
	
	//Take everything back to normal on clicking that button
	$("#closethismessage").click(function()
	{
		var fb = chrome.app.window.current();
		fb.resizeTo(500, 100);

	    //Make the HR less wide
		$("#thathr").css("width", "100%").css("margin-left", "0px");

	    //Make the draggable area bigger
		$("#draggablearea").css("width", "400px");
		
		//Fix title bar button again
		$("#closebutton").css("margin-left","480px");
		$("#minimizebutton").css("margin-left","460px");
		$("#helpbutton").css("margin-left","440px");
		$("#optionsbutton").css("margin-left","420px");
		
		//remove the text
		$("#optionspart").html('');
		$("#optionspart").css("margin-left", "0p").css("width", "100%").css("font-size", "16px");
		
		//Change BG back
		$("body").css("background-color","#3C92FF").css("background-image","none");
		
	});
	
}

});

var newtitlebarcolor = "";
var newhovercolor = "";


chrome.storage.sync.get("colors",function(items)
{
    if (items.colors !== undefined) {
        $("body").css("background-color", items.colors.bg);
        $("#helpconflict").css("background-color",items.colors.bg);

        if (tutoptions !== 1) {
            $(".fixedpart").css("background-color", items.colors.bg);
        }

        $("#topbar").css("background-color", items.colors.title);
        newtitlebarcolor = items.colors.title;
        newhovercolor = items.colors.hover;
        $(".binding").css("background-color", items.colors.inputs);
        $(".url").css("background-color", items.colors.inputs);
        $(".changableinput").css("background-color", items.colors.inputs);
    }
});


document.getElementById("maininput").focus();



//On close resize to prevent weird resize on startup
chrome.app.window.onClosed.addListener(function()
{
	var ca = chrome.app.window.current();
	ca.resizeTo(500,100);
});


storage.get(function(items)
{
	stored = items;
});

var looppreventer = 0;

 //Wait for stored to get finished
 setTimeout(function()
 {
 
 
 
 
  
//check if supasearch exists
if (stored.supasearch === undefined)
{
storage.set({"supasearch":"no"});
}

//Check if there is any data at all about any items
if (stored.binding === undefined)
{
	var aaa = [];
	aaa[0] = "example%123http://www.example.com";
	storage.set({"binding":aaa});
}

//Set this array to that data
theitems = stored.binding;

//On change, change storage var to keep the var in sync with the actual value
chrome.storage.onChanged.addListener(function()
{
storage.get(function(items)
{
	stored = items;
	theitems = stored.binding;
})
});

//If it's the first time
if (stored.firsttime === undefined)
         {
			var da = new Object();
			da.bg = "##3C92FF";
			da.title = "#FFFFFF";
			da.inputs = "#FFFFFF";
			
            //First time yo
			storage.set({"firsttime":"nop"});
			storage.set({"rows":"1"});
			storage.set({"supasearch":"no"});
			storage.set({"exitafter":"1"});
			storage.set({"colors":da});
}

var hidden = [];

if (stored.hidden === undefined)
{
    var hiddenitems = [];

    var hiddenvar = 0;
    while (stored.rows > hiddenvar) {
        hiddenitems[hiddenvar] = "";
        hiddenvar++;
    }

    storage.set({ "hidden": hiddenitems });

    hidden = hiddenitems;
}
else
{
    storage.get(function(items)
    {
        hidden = items.hidden;
    });
}
		 
chrome.storage.sync.get("colors",function(items)
{
    $("body").css("background-color", items.colors.bg);
    $("#helpconflict").css("background-color",items.colors.bg);

    if (tutoptions !== 1) {
        $(".fixedpart").css("background-color", items.colors.bg);
    }

	$("#topbar").css("background-color",items.colors.title);
	newtitlebarcolor = items.colors.title;
	newhovercolor = items.colors.hover;
	$(".binding").css("background-color",items.colors.inputs);
	$(".url").css("background-color",items.colors.inputs);
	$(".changableinput").css("background-color",items.colors.inputs);
});

var searching = 0;


//If supasearch is true, check on every key hit
chrome.storage.sync.get("supasearch",function(items)
{
	if (items.supasearch == "yes")
	{
		//Yep it's true, now do this stuff
		document.getElementById("maininput").onkeypress = function(e)
		{

		
			//Only go through if it's still on and searching is off
			if (stored.supasearch == "yes" && searching == 0)
			{
		
			if (event.which === 13)
			{
					$("body").animate({backgroundColor:"red"},700,function()
				{
					$("body").delay(3000).animate({backgroundColor:stored.colors.bg},700);
				});
			}
			else
			{
				var aa = document.getElementById("maininput").value;
				e = String.fromCharCode(e.charCode);
				aa = aa + e;
				
			
				var looploop = 0;
				var af = 0;
				var ab = 1;
				var ac = stored.rows;
				ac++;
				while (ac > ab)
				{
					var ag = parseInt(ab, 10) - 1;
					var ad = theitems[ag];
					var ae = [];
					ae = ad.split("%123");

					if (ae[1].search("%s") > -1 && ae[0] == aa) {
					    //Search function, change HTML first to fit search stuff
					    $("#textbeforeinput").html('Searching your site for: ');
					    $("#maininput").attr({ size: "40" });
					    $("#maininput").val('');
					    document.getElementById("wherethebuttongoes").innerHTML = ('<br><button id="dontsearchanymore">Quit Searching</button>');
					    searching = ae[1];

					    //Make enter also work for a submit
					    $("#maininput").keydown(function (e) {
					        e = e.which;
					        if (e === 13) {
					            if (searching !== 0) {

					                //Search using searching
					                var afa = $("#maininput").val();
					                console.log(afa);
					                afa = afa.replace(/ /g, "+");
					                console.log(afa);
					                afa = afa.replace(/&/g, "%26");
					                console.log(afa);
					                afa = searching.replace(/%s/g, afa);
					                console.log(afa);

					                window.open(afa, "_blank");
					                af = 1;

					                //Do the possible closing if selected
					                if (stored.exitafter == "1") {

					                    var ce = chrome.app.window.current();
					                    ce.resizeTo(500, 100);
					                    ce.close();

					                }
					                else {
					                    document.getElementById("maininput").value = "";
					                }

					            }
					        }
                            
					        if (e === 27) {
					            $("#textbeforeinput").html('Your Binding: ');
					            $("#maininput").attr({ size: "56" });
					            $("#maininput").val('');
					            document.getElementById("wherethebuttongoes").innerHTML = ('');
					            searching = 0;
					            $("#submitbutton").css("display", "none");
					            $("#submitbutton").unbind("click");
					        }

					    });
					            
					    //Display the submit button again
					    $("#submitbutton").css("display", "inline");
					    $("#submitbutton").click(function () {
					        //Search using searching
					        var afa = $("#maininput").val();
					        afa = searching.replace(/%s/g, afa);

					        window.open(afa, "_blank");
					        af = 1;

					        //Do the possible closing if selected
					        if (stored.exitafter == "1") {

					            var ce = chrome.app.window.current();
					            ce.resizeTo(500, 100);
					            ce.close();

					        }
					        else {
					            document.getElementById("maininput").value = "";
					        }
					    });


					    $("#dontsearchanymore").click(function () {
					        $("#textbeforeinput").html('Your Binding: ');
					        $("#maininput").attr({ size: "56" });
					        $("#maininput").val('');
					        document.getElementById("wherethebuttongoes").innerHTML = ('');
					        searching = 0;
					        $("#submitbutton").css("display", "none");
					        $("#submitbutton").unbind("click");
					        console.log("this");
					        $("#maininput").unbind("keydown");
					    });

                        //$("#maininput").

					    $("#maininput").focus();
                        
					    af = 2;

					    setTimeout(function () {
					        //Clear main input
					        $("#maininput").val('');
					    }, 10);
					}
					else {

					    if (ae[0] == aa && aa != "") {
					        if (ae[1].search(",") > -1) {
					            var allurls = ae[1].split(",");

					            var urlopeningvar = 0;
					            while (allurls.length > urlopeningvar) {
					                window.open(allurls[urlopeningvar], "_blank");
					                urlopeningvar++;
					            }
					            ac = ab;
					            af = 1;
					        }
					        else {

					            window.open(ae[1], "_blank");
					            ac = ab;
					            af = 1;
					        }
					    }

					    looploop++;

					    if (looploop == "50") {
					        console.log("infinite loop");
					        document.getElementById("maininput").value = "infinite loop detected, please hit help button and do a full reset";
					        ac = ab;
					        return false;
					    }

					}


				ab++;
				}
				
				if (af == 1 && stored.exitafter == "1")
				{
				var ce = chrome.app.window.current();
				ce.resizeTo(500,100);
				ce.close();
				}
				
		
			}
		}
		}
		//End of that stuff (going through if....)
		
	}
});
		 
     //On submit

function submitfunction()
{
	var aa = document.getElementById("maininput").value;
	var ab = 1;
	var ac = stored.rows;
	ac++;
	var af = 0;
	var looploop = 0;

	if (searching !== 0) {

	    //Search using searching
	    var afa = $("#maininput").val();
	    console.log(afa);
	    afa = afa.replace(/ /g, "+");
	    console.log(afa);
	    afa = afa.replace(/&/g, "%26");
	    console.log(afa);
	    afa = searching.replace(/%s/g, afa);
	    console.log(afa);

	    window.open(afa, "_blank");
	    af = 1;

	    //Do the possible closing if selected
	    if (stored.exitafter == "1") {

	        var ce = chrome.app.window.current();
	        ce.resizeTo(500, 100);
	        ce.close();

	    }
	    else {
	        document.getElementById("maininput").value = "";
	    }
	}
	else {


	    while (ac > ab) {
	        var ag = parseInt(ab, 10) - 1;
	        var ad = theitems[ag];
	        var ae = [];
	        ae = ad.split("%123");


	        if (ae[1].search("%s") > -1 && ae[0] == aa) {
	            //Search function, change HTML first to fit search stuff
	            $("#textbeforeinput").html('Searching your site for: ');
	            $("#maininput").attr({ size: "40" });
	            $("#maininput").val('');
	            document.getElementById("wherethebuttongoes").innerHTML = ('<br><button id="dontsearchanymore">Quit Searching</button>');
	            searching = ae[1];

	            $("#dontsearchanymore").click(function () {
	                $("#textbeforeinput").html('Your Binding: ');
	                $("#maininput").attr({ size: "50" });
	                $("#maininput").val('');
	                console.log("this one");
	                $("#maininput").unbind("keydown");
	                document.getElementById("wherethebuttongoes").innerHTML = ('');
	                searching = 0;
	            });

	            $("#maininput").focus();

	            af = 2;
	        }
	        else {

	            if (ae[0] == aa && aa != "") {
	                if (ae[1].search(",") > -1) {
	                    var allurls = ae[1].split(",");

	                    var urlopeningvar = 0;
	                    while (allurls.length > urlopeningvar) {
	                        window.open(allurls[urlopeningvar], "_blank");
	                        urlopeningvar++;
	                    }
	                    ac = ab;
	                    af = 1;
	                }
	                else {

	                    window.open(ae[1], "_blank");
	                    ac = ab;
	                    af = 1;
	                }
	            }

	            looploop++;

	            if (looploop == "50") {
	                console.log("infinite loop");
	                document.getElementById("maininput").value = "infinite loop detected, please hit help button and do a full reset";
	                ac = ab;
	                return false;
	            }
	        }

	        ab++;
	    }

	    //Make background flash red 
	    if (af == "0") {
	        console.log("this");
	        $("body").animate({ backgroundColor: "red" }, 700, function () {
	            $("body").delay(3000).animate({ backgroundColor: stored.colors.bg }, 700);
	        });
	        $(".fixedpart").animate({ backgroundColor: "red" }, 700, function () {
	            $(this).delay(3000).animate({ backgroundColor: stored.colors.bg }, 700);
	            console.log(stored.colors.bg);
	            console.log(stored);
	        });
	    }
	    else {
	        if (af == 2) {
	            af = 0;
	        }
	        else {
	            if (stored.exitafter == "1") {

	                var ce = chrome.app.window.current();
	                ce.resizeTo(500, 100);
	                ce.close();

	            }
	            else {
	                document.getElementById("maininput").value = "";
	            }
	        }
	    }
	}
};

$("#submitbutton").click(function()
{
submitfunction()
});
						
document.getElementById("maininput").onkeypress = function(e) {
    var ag = event.which;
													if (ag === 13)
													{
													    submitfunction();
													   													
													}
												};
							  
                             

document.getElementById("maininput").focus();

//Top bar hover and shit
$("#optionsbutton").mouseenter(function()
{
    $(this).stop().animate({ opacity: 1 });
});

$("#optionsbutton").mouseleave(function()
{
    $(this).stop().animate({ opacity: 0.6 });
});

$("#helpbutton").mouseenter(function()
{
    $(this).stop().animate({ opacity: 1 });
});

$("#helpbutton").mouseleave(function()
{
    $(this).stop().animate({ opacity: 0.6 });
});

$("#minimizebutton").mouseenter(function()
{
    $(this).stop().animate({ opacity: 1 });
});

$("#minimizebutton").mouseleave(function()
{
    $(this).stop().animate({ opacity: 0.6 });

});

$("#closebutton").mouseenter(function()
{
	$(this).animate({backgroundColor:"rgb(192, 0, 0)"},100);
});

$("#closebutton").mouseleave(function()
{
	$(this).animate({backgroundColor:"#FF5F5F"},100);
});
//End of top bar hovers

var helpon = 0;

//On clicking help button
$("#helpbutton").click(function()
{
	if (helpon === 0)
	{

	//Turn on overlay
	$("#overlay").css("display","block");
	$("#overlay").animate({opacity:"1"},200);
	
	$("#closehelp").click(function()
	{
		$("#overlay").animate({opacity:"0"},200,function()
		{
			$("#overlay").css("display","none");
		});
		helpon = 0;
	});
	
	helpon = 1;
	}
	else
	{
	$("#overlay").animate({opacity:"0"},200,function()
		{
			$("#overlay").css("display","none");
		});
		helpon = 0;
	}
});

//Reset everything & shit
$("#defaulteverything").click(function()
{
	storage.clear();
	var da = new Object();
			da.bg = "#3C92FF";
			da.title = "#FFFFFF";
			da.inputs = "#FFFFFF";
			
            //First time yo
			storage.set({"firsttime":"nop"});
			storage.set({"rows":"1"});
			storage.set({"supasearch":"no"});
			storage.set({"exitafter":"1"});
			storage.set({"colors":da});
			
	//Still not first time
	storage.set({"firstrun":"nope"});
			
	//Make bindings default again
	var aaa = [];
	aaa[0] = "example%123http://www.example.com";
	storage.set({"binding":aaa});
			
	//Hide options page
	$("#hidebutton").css("opacity","0");	
	 
	 
	$("#backbutton").css("display","none");
    $("#hidebutton").css("display","block");
    $("#hidebuttonhover").css("display","none");
	$("#hidebutton").css("display","none");
	var ce = chrome.app.window.current();
	ce.resizeTo(500,100);
	$("#optionspart").html('');
	
	//Fix title bar
	$("#closebutton").css("margin-left","480px");
	$("#minimizebutton").css("margin-left","460px");
	$("#helpbutton").css("margin-left","440px");
	$("#optionsbutton").css("margin-left","420px");
	
	//Fix title bar color
	$("#topbar").css("background-color","white");
	
	//Fix input bar
	$("#maininput").css("background-color","white");
	
	//Fix main body background ofcourse
	$("body").css("background-color","#3C92FF");
	
	//Fix button on title bar bg colors
	$("#optionsbutton").css("background-color","white");
	$("#helpbutton").css("background-color","white");
	$("#minimizebutton").css("background-color","white");
	
	//Change background color for some visual feedback
	$("#overlay").animate({backgroundColor:"green"},200).delay(500).animate({backgroundColor:"black"},200);
});

//On minimize
$("#minimizebutton").click(function()
{
	var cc = chrome.app.window.current();
	cc.minimize();
});

//On close
$("#closebutton").click(function()
{
    //Save the URL and shit

    //If options are not displayed, do this
    var aga = chrome.app.window.current();
    if (aga.getBounds().height !== 100) {
        var aca = 0;
        while (aca < stored.rows) {
            var acb = document.getElementById("binding" + aca).value;
            var acc = document.getElementById("url" + aca).value;
            
            theitems[aca] = acb + "%123" + acc;


            aca++;
        }

        storage.set({ "binding": theitems });
    }


	var cd = chrome.app.window.current();
	cd.resizeTo(500,100);
	cd.close();
});

$("#checkupdate").click(function () {
    setTimeout(function () {

        $("#optionspart").css("height", "700px");
        $("#mainoptions").css("height", "690px");
        $(".remove").css("display", "none");

    }, 150);
});

     //Options page
function displayoptions() {

    var y = 0;


    //Options page displaying
    var cf = chrome.app.window.current();

    //if it's already out, retract
    if (cf.getBounds().height !== 100 && tutoptions === 0) {

        if (updateshit === 1) {
        }
        else {

            $("#hidebutton").css("opacity", "0");


            $("#backbutton").css("display", "none");
            $("#hidebutton").css("display", "block");
            $("#hidebuttonhover").css("display", "none");
            $("#hidebutton").css("display", "none");
            var ce = chrome.app.window.current();
            ce.resizeTo(500, 100);
            $("#optionspart").html('');

            //Fix title bar
            $("#closebutton").css("margin-left", "480px");
            $("#minimizebutton").css("margin-left", "460px");
            $("#helpbutton").css("margin-left", "440px");
            $("#optionsbutton").css("margin-left", "420px");

            //Make the draggable area smaller
            $("#draggablearea").css("width", "400px");

            if (searchbindingsmode === 1) {
                if (stored.supasearch == "yes") {
                    $("#maininput").attr("size", "56");
                }
                else {
                    $("#maininput").attr("size", "50");
                }
            }

        }
    }
    else {
        //Else....

        //If they came from tutorial, first clear things up
        if (tutoptions === 1) {

            var fb = chrome.app.window.current();
            fb.resizeTo(500, 100);

            //Make the HR less wide
            $("#thathr").css("width", "100%");

            //Make the draggable area bigger
            $("#draggablearea").css("width", "400px");

            //Fix top BG color
            $("#fixedpart").css("background-color", "rgb(60, 146, 255)");

            //Fix title bar button again
            $("#closebutton").css("margin-left", "480px");
            $("#minimizebutton").css("margin-left", "460px");
            $("#helpbutton").css("margin-left", "440px");
            $("#optionsbutton").css("margin-left", "420px");

            //remove the text
            $("#optionspart").html('');
            $("#optionspart").css("margin-left", "0p").css("width", "100%").css("font-size", "16px");

            //Change BG back
            $("body").css("background-color", "#3C92FF").css("background-image", "none");

            tutoptions = 0;

        }


        var cd = chrome.app.window.current();
        cd.resizeTo(700, 700);

        //Change title bar to be legit
        $("#closebutton").css("margin-left", "680px");
        $("#minimizebutton").css("margin-left", "660px");
        $("#helpbutton").css("margin-left", "640px");
        $("#optionsbutton").css("margin-left", "620px");


        $("#backbutton").css("display", "inline");
        $("#hidebutton").css("display", "inline");
        $("#hidebutton").animate({ opacity: "1" });

        $("#backbutton").unbind("mouseover").unbind("mouseout");

        $("#backbutton").mouseenter(function () {
            if ($("body").css("height") != "50px") {

                $("#hidebutton").css("display", "none");
                $("#hidebuttonhover").css("display", "block");

            }
        });

        $("#backbutton").mouseleave(function () {
            if ($("body").css("height") != "50px") {

                $("#hidebutton").css("display", "block");
                $("#hidebuttonhover").css("display", "none");

            }
        });

        $("#backbutton").unbind("click");

        $("#backbutton").click(function () {
            //First save stuff before stuff's gone
            //Save the URL and shit
            var aca = 0;
            while (aca < stored.rows) {

                var acb = document.getElementById("binding" + aca).value;
                var acc = document.getElementById("url" + aca).value;

                theitems[aca] = acb + "%123" + acc;

                //Write
                storage.set({ "binding": theitems });

                aca++;
            }

            var ce = chrome.app.window.current();
            if (ce.getBounds().height !== 100) {



                $("#hidebutton").css("opacity", "0");
                $("#backbutton").css("display", "none");
                $("#hidebutton").css("display", "block");
                $("#hidebuttonhover").css("display", "none");
                $("#hidebutton").css("display", "none");
                var ce = chrome.app.window.current();
                ce.resizeTo(500, 100);
                $("#optionspart").html('');

                //Fix title bar
                $("#closebutton").css("margin-left", "480px");
                $("#minimizebutton").css("margin-left", "460px");
                $("#helpbutton").css("margin-left", "440px");
                $("#optionsbutton").css("margin-left", "420px");

                //Make the draggable area smaller
                $("#draggablearea").css("width", "400px");
            }

            if (searchbindingsmode === 1) {
                if (stored.supasearch == "yes") {
                    $("#maininput").attr("size", "56");
                }
                else {
                    $("#maininput").attr("size", "50");
                }
            }

        });

        //Change the draggable area size
        $("#draggablearea").css("width", "600px");

        //Write the actual options & shit

        $("#optionspart").html('<div class="scrollable" id="mainoptions"><div id="boomdiv" style="width:1010px;height:700px;margin-left:-10px;position:absolute;display:none;"><img width="1010" height="700" id="boomgif" src="Images/close.png"></div><div class="scrollable" id="helpconflict"><b>Get search bindings quickly and easily</b><div class="exitpage">&nbsp;Exit&nbsp;</div>Okay, here is how to do it and how it works.<br>First of all go to your search engines page in chrome. This can be done by rightclicking the omnibar and hitting "manage search engines". Then go ahead and just click on the area between "search engines" just to select that area. Then hit CTRL+A, then CTRL+C and paste it in the box below. Then hit start<br><br><textarea id="harvestsearchengines" rows="10" style="resize:none;" cols="119"></textarea><br><b>Warning:</b> Do not try to post what you just copied anywhere that can not handle huge amounts of text. Any text editor is fine, but if you paste it in the omnibar, chrome will crash. Simply clear your clipboard when you are done pasting by just copying something else.<br><b>Other Warning:</b> It may take approx 1-2 seconds before the finding search engines is done, dont worry, just wait a sec<br><br><button id="startharvesting">Start</button><br><br><br><div id="whereallthesethingsgo"></div><div class="exitpage">&nbsp;Exit&nbsp; </div><br><br></div>\
<br><h1><b>Options for Binder</b></h1><br><br>Use the left row of boxes to choose the Binding you want to be linked to a url, use the right row to choose the<br> url you want it to link to, if you put a comma between the URLs you can open multiple URls with one binding. Below are some options for Binder.<br> Changes will automatically be saved and URLs missing <b>http://www.</b> or <b>www.</b> will have a warning around them and allow you to fix it. You can also hide the warning for as long as the URL stays the same. So in case your URL does not need www. the message will not be shown if you leave the URL the same.<br><br><b>Notice</b>: If your settings are not saved, this is due to you exceeding the max write operations per hour for the chrome.storage API. The way to fix this is to wait an hour and do it again. Your bindings that are saved will continue to work in the meantime and as long as you do not close the app it should work even with your non-saved items. The maximum is 1000 write operations per hour which is a lot, but every keypress in either the URL input box or the Binding input box equals one write operation.<br><br>Change the background-color of the options page and the page above (the actual input and stuff). <input id="colorpickerone"><br><br>Change the color of the title bar (the bar with the options, close etc button).<input id="colorpickertwo"><br><br>Change the colors of the inputs (main input and options input)<input id="colorpickerfour"><br><br><input type="checkbox" id="supasearch">Supasearch will already send you to the matching URL even if you have not hit enter yet or pressed the <br>button.<br><br><input type="checkbox" id="closeafter">Close the binder app after succesfully opening a new window. Defaults to true. Turn this off to leave Binder on minimized but with a cleared input box.<br>\
<br><div id="wheretherowsgo"></div><br><br><button id="addrows">Add one empty row</button><br><br>\
<hr><h1>Standard Bindings</h1><br>Here are some standard bindings to get you started. Simply click them to add them as the last binding.<br><br><button style="width:80px;" id="youtubestandard">Youtube</button>http://www.youtube.com<br><button style="width:80px;" id="googlestandard">Google</button>http://www.google.com<br><button style="width:80px;" id="wikipediastandard">Wikipedia</button>http://www.wikipedia.org<br><button style="width:80px;" id="facebookstandard">Facebook</button>http://www.facebook.com<br><button style="width:80px;" id="twitterstandard">Twitter</button>http://www.twitter.com<br><button style="width:80px;" id="hotmailstandard">Hotmail</button>http://www.hotmail.com<br><button style="width:80px;" id="gmailstandard">Gmail</button>http://www.gmail.com<br><br>\
<hr><br><h1>Search Bindings</h1><br>You can also use search bindings, these allow you to search websites directly from your desktop. Simply add a search url, and when you trigger it, binder will change its input area to an area where you can enter what you want to search for. Then simply press enter and there you go. Below are some preset search bindings to get you started. Click the button to add them. If you want to search other sites than those in the presets, follow the tutorial below it.<br><br><button id="googlesearch">googlesearch</button>Search Google<br><button id="youtubesearch">youtubesearch</button>Search Youtube<br><button id="wikipediasearch">wikipediasearch</button>Search Wikipedia<br>Pro tip: follow the instructions below to find a wikipedia search for your language.<br><br><b>How to add your own search Binding</b><br><br>Click this button to get search engines quickly and easily, this will show you all search engines currently stored in your chrome, which is basically any site you visited that has a search function.<br><br><button id="getsearchenginesyo">Find Search Engines</button><br><br>Furthermore there are two other ways to do this, the easy way, or the hard way. <br><br><b>The easy way:</b><br><br>Go to chrome, and go to your settings, then go to <b>manage search engines</b>. In this list, search the site you want to search and get the URL in the box to the right. Paste this URL in a URL field in the Binder settings and you are done.<br><br><b>The hard way</b><br><br>If you can not find the site you want to search in this list, there is a different way to do it, but it is a bit harder and more annoying.<br>Go to the site and search for something. Then get the URL and replace the word you searched for with %s.<br>Example:<br><br>you searched for "example" on google. This gives you this URL: http://www.google.com/search?q=example. <br><br>Now go ahead and replace the word you searched for (in this case "example") with %s.<br>This gives:<br><br>http:/wwww.google.com/search?q=%s.<br>Now put this in the URL box in Binder and you are done.<br><br>\
<hr><br><h1>Importing or exporting settings</h1><br>If you are on a different computer, you might still want to have the same settings. To easily sync this between computers, hit the export button below and paste it into the import box of a different computer. If you want to import something, simply paste the export code of the other computer into the import box and hit import.<br>Chrome should also sync any settings as long as you log into your google account on the new computer.<br><br><textarea id="exportfield" style="resize:none;" cols="50" rows="7"></textarea><br><button id="exportbutton">Export</button><br><br><b>Importing from other binder apps or binder extensions</b><br><textarea id="importfield" cols="50" rows="7" style="resize:none;"></textarea><br><button id="importbutton">Import</button><input type="checkbox" id="fromotherbinder">Enable this if you are importing from the other version of Binder (the non-app one).<br><br><b>Downloading and installing bindings from the website</b><br>Click <a style="color:white;" href="//HIERZO//VERVANGEN" target="_blank">here</a> to go to the website.<br><textarea id="importfromsite" cols="50" rows="7" style="resize:none;"></textarea><br><button id="importfromsitebutton">import</button><br><span id="resultspan" style="display:none;"></span><br>\
<hr><br><h1>Create a keyboard shortcut to Binder</h1><br>You can create a keyboard shortcut to Binder to launch it a lot faster. Here is how to do it:<br><br>1. Go to the new tab page in chrome, and rightclick Binder.<br>2. Hit Create shortcuts and check "Desktop".<br>3. Go to the shortcut on your desktop and rightclick it. Then go to properties.<br>4. Go to the shortcut tab if you are not already there, then click the shortcut box and type in the shortcut you want. <b>tip:</b> Go to <a href="http://en.wikipedia.org/wiki/Table_of_keyboard_shortcuts" target="_blank">this wikipedia article</a> to see if the shortcut you want is already taken.<br>5. Hit OK and you are done. Be sure not to delete the shortcut on the dekstop or the keyboard shortcut will go away.<br><br>\
<hr><br><h1>Suggestions, ideas, bugs</h1><br><a id="fonts"></a>If you have any suggestions, ideas or bugs, you can email me at <a target="_blank" href="mailto:awsdfgvhbjn@gmail.com">awsdfgvhbjn@gmail.com</a>.<br><br><hr><br><h1>Font Size</h1><br>\
If you want you can change the font size, you can do that here. This is designed for if the current font-size, will not fit the screen properly. If you can not see the white line at the bottom of the main page (without options expanded), then your font size works. If, however the "hide binder settings" button is touching the input bar with options expanded, this means the font is too large. For some reason on some computers (including mine) the font-size 16px will work normally, but on most 19px only works. So here you can choose from either 16px or 19px or a custom size if that still does not do it.<br><br><input type="radio" id="16" name="fontsize">16px<br><input type="radio" id="19" name="fontsize">19px<br><input type="radio" id="own" name="fontsize"><input min="11" max="25" type="number" id="ownfontsize" placeholder="Choose" disabled>px<br><br><br><hr><h1><a id="bottom">Changelog</a></h1><br>This is the changelog, starting at version 1.1 since that is when I implemented it.\
<br><br><b>1.1</b><br><ul>\
<li>Fixed a bug that made you search for %s on a website after just switching on supasearch</li><li>Added the changelog</li><li>Added an (Old) Binder to Binder App importing thing.</li></ul>\
<br><b>1.2</b><br><ul>\
<li>Fixed a bug where clicking Gmail linked the wrong URL</li><li>Added the search harvesting thingy</li></ul>\
<br><b>1.2.1</b><br><ul>\
<li>Fixed a long-time bug (from the launch) that caused the wrong font-size, the problem was that on my main PC, i do get the right font-size when i use 16px, yet on other computers, only 19px will do it. If you have the same thing as me (namely that this new font-size is too large) or if you just want the font to be a bit larger, click <a href="#fonts">here</a> to change it.</li></ul>\
<br><hr><br class="remove"><br class="remove"></div>');

        //Do the font-size shizzl
        if (stored.fontsize === undefined) {
            storage.set({ "fontsize": "19px" });
        }

        setTimeout(function () {

            if (stored.fontsize == "16px") {
                $("#16").attr("checked", "true");
            }
            else {

                if (stored.fontsize == "19px") {
                    $("#19").attr("checked", "true");
                }
                else {

                    $("#own").attr("checked", "true");
                    $("#ownfontsize").removeAttr("disabled").val(stored.fontsize.split("px")[0].split("own")[1]).keydown(function (e) {

                        var originalvalue = $(this).val();

                        if ((event.which > 47 && event.which < 58) || (event.which > 95 && event.which < 106) || event.which === 8) {
                        }
                        else {
                            setTimeout(function () {
                                $("#ownfontsize").val(originalvalue);
                            }, 5);
                        }
                    });

                }
            }

        }, 250);

        $("#16").click(function () {
            storage.set({ "fontsize": "16px" });
            $("#ownfontsize").attr("disabled", "");
            $("html").css("font-size", "16px");
        });

        $("#19").click(function () {
            storage.set({ "fontsize": "19px" });
            $("#ownfontsize").attr("disabled", "");
            $("html").css("font-size", "19px");
        });

        $("#own").click(function () {
            storage.set({ "fontsize": "own19px" });
            $("#ownfontsize").removeAttr("disabled").val("19").keydown(function (e) {

                var originalvalue = $(this).val();

                if ((event.which > 47 && event.which < 58) || (event.which > 95 && event.which < 106) || event.which === 8) {
                }
                else {
                    setTimeout(function () {
                        $("#ownfontsize").val(originalvalue);
                    }, 5);
                }

            }).focusout(function () {
                storage.set({ "fontsize": "own" + $("#ownfontsize").val() + "px" });
                $("html").css("font-size", $("#ownfontsize").val() + "px");
            });
        });


        $("#helpconflict").css("background-color", stored.colors.bg);

        $("#getsearchenginesyo").click(function()
        {
            searchbindingsmode = 1;

            var ce = chrome.app.window.current();
            ce.resizeTo(1000, 700);

            $("#helpconflict").css("opacity", "0").css("display", "block").animate({ opacity: 1 });

            //Fix the top thingys again
            $("#closebutton").css("margin-left", "980px");
            $("#minimizebutton").css("margin-left", "960px");
            $("#helpbutton").css("margin-left", "940px");
            $("#optionsbutton").css("margin-left", "920px");

            //Fix main bar
            if (stored.supasearch == "yes") {
                $("#maininput").attr("size", "100");
            }
            else {
                $("#maininput").attr("size", "95");
            }

            //increase draggable area size
            $("#draggablearea").css("width", "900px");

        });

        $(".exitpage").mouseenter(function () {
            $(this).stop().animate({ backgroundColor: "rgb(107, 0, 0)" });
        }).mouseleave(function () {
            $(this).stop().animate({ backgroundColor: "red" });
        }).click(function () {

            $("#helpconflict").animate({ opacity: 0 }, function () {
                $(this).css("display", "none");
            });

            var ce = chrome.app.window.current();
            ce.resizeTo(700, 700);

            if (stored.supasearch == "yes") {
                $("#maininput").attr("size", "56");
            }
            else {
                $("#maininput").attr("size", "50");
            }

            $("#draggablearea").css("width", "600px");
            $("#optionsbutton").css("margin-left", "620px");
            $("#helpbutton").css("margin-left", "640px");
            $("#minimizebutton").css("margin-left", "660px");
            $("#closebutton").css("margin-left", "680px");


        });

        $("#startharvesting").click(function () {
            //Lol harvesting sounds quite evil, rlax, it's not

            //Get that progress indicator running
            $("#progressbar1").css("opacity", "1");

            var allshizzldata = $("#harvestsearchengines").val();

            if (allshizzldata == "") {
                $("#harvestsearchengines").val('Please input something');
            }

            if (allshizzldata == "Please input something") {
                $("#harvestsearchengines").val('Ah come on....');
            }

            if (allshizzldata == "Ah come on....") {
                $("#harvestsearchengines").val('Okay really, enter something already, this is the last warning');
            }

            if (allshizzldata == "Okay really, enter something already, this is the last warning") {
                $("#harvestsearchengines").val("Okay it wasn't, this is");
            }

            if (allshizzldata == "Okay it wasn't, this is") {
                $("#boomgif").css("display", "block").attr("src", "Images/boom.gif");
                $("#boomdiv").css("display", "block").css("position", "");

                setTimeout(function () {
                    $("#boomdiv").css("display", "none").css("position", "absolute");
                    $("#boomgif").css("display", "none").attr("src", "Images/close.png");
                    $("#harvestsearchengines").val("There, now your computer exploded, are you happy now?");
                }, 900);
            }

            if (allshizzldata == "There, now your computer exploded, are you happy now?") {
                $("#harvestsearchengines").val("Okay, as long as this text is inside this area, the button will make it go boom, have fun");
            }

            if (allshizzldata == "Okay, as long as this text is inside this area, the button will make it go boom, have fun") {
                $("#boomgif").css("display", "block").attr("src", "Images/boom.gif");
                $("#boomdiv").css("display", "block").css("position", "");

                setTimeout(function () {
                    $("#boomdiv").css("display", "none").css("position", "absolute");
                    $("#boomgif").css("display", "none").attr("src", "Images/close.png");
                }, 900);
            }


            var a = allshizzldata.split("\n");

            //Write it to the HTML part
            $("#whereallthesethingsgo").html('<hr><br><br><br><table cellpadding="1" border="0"><tbody id="searchenginewriteplace"><tr id="titletr"><td style="padding-top:5px;padding-bottom:5px;">\
<b><span style="font-size:200%;">Website</span></b></td><td style="padding-top:5px;padding-bottom:5px;padding-left:3px;">\
<b><span style="font-size:200%;">Binding</span></b></td><td style="padding-top:5px;padding-bottom:5px;padding-left:3px;">\
<b><span id="confirmedspan" style="font-size:200%;">Search URL</span></b></td><td style="padding-top:5px;padding-bottom:5px;padding-left:3px;">\
</td></tr></tbody></table><br><br>');

            //Now the rest
            var i = 3;
            var d = 0;
            var e = 0;
            var c = a.length;
            var b = 0;
            var onchangearray = [];
            var locationsarray = [];

            var storedbindings = stored.binding;

            //Get pixels/c
            var pixelsoverc = 1000 / c;
            pixelsoverc = pixelsoverc * 4;

            NProgress.start();

            while (c > i) {

                d = parseInt(i, 10) + 1;
                e = parseInt(i, 10) + 2;
                b = parseInt(i, 10) + 3;

                //If next 4 are blank, stop
                if (a[i] == "" && a[d] == "" && a[e] == "" && a[b] == "") {
                    i = c;
                }
                else {

                    //If it's displaying "other search engines" get past that
                    if (a[i] == "" && a[e] == "") {
                        i++;
                        i++;
                    }

                    i++;

                    if (a[i] == "") {
                        //Skip one, just i++
                        i++;
                    }


                    d = parseInt(i, 10) + 1;
                    e = parseInt(i, 10) + 2;


                    document.getElementById("searchenginewriteplace").innerHTML += ('<tr id="column' + i + '"><td>\
<input id="nameinput' + i + '" size="25" class="nameinput" value="' + a[i] + '" disabled="disabled"></td><td>\
<input id="bindinginput' + i + '" size="25" class="bindinginput" value="' + a[d] + '"></td><td>\
<input id="urlinput' + i + '" size="89" class="urlinput" value="' + a[e] + '" disabled="disabled"></td><td>\
<span class="addsb" id="add' + i + '"><b>&nbsp;+&nbsp;</b></span></td></tr>')

                    var f = 0;
                    var g = storedbindings.length;

                    while (g > f) {
                        var h = storedbindings[f];
                        h = h.split("%123");
                        var j = h[1];
                        h = h[0];

                        if (a[e] == j) {
                            //Match, now light that row up, and fill in matching binding
                            $("#nameinput" + i).css({
                                "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "border": "2px solid rgba(0,255,102,1)"
                            });

                            $("#bindinginput" + i).css({
                                "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "border": "2px solid rgba(0,255,102,1)"
                            });
                            $("#urlinput" + i).css({
                                "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                                "border": "2px solid rgba(0,255,102,1)"
                            });

                            onchangearray.push(i);
                            locationsarray.push(f);

                        }

                        f++;
                    }

                    i++;
                    i++;
                    i++;

                }

                NProgress.done();

            };

            $(".bindinginput").focusout(function () {
                //Find it in the array

                var i = 0;
                var a = onchangearray.length;

                while (a > i) {

                    if ($(this).context.id.split("bindinginput")[1] == onchangearray[i]) {

                        var thingy = locationsarray[i];
                        var oldstuff = stored.binding;

                        var i = oldstuff[thingy].split("%123")[1];

                        var k = $(this).val();

                        oldstuff[thingy] = k + "%123" + i;

                        storage.set({ "binding": oldstuff });

                    }
                    i++;
                }

            });

            $(".addsb").mouseenter(function () {
                $(this).css("border", "2px solid white");
            }).mouseleave(function()
            {
                $(this).css("border","2px solid rgba(0,0,0,0)");
            }).click(function()
            {

                var parentid = $(this).context.id;
                parentid = parentid.split("add")[1];
                
                parentid = parseInt(parentid, 10) + 1;

                var newbinding = a[parentid];
                parentid++;
                var newsearchurl = a[parentid];


                var oldbindings = stored.binding;
                oldbindings.push(newbinding + "%123" + newsearchurl);

                var oldrows = stored.rows;
                oldrows = parseInt(oldrows, 10) + 1;

                /*

                storage.set({ "binding": oldbindings });
                storage.set({ "rows": oldrows });

                */

                parentid--;
                parentid--;

                $("#nameinput" + parentid).css({
                    "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "border":"2px solid rgba(0,255,102,1)"
                });

                $("#bindinginput" + parentid).css({
                    "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "border":"2px solid rgba(0,255,102,1)"
                });
                $("#urlinput" + parentid).css({
                    "box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-webkit-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "-moz-box-shadow": "0 0 15px rgba(0, 255, 102, 1)",
                    "border":"2px solid rgba(0,255,102,1)"
                });

                $("#confirmedspan").html('Search URL &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span id="confirmingtext" style="display:none" class="greentext">Added!</span>');
                $("#confirmingtext").css("opacity", "0").css("display", "inline").animate({ opacity: 1 }, function () {
                    $(this).delay(4000).animate({ opacity: 0 }, function () {
                        $(this).css("display", "none");
                    });
                });

            });

        });

        //Get colors
        var newcolors = stored.colors;
        var selectedcolor = "";


        $("#colorpickerone").css("background-color", stored.colors.bg);
        $("#colorpickerone").ColorPicker({
            color: stored.colors.bg,
            onChange: function (hsb, hex, rgb) {
                $('#colorpickerone').css('backgroundColor', '#' + hex);
                $("body").css("background-color", "#" + hex);
                $(".fixedpart").css("background-color", "#" + hex);
            },
            onHide: function (hsb, hex, rgb) {
                selectedcolor = hsb.children[2].style.backgroundColor;
                newcolors.bg = selectedcolor;
                storage.set({ "colors": newcolors });
            }
        });

        $("#colorpickertwo").css("background-color", stored.colors.title);
        $("#colorpickertwo").ColorPicker({
            color: stored.colors.title,
            onChange: function (hsb, hex, rgb) {
                $('#colorpickertwo').css('backgroundColor', '#' + hex);
                $("#topbar").css("background-color", "#" + hex);
                $("#optionsbutton").css("background-color", "#" + hex);
                $("#helpbutton").css("background-color", "#" + hex);
                $("#minimizebutton").css("background-color", "#" + hex);
            },
            onHide: function (hsb, hex, rgb) {
                selectedcolor = hsb.children[2].style.backgroundColor;
                newcolors.title = selectedcolor;
                storage.set({ "colors": newcolors });
            }
        });

        $("#colorpickerfour").css("background-color", stored.colors.inputs);
        $("#colorpickerfour").ColorPicker({
            color: stored.colors.inputs,
            onChange: function (hsb, hex, rgb) {
                $('#colorpickerfour').css('backgroundColor', '#' + hex);
                $(".binding").css("background-color", "#" + hex);
                $(".url").css("background-color", "#" + hex);
                $(".changableinput").css("background-color", "#" + hex);
            },
            onHide: function (hsb, hex, rgb) {
                selectedcolor = hsb.children[2].style.backgroundColor;
                newcolors.inputs = selectedcolor;
                storage.set({ "colors": newcolors });
            }
        });

        //Make checkboxes display correct value
        if (stored.supasearch == "yes") {
            document.getElementById("supasearch").checked = true;
        }

        if (stored.exitafter == "1") {
            document.getElementById("closeafter").checked = true;
        }

        //Do the checkboxes thing
        $("#supasearch").click(function () {
            var da = document.getElementById("supasearch").checked;
            if (da === true) {
                storage.set({ "supasearch": "yes" });
                $("#maininput").attr("size", "56");
                $("#submitbutton").css("display", "none");
                //K, now rebind this shit to the main input

                document.getElementById("maininput").onkeypress = function (e) {

                    //Go through with it only if it's still on and not in searching mode
                    if (stored.supasearch == "yes" && searching == 0) {

                        if (event.which === 13) {
                            $("body").animate({ backgroundColor: "red" }, 700, function () {
                                $("body").delay(3000).animate({ backgroundColor: "#3C92FF" }, 700);
                            });
                        }
                        else {
                            var aa = document.getElementById("maininput").value;
                            e = String.fromCharCode(e.charCode);
                            aa = aa + e;


                            var looploop = 0;
                            var af = 0;
                            var ab = 1;
                            var ac = stored.rows;
                            ac++;
                            while (ac > ab) {
                                var ag = parseInt(ab, 10) - 1;
                                var ad = theitems[ag];
                                var ae = [];
                                ae = ad.split("%123");

                                if (ae[1].search("%s") > -1 && ae[0] == aa) {
                                    //Search function, change HTML first to fit search stuff
                                    $("#textbeforeinput").html('Searching your site for: ');
                                    $("#maininput").attr({ size: "40" });
                                    $("#maininput").val('');
                                    document.getElementById("wherethebuttongoes").innerHTML = ('<br><button id="dontsearchanymore">Quit Searching</button>');
                                    searching = ae[1];

                                    //Make enter also work for a submit
                                    $("#maininput").keydown(function (e) {
                                        e = e.which;
                                        if (e === 13) {
                                            if (searching !== 0) {

                                                //Search using searching
                                                var afa = $("#maininput").val();
                                                console.log(afa);
                                                afa = afa.replace(/ /g, "+");
                                                console.log(afa);
                                                afa = afa.replace(/&/g, "%26");
                                                console.log(afa);
                                                afa = searching.replace(/%s/g, afa);
                                                console.log(afa);

                                                window.open(afa, "_blank");
                                                af = 1;

                                                //Do the possible closing if selected
                                                if (stored.exitafter == "1") {

                                                    var ce = chrome.app.window.current();
                                                    ce.resizeTo(500, 100);
                                                    ce.close();

                                                }
                                                else {
                                                    document.getElementById("maininput").value = "";
                                                }

                                            }
                                        }

                                        if (e === 27) {
                                            $("#textbeforeinput").html('Your Binding: ');
                                            $("#maininput").attr({ size: "56" });
                                            $("#maininput").val('');
                                            document.getElementById("wherethebuttongoes").innerHTML = ('');
                                            searching = 0;
                                            $("#submitbutton").css("display", "none");
                                            $("#submitbutton").unbind("click");
                                        }

                                    });

                                    //Display the submit button again
                                    $("#submitbutton").css("display", "inline");
                                    $("#submitbutton").click(function () {
                                        //Search using searching
                                        var afa = $("#maininput").val();
                                        afa = searching.replace(/%s/g, afa);

                                        window.open(afa, "_blank");
                                        af = 1;

                                        //Do the possible closing if selected
                                        if (stored.exitafter == "1") {

                                            var ce = chrome.app.window.current();
                                            ce.resizeTo(500, 100);
                                            ce.close();

                                        }
                                        else {
                                            document.getElementById("maininput").value = "";
                                        }
                                    });


                                    $("#dontsearchanymore").click(function () {
                                        $("#textbeforeinput").html('Your Binding: ');
                                        $("#maininput").attr({ size: "56" });
                                        $("#maininput").val('');
                                        document.getElementById("wherethebuttongoes").innerHTML = ('');
                                        searching = 0;
                                        $("#submitbutton").css("display", "none");
                                        $("#submitbutton").unbind("click");
                                        console.log("this");
                                        $("#maininput").unbind("keydown");
                                    });

                                    //$("#maininput").

                                    $("#maininput").focus();

                                    af = 2;

                                    setTimeout(function () {
                                        //Clear main input
                                        $("#maininput").val('');
                                    }, 10);
                                }
                                else {

                                    if (ae[0] == aa) {
                                        if (ae[1].search(",") > -1) {
                                            var allurls = ae[1].split(",");

                                            var urlopeningvar = 0;
                                            while (allurls.length > urlopeningvar) {
                                                window.open(allurls[urlopeningvar], "_blank");
                                                urlopeningvar++;
                                            }
                                            ac = ab;
                                            af = 1;
                                        }
                                        else {

                                            window.open(ae[1], "_blank");
                                            ac = ab;
                                            af = 1;
                                        }
                                    }

                                    looploop++;

                                    if (looploop == "50") {
                                        console.log("infinite loop");
                                        document.getElementById("maininput").value = "infinite loop detected, please hit help button and do a full reset";
                                        ac = ab;
                                        return false;
                                    }
                                }


                                ab++;
                            }

                            if (af == 1 && stored.exitafter == "1") {
                                var ce = chrome.app.window.current();
                                ce.resizeTo(500, 100);
                                ce.close();
                            }

                        }
                    }
                    //End of going through-stuff
                }

                //End of the rebind
            }
            else {
                storage.set({ "supasearch": "no" });
                $("#maininput").attr("size", "50");
                $("#submitbutton").css("display", "inline");
            }
        });


        $("#closeafter").click(function () {
            var db = document.getElementById("closeafter").checked;
            if (db === true) {
                storage.set({ "exitafter": "1" });
            }
            else {
                storage.set({ "exitafter": "0" });
            }
        });


        function ontypesave(e) {
            $(".binding").keydown(function () {

                var aba = $(this).context.id.split("binding");
                aba = aba[1];

                //Wait 50ms
                setTimeout(function () {

                    //So then write this to the theitems array
                    var abb = document.getElementById("binding" + aba).value;
                    var abc = theitems[aba];
                    abc = abc.split("%123");
                    abc = abc[1];
                    theitems[aba] = abb + "%123" + abc;

                    storage.set({ "binding": theitems });
                }, 50);
            });

            $(".url").keydown(function () {

                var aba = $(this).context.id.split("url");
                aba = aba[1];

                //Wait 50ms
                setTimeout(function () {

                    //So then write this to the theitems array
                    var abb = document.getElementById("url" + aba).value;
                    var abc = theitems[aba];
                    abc = abc.split("%123");
                    abc = abc[0];
                    theitems[aba] = abc + "%123" + abb;

                    storage.set({ "binding": theitems });

                    //Set the hiding to not-hiding
                    var newhidden = stored.hidden;
                    newhidden[aba] = "";
                    storage.set({ "hidden": newhidden });

                }, 50);
            });
        }


        function writeitall() {

            var arrayofarrays = [];
            //Fill arrayofarrays


            $("#wheretherowsgo").html('<h1><ul id="thelist"><li id="leftli" class="listitem">Binding</li><li id="rightli" class="listitem">URL</li></ul></h1><br><br>');

            var x = stored.rows;



            while (y < x) {
                var a = theitems[y];
                var c = parseInt(y, 10) + 1;

                if (c < 10) {
                    c = c + "&nbsp;";
                }

                var b = [];
                b = a.split("%123");
                a = b[0];
                b = b[1];


                document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp;<input id="binding' + y + '" class="binding" value="' + a + '" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="' + b + '" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br style="font-size:50%;"></div>');

                var errorarray = [];
                arrayofarrays[arrayofarrays.length] = errorarray;

                y++;
            }

            //Check all the rows and stuff
            //Check if the URL is legit


            var aia = 0;
            while (aia < stored.rows) {
                var aba = aia;
                //That is the number, now this doesnt have shit to do with it but that doesnt matter
                //Get the input and check it

                var abc = $("#url" + aba).val();

                //If multiple URL's are in there, check em all
                if (abc.search(",") > -1) {
                    var alltheurls = [];
                    alltheurls = abc.split(",");

                    var errorarray = [];

                    var gothroughallurls = 0;
                    while (gothroughallurls < alltheurls.length) {
                        abc = alltheurls[gothroughallurls];
                        if (abc.search("http://www.") > -1 || abc.search("https://www.") > -1 || abc.search("chrome://") > -1 || abc.search("file://") > -1 || abc.search("ftp://") > -1 || abc == "") {
                            errorarray[gothroughallurls] = "";
                        }
                        else {
                            if (abc.search("www.") > -1) {
                                //only http://
                                errorarray[gothroughallurls] = "http://";
                            }
                            else {
                                errorarray[gothroughallurls] = "www.";
                            }
                        }
                        gothroughallurls++;
                        arrayofarrays[aba] = errorarray
                    }

                    //Now see if any errors occurred
                    gothroughallurls = 0;

                    var httperrors = 0;
                    var wwwerrors = 0;

                    while (gothroughallurls < errorarray.length) {
                        if (errorarray[gothroughallurls] == "http://") {
                            httperrors++;
                        }
                        else {
                            if (errorarray[gothroughallurls] == "www.") {
                                wwwerrors++;
                            }
                            else {
                                errorarray[gothroughallurls] == "";
                            }
                        }


                        gothroughallurls++;
                    }

                    if (httperrors === 0 && wwwerrors === 0) {
                        //No errors found
                        //If shit's displayed, remove it now
                        if ($("#warning" + aba).html().search("second one") === -1 || $("#warning" + aba).html().search("first one") === -1) {
                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                $(this).css("display", "none");
                            });

                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs });
                        }
                    }
                    else {
                        //Errors found

                        //First of all check if it's not hidden
                        var aaba = "a" + aba;
                        if (stored.hidden[aba] != "") {
                            //Dont show the warning shit yo


                        }
                        else {

                            if ($("#otherwarning" + aba).css("display") != "none") {
                                $("#warning" + aba).css("margin-left", "10px");
                            }

                            if (wwwerrors > 0) {
                                //http://www. error(s), so display http://www. errors thingy
                                if ($("#warning" + aba).html().search("second one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they came from other one, dont do the animating
                                    if ($("#warning" + aba).html().search("first one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("add");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            errorarray = arrayofarrays[aba];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("hide");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                    else {


                                        //Display other stuff normally
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("add");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            errorarray = arrayofarrays[aba];

                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }

                                                cyclevar++;
                                            }


                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("hide");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                }

                                //End of http:// error
                            }
                            else {
                                //http:// error(s), display http:// errors thingy
                                //If already displayed, do nothing
                                if ($("#warning" + aba).html().search("first one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they just came from the other one, dont do the animate stuff
                                    if ($("#warning" + aba).html().search("second one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("add");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            errorarray = arrayofarrays[aba];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("hide");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                    else {

                                        //http://www. warning message
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("add");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            errorarray = arrayofarrays[aba];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {

                                            //Get context ID and shit
                                            var contextid = $(this).context.id;
                                            contextid = contextid.split("hide");
                                            contextid = contextid[1];
                                            aba = contextid;

                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                }

                            }
                        }
                    }
                }
                else {

                    //Do the normal shit
                    if (abc.search("http://www.") > -1 || abc.search("https://www.") > -1 || abc.search("chrome://") > -1 || abc.search("file://") > -1 || abc.search("ftp://") > -1 || abc == "") {
                        //Shit's good yo

                        //If shit's displayed, remove it now
                        if ($("#warning" + aba).html().search("second one") === -1 || $("#warning" + aba).html().search("first one") === -1) {
                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                $(this).css("display", "none");
                            });

                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs });
                        }


                    } else {
                        //First of all check if it's not hidden
                        if (stored.hidden[aba] != "") {
                            //Dont show the warning shit yo


                        }

                        else {
                            //Display like normal

                            //Display what warning message
                            if (abc.search("www.") > -1) {
                                if ($("#warning" + aba).html().search("second one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they came from other one, dont do the animating
                                    if ($("#warning" + aba).html().search("first one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item


                                        $("#add" + aba).click(function () {

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("add");
                                            clickid = clickid[1];
                                            var old = $("#url" + clickid).val();

                                            old = "http://" + old;

                                            $("#url" + clickid).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + clickid).value;
                                            var abc = theitems[clickid];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[clickid] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });


                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("hide");
                                            clickid = clickid[1];

                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[clickid] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                    else {


                                        //Display other stuff normally
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });


                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("add");
                                            clickid = clickid[1];
                                            var old = $("#url" + clickid).val();

                                            old = "http://" + old;

                                            $("#url" + clickid).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + clickid).value;
                                            var abc = theitems[clickid];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[clickid] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });


                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("hide");
                                            clickid = clickid[1];

                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[clickid] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }


                                    //Display the http:// warning message
                                }
                            }
                            else {
                                //If already displayed, do nothing
                                if ($("#warning" + aba).html().search("first one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they just came from the other one, dont do the animate stuff
                                    if ($("#warning" + aba).html().search("second one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("add");
                                            clickid = clickid[1];
                                            var old = $("#url" + clickid).val();

                                            old = "http://" + old;

                                            $("#url" + clickid).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + clickid).value;
                                            var abc = theitems[clickid];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[clickid] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });


                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("hide");
                                            clickid = clickid[1];

                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[clickid] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                    else {

                                        //http://www. warning message
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("add");
                                            clickid = clickid[1];
                                            var old = $("#url" + clickid).val();

                                            old = "http://" + old;

                                            $("#url" + clickid).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + clickid).value;
                                            var abc = theitems[clickid];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[clickid] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });


                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 

                                            var clickid = $(this).context.id
                                            clickid = clickid.split("hide");
                                            clickid = clickid[1];

                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[clickid] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + clickid).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + clickid).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px").css("margin-left", "270px");
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
                aia++;
            }
            //End of url-legitness-checking

            /*
            //Check all bindings for legitness
           if (stored.supasearch == "yes") {
  
               var cab = 0;
  
               //Now get all the values
  
               var allbindingsarray = [];
  
               while (stored.rows > cab) {
                   allbindingsarray.push($("#binding" + cab).val());
  
                   cab++;
               }
  
               //Now check if they are the same
               var cac = 0;
               var cad = 0;
               var checkval = "";
  
               while (stored.rows > cad) {
                   checkval = allbindingsarray[cad];
                   //Get first val and compare it to others
                   cac = 0;
  
                   while (allbindingsarray.length > cac) {
                       if (allbindingsarray[cac].search(checkval) > -1 || checkval.search(allbindingsarray[cac]) > -1 && checkval != "" && allbindingsarray[cac] != "") {
                           if (cac != cad && checkval != "" && allbindingsarray[cac] != "") {
                               //Error found
                               //Now display the error stuff and with which one it causes problems
  
                               //if other warning is already displayed, fix it
                               if ($("#warning" + cac).css("display") != "none") {
                                   $("#warning" + cac).css("margin-left", "10px");
                               }
  
                               //If already displayed, dont do anything, just update the innerHTML
                               if ($("#otherwarning" + cac).html() == "") {
                                   $("#otherwarning" + cac).css("opacity", "0").css("display", "inline-block").animate({ opacity: 1 });
                                   $("#binding" + cac).animate({ backgroundColor: "rgb(255, 190, 190)" }).css("paddingleft", "5px").css("border", "3px solid red");
                               }
  
                               $("#otherwarning" + cac).html("<span style='background-color:red;'> &nbsp; Conflicts with <b>" + checkval + "</b>&nbsp; </span><span style='background-color:red;' id='conflict" + cac + "' class='helpconflict'>&nbsp; ? &nbsp;</span>");
                               $("#conflict" + cac).mouseenter(function () {
                                   $(this).stop().animate({ backgroundColor: "rgb(65,0,0)" });
                               }).mouseleave(function () {
                                   $(this).stop().animate({ backgroundColor: "rgb(255,0,0)" });
                               }).click(function () {
                                   //Display the help message about the conflicting thingys
                                   $("#helpconflict").css("opacity", "0").css("display", "block").animate({ opacity: 1 });
                                   $("#hideconflicthelp").click(function () {
                                       $("#helpconflict").animate({ opacity: 0 }, function () {
                                           $(this).css("display", "none");
                                       });
                                   });
                               });
  
                           }
                       }
                       cac++;
                   }
                   cad++;
               }
           }
           */

            ontypesave();

            $(".binding").css("background-color", stored.colors.inputs);
            $(".url").css("background-color", stored.colors.inputs);
            $(".changableinput").css("background-color", stored.colors.inputs);

            $(".removething").hover(function () {
                $(this).html("<b>X</b>");
            }, function () {
                $(this).html("X");
            })


            onclicksandstuff();
        }

        function onclicksandstuff() {

            /*
            //On unfocussing any Binding input, check if problems with supasearch arise
            $(".binding").focusout(function () {
                if (stored.supasearch == "yes") {
  
                    var cab = 0;
  
                    //Now get all the values
  
                    var allbindingsarray = [];
  
                    while (stored.rows > cab) {
                        allbindingsarray.push($("#binding" + cab).val());
  
                        cab++;
                    }
  
                    //Now check if they are the same
                    var cac = 0;
                    var cad = 0;
                    var checkval = "";
                    var errorsat = [];
  
                    while (stored.rows > cad) {
                        checkval = allbindingsarray[cad];
                        //Get first val and compare it to others
                        cac = 0;
  
                        while (allbindingsarray.length > cac) {
                            if (allbindingsarray[cac].search(checkval) === 0 || checkval.search(allbindingsarray[cac]) === 0) {
                                if (cac != cad && checkval != "" && allbindingsarray[cac] != "") {
                                    errorsat.push(cac);
                                    //Error found
                                    //Now display the error stuff and with which one it causes problems
  
                                    //if other warning is already displayed, fix it
                                    if ($("#warning" + cac).css("display") != "none") {
                                        $("#warning" + cac).css("margin-left", "10px");
                                    }
  
                                    //If already displayed, dont do anything, just update the innerHTML
                                    if ($("#otherwarning" + cac).html() == "") {
                                        $("#otherwarning" + cac).stop().css("opacity", "0").css("display", "inline-block").animate({ opacity: 1 });
                                        $("#binding" + cac).stop().animate({ backgroundColor: "rgb(255, 190, 190)" }).css("paddingleft", "5px").css("border", "3px solid red");
                                    }
  
                                    $("#otherwarning" + cac).html("<span style='background-color:red;'> &nbsp; Conflicts with <b>" + checkval + "</b>&nbsp; </span><span style='background-color:red;' id='conflict" + cac + "' class='helpconflict'>&nbsp; ? &nbsp;</span>");
                                    $("#conflict" + cac).stop().mouseenter(function () {
                                        $(this).stop().animate({ backgroundColor: "rgb(65,0,0)" });
                                    }).mouseleave(function () {
                                        $(this).stop().stop().animate({ backgroundColor: "rgb(255,0,0)" });
                                    }).click(function () {
                                        //Display the help message about the conflicting thingys
                                        $("#helpconflict").css("opacity", "0").css("display", "block").animate({ opacity: 1 });
                                        $("#hideconflicthelp").click(function () {
                                            $("#helpconflict").animate({ opacity: 0 }, function () {
                                                $(this).css("display", "none");
                                            });
                                        });
                                    });
  
                                }
                            }
                            cac++;
                        }
                        cad++;
                    }
  
                    //Check which ones didnt get an error at em but do have shit displayed
  
                    var cae = 0;
                    while (cae < stored.rows) {
                        if ($("#otherwarning" + cae).css("display") != "none") {
                            //Check if it's in the error list
                            if (errorsat.indexOf(cae) === -1) {
                                $("#otherwarning" + cae).html('').animate({ opacity: 1 }, function () {
                                    $(this).css("display", "none");
                                    
                                    //Get the ID from the this-thing since otherwise it does annoying shit
                                    var caf = 0;
                                    caf = $(this).context.id;
                                    caf = caf.split("otherwarning");
                                    caf = caf[1];
  
                                    //Reset other warning's margin-left
                                    $("#warning" + caf).css("margin-left", "250px");
                                });
                                $("#binding" + cae).css("padding-left", "0px").css("border", "3px solid rgba(0,0,0,0)").stop().animate({ backgroundColor: stored.colors.inputs });
  
                            }
                        }
                        cae++;
                    }
                }
            });
            */


            //On unocussing any url input, see if http://www. is in there and give warning if needed
            $(".url").focusout(function () {
                var aba = $(this).context.id;
                var abb = [];
                abb = aba.split("url");
                aba = abb[1];
                //That is the number, now this doesnt have shit to do with it but that doesnt matter
                //Get the input and check it

                var abc = $(this).val();

                //If multiple URL's are in there, check em all
                if (abc.search(",") > -1) {
                    var alltheurls = [];
                    alltheurls = abc.split(",");
                    var errorarray = [];

                    var gothroughallurls = 0;
                    while (gothroughallurls < alltheurls.length) {
                        abc = alltheurls[gothroughallurls];
                        if (abc.search("http://www.") > -1 || abc.search("https://www.") > -1 || abc.search("chrome://") > -1 || abc.search("file://") > -1 || abc.search("ftp://") > -1 || abc == "") {
                            errorarray[gothroughallurls] = "";
                        }
                        else {
                            if (abc.search("www.") > -1) {
                                //only http://
                                errorarray[gothroughallurls] = "http://";
                            }
                            else {
                                errorarray[gothroughallurls] = "www.";
                            }
                        }
                        gothroughallurls++;
                    }
                    //Now see if any errors occurred
                    gothroughallurls = 0;

                    var httperrors = 0;
                    var wwwerrors = 0;

                    while (gothroughallurls < errorarray.length) {
                        if (errorarray[gothroughallurls] == "http://") {
                            httperrors++;
                        }
                        else {
                            if (errorarray[gothroughallurls] == "www.") {
                                wwwerrors++;
                            }
                            else {
                                errorarray[gothroughallurls] == "";
                            }
                        }

                        gothroughallurls++;
                    }

                    if (httperrors === 0 && wwwerrors === 0) {
                        //No errors found
                        //If shit's displayed, remove it now
                        if ($("#warning" + aba).html().search("second one") === -1 || $("#warning" + aba).html().search("first one") === -1) {
                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                $(this).css("display", "none");
                            });

                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs });
                        }
                    }
                    else {
                        //Errors found

                        //First of all check if it's not hidden
                        var aaba = "a" + aba;
                        if (stored.hidden[aba] != "") {
                            //Dont show the warning shit yo


                        }
                        else {

                            /*
                            if ($("#otherwarning" + aba).css("display") != "none") {
                                $("#warning" + aba).css("margin-left", "10px");
                            }
                            */

                            if (wwwerrors > 0) {
                                //http://www. error(s), so display http://www. errors thingy
                                if ($("#warning" + aba).html().search("second one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they came from other one, dont do the animating
                                    if ($("#warning" + aba).html().search("first one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                    else {


                                        //Display other stuff normally
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }


                                                cyclevar++;
                                            }


                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                }

                                //End of http:// error
                            }
                            else {
                                //http:// error(s), display http:// errors thingy
                                //If already displayed, do nothing
                                if ($("#warning" + aba).html().search("first one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they just came from the other one, dont do the animate stuff
                                    if ($("#warning" + aba).html().search("second one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                    else {

                                        //http://www. warning message
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            //Quite some complicated shit

                                            old = old.split(",");
                                            var cyclevar = 0;
                                            var newthingsarray = [];

                                            while (cyclevar < old.length) {
                                                //See what kind of error it is and if it is an error at all

                                                if (errorarray[cyclevar] == "http://") {
                                                    //https error, now fix it
                                                    newthingsarray[cyclevar] = "http://" + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "www.") {
                                                    ///wwww. error, now fix it
                                                    newthingsarray[cyclevar] = "http://www." + old[cyclevar];
                                                }
                                                if (errorarray[cyclevar] == "") {
                                                    //No error, just write old one to newstuffarray
                                                    newthingsarray[cyclevar] = old[cyclevar];
                                                }
                                                cyclevar++;
                                            }

                                            //Write em all
                                            var writevar = 0;
                                            var newvalue = "";
                                            var newthingsarrayminusone = parseInt(newthingsarray.length, 10) - 1;
                                            while (writevar < newthingsarray.length) {
                                                if (writevar === newthingsarrayminusone) {
                                                    newvalue = newvalue + newthingsarray[writevar];
                                                }
                                                else {
                                                    newvalue = newvalue + newthingsarray[writevar] + ",";
                                                }
                                                writevar++
                                            }
                                            $("#url" + aba).val(newvalue);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                }

                            }
                        }
                    }
                }
                else {

                    if (abc.search("http://www.") > -1 || abc.search("https://www.") > -1 || abc.search("chrome://") > -1 || abc.search("file://") > -1 || abc.search("ftp://") > -1 || abc == "") {
                        //Shit's good yo

                        //If shit's displayed, remove it now
                        if ($("#warning" + aba).html().search("second one") === -1 || $("#warning" + aba).html().search("first one") === -1) {
                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                $(this).css("display", "none");
                            });

                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs });
                        }


                    } else {
                        //First of all check if it's not hidden
                        var aaba = "a" + aba;
                        if (stored.hidden[aba] != "") {
                            //Dont show the warning shit yo


                        }

                        else {
                            //Display like normal

                            //Display what warning message
                            if (abc.search("www.") > -1) {
                                if ($("#warning" + aba).html().search("second one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they came from other one, dont do the animating
                                    if ($("#warning" + aba).html().search("first one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            old = "http://" + old;

                                            $("#url" + aba).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                    else {


                                        //Display other stuff normally
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- second one -->&nbsp; <b>http(s)://</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            old = "http://" + old;

                                            $("#url" + aba).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }


                                    //Display the http:// warning message
                                }
                            }
                            else {
                                //If already displayed, do nothing
                                if ($("#warning" + aba).html().search("first one") === -1) {

                                    //Unbind if needed, can never be too sure bra
                                    $("#add" + aba).unbind("mouseover").unbind("mouseout").unbind("click");
                                    $("#hide" + aba).unbind("mouseover").unbind("mouseout").unbind("click");

                                    //If they just came from the other one, dont do the animate stuff
                                    if ($("#warning" + aba).html().search("second one") > -1) {
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            old = "http://www." + old;

                                            $("#url" + aba).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                    else {

                                        //http://www. warning message
                                        $("#url" + aba).animate({
                                            backgroundColor: "rgb(255, 190, 190)"
                                        }, function () {
                                            $(this).css("border", "3px solid red").css("padding-left", "5px");
                                        });
                                        $("#warning" + aba).css("opacity", "0").css("display", "inline").css("margin-bottom", "-5px");
                                        $("#warning" + aba).animate({ opacity: "1" });
                                        $("#warning" + aba).html('<!-- first one -->&nbsp; <b>http(s)://www.</b> not found, add it? &nbsp; <b><span id="add' + aba + '" class="add"> &nbsp; Yes &nbsp; </span></b> <b><span id="hide' + aba + '" class="hide"> &nbsp; Hide &nbsp;</span></b>');

                                        //Do the hovers
                                        $("#add" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        $("#hide" + aba).mouseenter(function () {
                                            $(this).stop().animate({ backgroundColor: "rgb(65, 0, 0)" }, 400);
                                        }).mouseleave(function () {
                                            $(this).stop().animate({ backgroundColor: "red" }, 150);
                                        });

                                        //Do the onclicks, individual ones because otherwise you get like 3 clickhandlers on one item
                                        $("#add" + aba).click(function () {
                                            var old = $("#url" + aba).val();

                                            old = "http://www." + old;

                                            $("#url" + aba).val(old);

                                            //Save the new url
                                            var abb = document.getElementById("url" + aba).value;
                                            var abc = theitems[aba];
                                            abc = abc.split("%123");
                                            abc = abc[0];
                                            theitems[aba] = abc + "%123" + abb;

                                            storage.set({ "binding": theitems });

                                            //Hide the stuff above again
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });

                                        //Hide onclick
                                        $("#hide" + aba).click(function () {
                                            //Get the array and set this spot 
                                            var hidden = [];
                                            hidden = stored.hidden;
                                            hidden[aba] = "hidden";
                                            storage.set({ "hidden": hidden });

                                            //Hide it
                                            $("#warning" + aba).html('').animate({ opacity: "0" }, function () {
                                                $(this).css("display", "none");
                                            });

                                            $("#url" + aba).css("border", "3px solid rgba(0,0,0,0)").animate({ backgroundColor: stored.colors.inputs }).css("padding-left", "0px");
                                        });
                                    }
                                }
                            }
                        }
                    }

                }

            });

            //On clicking add row
            $("#addrows").unbind("click");
            $("#addrows").click(function () {
                storage.set({ "rows": (parseInt(stored.rows, 10) + 1) });
                theitems[theitems.length] = "%123";
                storage.set({ "binding": theitems });

                var c = parseInt(y, 10) + 1;
                //Do some fancy stuff to hide the 250ms wait
                document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp;<input id="binding' + y + '" class="binding" value="" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

                $("#row" + y).css("opacity", "0");
                $("#binding" + y).css("opacity", "0");
                $("#url" + y).css("opacity", "0");
                $("#removething" + y).css("opacity", "0");

                $("#row" + y).animate({ opacity: 1 }, 100, function () {
                    $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                        $("#url" + y).animate({ opacity: 1 }, 300, function () {
                            $("#removething" + y).animate({ opacity: 1 }, 300);
                        });
                    });
                });

                setTimeout(function () {
                    $("#wheretherowsgo").html('');
                    y = 0;
                    writeitall();
                }, 1000);
            });

            //On clicking the cross to the right
            $(".removething").click(function () {

                if (stored.rows == "1") {
                    var aha = [];
                    aha[0] = "%123";
                    storage.set({ "binding": aha });

                    //Clear it
                    $("#binding0").animate({ color: stored.colors.inputs }, 500);
                    $("#url0").animate({ color: stored.colors.inputs }, 500);

                    setTimeout(function () {
                        $("#wheretherowsgo").html('');
                        y = 0;
                        writeitall();
                    }, 500);
                }
                else {

                    //Take down stored rows by one
                    var newrows = parseInt(stored.rows, 10) - 1;
                    storage.set({ "rows": newrows });
                    var aab = [];
                    aab = $(this).context.id.split("removething");
                    aab = aab[1];

                    //First remove the actual row from the list
                    //Just hide it since nobody's gonna take a look in the HTML to find a hidden row and give a fuck, so lets just hide it and not write it next time

                    //Remove the binding from storage
                    theitems.splice(aab, 1);
                    storage.set({ "binding": theitems });

                    //Do some fancy stuff in the meantime to distract em from the fact that they're waiting 250ms
                    $("#entirerow" + aab).animate({ marginLeft: "50px", opacity: 0 }, 500, function () {

                        $(this).css("display", "none");
                        aab++;
                        $("#entirerow" + aab).css("margin-top", "44px").animate({ marginTop: "0px" }, 250);

                    });

                    setTimeout(function () {

                        y = 0;
                        $("#wheretherowsgo").html('');
                        writeitall();

                    }, 750);
                }
            });

            //End of the onclicks
        }

        writeitall();


        //The onclicks of the standard bindings
        $("#youtubestandard").click(function () {
            theitems.push("youtube%123http://www.youtube.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="youtube" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.youtube.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#googlestandard").click(function () {
            theitems.push("google%123http://www.google.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="google" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.google.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#wikipediastandard").click(function () {
            theitems.push("wikipedia%123http://www.wikipedia.org");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="wikipedia" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.wikipedia.org" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#facebookstandard").click(function () {
            theitems.push("facebook%123http://www.facebook.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="facebook" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.facebook.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#twitterstandard").click(function () {
            theitems.push("twitter%123http://www.twitter.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="twitter" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.twitter.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#hotmailstandard").click(function () {
            theitems.push("hotmail%123http://www.hotmail.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="hotmail" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.hotmail.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#gmailstandard").click(function () {
            theitems.push("gmail%123http://www.gmail.com");
            storage.set({ "binding": theitems });

            //Stored ++
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Fancy stuff again...
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="gmail" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="http://www.gmail.com" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        //Search Bindings onclicks
        $("#googlesearch").click(function () {
            var first = "googlesearch";
            var second = "http://www.google.com/search?q=%s"

            theitems.push(first + "%123" + second);
            storage.set({ "binding": theitems });

            //Stored++;
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Same fancy stuff, only made easier for me to make now
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="' + first + '" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="' + second + '" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#youtubesearch").click(function () {
            var first = "youtubesearch";
            var second = "http://www.youtube.com/results?search_query=%s"

            theitems.push(first + "%123" + second);
            storage.set({ "binding": theitems });

            //Stored++;
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Same fancy stuff, only made easier for me to make now
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="' + first + '" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="' + second + '" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#wikipediasearch").click(function () {
            var first = "wikipediasearch";
            var second = "http://en.wikipedia.org/w/index.php?title=Special:Search&search=%s"

            theitems.push(first + "%123" + second);
            storage.set({ "binding": theitems });

            //Stored++;
            var ada = stored.rows;
            ada = parseInt(ada, 10) + 1;

            storage.set({ "rows": ada });

            //Same fancy stuff, only made easier for me to make now
            var c = parseInt(y, 10) + 1;
            document.getElementById("wheretherowsgo").innerHTML += ('<div id="entirerow' + y + '"><div id="otherwarning' + y + '" class="otherwarning"></div><div id="warning' + y + '" class="warning"></div><div id="row' + y + '" class="row">' + c + '&nbsp; &nbsp;<input id="binding' + y + '" class="binding" value="' + first + '" size="30">&nbsp;&nbsp;&nbsp;<input id="url' + y + '" class="url" value="' + second + '" size="57"></div><div id="removething' + y + '" class="removething" style="color:#494949;font-size:125%;">X</div><br></div>');

            $("#row" + y).css("opacity", "0");
            $("#binding" + y).css("opacity", "0");
            $("#url" + y).css("opacity", "0");
            $("#removething" + y).css("opacity", "0");

            $("#row" + y).animate({ opacity: 1 }, 100, function () {
                $("#binding" + y).animate({ opacity: 1 }, 300, function () {
                    $("#url" + y).animate({ opacity: 1 }, 300, function () {
                        $("#removething" + y).animate({ opacity: 1 }, 300);
                    });
                });
            });

            setTimeout(function () {
                y = 0;
                $("#wheretherowsgo").html('');
                writeitall();
            }, 1000);
        });

        $("#exportbutton").click(function () {
            //Put all the settings into one var
            var exportvar = "";
            var sep = "%123";
            var specialsep = "%124";
            var supaspecialsep = "%125";

            exportvar = stored.colors.bg + sep + stored.colors.inputs + sep + stored.colors.title + sep + stored.exitafter + sep + stored.firstrun + sep + stored.firsttime + sep + stored.rows + sep + stored.supasearch + specialsep;

            var i = 0;
            while (stored.hidden.length > i) {
                exportvar = exportvar + sep + stored.hidden[i];
                i++;
            }
            exportvar = exportvar + specialsep;

            i = 0;
            while (stored.binding.length > i) {
                exportvar = exportvar + supaspecialsep + stored.binding[i];
                i++;
            }
            exportvar = exportvar + specialsep;

            $("#exportfield").val(exportvar);
        });

        $("#importbutton").click(function () {
            var importvar = $("#importfield").val();

            if (document.getElementById("fromotherbinder").checked === true) {

                //If its from the other binder thingy
                importvar = importvar.split(",");

                if (importvar[0] === 1) {
                    storage.set({ "supasearch": "yes" });
                }
                else {
                    storage.set({ "supasearch": "no" });
                }


                var eventualrows = importvar[1];

                var newrows = [];

                if (importvar[3] == "yes") {
                    newrows.push("googlesearch%123http://wwww.google.com/search?q=%s");
                }

                if (importvar[4] == "yes") {
                    newrows.push("youtubesearch%123http://www.youtube.com/results?search_query=%s");
                }

                if (importvar[5] == "yes") {
                    newrows.push("bingsearch%123http://www.bing.com/search?setmkt=nl-NL&q=%s");
                }

                if (importvar[6] == "yes") {
                    newrows.push("amazonsearch%123http://www.amazon.com/s/ref=nb_sb_noss/175-3631512-6188805?url=search-alias%3Daps&field-keywords=%s");
                }

                if (importvar[7] == "yes") {
                    newrows.push("wikipediasearch%123http://en.wikipedia.org/w/index.php?title=Special:Search&search=%s");
                }

                var b = 22;
                var c = b + parseInt(importvar[1], 10) - 1;
                var d = 0;

                while (c > b) {
                    d = b + parseInt(importvar[1], 10) - 1;
                    if (importvar[b] != "thisoneisnotsetyet" && importvar[d] != "thisoneisnotsetyet" && importvar[d] != "thisisasearchurl") {
                        newrows.push(importvar[b] + "%123" + importvar[d]);
                    }
                    else {
                        eventualrows--;
                    }

                    b++;
                }

                console.log(newrows);

                storage.set({ "binding": newrows });
                storage.set({ "rows": eventualrows });


            }
            else {

                importvar = importvar.split("%124");

                var normalsettings = importvar[0];
                var hiddensettings = importvar[1];
                var bindingsettings = importvar[2];

                normalsettings = normalsettings.split("%123");

                var colorsfromimport = new Object();
                colorsfromimport.bg = normalsettings[0];
                colorsfromimport.inputs = normalsettings[1];
                colorsfromimport.title = normalsettings[2];

                storage.set({ "colors": colorsfromimport });

                storage.set({ "exitafter": normalsettings[3] });

                storage.set({ "firstrun": normalsettings[4] });

                storage.set({ "firsttime": normalsettings[5] });

                storage.set({ "rows": normalsettings[6] });

                storage.set({ "supasearch": normalsettings[7] });


                hiddensettings = hiddensettings.split("%123");

                var i = 0;
                var hiddenfrominput = [];
                var settingsminusone = parseInt(hiddensettings.length, 10) - 1;

                while (settingsminusone > i) {
                    var iplusone = parseInt(i, 10) + 1;
                    hiddenfrominput[i] = hiddensettings[iplusone];

                    i++;
                }

                storage.set({ "hidden": hiddenfrominput });


                bindingsettings = bindingsettings.split("%125");

                var bindingsinput = [];
                settingsminusone = parseInt(bindingsettings.length, 10) - 1;
                i = 0;


                while (settingsminusone > i) {
                    var iplusone = parseInt(i, 10) + 1;
                    bindingsinput[i] = bindingsettings[iplusone];

                    i++;
                }

                storage.set({ "binding": bindingsinput });

            }
        });

        $("#importfromsitebutton").click(function () {

        	var data = $("#importfromsite").val();

        	console.log(data);

        	data = data.replace(/\s+/g, '');

        	console.log(data);

        	if (data.search("datastart-") > -1) {
        		data = data.split("datastart-")[1];
        	}

        	var bindings = data.split("%splitsplit%");

        	console.log(bindings);

        	var storedbindings = stored.binding;

        	for (var i = 0; i < bindings.length; i++) {

        		storedbindings[storedbindings.length] = bindings[i].split("%trigger%")[0] + "%123" + bindings[i].split("%trigger%")[1];

        		console.log(storedbindings);

        	}

        	storage.set({ "binding": storedbindings });
        	storage.set({ "rows": (parseInt(stored.rows, 10) + bindings.length) });

        	$("#resultspan").html("Succes!, restart app to see changes").css("display", "block").css("color", "green").delay(2000).fadeOut(2000);


        });

        $("a").click(function () {
            if ($(this).attr("href").search("#") === 0) {

                setTimeout(function () {

                    $("#optionspart").css("height", "700px");
                    $("#mainoptions").css("height", "690px");
                    $(".remove").css("display", "none");

                }, 50);
            }
        });


        //Closing of this function, close of the if tutorial stuff, then close of click function
    }
}

$("#optionsbutton").click(function () {
    displayoptions();
});

if (stored.newversion == "yep") {

    $("#updatemessage").delay(500).css("opacity", "0").css("display", "block").animate({ opacity: 1 }, function () {
        $("#checkupdate").mouseenter(function () {
            $(this).stop().animate({ backgroundColor: "rgb(88, 0, 0)" });
        }).mouseleave(function () {
            $(this).stop().animate({ backgroundColor: "red" });
        }).click(function () {

            updateshit = 1;
            $("#optionsbutton").trigger("click");
            //Now go to the bottom of the page

            setTimeout(function () {
                location.href = "#bottom";
                storage.remove("newversion");
                $("#updatemessage").animate({ opacity: 0 }, function () {
                    $(this).css("display", "none");
                });
            }, 100);


        });

        $("#hideupdatething").mouseenter(function () {
            $(this).stop().animate({ backgroundColor: "rgb(88, 0, 0)" });
        }).mouseleave(function () {
            $(this).stop().animate({ backgroundColor: "red" });
        }).click(function () {
            storage.remove("newversion");
            $("#updatemessage").animate({ opacity: 0 }, function () {
                $(this).css("display", "none");
            });
        });
    });

}



},250);