export default class{
    constructor(values){
        this.author = values.author;
        this.title = values.title;
        this.image = values.image;
        this.text = values.text;
        this.date = values.date;
        this.activitiesId = values.activitiesId;
        this.type = 'blogpost';
    }
}