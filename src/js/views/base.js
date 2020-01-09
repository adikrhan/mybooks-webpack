export const elements = {

    searchForm: document.querySelector('.form'),
    searchInput: document.querySelector('.form__input'),
    searchIcon: document.querySelector('.form__icon'),

    sectionMiddle: document.querySelector('.section-feed'),

    countBooks: document.querySelector('.count__number--read'),
    countWishes: document.querySelector('.count__number--wish'),
    countReviews: document.querySelector('.count__number--review'),

    myBooksLink: document.querySelector('.navigation__link--mybooks'),
    blogLink: document.querySelector('.navigation__link--blog'),

    loginLink: document.querySelector('.header__login-link')
}

export const clearPage = () => {
    elements.sectionMiddle.innerHTML = '';
}

export const showLoader = () => {
    const markup = `
        <i class="fas fa-spinner spinner"></i>
    `;

    elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
}

export const checkLists = (data, result) => {
    let exists = false;
    let onShelf = false;

    data.booksRead.forEach(el => {
        if(el.id == result.best_book.id._text){
            exists = 'read';
            return;
        }
    })

    data.wishlist.forEach(el => {
        if(el.id == result.best_book.id._text){
            exists = 'wish';
            return;
        }
    })

    data.bookshelf.forEach(el => {
        if(el.goodreadsId == result.best_book.id._text){
            onShelf = 'owned';
            return;
        }
    })

    return [exists, onShelf];
}

export const deleteBook = (list, id, activities) => {

    const index = list.findIndex(el => el.id == id);

    if(list[index].review){
        const activitiesId = list[index].review.activitiesId;
        const index_activities = activities.findIndex(el => el.activitiesId == activitiesId);
        activities.splice(index_activities, 1);
    }

    list.splice(index, 1);

}

export const changeLists = (data, id, type) => {

    if(type === 'read'){
        const index = data.wishlist.findIndex(el => el.id == id);
        if(index != -1){
            data.wishlist.splice(index, 1);
        }
    } 
    else if(type === 'wish'){
        const index = data.booksRead.findIndex(el => el.id == id);
        if(index != -1){
            data.booksRead.splice(index, 1);
        }
        
    }
}


export const createStars = (rating) => {

    const splitRating = rating.split('.');
    let fullStars = parseInt(splitRating[0]);
    let halfStars = Math.round(splitRating[1]/100 * 2) / 2;

    var fullRating = '';

    if(halfStars == 1){
        fullStars += halfStars;
        for(let i = 0; i < fullStars; i++){
            fullRating += '<i class="fas fa-star"></i>';
        }
    } else if(halfStars == 0.5){
        for(let i = 0; i < fullStars; i++){
            fullRating += '<i class="fas fa-star"></i>';
        }
        fullRating += '<i class="fas fa-star-half-alt"></i>';
    } else {
        for(let i = 0; i < fullStars; i++){
            fullRating += '<i class="fas fa-star"></i>';
        }
    }

    return fullRating;
}

export const removeActiveLink = () => {
    elements.myBooksLink.classList.remove('navigation__link-active');
    elements.blogLink.classList.remove('navigation__link-active');
}

export const addActiveLink = (e) => {
    removeActiveLink();
    e.target.classList.add('navigation__link-active');
}

export const clearPopup = () => {
    const popup = document.querySelector('.popup');
    popup.remove();
}

