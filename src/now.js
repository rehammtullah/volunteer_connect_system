const express = require("express");
const jwt = require('jsonwebtoken');
const app = express();
const path = require("path");
const hbs = require("hbs");
const cookieParser=require("cookie-parser");
const staticpath = path.join(__dirname, "../public");
const partialpath = path.join(__dirname, "../templates/partials");
const templatepath = path.join(__dirname, "../templates/views");
app.set("view engine", "hbs");
app.set("views", templatepath);
app.use(express.json());
app.use(express.static(staticpath));
hbs.registerPartials(partialpath);
let nodemailer = require("nodemailer");
let http = require("http");
let port = 5005;
const bodyparser = require("body-parser");
const multer = require('multer');
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
let mysql = require("mysql2");
let db = mysql.createConnection({
    host: "localhost",
    user: "rehammtullah",
    password: "Shannu6300$,",
    database: "volunteer",
});
db.connect(function(err) {
    if (err) {
        console.log("some error ");
    } else {
        console.log("connected");
    }
});

const verifyUser = (req, res, next) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
      console.log("not verified -- verifyUser.js")
      res.render("login",{message:"your session is expired, login again"});
    }
    else{
      jwt.verify(cookie, "secret", (err, user) => {
        req.user = user;
        next();
      });
    }
  };
  

  
  var session = require("express-session");
  const passport = require("passport");
  app.use(cookieParser());
  app.use(
      session({
        secret: "secret",
        cookie: {
          maxAge: 60000,
        },
        resave: false,
        saveUninitialized: false,
      })
    );
  
  app.use(session({ secret: "cats" }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
          user: "dbmsproject09@gmail.com",
          pass: "bfmsiekyfigsvjuk",
      },
  });
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          return cb(null, '../public/images')
      },
      filename: (req, file, cb) => {
          return cb(null, Date.now() + path.extname(file.originalname));
      }
  });
  const upload = multer({
      storage: storage
  });
  const socketio = require('socket.io');
