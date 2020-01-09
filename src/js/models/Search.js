import axios from 'axios';
import { proxy, key } from '../../config';

const convert = require('xml-js');

export default class{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try {
            const searchResXML = await axios.get(`${proxy}https://www.goodreads.com/search/index.xml?key=${key}&q=${this.query}`);
            
            const searchResJS = convert.xml2js(searchResXML.data, {compact: true});
            console.log(searchResJS);
            this.results = searchResJS.GoodreadsResponse.search.results.work;
            
        }
        catch(error){
            console.log(error);
        }
    }

    async getBookInfo(id){
        try {
            const bookInfoXML = await axios.get(`${proxy}https://www.goodreads.com/book/show/${id}.xml?key=${key}`);
            const bookInfoJS = convert.xml2js(bookInfoXML.data, {compact: true});
            this.bookInfo = bookInfoJS.GoodreadsResponse.book;
        }
        catch(error){
            console.log(error);
        }
    }
}