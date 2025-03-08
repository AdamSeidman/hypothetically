getUserInfo().then((data) => {
    $(document).ready(() => {
        $('#name').text(data.name)
        $('#display-name').text(data.displayName)
        $('#email').text(data.email)
        if (typeof data.photo === 'string' && data.photo.length > 0) {
            $('#photo').attr('src', data.photo)
            $('#photo').toggleClass('hidden', false)
        }
        $('#submit-link').toggleClass('hidden', !data.isAdmin)
    })
})
