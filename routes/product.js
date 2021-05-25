const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');


// TO DISPLAY ALL DOCUMENTS

router.get('/',(req,res)=>{
    res.render('home');
})

router.get('/products',async(req,res)=>{
    try{
        const products = await Product.find({})
        res.render('products/index',{products})
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Could not load products');
        res.redirect('/error');
    }
})


// TO CREATE NEW DOCUMENT

router.get('/products/new',isLoggedIn,(req,res)=>{
    res.render('products/new');
})

router.post('/products',isLoggedIn, async(req,res)=>{
    try{
        const product = await Product.create(req.body.product);
        //To save into myProducts of user.
        const user = req.user
        user.myProducts.push(product);
        await user.save();

        req.flash('success','Product created successfully!!!');
        res.redirect('/products');
    }
    catch(e){
        console.log(e.message);
        req.flash('error',`Failed to create product: ${e.message}`);
        res.redirect('/products');
    }
})

// TO DISPLAY A PRODUCT

router.get('/products/:id', async(req,res)=>{
    try{            
        const product = await Product.findById(req.params.id).populate('reviews');
        // console.log(product);
        res.render('products/show',{product});
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Can\'t find product')
        res.redirect('/error');
    }
})



// to create a new comment

router.post('/products/:id/review',isLoggedIn,async (req, res) => {
    
    try {
        const product = await Product.findById(req.params.id);

        const review = new Review({
            user: req.user.username,
            ...req.body
        });

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success','Successfully added your review!')
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot add review to this Product');
        res.redirect('/error');
    }
    
})


router.get('/error',(req,res)=>{
    res.status(500).render('error');
})


module.exports = router;