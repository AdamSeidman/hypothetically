/*
POST: /api/category

Submit new "category" information
*/

module.exports = function (req, res) {
    console.log('category')
    console.log(req.body)
    res.redirect('/admin')
}