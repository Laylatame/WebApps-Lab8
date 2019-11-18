console.log("Working");

function emptyAll(){
    $(".blogPosts").empty();
    $("#title").val("");
    $("#content").val("");
    $("#author").val("");
    $("#id").val("");
}

function init(){

    $(".blogPosts").empty();

    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        method: "GET",
        dataType: "json",
        success: function(response){
            console.log("Success");
            for (let i=0; i<response.length; i++){
                let title = (`<h2>${response[i].title}</h2>`);
                let author = (`<h4> Written by: ${response[i].author}</h4>`);
                let date = (`<h6>Published on: ${response[i].publishDate}</h6>`);
                let content = (`<p>${response[i].content}</p>`);
                let id = (`<h6>ID: ${response[i].id}</h6>`);
                $('.blogPosts').append(`<div class="post"> ${title} ${author} ${id} ${date} ${content}</div>`);
            }
        },
        error: function(err){
            console.log("Error");
        }
    });
}

$("#postBlog").on("click", (event) => {
    event.preventDefault();
    console.log("Post blog");

    $.ajax({
        url: "http://localhost:8080/api/blog-posts",
        data: JSON.stringify({
            "title": $("#titlePost").val(),
            "content": $("#contentPost").val(),
            "author": $("#authorPost").val(),
            "publishDate": new Date()
        }),
        method: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorPost").empty();
            console.log("success post");
            console.log(response.message);
            $("#titlePost").val("");
            $("#contentPost").val("");
            $("#authorPost").val("");
            init();
        },
        error: function(err){
            console.log(err.statusText);
            $(".errorPost").text("Error: Fields are incomplete.");
        }

    });
})

$("#deleteBlog").on("click", (event) => {
    event.preventDefault();
    console.log("Delete blog");

    let id = $("#idDelete").val();

    $.ajax({
        url: "http://localhost:8080/api/blog-posts" + "/" + id,
        data: JSON.stringify({"id": id}),
        method: "DELETE",
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorDelete").empty();
            console.log(response.message);
            $("#idDelete").val("");
            init();
        },
        error: function(err){
            console.log(err.status);
            let status = err.status;
            if (! id){
                $(".errorDelete").text("Error: Id is missing.");
                status = 406;
            }
            if (status == 404){
                $(".errorDelete").text("Error: Blog was not found.");
            }
        }

    });
})

$("#update").on("click", (event) => {
    event.preventDefault();
    console.log("Update blog");
    //console.log($("#title").val()); -> Mandar como undefined

    let id = $("#idUpdate").val();
    console.log(id);

    let content = {
        "title": $("#titleUpdate").val() != "" ? $("#titleUpdate").val() : undefined,
        "content": $("#contentUpdate").val() != "" ? $("#contentUpdate").val() : undefined,
        "author": $("#authorUpdate").val() != "" ? $("#authorUpdate").val() : undefined,
        "publishDate": new Date() //Como hacer para que lea el input
    }

    $.ajax({
        url: "http://localhost:8080/api/blog-posts" + "/" + id,
        method: "PUT",
        data: JSON.stringify({
            "id": id,
            "content": content
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(response){
            $(".errorUpdate").empty();
            console.log(response.message);
            $("#idUpdate").val("");
            $("#titleUpdate").val("");
            $("#contentUpdate").val("");
            $("#authorUpdate").val("");
            init();
        },
        error: function(err){
            console.log(err.status);
            let status = err.status;
            if (! id){
                $(".errorUpdate").text("Error: ID is missing.");
                status = 404;
            }
            if (status == 406){
                $(".errorUpdate").text("Error: Blog was not found.");
            }
        }

    });
})


init();