const formatMessage = require('./helpers/formatDate')
const {
    getActiveUser,
    exitRoom,
    newUser,
    getIndividualRoomUsers
} = require('./helpers/userHelper');
const server = http.createServer(app);
const io = socketio(server);
io.on('connection', socket => {
    socket.on('joinRoom', ({
        username,
        room,
        email,
        identifier
    }) => {
        const user = newUser(socket.id, username, room, email, identifier);
        socket.join(user.room);
        socket.join(user.identifier);
        socket.join(user.email);
        socket.emit('message', formatMessage("Helping Hands", 'Messages are limited to this room', 'dbmsproject09@gmail.com '));
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage("Helping Hands", `${user.username} has joined the room`, 'dbmsproject09@gmail.com')
            );
        let sql = `select user,message,time,email,date from chat where rid="${user.room}"`;
        db.query(sql, function(err, result1) {
            if (err) {
                console.log(err);
                res.redirect("view_requests");
            } else {
                if (result1.length > 0) {
                    for (let i = 0; i < result1.length; i++) {
                        io.to(user.identifier).emit('pastmessages', {
                            user: result1[i].user,
                            message: result1[i].message,
                            time: result1[i].time,
                            email: result1[i].email,
                            date: result1[i].date
                        });
                    }
                }
            }
        });
        let sql1 = `select email from accept_status where rid="${user.room}"`;
        db.query(sql1, function(err, result1) {
            if (err) {
                console.log(err);
                res.redirect("view_requests");
            } else {
                if (result1.length > 0) {
                    for (let i = 0; i < result1.length; i++) {
                        io.to(user.room).emit('allusers', {
                            email: result1[i].email,
                        });
                    }
                }
            }
        })
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            email: user.email,
            users: getIndividualRoomUsers(user.room)
        });
    });
    socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);
        let sql = `INSERT INTO chat(rid,user,message,time,email,date) VALUES ("${user.room}","${user.username}","${msg}","${formatMessage(user.username, msg).time}","${user.email}","${formatMessage(user.username, msg).date}" );`;
        db.query(sql, function(err, result) {
            if (err) {
                console.log('error here');
            } else {}
        });
        io.to(user.room).emit('message', formatMessage(user.username, msg, user.email));
    });
    socket.on('disconnect', () => {
        const user = exitRoom(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("Helping Hands", `${user.username} has left the room`)
            );
            // Current active users and room name
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getIndividualRoomUsers(user.room)
            });
        }
    });
});
app.get("/login", async (req, res, next) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("login")
    }
    else{
        res.redirect("user");
    }

})
app.post("/login", async (req, res) => {
    let user = req.body.email;
    let pass = req.body.password;
    try {
        let sql = `select * from register where email="${user}" and password="${pass}"`;
        db.query(sql, function(err, result) {
            if (result.length > 0) {
                result[0].logged=true;
                result[0].pagestatus="login";
                console.log(result[0]);
                
                let token = jwt.sign(result[0], "secret");
                    res.cookie("access_token", token, { httpOnly: true })
                    res.redirect('user');
                
            } else {
                res.render('login', {
                    message: "Invalid Credentials"
                });
            }
        });
    } catch (error) {
        res.send('try again');
    }
});
app.get("/user",verifyUser, async (req, res) => {
    if(req.user.logged==true){
    req.user.pagestatus="user";
    let sql = `select image from data where email="${req.user.email}"`;
    let name=req.user.name;
    db.query(sql, function(err, result1) {
      let image=result1[0].image;
   
        res.render("user",{image,name});
        

    })
}
else{
    res.render("login");
}


})
app.get("/profile",verifyUser, async (req, res) => {
    if(req.user.logged==true){
        req.user.pagestatus="profile";
    let sql = `select   name,email,aadhar,phone,postal from register where email="${req.user.email}";`
    db.query(sql, function(err, result1) {
        if (err) {
            console.log(err);
        } else {
            let sql = `select   * from data where email="${req.user.email}";`
            db.query(sql, function(err, result2) {
                if (err) {
                    console.log(err);
                } else {
                    let sql = `select   * from personal where email="${req.user.email}";`
                    db.query(sql, function(err, result3) {
                        if (err) {
                            console.log(err);
                        } else {
                            let sql = `select   * from you where email="${req.user.email}";`
                            db.query(sql, function(err, result4) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let result = result1.concat(result2, result3, result4);
                                    res.render("profile", {
                                        result
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}
else{
    res.redirect("login");
}
})
app.get("/new_request",verifyUser, async (req, res) => {
    if(req.user.logged==true){
        req.user.pagestatus="new_request";
    let user_image;
    let sql = `select image from data where email="${req.user.email}"`;
    db.query(sql, function(err, result1) {
        user_image=result1[0].image;
        res.render("new_request", {
            user_image
        })
    })
}
else{
    res.redirect("login");
}
   
 })
app.post("/new_request", verifyUser, async (req, res, next) => {
    if(req.user.logged==true){
    let subject = req.body.subject;
    let body = req.body.body;
    let tag1 = req.body.tag1;
    let tag2 = req.body.tag2;
    let status = "0";
    let user_image,user_name=req.user.name;
    let sql = `select image from data where email="${req.user.email}"`;
    db.query(sql, function(err, result1) {
         user_image=result1[0].image;
         console.log(user_image)

    })

    if (tag1[0] != '#') {
        tag1 = "#" + tag1;
    }
    if (tag2[0] != '#') {
        tag2 = "#" + tag2;
    }
         try {
           let sql = `INSERT INTO request(email,message,tag1,tag2,subject,accept,name,image) VALUES ("${req.user.email}","${body}", "${tag1}", "${tag2}", "${subject}" , "${status}","${user_name}","${user_image}" );`;
                                db.query(sql, function(err, result) {
                                    
                                    if (err) {
                                    } else {
                                        res.render("new_request", {
                                            message: "Request Successfully Submitted ",
                                            user_image
                                        });
                                    }
                                });
                            } catch (error) {
                                console.log(error.message);
                                res.render("new_request", {
                                    message: "Error Occured, Try Again ",
                                    user_image
                                });
                            }  
                        }
                        else{
                            res.redirect("login");
                        }
                        
});
app.get("/update_personal",verifyUser, async (req, res) => {
    if(req.user.logged==true){
    
    res.render("update_personal")
    }
    else{
        res.redirect("login");
    }

})
app.get("/chat",verifyUser, async (req, res) => {
    if(req.user.logged==true){

    res.render("chat")
}
else{
    res.redirect("login");
}
})
app.get("/update_contact",verifyUser, async (req, res) => {
    if(req.user.logged==true){

    res.render("update_contact")
}
else{
    res.redirect("login");
}

})
app.post("/update_personal",verifyUser, async (req, res, next) => {
    if(req.user.logged==true){

    let employment = req.body.employment,
        disability = req.body.disability,
        about = req.body.about,
        areas = req.body.areas,
        activities = req.body.activities,
        skills = req.body.skills;
    try {
        let sql = `update personal set about="${about}",areas="${areas}",activities="${activities}",skills="${skills}" where email="${req.user.email}";`;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            } else {
                try {
                    let sql = `update you set employment="${employment}",disability="${disability}" where email="${req.user.email}";`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(404);
                        } else {
                            res.redirect('profile');
                        }
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}
else{
    res.redirect("login");
}
});
app.post("/update_contact",verifyUser, async (req, res, next) => {
    if(req.user.logged==true){

    let building = req.body.building,
        house = req.body.house,
        street = req.body.street,
        city = req.body.city,
        state = req.body.state,
        country = req.body.country,
        postal = req.body.postal,
        phone = req.body.phone;
    try {
        let sql = `update data set building="${building}",house="${house}",street="${street}",city="${city}",country="${country}",state="${state}" where email="${req.user.email}";`;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                res.sendStatus(404);
            } else {
                try {
                    let sql = `update register set phone="${phone}",postal="${postal}" where email="${req.user.email}";`;
                    db.query(sql, function(err, result) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(404);
                        } else {
                            res.redirect('profile');
                        }
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
    } catch (error) {
        console.log(error.message);
    }
}
else{
    res.redirect("login");
}
});
app.get("/view_requests",verifyUser, async (req, res) => {
    if(req.user.logged==true){

    let name_of_user=req.user.name;
          try {
              let sql = `(select * from request where email != "${req.user.email}");`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      let sql = `select  rid from accept_status where email="${req.user.email}";`
                      db.query(sql, function(err, result1) {
                          if (err) {
                              console.log(err);
                          } else {
                              var set1 = new Set();
                              for (var i = 0; i < result1.length; i++) {
                                  set1.add(result1[i].rid);
                              }
                              for (var i = 0; i < result.length; i++) {
                                  if (set1.has(result[i].rid)) {
                                      result[i].accept = "none";
                                      result[i].chat = "block";
                                  } else {
                                      result[i].accept = "block";
                                      result[i].chat = "none";
                                  }
                              }
                              let title = "All Requests",
                                  a1 = "act",
                                  a2 = "pro",
                                  a3 = "pro",
                                  a4 = "pro",
                                  a5 = "pro",
                                  a6 = "pro",
                                  delete_status = "none",
                                  user = req.user.email,
                                  pagestatus = "view_requests";
                              res.render("view_requests", {
                                  result,
                                  title,
                                  a1,
                                  a2,
                                  a3,
                                  a4,
                                  a5,
                                  a6,
                                  user,
                                  name_of_user,
                                  delete_status,
                                  pagestatus
                              });
                          }
                      });
                  }
              })
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
          else{
            res.redirect("login");
        }
     
  })
  app.get("/my_requests",verifyUser, async (req, res) => {
    if(req.user.logged==true){

      let name_of_user=req.user.name;
  
          try {
              let sql = `select * from request where email = "${req.user.email}";`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      for (var i = 0; i < result.length; i++) {
                          result[i].accept = "none";
                          result[i].chat = "block";
                      }
                      let title = "My Requests",
                          a1 = "pro",
                          a2 = "act",
                          a3 = "pro",
                          a4 = "pro",
                          a5 = "pro",
                          a6 = "pro",
                          delete_status = "block",
                          user = req.user.email,
                          pagestatus = "my_requests";
                      res.render("view_requests", {
                          result,
                          title,
                          a1,
                          a2,
                          a3,
                          a4,
                          a5,
                          a6,
                          user,
                          name_of_user,
                          delete_status,
                          pagestatus
                      });
                  }
              });
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
        else{
          res.redirect("login");
      }
    
  })
  app.get("/my_accepted",verifyUser, async (req, res) => {
    if(req.user.logged==true){

      let name_of_user=req.user.name;
  
          try {
              let sql = `select * from request where email = "${req.user.email}" and accept="1";`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      for (var i = 0; i < result.length; i++) {
                          result[i].accept = "none";
                          result[i].chat = "block";
                      }
                      let title = "My Accepted Requests",
                          a1 = "pro",
                          a2 = "pro",
                          a3 = "act",
                          a4 = "pro",
                          a5 = "pro",
                          a6 = "pro",
                          delete_status = "block",
                          user = req.user.email,
                          pagestatus = "my_accepted";
                      res.render("view_requests", {
                          result,
                          title,
                          a1,
                          a2,
                          a3,
                          a4,
                          a5,
                          a6,
                          user,
                          name_of_user,
                          delete_status,
                          pagestatus
                      });
                  }
              });
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
        else{
          res.redirect("login");
      }
      
  })
  app.get("/my_pending",verifyUser, async (req, res) => {
    if(req.user.logged==true){

      let name_of_user=req.user.name;
  
          try {
              let sql = `select * from request where email = "${req.user.email}" and accept="0";`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      for (var i = 0; i < result.length; i++) {
                          result[i].accept = "none";
                          result[i].chat = "block";
                      }
                      let title = "My Pending Requests",
                          a1 = "pro",
                          a2 = "pro",
                          a3 = "pro",
                          a4 = "act",
                          a5 = "pro",
                          a6 = "pro",
                          delete_status = "block",
                          user = req.user.email,
                          pagestatus = "my_pending";
                      res.render("view_requests", {
                          result,
                          title,
                          a1,
                          a2,
                          a3,
                          a4,
                          a5,
                          a6,
                          user,
                          name_of_user,
                          delete_status,
                          pagestatus
                      });
                  }
              });
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
        else{
          res.redirect("login");
      }
    
  })
  app.get("/others_accepted",verifyUser, async (req, res) => {
    if(req.user.logged==true){

      let name_of_user=req.user.name;
  
          try {
              let sql = `select * from request where email != "${req.user.email}" and accept="1";`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      let sql = `select  rid from accept_status where email="${req.user.email}";`
                      db.query(sql, function(err, result1) {
                          if (err) {
                              console.log(err);
                          } else {
                              var set1 = new Set();
                              for (var i = 0; i < result1.length; i++) {
                                  set1.add(result1[i].rid);
                              }
                              for (var i = 0; i < result.length; i++) {
                                  if (set1.has(result[i].rid)) {
                                      result[i].accept = "none";
                                      result[i].chat = "block";
                                  } else {
                                      result[i].accept = "block";
                                      result[i].chat = "none";
                                  }
                              }
                              let title = "Others Accepted Requests",
                                  a1 = "pro",
                                  a2 = "pro",
                                  a3 = "pro",
                                  a4 = "pro",
                                  a5 = "act",
                                  a6 = "pro",
                                  delete_status = "none",
                                  user = req.user.email,
                                  pagestatus = "others_accepted";
                              res.render("view_requests", {
                                  result,
                                  title,
                                  a1,
                                  a2,
                                  a3,
                                  a4,
                                  a5,
                                  a6,
                                  user,
                                  name_of_user,
                                  delete_status,
                                  pagestatus
                              });
                          }
                      });
                  }
              });
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
        else{
          res.redirect("login");
      }
   
  })
  app.get("/others_pending",verifyUser, async (req, res) => {
    if(req.user.logged==true){

      let name_of_user=req.user.name;
  
          try {
              let sql = `select * from request where email != "${req.user.email}" and accept ="0";`;
              db.query(sql, function(err, result) {
                  if (err) {
                      res.send("error here");
                  } else {
                      let sql = `select  rid from accept_status where email="${req.user.email}";`
                      db.query(sql, function(err, result1) {
                          if (err) {
                              console.log(err);
                          } else {
                              var set1 = new Set();
                              for (var i = 0; i < result1.length; i++) {
                                  set1.add(result1[i].rid);
                              }
                              for (var i = 0; i < result.length; i++) {
                                  if (set1.has(result[i].rid)) {
                                      result[i].accept = "none";
                                      result[i].chat = "block";
                                  } else {
                                      result[i].accept = "block";
                                      result[i].chat = "none";
                                  }
                              }
                              let title = "Others Pending Requests",
                                  a1 = "pro",
                                  a2 = "pro",
                                  a3 = "pro",
                                  a4 = "pro",
                                  a5 = "pro",
                                  a6 = "act",
                                  delete_status = "none",
                                  user = req.user.email,
                                  pagestatus = "others_pending";
                              res.render("view_requests", {
                                  result,
                                  title,
                                  a1,
                                  a2,
                                  a3,
                                  a4,
                                  a5,
                                  a6,
                                  user,
                                  name_of_user,
                                  delete_status,
                                  pagestatus
                              });
                          }
                      });
                  }
              });
          } catch (error) {
              console.log(error.message);
              res.send(error.message);
          }
        }
        else{
          res.redirect("login");
      }
  })
app.get("/home", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("home")
    }
    else{
        res.redirect("user");
    }

})
app.get("/reset_password", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("reset_password")
    }
    else{
        res.redirect("user");
    }

})
app.get("/forget_password", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("forget_password")
    }
    else{
        res.redirect("user");
    }

})
app.get("/helpinghands", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("home")
    }
    else{
        res.redirect("user")
    }

})
app.get("/", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
    res.render("home")
    }
    else{
        res.redirect("user")
    }

})
app.post("/view_profile",verifyUser, async (req, res) => {
    if(req.user.logged==true){

    if (req.body.profile == "View Profile") {
        let user2 = req.body.email;
        let room = req.body.room;
        let sql = `select   * from register where email="${user2}";`
        db.query(sql, function(err, result1) {
            if (err) {
                console.log(err);
            } else {
                let sql = `select   * from data where email="${user2}";`
                db.query(sql, function(err, result2) {
                    if (err) {
                        console.log(err);
                    } else {
                        let sql = `select   * from personal where email="${user2}";`
                        db.query(sql, function(err, result3) {
                            if (err) {
                                console.log(err);
                            } else {
                                let sql = `select   * from you where email="${user2}";`
                                db.query(sql, function(err, result4) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        let result = result1.concat(result2, result3, result4);
                                        res.render("view_profile", {
                                            result
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    } else if (req.body.accept == "Accept") {
        let roomId = parseInt(req.body.room);
        let sql = `update request set accept="1" where rid="${roomId}";`
        db.query(sql, function(err, result5) {
            if (err) {
                console.log(err);
            } else {
                let sql = `insert into accept_status(rid,email) values("${roomId}","${req.user.email}");`
                db.query(sql, function(err, result4) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect(req.body.pagestatus);
                    }
                });
            }
        });
    } else if (req.body.delete == "Delete") {
        let roomId = parseInt(req.body.room);
        let sql = `delete from chat where rid="${roomId}";`
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                let sql = `delete from accept_status where rid="${roomId}";`
                db.query(sql, function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        let sql = `delete from request where rid="${roomId}";`
                        db.query(sql, function(err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.redirect(req.body.pagestatus);
                            }
                        });
                    }
                });
            }
        });
    }
}
    else{
        res.redirect("login");
    }
})
app.post("/add_image",verifyUser, upload.single('filename'), async (req, res, next) => {
        if(req.user.logged==true){

    image = req.file.filename;
    let sql = `update data set image='${image}' where email='${req.user.email}'`;
    db.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.redirect("home");
        } else {
            let sql = `update request set image='${image}' where email='${req.user.email}'`;
            db.query(sql, function(err, result1) {
                if (err) {
                    console.log(err);
                    res.redirect("home");
                } else {
                    res.redirect("profile");
                }
            });
        }
    });
}
else{
    res.redirect("login");
}
})
app.post("/register_email", async (req, res, next) => {
    let email = req.body.email;
    const secret = 'hello secret' + email;
    const payload = {
        email: email,
    };
    const token = jwt.sign(payload, secret, {
        expiresIn: "15m"
    });
    const link = `http://localhost:5005/register/${email}/${token}`;
    let mailOptions = {
        from: "dbmsproject09@gmail.com",
        to: `"${req.body.email}"`,
        subject: "Email verification to confirm registration ",
        html: '<h1>Thank You for showing interest in our volunteer connect system.</h1><br>' +
            '<p>Please click on the following link to verify your email address and continue regustration with "Helping Hands" and if you logged in your current browser, please logout to end the session and then continue with the registration :</p><br>' +
            `"${link}"` +
            '<br>mail generated by Helping Hands Website    --       copyright@dbms09',
    };
    transport.sendMail(mailOptions, function(error, info) {
        try {
            console.log(error);

            if (error) {
                console.log(error);
                //remove error here
                res.render("login", {
                    message: "Invalid Email"
                });
            } else {
                res.render("login", {
                    message: "Link Sent to your Gmail Account"
                });
            }
        } catch (error) {
            
        }
    });
});
app.get("/register/:email/:token", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
  
    const {
        email,
        token
    } = req.params;
   
    const secret = 'hello secret' + email;
    try {
        const payload = jwt.verify(token, secret);
        res.render("register",{email});
    } catch (error) {
        console.log(error.message);
        res.sendStatus(404);
    }
}
else{
    res.redirect("user");
}

})

