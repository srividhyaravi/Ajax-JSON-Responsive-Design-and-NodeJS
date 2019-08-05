// Node-JS Server code.

const express = require('express')
const request = require('request');

const app = express()
let fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({extended: true})); 


app.post('/', function(req, res) {
  console.log(req.body);
  keyword = req.body.keyword
  category = req.body.category
  shipping_pickup = req.body.pickup 
  shipping_free = req.body.free 
  distance = req.body.distance
  zip_code = req.body.zipcode
  current_location = req.body.here
  console.log(zip_code);
  global.url = "http://svcs.eBay.com/services/search/FindingService/v1?siteid=0&SECURITY-APPNAME=USCcc04da-be0e-426d-b7bd-582336ae77f&OPERATION-NAME=findItemsAdvanced&SERVICE-VERSION=1.0.0&RESPONSE-DATA-FORMAT=JSON&paginationInput.entriesPerPage=20&keywords="+keyword + "&buyerPostalCode="+zip_code+"&itemFilter(0).name=MaxDistance&itemFilter(0).value="+distance+
  "&itemFilter(1).name=FreeShippingOnly&itemFilter(1).value="+shipping_free+"&itemFilter(2).name=LocalPickupOnly&itemFilter(2).value="+shipping_pickup+"&itemFilter(3).name=HideDuplicateItems&itemFilter(3).value=true&itemFilter(4).name=Condition&itemFilter(4).value(0)=New&itemFilter(4).value(1)=Used&itemFilter(4).value(2)=Unspecified"
  console.log(global.url);
  var request = require('request');
  request(global.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        res.json(body);
     }
})
})

app.post('/info', (req, res) => {
   console.log("inside info");
   product_id = req.body.product_id
   global.url = "http://open.api.ebay.com/shopping?callname=GetSingleItem&responseencoding=JSON&appid=USCcc04da-be0e-426d-b7bd-582336ae77f&siteid=0&version=967&ItemID="+product_id+"&IncludeSelector=Description,Details,ItemSpecifics"
   var request = require('request');
   request(global.url, function (error, response, body) {
   		console.log(response.statusCode)
	    if (!error && response.statusCode == 200) {
	    	console.log(body);
	        res.json(body);
	     }
	})
})

// Listening on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port${port}`);
})