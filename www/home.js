getUserInfo().then((data) => {
    console.log(data)
    $(document).ready(() => {
        $('#username').text(data.displayName)
        $('p.greeting').toggleClass('hidden', false)
        $('#submit-link').toggleClass('hidden', !data.isAdmin)
    })
})
