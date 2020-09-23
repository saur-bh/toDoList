// Set required module 
const  express = require('express');
const bodyParser = require('body-parser');
// Load the full build.
var _ = require('lodash');

//Create app 

const app = express();

app.use(express.static("public"));

/* Setting to connect to db
1.  require mongooes
2. connect to db 
3. Create Model /Schema
4. create data 
5. save data 

*/
// getting-started.js
const mongoose = require('mongoose');
const url = 'mongodb+srv://saurabh:ravi0609@cluster0.ngyi9.gcp.mongodb.net/TODOLIST?retryWrites=true&w=majority'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
//Schema 
const postSchema = new mongoose.Schema({
    name: String
  });

  // Create Model 
  const Post = mongoose.model('Post', postSchema);

  //ceate data

  const post1 = new Post({name:"Welcome to Todo list"});
  const post2 = new Post({name:"Click on + to add item"});
  const post3 = new Post({name:"Check to Remove"});

  // add in array
  const defaultPostArr = [post1,post2,post3];

  //new schema
   const listSchema =  new mongoose.Schema({
    name: String,
    items : [postSchema]
  });

  const List = mongoose.model("List",listSchema);


//const items =[];

// set view engine 

 app.set('view engine', 'ejs');

//Using bod-parser
app.use(bodyParser.urlencoded({extended:true}));


// launch the server 
app.listen(process.env.PORT || 5001,function(){

    console.log("Server is running @ port 5001 in local   ");

})


//  send html to front end

app.get('/',function(req,res){

    Post.find({},function(err,foundItems){

       /// console.log(foundItems);
        if(foundItems.length===0){
            Post.insertMany(defaultPostArr,(err)=>{

                if(err){
                    console.log("not able to create..");
                }else{
                    console.log("data created...:)");
                }

            });
            res.redirect("/");
        }else{

            res.render("list",{dayinHTML:"Today", newListItems:foundItems});
        }
        
       

    });
    
    //routing dynamic on the fyl

    app.get("/:customListName",function(req,res){

        const customListName = req.params.customListName;

        const list = new List ({
            
            name: customListName,
        
            items : defaultPostArr
        });

        //check if list is there already
        
        List.findOne({name:customListName},function(err,foundList){

            if(!err){

                if(!foundList){

                    //create new list 
                    const list = new List ({
            
                        name: customListName,
                    
                        items : defaultPostArr
                    });

                    list.save().then(() => {
                        console.log('New List created for you....') ;
                        res.redirect("/"+customListName);
                    });
            


                }else{

                    res.render("list",{dayinHTML:foundList.name, newListItems:foundList.items});
                }
            }

        });
        
      


    }) ;

 

    
});

app.post("/",function(req,res){

    var  item = req.body.itemtoAdd;
     item = item.trim();
     var  addList = req.body.dayinHTML;
     console.log("List item ",addList);
     const newPost  = new Post({name:item});

     if(item.length>0){
         //Create new Post
          newPost.save().then(() => {
           console.log('New item inserted Sucessfully.') ;
           res.redirect('/');});
     } else{

        res.redirect("/");
     }

    


});


app.post("/delete",function(req,res){
    
  var itemToDelete = req.body.checkbox;
  itemToDelete = itemToDelete.trim();
console.log("this is to e....." ,itemToDelete.trim());
  if(itemToDelete!=undefined){
    
   // Post.findByIdAndRemove(itemToDelete,function(err){

    Post.findOneAndDelete({_id:itemToDelete }, function(err){

        if(err){
            console.log("Item was not deleted",err);
        }else{

            console.log("Itemwas deleted, check db");
            res.redirect("/");
        }
    
    
      });

  }

  

}) ;


