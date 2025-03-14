let myName = ''

const MAX_DISPLAY_NAME_LENGTH = 20

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
    if (name && name.trim() !== myName) {
        name = name.trim()
        if (name.length > MAX_DISPLAY_NAME_LENGTH) {
            alert(`Display name is too long!\n(${MAX_DISPLAY_NAME_LENGTH} characters or less)`)
        } else if (name.length > 1) {
            updateDisplayName(name)
                .then(() => {
                    $('#display-name').text(name)
                    myName = name
                })
                .catch(err => {
                    alert('Could not edit display name!')
                    console.error(err)
                })
        } else {
            alert('Invalid name!')
        }
    }
}
