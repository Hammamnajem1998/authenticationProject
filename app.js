// for express
const express = require('express');
const app = express();
app.use(express.json());
// for mysql
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "temp_schema"
});

// for passport 
const passport = require('passport');
app.use(passport.initialize());
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy((userName, password, done)=>{
    
    const sql1 = `select * from users WHERE name= '${userName}'; `;
    con.query(sql1, (err, user) =>{
        if (err) return done(err);
        if(!user[0]) return done(null, false, 'Incorrect user name.');
        if(password != user[0].password) return done(null, false, 'Incorrect password.');

        // console.log(user[0]);
        return done(null, user[0]);
    }); 
}));


app.post('/signup', (req, res) =>{
    try {        
        const sql1 = `INSERT INTO users (name, password) VALUES ('${req.body.username}', '${req.body.password}')`;
        con.query(sql1, (err, result) =>{
            if (err) throw err;
            console.log(result);
            return res.send(result);
        });
    }catch (error) {
        return res.status(404).send(error);
    }
});

// app.post('/login', (req, res, next) =>{
//     passport.authenticate('local',{session:false} ,{successRedirect:'/', failureRedirect: '/login', failureFlash: false})(req, res,next);
// });

app.post('/login', (req, res, next)=> {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err); 
      if (!user) return res.send('not authorized')
      return res.send('authorized');
    })(req, res, next);
});


app.get('/', (req, res) =>{
    res.send('Holow world??');
});

app.post('/users', (req, res, next) =>{
    
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err); 
        if (!user) return res.send('not authorized')
    })(req, res, next);

    const sql1 = `select * from users WHERE name= '${req.body.name}';`;
    con.query(sql1, (err, user) =>{
        if (err) return res.status(404).send("error");
        if(!user[0]) return res.status(404).send("error");
        return res.send(user[0]);
    });   

});



const port = process.env.PORT || 3000 ;
app.listen(port, () => console.log(`listing on port ${port}...`));




