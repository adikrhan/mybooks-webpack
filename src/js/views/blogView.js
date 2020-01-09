import * as base from './base';

const renderItem = (blogpost) => {

    const markup = `
        <div class="activities__item--blogpost margin-bottom-medium">
            <span class="activities__type">Blogpost</span>

            <div class="activities__img-group">
                <div class="activities__img">
                    <img src="${blogpost.image}" alt="Blog image 1" class="activities__img--1">
                    <span class="activities__img-caption">254 views</span>
                </div>
            </div>
            <div class="activities__text-group margin-bottom-small">
                <h4 class="heading-quaternary">${blogpost.title}</h4>
                <span class="activities__author">${blogpost.author}</span>
                <span class="activities__date">${blogpost.date}</span>
                <p class="activities__text marin">${blogpost.text.substring(0, 300)}...
                </p>
            </div>
            <a href="#" class="activities__btn list-item__blogpost--view-btn" data-id="${blogpost.activitiesId}">Read more &rarr;</a>
        </div>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
}

export const renderBlogposts = (blogposts) => {

    blogposts.forEach(renderItem);

    const markup = `
        <h3 class="heading-tertiary margin-bottom-medium search__head">Welcome to the blog</h3>
        <span class="activities__add-blogpost-btn">New blogpost</span>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);

}

export const renderForms = (type = 'new', id = -1) => {

    const markup = `
        <h3 class="heading-tertiary margin-bottom-medium search__head">New blogpost</h3>

            <div class="blogpost__form-container">
                <form class="blogpost__form">
                    <input type="text" class="blogpost__form--author" placeholder="Name">
                    <input type="text" class="blogpost__form--title" placeholder="Title">
                    <input type="text" class="blogpost__form--image" placeholder="Image URL">
                    <textarea class="blogpost__form--textarea" placeholder="Blog content here..."></textarea>
                    <button type="button" class="btn btn--green ${type === 'new' ? 'blogpost__add-btn' : 'blogpost__update-btn'}" ${id != -1 ? `data-id="${id}"` : ''}>
                        ${type === 'new' ? 'Submit' : 'Update'}
                    </button>
                </form>
            </div>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('beforeend', markup);
}

export const getInputValues = () => {
    const author = document.querySelector('.blogpost__form--author').value;
    const title = document.querySelector('.blogpost__form--title').value;
    const imageUrl = document.querySelector('.blogpost__form--image').value;
    const text = document.querySelector('.blogpost__form--textarea').value;
    const date = new Date().toISOString().slice(0, 10);
    const id = '';
    const type = 'blogpost';

    return {
        author: author,
        title: title,
        image: imageUrl,
        text: text,
        date: date,
        activitiesId: id,
        type: type
    }
}

export const updateBlogpost = (blogpost) => {
    blogpost.author = document.querySelector('.blogpost__form--author').value;
    blogpost.title = document.querySelector('.blogpost__form--title').value;
    blogpost.image = document.querySelector('.blogpost__form--image').value;
    blogpost.text = document.querySelector('.blogpost__form--textarea').value;
}


export const showBlogpost = (blogpost) => {

    const markup = `
    <div class="blogpost margin-bottom-medium">

        <h3 class="heading-tertiary margin-bottom-small">${blogpost.title}</h4>

        <div class="blogpost__info">
            <span class="blogpost__author">${blogpost.author}</span>
            <span class="blogpost__date">${blogpost.date}</span>

            <a href="#" class="blogpost__btn blogpost__btn--update" data-id="${blogpost.activitiesId}">Update</a>
            <a href="#" class="blogpost__btn blogpost__btn--delete" data-id="${blogpost.activitiesId}">Delete</a>
        </div>

        <div class="blogpost__img-container">
            <img src="${blogpost.image}" alt="Blog image 1" class="blogpost__img">
        </div>


        <p class="blogpost__text">${blogpost.text}</p>

    </div>
    `;

    base.elements.sectionMiddle.insertAdjacentHTML('afterbegin', markup);
}

export const getBlogpost = (blogpost) => {

    document.querySelector('.blogpost__form--author').value = blogpost.author;
    document.querySelector('.blogpost__form--title').value = blogpost.title;
    document.querySelector('.blogpost__form--image').value = blogpost.image;
    document.querySelector('.blogpost__form--textarea').value = blogpost.text;


}

{/* <button type="button" class="${type}-blogpost" data-id="${id}">${type === `submit` ? `Submit` : `Update`}</button> */}