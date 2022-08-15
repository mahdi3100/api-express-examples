var express = require("express");
var app = express();
var fs = require("fs");

/*
app.set("port", 8080);
app.listen(app.get("port"))
*/

//Save data of the file to prevent load it each time
let exposeData = null;

/**
 * 1/ Build a Restful web service API which will load the dump file and
 *  
 * */
app.use(function (req, res, next) {

   /** check if iban paramatere exist in transition file */
   let checkIbanExist = () => {
      if (req.query.iban) {
         let ArrayContainIban = exposeData.find(ele => ele["Iban source"] == req.query.iban);
         if (!ArrayContainIban) next(`IBAN ${req.query.iban} not found`);
         
         //save it in req object 
         req.iban = ArrayContainIban;
         
      }
   }

   //if var exposeData is empty , read transaction file otherwise we skip reading the file
   if (!exposeData) {
      fs.readFile(__dirname + "/transactions.json", function (err, data) {
         if (err) {
            next(err)//return res.status(404).send("Error");
         }
         exposeData = JSON.parse(data);

         
         checkIbanExist();
         next()


      });

   } else {

      checkIbanExist();
      next()

   }
})

//ERROR middleware
app.use(function (err, req, res, next) {
   return res.status(404).send(err)
})


// endpoit  root
app.get("/", function (req, res) {

   /**
    * Display all transaction if the paramatere "iban" is undefined 
    *  (/2the endpoint will expose all file's content as a basic JSON object..)
    *  otherwise we show only the transition that contains that iban
    * */

   (req.iban) ? res.status(200).send(req.iban) : res.status(200).send(exposeData)

});

/**3/ Add a new endpoint nested in the first one to retrieve the biggest transaction. 
 * This new endpoint should, of course, take in count the potential query params given to the "parent" endpoint.
 * */
app.get("/big", function (req, res) {

   var [index, amount] = [0, 0];

   exposeData.map((ele, i) => {
      if (ele["Amount"] > amount) {

         index = i;
         amount = ele["Amount"]
      }
   });

 /**
 * This new endpoint should, of course,
 *  take in count the potential query params given to the "parent" endpoint.
 * we display thte transaction chunk which match the IBAN's paramater .
 */
   let showiban = "";
   if (req.iban) {
      showiban = JSON.stringify(req.iban)
   }

   res.send(showiban + "<br><h2>The biggest amount is </h2>" + JSON.stringify(exposeData[index]))

})





app.param("Iban",function(req,res,next,iban){
   
    let obj = exposeData.find(o => o["Iban source"] == iban);
    if(!obj) next("Not found")
    next(obj)//next to route /list
})
app.get("/list/:Iban",function(req,res){
   res.send(obj)
})


app.all("*",function(req,res,next){
   console.log("rrrrrrrrrrrrrrrrrrr")
   next("Route Not Found")
});


module.exports = app;