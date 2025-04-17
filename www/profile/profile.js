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
        $('.modal-close').click(() => {
            $('.modal-overlay').toggleClass('hidden', true)
        })
        if (!data.defaultAvatar?.none && data.defaultAvatar.character && data.defaultAvatar.color) {
            if (color && character) {
                character = data.defaultAvatar.character
                color = data.defaultAvatar.color
                nextIcon(0)
                nextColor(0)
            }
            $('#default-avatar-text').text(`${data.defaultAvatar.color} ${data.defaultAvatar.character}`)
            $('#clear-avatar-btn').toggleClass('hidden', false)
        } else {
            $('#default-avatar-text').text('None Set!')
        }
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

async function clearDefaultAvatar() {
    if (confirm('Are you sure you want to clear your default avatar?')) {
        const changed = await setDefaultAvatar(null)
        if (changed) {
            $('#clear-avatar-btn').toggleClass('hidden', true)
            $('#default-avater-text').text('None Set!')
        }
        alert(changed? 'Avatar cleared!' : 'Error trying to clear avatar.')
    }
}

function defaultAvatarModal() {
    $('#avatar-submit-btn').attr('disabled', false)
    $('#default-avatar-modal').toggleClass('hidden', false)
}

async function submitDefaultAvatar() {
    $('#clear-avatar-btn').attr('disabled', true)
    const changed = await setDefaultAvatar(`${$('#character-text').text()}|${$('#color-text').text()}`)
    if (changed) {
        $('#clear-avatar-btn').toggleClass('hidden', false)
        $('#default-avatar-modal').toggleClass('hidden', true)
        $('#default-avatar-text').text(`${$('#color-text').text()} ${$('#character-text').text()}`)
    }
    alert(changed? 'Default avatar changed successfully!' : 'Error changing default avatar.')
}
