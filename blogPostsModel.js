let mongoose = require('mongoose');

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
    post : function(newPost) {
        return blog.create(newPost)
            .then(post => {
                return post;
            })
            .catch(err => {
                throw Error(err);
            });
    },
    delete : function(id) {
        return blog.getById(id)
            .then(post => {
                if (post) {
                    return blog.findOneAndDelete({id : id})
                        .then(deletedPost => {
                            return deletedPost;
                        })
                        .catch(err => {
                            throw Error(err);
                        });
                } else {
                    throw Error("404 ID was not found");
                }
            })
            .catch(err => {
                throw Error(err);
            });
    },
    put : function(updatedPost) {
        return BlogPosts.getById(updatedPost.id)
            .then(post => {
                if (post) {
                    return blog.findOneAndUpdate({id : post.id}, {$set : updatedPost}, {new : true})
                        .then(newPost => {
                            return newPost;
                        })
                        .catch(err => {
                            throw Error(err);
                        });
                } else {
                    throw Error("404 Id not found");
                }
            })
            .catch(err => {
                throw Error(err);
            });
    }
};


module.exports = { BlogPosts };