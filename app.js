//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false); //Uses MongoDB drivers findOneAndUpdate() instead of their depracated findAndModify() function

//"mongodb+srv://admin-rhys:<password>@cluster0-dfmlu.mongodb.net/todolistDB"
//"mongodb://localhost:27017/todolistDB"
mongoose.connect("mongodb+srv://admin-rhys:" + process.env.cluster0_password + "@cluster0-dfmlu.mongodb.net/todolistDB", {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({ //using new mongoose.Schema gives access to additional functionality
  name: {
    type: String,
    required: [true, "name is required as aprt of the schema."]
  }
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy food"
});
const item2 = new Item({
  name: "Cook food"
});
const item3 = new Item({
  name: "Eat food"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

//Get home route list
app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {

    //If there are no available documents then add the defaultItems
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("defaultItems array inserted successfully.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }

  });

});

//Handle the default browser request to favicon.ico. This seems to happen when app.get("/:custom") is called.
app.get('/favicon.ico', function(req, res){
  res.status(204);
});

//Get any list or make a new one
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);
      } else {
        //Show existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    } else {
      console.log(err);
    }
  });

});

//Add new item
app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

//Delete checked item
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Successfully deleted item from home route!");
        res.redirect("/");
      }
    });
  } else {
      List.findOneAndUpdate(
        {name: listName},
        {$pull: {items: {_id: checkedItemId}}},
        function(err, results){
          if (!err) {
            console.log("Successfully deleted item from " + listName + " route!");
            res.redirect("/" + listName);
          }
        }
      );
  }



});



app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
