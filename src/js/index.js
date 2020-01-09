import * as base from './views/base';
import * as searchView from './views/searchView';
import * as listView from './views/listView';
import * as blogView from './views/blogView';
import * as homeView from './views/homeView';
import * as loginView from './views/loginView';
import Search from './models/Search';
import Book from './models/Book';
import Blogpost from './models/Blogpost';
import Bookshelf from './models/Bookshelf';

import axios from 'axios';
import { proxy, key } from '../config';
const convert = require('xml-js');

const state = {};

const data = {
    booksRead: [],
    wishlist: [],
    bookshelf: [],
    blogposts: [],
    activities: []
};

(function getFromLS(){
    if(localStorage.length > 1){
        const dataLS = localStorage.getItem('data');
        let dataJS = JSON.parse(dataLS);

        data.booksRead = dataJS.booksRead;
        data.wishlist = dataJS.wishlist;
        data.blogposts = dataJS.blogposts;
        data.activities = dataJS.activities;
        data.bookshelf = dataJS.bookshelf;

        searchView.updateCount(data.booksRead.length, data.wishlist.length, data.booksRead);
    }
    
})()

const addToLS = () => {
    localStorage.setItem('data', JSON.stringify(data));
}


// Render home page at start
homeView.renderHomePage(data.activities);

// Render home page when clicking Home link
document.querySelector('.header__home-link').addEventListener('click', () => {
    base.clearPage();
    base.removeActiveLink();
    homeView.renderHomePage(data.activities);
})

// ==============================
//       SEARCH CONTROLLER
// ==============================
const searchControl = async () => {

    // 1. Get search input
    const query = searchView.getSearchInput();
    if(query){
        // 2. Clear input
        searchView.clearInput();
        // 3. Clear page and show loader
        base.clearPage();
        base.showLoader();
        // 4. Create instance of Search model
        state.search = new Search(query);
        // 5. Get results
        try {
            await state.search.getResults();
        }
        catch(error) {
            alert(error);
        }
        base.clearPage();
        // Check which books are already in one of the lists
        checkStatus(state.search.results);
        // 6. Display results
        base.removeActiveLink();
        searchView.renderResults(state.search.results);
        window.scrollTo(0, 0);
    }
}
//Check if book is already in a list and add status accordingly
const checkStatus = (results) => {

    if(results.length > 1){
        results.forEach(el => {
            const status = base.checkLists(data, el)[0];
            el.status = status;
            el.shelf = base.checkLists(data, el)[1];
        })
    } else {
        const status = base.checkLists(data, results)[0];
        results.status = status;
        results.shelf = base.checkLists(data, results)[1];
    }
    
}
//Event listeners for book search bar
base.elements.searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchControl();
})
base.elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchControl();
});

// Get and show info about book when clicking title
const bookInfoControl = async (id, index) => {

    base.clearPage();
    base.showLoader();

    try{
        await state.search.getBookInfo(id);
    }
    catch(error){
        console.log(error);
    }

    base.clearPage();
    if(state.search.results.length > 1){
        searchView.renderBookInfo(state.search.results[index], state.search.bookInfo, index);
    } else {
        searchView.renderBookInfo(state.search.results, state.search.bookInfo, index);
    }
    
}

base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.search__title-link');
    
    if(btn){
        bookInfoControl(btn.dataset.id, btn.dataset.index);
    }
});

// Get book info when clicking on title from list
const getBookInfo = async (id) => {

        try {
            const bookInfoXML = await axios.get(`${proxy}https://www.goodreads.com/book/show/${id}.xml?key=${key}`);
            const bookInfoJS = convert.xml2js(bookInfoXML.data, {compact: true});
            return bookInfoJS.GoodreadsResponse.book;
        
        }
        catch(error){
            console.log(error);
        }
}

const bookInfoFromList = async (id, index, type) => {
    let list;

    base.clearPage();
    base.showLoader();

    if(type === 'read'){
        list = data.booksRead;
    } else if(type === 'wish'){
        list = data.wishlist;
    }

    try{
        list[index].bookInfo = await getBookInfo(id);        
    }
    catch(error){
        console.log(error);
    }
    base.clearPage();

    searchView.renderBookInfoFromList(list[index], list[index].bookInfo, index);
}

base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__title-link');
    
    if(btn){
        bookInfoFromList(btn.dataset.id, btn.dataset.index, btn.dataset.type);
    }
});

// ==============================
//       LIST CONTROLLER
// ==============================

// Add book to chosen list
const listControl = async (result, type, btn) => {

    const exists = base.checkLists(data, result);

    if(type === 'read' && exists == 'read'){
        alert('You have already added this book as read');
    }
    else if(type === 'wish' && exists == 'wish'){
        alert('You have already added this book to your wishlist');
    } 
    else {
        
        if(type === 'read'){
            listView.rateBook(result.best_book.id._text);
            data.booksRead.push(new Book(result, 'read'));
            base.changeLists(data, result.best_book.id._text, type);
            result.status = 'read';
        } 
        else if(type === 'wish') {
            data.wishlist.push(new Book(result, 'wish'));
            base.changeLists(data, result.best_book.id._text, type);
            result.status = 'wish';
        }

        searchView.updateCount(data.booksRead.length, data.wishlist.length, data.booksRead);
        searchView.changeBtnColor(btn, type);
    }

    addToLS();
}

