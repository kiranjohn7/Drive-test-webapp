module.exports = (req, res) => {
    if (req.session.user) {
        req.session.destroy(() => {
            loggedIn = null;
            console.log(req.session)
            res.redirect('/');
        });
    }
}