import * as base from './base';

const renderListItems = (el, index) => {

    let starRating = base.createStars(`${el.status === 'wish' ? el.avgRating : el.userRating}`);

    const markup = `
        <div class="list-item">
            <div class="list-item__img-container">
                <img src="${el.image_url}" alt="Blog image" class="list-item__img">
            </div>
            <div class="list-item__text-container">
                <h4 class="heading-quaternary">
                    <a href="#" class="list-item__title-link" 
                    data-id="${el.id}" 
                    data-index="${index}" 
                    data-type="${el.status === 'read' ? `read` : 'wish'}">${el.title}</a>
                </h4>
                <h6 class="heading-senary">by ${el.author}</h6>

                ${el.status === 'read' ? `<span class="list-item__rating">${el.userRating == '' ? `<a href="#" class="list-item__add-rating" data-id="${el.id}">Rate this book</a>` : `Your rating: ${starRating}`} </span>` : ''}
                ${el.status === 'wish' ? `<span class="list-item__rating">Goodreads rating: ${el.avgRating} </span>` : ''}
                <a href="#" 
                    class="list-item__review list-item__review${el.review ? '--view-btn' : '--add-btn'}" 
                    data-title="${el.title}" 
                    data-id="${el.id}">
                    ${el.review && el.status === 'read' ? 'Your review &rarr;' : ''}
                    ${!el.review && el.status === 'read' ? 'Add review' : ''}
                </a>
            </div>
            
            <span class="list-item__delete-btn" data-status="${el.status == 'read' ? 'read' : 'wish'}" data-id="${el.id}">
                <i class="fas fa-trash-alt icon-margin-right"></i>
                Delete
            </span>
        </div>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
    
} 

export const renderLists = (list, type = 'read') => {

    if(type === 'read' || type === 'wish'){
        list.forEach(renderListItems);
    } else if(type === 'owned'){
        const markup = `<div class="bookshelf"></div>`;
        base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
        list.forEach(renderBookshelf);
    }
    
    const markup = `
        <h3 class="heading-tertiary margin-bottom-medium search__head">My books</h3>
    
        <div class="tabs">
            <ul class="tabs__list">
                <li class="tabs__tab tabs__read-tab ${type === 'read' ? 'tabs__active-tab' : ''}">Read</li>
                <li class="tabs__tab tabs__want-to-read-tab ${type === 'wish' ? 'tabs__active-tab' : ''}">Wishlist</li>
                <li class="tabs__tab tabs__owned-tab ${type === 'owned' ? 'tabs__active-tab' : ''}">Bookshelf</li>
            </ul>
        </div>
    `;
    
    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);



}

export const displayReviewForm = (title, id, type = 'new') => {

    const markup = `
        <h3 class="heading-tertiary margin-bottom-medium">Review of <em>${title}</em></h3>
        <input type="text" class="review__author" placeholder="Your name">
        <textarea class="review__textarea" placeholder="Write your review here..."></textarea>
        <a href="#" class="btn btn--green ${type === 'new' ? 'review__submit-btn' : 'review__update-btn'}" data-id="${id}">${type === 'new' ? 'Submit' : 'Update'}</a>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
}

