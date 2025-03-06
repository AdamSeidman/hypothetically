/*
GET: /api/test

Redirects to google.com

// TODO eventually delete
*/

module.exports = function (req, res) {
    res.redirect('https://google.com/')
}
