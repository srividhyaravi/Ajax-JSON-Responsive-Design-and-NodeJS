
// Client side code.


// global variables
var json_result = ""
var expand_flag = 0; 
var details = "";
var myZip;


// Geolocation 
$.ajax({
	'async': false,
    'type': "POST",
    'global': false,
    'dataType': 'json',
    'url': "http://ip-api.com/json", 
    'success': function (data) {
        myZip = data.zip;
    }
});


// Make ajax call to index.js server.
$(function(){
		$("#search").click(function(){ 
				if ($("#keyword").val() == ""){
					document.getElementById("key_error").innerHTML = "Please enter a keyword.";
					document.getElementById("key_error").style.color = "red";
				}
				keyword = $('#keyword').val()
				category = $('#category').val()
				pickup = $('#pickup').is(':checked') ? "true" : "false";
				free = $('#free').is(':checked') ? "true" : "false";
				zip_code = $("#location").is(':checked')? $('#zip').val() : myZip;
				distance = $("#distance").val();
				 $.ajax({
	                url: "/",
	                type: "POST",
	                data: JSON.stringify({
	                    "keyword": keyword,
	                    "category": category,
	                    "pickup": pickup,
	                    "free": free,
	                    "zipcode": zip_code,
	                    "distance": distance

	                }),
	                contentType: "application/json",
	                complete: function() {
	                  console.log('process complete');
	                },
	                success: function(data) {
	                  console.log(data);
	                  console.log('process sucess');
	                  create_table(data);
	               },
				});

	}); });


$(function(){    // reset values.
		$("#clear").click(function(){ 
			document.getElementById("display_area").innerHTML = "";	
			document.getElementById("description").innerHTML = "";
			document.getElementById("keyword").value = "";
			document.getElementById("here").checked = false;
			document.getElementById("zip").value = "";
			document.getElementById("free").checked = false;
			document.getElementById("pickup").checked = false;
			document.getElementById("distance").value = "10";
			document.getElementById("location").checked = false;
			document.getElementById("key_error").innerHTML = "";

	}); });


function get_details(product_id)
{
			 $.ajax({
                url: "/info",
                type: "POST",
                data: JSON.stringify({
                    "product_id": product_id
                }),
                contentType: "application/json",
                complete: function() {
                  console.log('process complete');
                },
                success: function(data) {
                  display_details(data);
               },
		});
}


function iframeLoaded() {
	  expand_flag = 1;
      var iFrameID = document.getElementById('foo');
      if(iFrameID) {
            iFrameID.height = "";
            iFrameID.width = "";
            iFrameID.width = iFrameID.contentWindow.document.body.scrollWidth + "px";
            iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
            iFrameID.height =200;
            iFrameID.width  = 400;
      }   
      description = json_result['Item']['Description'];
      iframedoc = iFrameID.contentDocument || iFrameID.contentWindow.document;
	  iframedoc.body.innerHTML = description;
  }


function expand_collapse_section(){
	  if (expand_flag == 1){
		   	document.getElementById("photo").innerHTML = "<th id='photo'>Photo</th><br><br><br><br><br><br><br><br><div align='center' onclick='expand_collapse_section()'><u> Click to show seller message </u></div>"
			expand_flag = 0;
	  }
	  else{
		  result = '<iframe id="foo" onload="iframeLoaded()" />'
		  expand_flag = 1;
		  document.getElementById("photo").innerHTML = "<th id='photo'>Photo</th><br><br><br><br><br><br><br><br><div align='center' onclick='expand_collapse_section()'><u> Click to hide seller message </u></div>"
		  document.getElementById("photo").innerHTML += result;
	}
}


function display_details(data){
	console.log("displaying product details")
	var jsonPretty = JSON.stringify(JSON.parse(data),null,2); 
	console.log(jsonPretty);
	json_result = JSON.parse(data);
	var details = "<h2> Item Details </h2>"
	result = json_result['Item']
	photo_url = result['PictureURL'][0]
	title = result['Title']
	subtitle = result['Subtitle']
	price = result['CurrentPrice']['Value']
	location1 = result['Location']
	seller = result['Seller']['UserID']
	return_policy = result['ReturnPolicy']['ReturnsAccepted']
	specifics = result['ItemSpecifics']['NameValueList']
	details += "<table class='table table-striped' align = 'center' style = 'margin-left=-10cm;' border='1' width='600'><col width='80'><col width='130'><tr><th id='photo'>Photo</th>"
	details += "<th><img src='"+photo_url+ "'height='450' width='500'></th></tr>"
	details += "<tr><td width='60%'> Title </td>" + "<td>"+title + "</td></tr>"
	details += "<tr><td width='60%'> Price </td>" + "<td>"+price + "</td></tr>"
	details += "<tr><td width='60%'> Location </td>" + "<td>"+location1 + "</td></tr>"
	details += "<tr><td width='60%'> Seller </td>" + "<td>"+seller + "</td></tr>"
	details += "<tr><td width='60%'> Return Policy (US) </td>" + "<td>"+return_policy + "</td></tr>";
	for(var i=0; i<specifics.length; i++)
	{
		details += "<tr><td width='60%'>" + specifics[i]['Name'] + "</td><td>" + specifics[i]['Value']+ "</td></tr>"
	}

	document.getElementById("display_area").innerHTML = details;
	document.getElementById("photo").innerHTML += "<br><br><br><br><br><br><br><br><div align='center' onclick='expand_collapse_section()'><u> Click to show seller message </u></div>"
}


function create_table(data){
	console.log("displaying table");
	var jsonPretty = JSON.stringify(JSON.parse(data),null,2);  
	console.log(jsonPretty);
	var table = ""
	table += "<table class='table' width='900' id='mytable'><thead><tr><th scope='col'>Index</th> <th scope='col'>Photo</th> <th scope='col'> Name </th> <th scope='col'>Price</th> <th scope='col'>Zip code </th> <th scope='col'>Condition</th> <th scope='col'>Shipping Option</th></tr></thead><tbody>"
	json_data = JSON.parse(data);
	status =json_data['findItemsAdvancedResponse'][0]['ack']
	if (status == "Success"){   
		count = json_data['findItemsAdvancedResponse'][0]['searchResult'][0]['@count']
		for(var i =1; i<=count; i++) {
			search_result = json_data['findItemsAdvancedResponse'][0]['searchResult'][0]['item'][i-1]
			photo_url = search_result['galleryURL']
			name = search_result['title']
			item_url = search_result['viewItemURL']
			price = search_result['sellingStatus'][0]['currentPrice'][0]['__value__']
			zip_code = search_result['postalCode']
			condition = search_result['condition'][0]['conditionDisplayName']
			shipping = search_result['shippingInfo'][0]['shippingServiceCost'][0]['__value__']
			if (shipping== 0){
				shipping = "Free Shipping";
			}
			product_id = search_result['itemId']
			table += "<tr><td>" + i + "</td>"
			table += "<td><img src='"+photo_url+ "'height='30' width='30'></td>";
			table += "<td onclick = 'get_details("+product_id+")'>"+ name+ "</td>"
			table += "<td>" + price + "</td><td>" + zip_code+ "</td><td>"+ condition+ "</td><td>"+ shipping+ "</td><td></tr>";
		}
		table += "</tbody></table>"
		document.getElementById("display_area").innerHTML = table;
	}
}