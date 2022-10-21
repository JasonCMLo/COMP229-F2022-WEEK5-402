import express from "express";

// need passport

import passport from "passport";

// user model
import User from "../models/user.js";
import { UserDisplayName } from "../utils/index.js";

export function DisplayLoginPage(req, res, next) {
  if (!req.user) {
    return res.render("index", {
      title: "Login",
      page: "login",
      messages: req.flash("loginMessage"),
      displayName: UserDisplayName(req),
    });
  }
  return res.redirect("/movie-list");
}

export function DisplayRegisterPage(req, res, next) {
  if (!req.uwer) {
    return res.render("index", {
      title: "Register",
      page: "register",
      messages: req.flash("registerMessage"),
      displayName: UserDisplayName(req),
    });
  }
}

export function ProcessLoginPage(req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      console.err(err);
      res.end(err);
    }

    if (!user) {
      req.flash("loginMessage", "Authentication Error - User does not exist");
      res.redirect("/login");
    }

    req.logIn(user, function (err) {
      if (err) {
        console.error(err);
        res.end(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
}

export function ProcessRegisterPage(req, res, next) {
  let newUser = new User({
    username: req.body.username,
    emailAddress: req.body.emailAddress,
    displayName: req.body.firstName + " " + req.body.lastName,
  });

  User.register(newUser, req.body.password, function (err) {
    if (err) {
      if (err.name == "UserExistsError") {
        console.error("Error: User already exists");
        req.flash("registerMessage", "User Already Exists");
      } else {
        console.err(err);
        req.flash("registerMessage", "Server error");
      }

      return res.redirect("/register");
    }

    return passport.authenticate("local")(req, res, function () {
      return res.redirect("/");
    });
  });
}

export function ProcessLogout(req, res, next) {
  req.logOut(function (err) {
    if (err) {
      console.error(err);
      res.end(err);
    }

    console.log("user logged out succesfully");
  });

  res.redirect("/login");
}
