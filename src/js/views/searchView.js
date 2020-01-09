import { elements, checkLists, createStars } from '../views/base';

export const getSearchInput = () => {
    return elements.searchInput.value;
}

export const clearInput = () => {
    elements.searchInput.value = '';
}

const renderSearchItem = (el, index) => {

    let starRating = createStars(el.average_rating._text);

    const markup = `
        <div class="search__item">
            <div class="search__img-container">
                <img src="${el.best_book.image_url._text}" alt="Blog image" class="search__img">
            </div>
            <div class="search__text-container">
                <h4 class="heading-quaternary"><a href="#" class="search__title-link" data-id="${el.best_book.id._text}" data-index="${index}">${el.best_book.title._text}</a></h4>
                <h6 class="heading-senary">by ${el.best_book.author.name._text}</h6>
                <span class="search__rating">
                    ${starRating}
                </span>
                <span class="search__rating-number">(${el.ratings_count._text} ratings)</span>
            </div>
            <ul class="search__button-list">
                <li class="search__button-list-item search__button-list-item-read ${el.status === 'read' ? 'search__button-list-item-read--colored' : ''}" data-index="${index}">
                        <i class="fas fa-check-square icon-margin-right search__list-button-icon--1"></i>
                        Read
                </li>
                <li class="search__button-list-item search__button-list-item-wish ${el.status === 'wish' ? 'search__button-list-item-wish--colored' : ''}" data-index="${index}">
                        <i class="fas fa-heart icon-margin-right search__list-button-icon--2"></i>
                        Wishlist
                </li>
                <li class="search__button-list-item search__button-list-item-shelf ${el.shelf ? 'search__button-list-item-shelf--colored' : ''}" data-index="${index}">
                        <i class="far fa-plus-square icon-margin-right"></i>
                        Bookshelf
                </li>
            </ul>
        </div>
    `;

    elements.sectionMiddle.insertAdjacentHTML('beforeend', markup);
}

export const renderResults = (results) => {

    const markup = `<h3 class="heading-tertiary margin-bottom-medium search__head">Search results</h3>`;
    elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);

    if(results.length > 1){
        results.forEach(renderSearchItem);
    } else {
        renderSearchItem(results, 0);
    }

}

export const renderBookInfoFromList = (result, info, index) => {

    let starRating = createStars(info.average_rating._text);

    const markup = `
        <div class="search__item">
            <div class="search__img-container">
                <img src="${info.image_url._text}" alt="Blog image" class="search__img">
            </div>
            <div class="search__text-container">
                <h4 class="heading-quaternary">${result.title}</h4>
                <h6 class="heading-senary">by ${result.author}</h6>
                <span class="search__rating">
                    ${starRating}
                </span>
                <span class="search__rating-number">(${result.ratingCount} ratings)</span>
                <h6 class="heading-senary">Publication year: ${info.publication_year._text}</h6>
                <h6 class="heading-senary">Nr of pages: ${info.num_pages._cdata}</h6>
            </div>
            

            <div class="search__description">
                <h3 class="heading-tertiary margin-top-medium">Description</h3>
                <p class="search__description-text">${info.description._cdata}</p>
            </div>
        </div>
    `;

    elements.sectionMiddle.insertAdjacentHTML('beforeend', markup);

}

export const renderBookInfo = (result, info, index) => {

    let starRating = createStars(info.average_rating._text);

    const markup = `
        <div class="search__item">
            <div class="search__img-container">
                <img src="${info.image_url._text}" alt="Blog image" class="search__img">
            </div>
            <div class="search__text-container">
                <h4 class="heading-quaternary">${result.best_book.title._text}</h4>
                <h6 class="heading-senary">by ${result.best_book.author.name._text}</h6>
                <span class="search__rating">
                    ${starRating}
                </span>
                <span class="search__rating-number">(${result.ratings_count._text} ratings)</span>
                <h6 class="heading-senary">Publication year: ${info.publication_year._text}</h6>
                <h6 class="heading-senary">Nr of pages: ${info.num_pages._cdata}</h6>
            </div>
            <ul class="search__button-list">
                <li class="search__button-list-item search__button-list-item-read ${result.status === 'read' ? 'search__button-list-item-read--colored' : ''}" data-index="${index}">
                        <i class="fas fa-check-square icon-margin-right search__list-button-icon--1"></i>
                        Read
                </li>
                <li class="search__button-list-item search__button-list-item-wish ${result.status === 'wish' ? 'search__button-list-item-wish--colored' : ''}" data-index="${index}">
                        <i class="fas fa-heart icon-margin-right search__list-button-icon--2"></i>
                        Wishlist
                </li>
                <li class="search__button-list-item search__button-list-item-shelf ${result.shelf ? 'search__button-list-item-shelf--colored' : ''}" data-index="${index}">
                        <i class="far fa-plus-square icon-margin-right"></i>
                        Bookshelf
                </li>
            </ul>

            <div class="search__description">
                <h3 class="heading-tertiary margin-top-medium">Description</h3>
                <p class="search__description-text">${info.description._cdata}</p>
            </div>
        </div>
    `;

    elements.sectionMiddle.insertAdjacentHTML('beforeend', markup);

}

export const changeBtnColor = (btn, type) => {

    if(type === 'read'){
        btn.style.color = '#23a51e';
        btn.nextSibling.nextSibling.style.color = '#666';
    }
    else if(type === 'wish'){
        btn.style.color = 'red'; 
        btn.previousSibling.previousSibling.style.color = '#666';
    }
    
}

export const updateCount = (readLength, wishLength, data) => {
    let bookReviews = 0;

    data.forEach(el => {
        if(el.review){
            bookReviews++;
        }
    })

    elements.countBooks.innerHTML = readLength;
    elements.countWishes.innerHTML = wishLength;
    elements.countReviews.innerHTML = bookReviews;
}

