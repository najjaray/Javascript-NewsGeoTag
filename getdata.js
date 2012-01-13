// initialize XMLHttpRequest object
var xmlobj=null;
// initialize global variables
var data=new Array();
var i=0;

// send http request
function sendRequest(doc,page){
    // check for existing requests
    if(xmlobj!=null&&xmlobj.readyState!=0&&xmlobj.readyState!=4){
        xmlobj.abort();
    }
    try{
        // instantiate object for Firefox, Nestcape, etc.
        xmlobj=new XMLHttpRequest();
    }
    catch(e){
        try{
            // instantiate object for Internet Explorer
            xmlobj=new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch(e){
            // Ajax is not supported by the browser
            xmlobj=null;
            return false;
        }
    }
    // assign state handler
    xmlobj.onreadystatechange=stateChecker;
    // open socket connection
    xmlobj.open('GET',doc,true);
    // send request
    xmlobj.send(null);
}

// check request status
function stateChecker(){
    // if request is completed
    if(xmlobj.readyState==4){
        // if status == 200 display text file
        if(xmlobj.status==200){
            // create data container
            //createDataContainer();
            // display data into container
            data=xmlobj.responseXML;

			lsit_total_pages = data.getElementsByTagName("folder")[0].getAttribute("found")/data.getElementsByTagName("folder")[0].getAttribute("count");
			var alldata = data.getElementsByTagName("place");
			clearoptinos();
			
			for (i=0;i<alldata.length;i++)
			{
				var shape_points = new Array();
				var shape_fill = new Array();
				var selected_item = (selected_items[alldata[i].getAttribute("id")] != null);
				addraw('options',alldata[i].getAttribute("id"),alldata[i].getElementsByTagName("name")[0].childNodes[0].nodeValue,selected_item);
				for (j=0;j<alldata[i].getElementsByTagName("polygon")[0].childNodes.length;j++)
				{
					shape_points.push(new YGeoPoint(alldata[i].getElementsByTagName("polygon")[0].childNodes[j].getAttribute("y"), alldata[i].getElementsByTagName("polygon")[0].childNodes[j].getAttribute("x")));
					
					//alert(alldata[i].getElementsByTagName("polygon")[0].childNodes[j].getAttribute("x") + "#" + alldata[i].getElementsByTagName("polygon")[0].childNodes[j].getAttribute("y"));
				}
				

				shape_points.push(shape_points[0]);
				
				wiki_data[alldata[i].getAttribute("id")] = shape_points;
				showpages();
			}
            //displayData();
        }
        else{
            //alert('Failed to get response :'+ xmlobj.statusText);
        }
    }
}

// execute program when page is loaded
window.onload=function(){
    // check if browser is DOM compatible
    if(document.getElementById &&
       document.getElementsByTagName &&
       document.createElement){
        // load data file
    }
}