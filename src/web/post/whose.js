/*
POST: /api/whose

Submit new "whose" information
*/

module.exports = function (req, res) {
    console.log('whose')
    console.log(req.body)
    res.redirect('/admin')
}