app.get("/personal", async (req, res) => {

    let cookie = req.cookies.access_token;
    if(!cookie){
        res.render("personal")
    }
    else{
        res.redirect("user")
    }
   
    

})
app.get("/update", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
       
    res.render("update")
    }
    else{
        res.redirect("user")
 
    }



})

app.get("/you", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){

    res.render("you")
    }
    else{
        res.redirect("user")
   
    }


})
app.post("/register", async (req, res, next) => {
    let email=req.body.email
    console.log(email+"r");

    let fname = req.body.firstname;
    let sname = req.body.surname;
    let s = fname + " " + sname;
    let pass = req.body.password;
    let aadhar = req.body.aadhar;
    let phone = req.body.phone;
    let postal = req.body.postal;
    res.render("update",{email,s,pass,aadhar,phone,postal});
});
app.post("/update", async (req, res, next) => {
    let s =req.body.s;
    let email=req.body.email
    console.log(email+"u");

    let pass = req.body.pass;
    let aadhar = req.body.aadhar;
    let phone = req.body.phone;
    let postal = req.body.postal;
    let building = req.body.building;
    let house = req.body.house;
    let street = req.body.street;
    let city = req.body.city;
    let state = req.body.state;
    let country = req.body.country;
    let date = req.body.date;
    let gender = req.body.gender;
    res.render("personal",{s,email,pass,aadhar,phone,postal,building,house,street,city,state,country,date,gender});
});


