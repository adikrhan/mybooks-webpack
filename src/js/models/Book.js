export default class{
    constructor(result, type){
        this.title = result.best_book.title._text;
        this.author = result.best_book.author.name._text;
        this.id = result.best_book.id._text;
        this.image_url = result.best_book.image_url._text;
        this.avgRating = result.average_rating._text;
        this.ratingCount = result.ratings_count._text;
        this.status = type;
        this.userRating = '';
    }

}