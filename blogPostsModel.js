let mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var blogSchema = mongoose.Schema({
    id: { 
        type: String, 
        required: true
    },
    title: {
        type: String
    },
    author: {
        type: String
    },
    content: {
        type: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
});

let blog = mongoose.model('BlogPost', blogSchema);

let BlogPosts = {
    get : function() {
        return blog.find()
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getById : function(id) {
        return blog.findOne({id : id})
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    getByAuthor : function(author) {
        return blog.find({author : author})
            .then(posts => {
                return posts;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    post : function(nPost) {
        return blog.create(nPost)
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete : function(id) {
        return blog.remove({id: id})
            .then(post => {
                return post;
            })
            .catch (err => {
                throw Error(err);
            });
    },
    put : function(updPost) {
        return BlogPosts.getById(updPost.id)
            .then(post => {
                if (post) {
                    return blog.findOneAndUpdate({id : post.id}, {$set : updPost}, {new : true})
                        .then(nPost => {
                            return nPost;
                        })
                        .catch(err => {
                            throw Error(err);
                        });
                } else {
                    throw Error("404. ID not found.");
                }
            })
            .catch(err => {
                throw Error(err);
            });
    }
};


module.exports = { BlogPosts };