app.post("/personal", async (req, res, next) => {
    let s =req.body.s;
    let email=req.body.email
    console.log(email+"p");

    let pass = req.body.pass;
    let aadhar = req.body.aadhar;
    let phone = req.body.phone;
    let postal = req.body.postal;
    let building = req.body.building;
    let house = req.body.house;
    let street = req.body.street;
    let city = req.body.city;
    let state = req.body.state;
    let country = req.body.country;
    let date = req.body.date;
    let gender = req.body.gender;
    let about = req.body.about;
    let areas = req.body.areas;
    let activities = req.body.activities;
    let skills = req.body.skills;
    res.render("you",{s,email,pass,aadhar,phone,postal,building,house,street,city,state,country,date,gender,about,areas,activities,skills});
});
app.post("/you", async (req, res, next) => {
    let s =req.body.s;
    let email=req.body.email
    console.log(email+"y");

    let pass = req.body.pass;
    let aadhar = req.body.aadhar;
    let phone = req.body.phone;
    let postal = req.body.postal;
    let building = req.body.building;
    let house = req.body.house;
    let street = req.body.street;
    let city = req.body.city;
    let state = req.body.state;
    let country = req.body.country;
    let date = req.body.date;
    let gender = req.body.gender;
    let about = req.body.about;
    let areas = req.body.areas;
    let activities = req.body.activities;
    let skills = req.body.skills;
    let ethincity = req.body.ethincity;
    let employment = req.body.employment;
    let disability = req.body.disability;
    let nationality = req.body.nationality;
    try {
        let sql = `INSERT INTO you VALUES ("${ethincity}","${employment}", "${disability}", "${nationality}","${email}" );`;
        db.query(sql, function(err, result) {
            if (err) {
                    res.render('login', {
                        message: "email already exists, try with another account"
                    });
                
            } else {
                try {
                    let sql = `INSERT INTO personal VALUES ("${about}","${areas}", "${activities}", "${skills}" ,"${email}" );`;
                    db.query(sql, function(err, result) {
                        if (err) {
                                res.render('login', {
                                    message: "email already exists, try with another account"
                                });
                        
                        } else {
                            try {
                                let sql = `INSERT INTO data(building,house,street,city,gender,dob,email,country,state) VALUES ("${building}","${house}", "${street}", "${city}", "${gender}" , "${date}","${email}","${country}" ,"${state}" );`;
                                db.query(sql, function(err, result) {
                                    if (err) {
                                            res.render('login', {
                                                message: "email already exists, try with another account"
                                            });
                                        
                                    } else {
                                        try {
                                            let sql = `INSERT INTO register VALUES ("${s}","${email}", "${aadhar}", "${pass}", "${phone}" , "${postal}" );`;
                                            db.query(sql, function(err, result) {
                                                if (err) {
                                                        res.render('login', {
                                                            message: "email already exists, try with another account"
                                                        });
                                                    
                                                } else {
                                                   
                                                        res.render('login', {
                                                            message: "User Registered Successfully, Login from here"
                                                    
                                                    })
                                                }
                                            });
                                        } catch (error) {
                                            console.log(error.message);
                                        }
                                    }
                                });
                            } catch (error) {
                                console.log(error.message);
                            }
                        }
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
    } catch (error) {
        console.log(error.message);
    }
});
app.post("/forget_password", async (req, res, next) => {
    let email = req.body.email;
    const secret = 'hello secret' + email;
    const payload = {
        email: email,
    };
    const token = jwt.sign(payload, secret, {
        expiresIn: "15m"
    });
    const link = `http://localhost:5005/reset_password/${email}/${token}`;
    let mailOptions = {
        from: "dbmsproject09@gmail.com",
        to: `"${req.body.email}"`,
        subject: "Reset Password ",
        html: '<p>Please click on the following link to reset password and if you logged in your current browser, please logout to end the session and then continue with the registration :</p><br>' +
            `"${link}"` +
            '<br>mail generated by Helping Hands Website    --       copyright@dbms09',
    };
    transport.sendMail(mailOptions, function(error, info) {
        try {
            if (error) {
                //remove error here
                res.render("login", {
                    message: "Invalid Email"
                });
            } else {
                res.render("login", {
                    message: " Reset Link Sent to your Gmail Account"
                });
            }
        } catch (error) {}
    });
});
app.post("/reset_password", async (req, res, next) => {
    let email=req.body.email
    let password = req.body.password;
    try {
        let sql = `update register set password="${password}" where email="${email}";`;
        db.query(sql, function(err, result) {
            if (err) {
                console.log(err);
                req.session.destroy((err) => {
                    res.render('login', {
                        message: "Try Again"
                    });
                })
            } else {
                req.session.destroy((err) => {
                    res.render('login', {
                        message: "password changed successfully"
                    });
                })
            }
        });
    } catch (error) {
        console.log(error.message);
    }
});
app.get("/reset_password/:email/:token", async (req, res) => {
    let cookie = req.cookies.access_token;
    if(!cookie){
       
    const {
        email,
        token
    } = req.params;
    const secret = 'hello secret' + email;
    try {
        const payload = jwt.verify(token, secret);
        res.render("reset_password",{email});
    } catch (error) {
        console.log(error.message);
        res.sendStatus(404);
    }
}
else{
    res.redirect("user");
}

})
app.get('/logout',verifyUser, function(req, res){
    res.clearCookie('access_token');
    res.redirect('home');
 });






server.listen(port, () => {
    console.log("connected");
});