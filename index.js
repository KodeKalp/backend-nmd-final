const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');


const app = express()
app.use(express.json());
app.use(cors());


const port = process.env.PORT

mongoose.connect(process.env.MONGODB_URL, {
}).then(()=>{
    console.log("Mongo DB Connected");
}).catch(error =>{
    console.log(error)
})

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number
})
const Book = mongoose.model('Book', bookSchema)

const urlSchema = new mongoose.Schema({
    randomStr: String,
    url: String
})
const Url = mongoose.model('Url', urlSchema)

app.post('/api/url', async(req, res) => {

        const {originalUrl} = req.body;

    console.log(req.body, "originalUrloriginalUrl")
    const shortCode = shortid.generate()

    const newURL = new Url({
       randomStr: shortCode,
       url: originalUrl
    })
    await newURL.save();
    res.json(newURL)
})

app.get('/myshorturl/:randomStr', async(req, res)=>{
 
    const {randomStr} = req.params;
    try {
        const MyUrl = await Url.findOne({randomStr})
        console.log(MyUrl, "MyUrl")
        res.redirect(MyUrl.url)
    }
    catch(err){
        console.log(err, "errorrororo");
        
        res.redirect("http://localhost:3000")
    }

})

app.get('/api/allurl', async(req, res)=>{
    const myUrl = await Url.find()
    res.json(myUrl)
})

app.get('/srturl/:id', async(req, res)=>{
    const {id} = req.params;

    const data = await Url.findById(id);
    console.log(data, "data")
})





app.get('/', async(req, res) => {
    res.json({message: "Hello NMD"})

})

app.get('/api/books', async(req, res) => {
    const books = await Book.find();
    res.json(books)
})

app.get('/api/books/:id', async(req, res) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (book)
        res.json(book)
    else
        res.status(404).json({ message: "Book Not Found" })
})

app.post('/api/books', async(req, res) => {

    const body = req.body;
    console.log(body)

    // const newBook = new Book(body)
    const newBook = new Book({
        title : body.title,
        author : body.author,
        year: parseInt(body.year)
    })

    await newBook.save();
    res.status(201).json(newBook)



    // const newId = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
    // const newBook = {
    //     id: newId,
    //     title : body.title,
    //     author : body.author,
    //     year: parseInt(body.year)
    // }
    // books.push(newBook);

    // res.status(201).json(books)
})

app.delete('/api/books/:id', async(req, res) => {
    console.log("delete ")
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId)

    res.status(201).json(deletedBook)
})


app.listen(port, () => {
    console.log(`server is running on port no. ${port}`)
})