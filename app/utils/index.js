// check if user is authenticated or not

export function AuthGuard(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
}

// get info about user

export function UserDisplayName(req) {
  if (req.user) {
    return req.user.displayName;
  }

  return "";
}