// Add event listener to Read-button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.search__button-list-item-read');

    if(btn){
        const index = btn.dataset.index;
        if(state.search.results.length > 1){
            listControl(state.search.results[index], 'read', btn);
        } else {
            listControl(state.search.results, 'read', btn);
        }
        
    }
})
// Add event listener to Wishlist-button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.search__button-list-item-wish');

    if(btn){
        const index = btn.dataset.index;
        if(state.search.results.length > 1){
            listControl(state.search.results[index], 'wish', btn);  
        } else {
            listControl(state.search.results, 'wish', btn);
        }
    }
})

// Bookshelf controller
const bookShelfControl = (index) => {

    let id;
    if(data.bookshelf.length == 0){
        id = 0;
    } else {
        id = data.bookshelf[data.bookshelf.length - 1].shelfId + 1;
    }

    if(state.search.results.length > 1){
        const shelfItem = new Bookshelf(state.search.results[index], id);
        data.bookshelf.push(shelfItem);
        addToLS();
    } else {
        const shelfItem = new Bookshelf(state.search.results, id);
        data.bookshelf.push(shelfItem);
    }

}
// Add event listener to Bookshelf-button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.search__button-list-item-shelf');

    if(btn){
        bookShelfControl(btn.dataset.index);
    }
})

// Render chosen list
const displayListControl = (list, type = 'read') => {
    base.clearPage();
    listView.renderLists(list, type);
}
// Add event listener to My Books link
base.elements.myBooksLink.addEventListener('click', (e) => {
    base.addActiveLink(e);
    displayListControl(data.booksRead);
    window.scrollTo(0, 0);
})
// Add event listener for switching tabs
base.elements.sectionMiddle.addEventListener('click', (e) => {
    if(e.target.classList.contains('tabs__want-to-read-tab')){
        displayListControl(data.wishlist, 'wish');
    } else if(e.target.classList.contains('tabs__read-tab')){
        displayListControl(data.booksRead);
    } else if(e.target.classList.contains('tabs__owned-tab')){
        displayListControl(data.bookshelf, 'owned');
    }
})
// Add event listener to delete list item button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__delete-btn');

    if(btn && btn.dataset.status === 'read'){
        const answer = window.confirm('Are you sure you want to delete this book?');
        if(answer){
            base.deleteBook(data.booksRead, btn.dataset.id, data.activities);
            displayListControl(data.booksRead, 'read');
        } 
    } else if(btn && btn.dataset.status === 'wish'){
        const answer = window.confirm('Are you sure you want to delete this book?');
        if(answer){
            base.deleteBook(data.wishlist, btn.dataset.id);
            displayListControl(data.wishlist, 'wish');
        }   
    }
    addToLS();
    searchView.updateCount(data.booksRead.length, data.wishlist.length, data.booksRead);
})

// Add event listener for clicking on bookshelf-item
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.bookshelf__item');

    if(btn){
        const index = data.bookshelf.findIndex(el => el.shelfId == btn.dataset.id);        
        listView.showBookshelfItemInfo(data.bookshelf[index]);
    }
})

// Controller for deleting bookshelf item
const deleteBookshelfItem = (btn) => {
    const index = data.bookshelf.findIndex(el => el.shelfId == btn.dataset.id);
    data.bookshelf.splice(index, 1);
    addToLS();
    document.querySelector('.popup').style.display = 'none';
    base.clearPopup();
    displayListControl(data.bookshelf, 'owned');
}

// Add event listener on deleting bookshelf item 
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.popup__bookshelf-btn--delete');
    
    if(btn){
        deleteBookshelfItem(btn);
    }
})

// =============  Rating =================

// Controller for adding rating
const addRating = (btn) => {
    const rating = document.querySelector('input[name=rating]:checked').value;
    const index = data.booksRead.findIndex(el => el.id == btn.dataset.id);
    data.booksRead[index].userRating = rating;
    addToLS();
    base.clearPopup();
}
//Add rating for book when adding to Read list
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.star-rating__submit-btn');
    if(btn){
        addRating(btn);
    }
})
// Add rating for book already in Read-list
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__add-rating');
    if(btn){
        listView.rateBook(btn.dataset.id);
    }
})

// =============  Reviews =================