export const displayReview = (book) => {

    const markup = `
        <div class="popup">
            <div class="popup__content">
                <h3 class="heading-tertiary margin-bottom-small popup__title"></h3>
                <span class="popup__review-author"></span>
                <span class="popup__review-date"></span>
                <p class="popup__text"></p>
                <a href="#" class="popup__btn popup__btn--update" data-id="${book.id}">Update</a>
                <a href="#" class="popup__btn popup__btn--delete" data-id="${book.id}">Delete</a>
                <span class="popup__close-btn"><i class="fas fa-times"></i></span>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);

    showReview(book);
    
}

const showReview = (book) => {
    document.querySelector('.popup__title').innerHTML = `Review of <em>${book.title}</em>`;
    document.querySelector('.popup__review-author').innerHTML = `${book.review.author}`;
    document.querySelector('.popup__review-date').innerHTML = `${book.review.date}`;
    document.querySelector('.popup__text').innerHTML = book.review.text;

    document.querySelector('.popup').style.display = 'block';

}

export const setReviewInput = (book) => {
    document.querySelector('.review__author').value = book.review.author;
    document.querySelector('.review__textarea').value = book.review.text;
}

export const getReviewInput = (book) => {
    return {
        title: book.title,
        image: book.image_url,
        author: document.querySelector('.review__author').value,
        date: new Date().toISOString().slice(0, 10),
        text: document.querySelector('.review__textarea').value,
        bookId: book.id,
        activitiesId: '',
        type: 'review'
    }
}

export const updateReview = (book) => {
    book.review.author = document.querySelector('.review__author').value;
    book.review.text = document.querySelector('.review__textarea').value;
}

export const rateBook = (id) => {

    const markup = `
        <div class="popup">
            <div class="star-rating__container">
                <h3 class="heading-tertiary margin-bottom-small star-rating__title">Rate this book</h3>
                <div class="star-rating__star-group">
                        <input type="radio" id="star5" name="rating" value="5.0" class="star-rating__input" />                            
                            <label class="full star-rating__label" for="star5" title="5"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star4" name="rating" value="4.0" class="star-rating__input" />                          
                            <label class="full star-rating__label" for="star4" title="4"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star3" name="rating" value="3.0" class="star-rating__input" />                           
                            <label class="full star-rating__label" for="star3" title="3"><i class="fas fa-star"></i></label>
                        <input type="radio" id="star2" name="rating" value="2.0" class="star-rating__input" />                          
                            <label class="full star-rating__label" for="star2" title="2"> <i class="fas fa-star"></i></label>
                        <input type="radio" id="star1" name="rating" value="1.0" class="star-rating__input" />                           
                            <label class="full star-rating__label" for="star1" title="1"><i class="fas fa-star"></i></label>
                </div> 
                <a href="#" class="btn btn--green star-rating__submit-btn" data-id="${id}">Rate</a>
                <span class="popup__close-btn"><i class="fas fa-times"></i></span>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);

    document.querySelector('.popup').style.display = 'block';
}

export const renderBookshelf = (el, index) => {

    if(index === 0 || index % 5 == 0){
        const markup = `<div class="bookshelf__row" style="order: ${index}"></div>`;
        document.querySelector('.bookshelf').insertAdjacentHTML('afterbegin', markup);
    }

    const markup = `
            <div class="bookshelf__item" data-id="${el.shelfId}">
                <div class="bookshelf__img-container">
                    <img src="${el.image}" title="" class="bookshelf__img">
                </div>
                <a href="#" class="bookshelf__title">${el.title.substring(0, 30)}...</a>
            </div>
    `;
    
    document.querySelector('.bookshelf__row').insertAdjacentHTML('afterbegin', markup);

    // base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);

}


export const showBookshelfItemInfo = (item) => {

    const markup = `
        <div class="popup">
            <div class="popup__bookshelf-content">
                <div class="popup__bookshelf-container">
                    <div class="popup__bookshelf-img-container">
                        <img src="${item.image}" class="popup__bookshelf-img">
                    </div>
                    <div class="popup__bookshelf-text-container">
                        <h4 class="heading-quaternary popup__bookshelf-title">${item.title}</h4>
                        <span class="heading-quinary popup__bookshelf-author">${item.author}</span>
                    </div>
                </div>
                <div class="popup__bookshelf-form-group">
                    <h4 class="heading-quaternary popup__bookshelf-heading">I want to...</h4>
                    <div class="popup__bookshelf-radio-group">
                        <input type="radio" id="sell" name="shop" value="sell" class="popup__bookshelf-radio" />                            
                            <label class="popup__bookshelf-radio-label" for="sell" title="sell">Sell</label>
                        <input type="radio" id="trade" name="shop" value="trade" class="popup__bookshelf-radio" />                            
                            <label class="popup__bookshelf-radio-label" for="trade" title="trade">Trade</label>
                        <input type="radio" id="giveaway" name="shop" value="give" class="popup__bookshelf-radio" />                            
                            <label class="popup__bookshelf-radio-label" for="giveaway" title="give">Give away</label>
                    </div>
                    <form class="popup__bookshelf-form">
                        <input type="number" class="popup__bookshelf-input" placeholder="Your price">
                        <button class="btn btn--green popup__bookshelf-btn">Send</button>
                    </form>
                </div>
                <span class="popup__close-btn"><i class="fas fa-times"></i></span>
                <a href="#" class="popup__btn popup__bookshelf-btn--delete" data-id="${item.shelfId}">Remove fom shelf</a>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', markup);
    document.querySelector('.popup').style.display = 'block';

}

