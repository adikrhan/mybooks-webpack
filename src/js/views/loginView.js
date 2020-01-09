export const renderLoginForm = () => {

    const markup = `
        <div class="popup">
            <div class="popup__content popup__login-content">
                <h3 class="heading-tertiary margin-bottom-small popup__title">Login</h3>
                <form class="popup__login-form">
                    <input type="text" class="popup__login-input" name="email" placeholder="Email">
                    <input type="password" class="popup__login-input" name="password" placeholder="Password">
                    <button class=" btn btn--green popup__login-button">Sign In</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);

    document.querySelector('.popup').style.display = 'block';
}