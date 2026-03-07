//jshint esversion:6
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose, { Model } from "mongoose";
import encrypt from "mongoose-encryption";
// import flash from "connect-flash";

mongoose.connect("mongodb://localhost:27017/userDBRohit");

const userSchema = new mongoose.Schema({
  email: String,
  pass: String,
});

const secret = "Thisismyscretekey.";

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["pass"] });

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(flash());

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  try {
    const userData = new User({
      email: email,
      pass: pass,
    });
    userData.save();
    res.render("secrets");
  } catch (error) {
    console.log(error);
  }

  console.log("email of user is " + email + " and password is " + pass);
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  console.log(email);

  const searchUser = await User.findOne({ email, pass });

  console.log(searchUser);

  if (searchUser) {
    res.render("secrets");
  } else {
    // req.flash("error", "Wrong user or pass");
    res.redirect("/login");
  }
});

app.get("/logout", async (req, res) => {
  res.redirect("/login");
});
app.listen(3000, () => {
  console.log("Server started in port http://localhost:3000");
});
