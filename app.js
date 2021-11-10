//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;//set active PORT

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-ikq:ikqAtlast@cluster0.3nszl.mongodb.net/wikiDB?retryWrites=true&w=majority", { useNewUrlParser: true });
//schema
const articleSchema = {
    title: String,
    content: String
};
//model
const Article = mongoose.model("Article", articleSchema);

//---------------------- Method for all articles ----------------------------//

app.route("/articles")

.get(function (req, res) {
    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

.post(function (req, res) {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function (err) {
        if (!err) {
            res.send("Successfully add a new article");
        } else {
            res.send(err);
        }
    });
})

.delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Successfully delete all articles.");
        } else {
            res.send(err);
        }
    });
});

//----------------------------- Method for a specific article --------------------------------//
app.route("/articles/:articleTitle")

.get(function(req, res){

    
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticles){
        if (foundArticles){
            res.send(foundArticles);
        } else {
            res.send("No article matching that title was found.");
        }
    });
})

.put(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        //{overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully update article.");
            } else {
                console.log(err);
            }
        }
    );
})

.patch(function(req, res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully patch the article");
            } else {
                res.send(err);
                console.log(err);
            }
        }
    );
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully delete a article.");
            } else {
                res.send(err);
                console.log(err);
            }
        }
    );
});

app.listen(PORT, function () {
    console.log("Server onlined!!! and run on PORT : " + PORT);
})