const express = require('express')
const router = express.Router()
const Post = require('../models/Post')

//Routes
router.get('', async (req, res) => {
    try {
    const locals = {
        title: "NodeJS Blog",
        description: "Simple Blog Post, created with NodeJS, Express and Mongo DB"
    }
    let perPage = 10
    let page = req.query.page || 1
    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
    console.log("data is: ", data)

    const count = await Post.count()
    const nextPage = parseInt(page) + 1
    const hasNextPage = nextPage <= Math.ceil(count / perPage)

    res.render('index',
    {
    locals,
    data,
    current: page,
    nextPage: hasNextPage? nextPage : null,
    currentRoute: '/'
    }
    ) 
    } catch (error) {
        console.log(error)
    }
})

router.get('/post/:id', async (req, res) => {
    try{
        const slug = req.params.id
        const data = await Post.findById({_id: slug})
        const locals = {
            title: data.title,
            description: "Simple Blog Post, created with NodeJS, Express and Mongo DB"
        }
        res.render('post', {locals, data, currentRoute: `post/${slug}`})
    }
    catch(error){
        console.log(error)
    }
})

router.post('/search', async (req, res) => {
    try{
        const locals = {
            title: "Search",
            description: "Simple Blog Post, created with NodeJS, Express and Mongo DB"
        }
        
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await Post.find({
            $or: [
              { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
              { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
          });
        res.render("search", {
            data,
            locals,
            currentRoute: '/'
        })
    }
    catch(error){
        console.log("error is:", error)
    }
})

router.get('/about', (req, res) => {
    res.render('about', { currentRoute: '/about'})
})


module.exports = router



// function insertPostData () {
//     Post.insertMany([{
//         title: "Building a Blog",
//         body: "Hi there, this is a body text.."
//     }])
// } 
// insertPostData()