// Add event listener to Add review
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__review--add-btn');

    if(btn){
        base.clearPage();
        listView.displayReviewForm(btn.dataset.title, btn.dataset.id);
    }
})
// Add review to book in Read-list
const addReviewControl = (id) => {

    const index = data.booksRead.findIndex(el => el.id == id)
    const review = listView.getReviewInput(data.booksRead[index]);

    if(data.activities.length == 0){
        review.activitiesId = 0;
    } 
    else {
        review.activitiesId = data.activities[data.activities.length-1].activitiesId + 1;
    }
    
    data.booksRead[index].review = review;
    data.activities.push(review);
    addToLS();
    searchView.updateCount(data.booksRead.length, data.wishlist.length, data.booksRead);

    displayListControl(data.booksRead);

}
// Add event listener to Submit review
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.review__submit-btn');

    if(btn){
        addReviewControl(btn.dataset.id);
    }
})
// Add event listener to Read review
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__review--view-btn');

    if(btn){
        const index = data.booksRead.findIndex(el => el.id == btn.dataset.id);
        listView.displayReview(data.booksRead[index]);
    }
})
// Add event listener to close review
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.popup__close-btn');
    if(btn){
        base.clearPopup();
    }
})
// Show forms to update review
const displayUpdateReview = (book) => {
    document.querySelector('.popup').style.display = 'none';
    base.clearPage();
    listView.displayReviewForm(book.title, book.id, 'update');
    listView.setReviewInput(book);
}
// Add event listener to update review button
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.popup__btn--update');

    if(btn){
        const index = data.booksRead.findIndex(el => el.id == btn.dataset.id);
        displayUpdateReview(data.booksRead[index]);
    }
})
// Submit updated review
const updateReview = (book) => {
    listView.updateReview(book);
    addToLS();
    base.clearPage();
    base.clearPopup();
    listView.renderLists(data.booksRead);
    listView.displayReview(book);
}
// Add  event listener to submit updated review button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.review__update-btn');

    if(btn){
        const index = data.booksRead.findIndex(el => el.id == btn.dataset.id);
        updateReview(data.booksRead[index]);
    }
})
// Controller for deleting review
const deleteReview = (book) => {

    const index = data.activities.findIndex(el => el.activitiesId === book.review.activitiesId);
    data.activities.splice(index, 1);

    book.review = '';
    addToLS();
    document.querySelector('.popup').style.display = 'none';
    base.clearPage();
    listView.renderLists(data.booksRead);
    searchView.updateCount(data.booksRead.length, data.wishlist.length, data.booksRead);
}
// Add event listener for delete review button
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.popup__btn--delete');

    if(btn){
        const index = data.booksRead.findIndex(el => el.id == btn.dataset.id);
        deleteReview(data.booksRead[index]);
    }
})

// ==============================
//       BLOG CONTROLLER
// ==============================

// Show blogpage
const displayBlogControl = () => {
    base.clearPage();
    blogView.renderBlogposts(data.blogposts);
}
// Add event listener to Blog link
base.elements.blogLink.addEventListener('click', (e) => {
    base.addActiveLink(e);
    displayBlogControl();
 })
// Controller for creating new blogpost
const addBlogpostControl = () => {
    const values = blogView.getInputValues();

    if(data.activities.length == 0){
        values.activitiesId = 0;
    } 
    else {
        values.activitiesId = data.activities[data.activities.length - 1].activitiesId + 1;
    }

    const blogpost = new Blogpost(values);

    data.blogposts.push(blogpost);
    displayBlogControl();
    data.activities.push(blogpost);
    addToLS();
    window.scrollTo(0, 0);

}
 // Write new blogpost
 base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.activities__add-blogpost-btn');

    if(btn){
        base.clearPage();
        blogView.renderForms();
    }
})
// Submit new blogpost
 base.elements.sectionMiddle.addEventListener('click', (e) => {
     const btn = e.target.closest('.blogpost__add-btn');

     if(btn){
        addBlogpostControl();
     }
 })
 // Show blogpost
 const showBlogpost = (id) => {
    const index = data.blogposts.findIndex(el => el.activitiesId == id);

    if(index != -1){
        base.clearPage();
        blogView.showBlogpost(data.blogposts[index]);
    }
    

 }
// Add event listener to blogpost Read more-button
 base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.list-item__blogpost--view-btn');

    if(btn){
       showBlogpost(btn.dataset.id);
    }
})
// Event listener to Update blogpost
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.blogpost__btn--update');

    if(btn){
        base.clearPage();
        blogView.renderForms('update', btn.dataset.id);
        const index = data.blogposts.findIndex(el => el.activitiesId == btn.dataset.id);
        blogView.getBlogpost(data.blogposts[index]);
    }
})
// Event listener to update blogpost button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.blogpost__update-btn');

    if(btn){
        const index = data.blogposts.findIndex(el => el.activitiesId == btn.dataset.id)
        blogView.updateBlogpost(data.blogposts[index]);
        displayBlogControl();
    }
})
// Controller for deleting blogpost
const deleteBlogpost = (id) => {
    // id = 2
    const index_activities = data.activities.findIndex(el => el.activitiesId == id); // = 2
    const index_blogposts = data.blogposts.findIndex(el => el.activitiesId == id); // = 0
    data.blogposts.splice(index_blogposts, 1);
    data.activities.splice(index_activities, 1); // data.activities.splice(2, 1);

    addToLS();
    displayBlogControl();
}
// Event listener to delete blogpost button
base.elements.sectionMiddle.addEventListener('click', (e) => {
    const btn = e.target.closest('.blogpost__btn--delete');

    if(btn){
        deleteBlogpost(btn.dataset.id);
    }
})


// ================================
//          HANDLE LOGIN 
// ================================

base.elements.loginLink.addEventListener('click', (e) => {
    loginView.renderLoginForm();
});