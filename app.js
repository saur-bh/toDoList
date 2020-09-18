// Set required module 
const  express = require('express');
const bodyParser = require('body-parser');

//Create app 

const app = express();

app.use(express.static("public"));

const items =[];

// set view engine 

 app.set('view engine', 'ejs');

//Using bod-parser
app.use(bodyParser.urlencoded({extended:true}));


// launch the server 
app.listen(process.env.PORT|5001,function(){

    console.log("Server is running @  ");

})


//  send html to front end

app.get('/',function(req,res){

    var today = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   var  day =  today.toLocaleDateString('hi-IN', options);
    res.render("list",{dayinHTML:day, newListItems:items});

    
});

app.post("/",function(req,res){

    var  item = req.body.itemtoAdd;
     item = item.trim();
     if(item.length>0){
        items.push(item);
     }
  
     
        
     

    console.log(item);
    res.redirect('/');


});