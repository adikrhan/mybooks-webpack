import * as base from './base';


export const renderItem = (el) => {

    if(el.type == 'blogpost'){

        const markup = `
            <div class="activities__item--blogpost margin-bottom-medium">
                <span class="activities__type">Blogpost</span>

                <div class="activities__img-group">
                    <div class="activities__img">
                        <img src="${el.image}" alt="Blog image 1" class="activities__img--1">
                    </div>
                </div>
                <div class="activities__text-group margin-bottom-small">
                    <h4 class="heading-quaternary">${el.title}</h4>
                    <span class="activities__author">${el.author}</span>
                    <span class="activities__date">${el.date}</span>
                    <p class="activities__text marin">${el.text.substring(0, 200)}
                    </p>
                </div>
                <a href="#" class="activities__btn list-item__blogpost--view-btn" data-id="${el.activitiesId}">Read more &rarr;</a>
            </div>
        `;

        base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
    } else {

        const markup = `
            <div class="activities__item--review margin-bottom-medium">
                <span class="activities__type">Review</span>

                <div class="activities__img-group-review">
                        <img src="${el.image}" alt="Review image 1" class="activities__img--2">
                </div>
                <div class="activities__text-group-review margin-bottom-small">

                    <h4 class="heading-quaternary">${el.author} has written a review of <em>${el.title}</em></h4>
                    <span class="activities__review-date">${el.date}</span>
                    </p>
                </div>
                <a href="#" class="activities__btn list-item__review--view-btn" data-id="${el.bookId}">Read review &rarr;</a>
            </div>
        `;

        base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
    }

    

}

export const renderHomePage = (activities) => {


    activities.forEach(renderItem);

    const markup = `<h3 class="heading-tertiary margin-bottom-medium">Latest activities</h3>`;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);

}