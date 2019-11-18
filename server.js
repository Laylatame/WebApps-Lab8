let express = require("express"); //Import a package 
let morgan = require("morgan"); //Morgan is a logger to log stuff when requests are executed
let bodyParser = require('body-parser');
let uuid = require('uuid');
let mongoose = require('mongoose');
let {BlogPosts} = require('./blogPostsModel');
const { DATABASE_URL, PORT } = require('./config');

let app = express(); //Set up the endpoints
let jsonParser = bodyParser.json();
mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use(morgan("dev"));

/*
let posts = [
    {
        id: uuid.v4(),
        title: "Blog Post 1",
        content: "This is the content of the first post",
        author: "Juan",
        publishDate: new Date (2019, 01, 16)
    },
    {
        id: uuid.v4(),
        title: "Blog Post 2",
        content: "This is the content of the second post",
        author: "Maria",
        publishDate: new Date (2019, 03, 07)
    },
    {
        id: uuid.v4(),
        title: "Blog Post 3",
        content: "This is the content of the third post",
        author: "Pedro",
        publishDate: new Date (2019, 05, 23)
    },
    {
        id: uuid.v4(),
        title: "Blog Post 4",
        content: "This is the content of the forth post",
        author: "Pedro",
        publishDate: new Date (2019, 07, 30)
    },
];
*/

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.get("/api/blog-posts", (req, res) => {

    BlogPosts.get().then(
        posts => {
            return res.status(200).json({message: posts, status: 200});
        }).catch(
            err => {
                return res.status(500).json({message: "There was an error with the database.", status: 500});
        })
});


app.get("/api/blog-post", (req, res) => {
    let author = req.query.author;

    if(! author){
        return res.status(406).json({message: "Missing author in params", status:406});
    }

    BlogPosts.getByAuthor(author).then(
        postsAuthor => {
            if(postsAuthor.length == 0){
                return res.status(404).json({message: "Author not found", status: 404});

            }
            else{
                return res.status(200).json({message: postsAuthor, status: 200});

            }
    }).catch(
        err => {
            return res.status(500).json({message: "There was an error with the database.", status: 500});
    });
});

app.post("/api/blog-posts", jsonParser, (req, res) => {

    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if (! title || ! content || ! author || ! publishDate){
        return res.status(406).json({message: "Fields incomplete", status: 406});
    }

    posts.push({
        id: uuid.v4(),
        title: title,
        content: content,
        author: author,
        publishDate: publishDate//new Date (publishDate)
    });

    return res.status(201).json({message: "Success: " + title + " was added.", status: 201});
});

app.delete("/api/blog-posts/:id", (req, res) => {

    let id = req.params.id;
    
    for(let i=0; i<posts.length; i++){
        if (posts[i].id == id){
            posts = posts.filter(post => post.id != id);
            return res.status(200).json({message: "Blog removed.", status: 200});
        }
    }

    return res.status(404).json({message: "Blog not found.", status: 404});
});

app.put("/api/blog-posts/:id", jsonParser, (req, res) => {
    
    let idB = req.body.id;
    let id = req.params.id;
    let content = req.body.content;

    if (!idB){
        return res.status(406).json({message: "Missing id in body", status: 406});
    }
    
    if(id != idB){
        return res.status(409).json({message: "Id in body and params don't match", status: 409});
    }

    for (let i=0; i<posts.length; i++){
        if (posts[i].id == id){
            if(content.title != undefined){posts[i].title = content.title;}
            if(content.content != undefined){posts[i].content = content.content;}
            if(content.author != undefined){posts[i].author = content.author;}
            if(content.publishDate != undefined){posts[i].publishDate = new Date(content.publishDate);}
            return res.status(202).json({message: "Object updated: " + posts[i].title, status: 202});
        }
    }

    return res.status(406).json({message: "Blog not found ", status: 406});
});


app.listen('8080', () => {
    console.log("Our app is running on port 8080");
});

