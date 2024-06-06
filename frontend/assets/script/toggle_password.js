export function handleTogglePassword() {
    const togglePassword = document.getElementById('togglePassword');
    const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');
    const togglePasswordOld = document.getElementById('togglePasswordOld');
    const togglePasswordNew = document.getElementById('togglePasswordNew');

    if (togglePassword) {
        togglePassword.addEventListener('click', function () {
            const password = document.getElementById('password');
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (togglePasswordConfirm) {
        togglePasswordConfirm.addEventListener('click', function () {
            const confirmPassword = document.getElementById('confirmPassword');
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (togglePasswordOld) {
        togglePasswordOld.addEventListener('click', function () {
            const oldPassword = document.getElementById('oldPassword');
            const type = oldPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            oldPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }

    if (togglePasswordNew) {
        togglePasswordNew.addEventListener('click', function () {
            const newPassword = document.getElementById('newPassword');
            const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            newPassword.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    }
}
