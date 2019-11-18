//server.js
let bcrypt = require('bcryptjs');

//model.js
users = {
    username,
    password
}

Schema StudentsDB
    Collection students
               users
//Mongoose uses the keyword schema to create collections
//mongoose.schema and add users

app.post("/register", jsonParser, (req, res, next) => {

    let {password} = req.body;
    let hashpass = bcrypt.hash(password, 10);

    //Create new entry on the database
    users.create({username, password: hashpass}).then(......)
})

//Post is used to create new stuff on the database but we don't want to sent the password through the query string
app.post("/login", jsonParser, (req, res, next) => {

    let {username, password} = req.body;

    users.get({username}).then(
        user => {
            if(bcrypt.compare(password, user.password)){
                //successful login
            }
            else{
                //trigger an error
            }
        }
    )
})