let myName = ''

getUserInfo().then((data) => {
    $(document).ready(() => {
        $('#name').text(data.name)
        $('#display-name').text(data.displayName)
        myName = data.displayName
        $('#email').text(data.email)
        if (typeof data.photo === 'string' && data.photo.length > 0) {
            $('#photo').attr('src', data.photo)
            $('#photo').toggleClass('hidden', false)
        }
        $('#submit-link').toggleClass('hidden', !data.isAdmin)
    })
})

function editDisplayName() {
    let name = prompt('Enter new name:')
    if (name && name.trim().length > 1 && myName !== name) {
        name = name.trim()
        updateDisplayName(name)
            .then(() => {
                $('#display-name').text(name)
                myName = name
            })
            .catch(err => {
                alert('Could not edit display name!')
                console.error(err)
            })
    }
}
