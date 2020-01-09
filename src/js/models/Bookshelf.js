export default class{
    constructor(book, id){
        this.title = book.best_book.title._text;
        this.author = book.best_book.author.name._text;
        this.image = book.best_book.image_url._text;
        this.goodreadsId = book.best_book.id._text;
        this.shelfId = id;

    }
}