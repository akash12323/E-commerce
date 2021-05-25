const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');



router.get('/user/:userid/cart',isLoggedIn,async(req,res)=>{
    const user = await User.findById(req.params.userid).populate('cart');
    res.render('user/showcart',{userCart:user.cart});
})

router.post('/user/:id/cart',isLoggedIn,async(req,res)=>{
    try{
        const product =await Product.findById(req.params.id);
        const user = req.user;
        user.cart.push(product);
        await user.save();
        req.flash('success','Product added to cart successfully');
        res.redirect(`/user/${req.user._id}/cart`);
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect(`/products/${req.params.id}`);
    }
})

router.delete('/user/:userId/cart/:id',isLoggedIn,async(req,res)=>{
    console.log(`Deleting product ${req.params.id} for user ${req.params.userId}`);
    await User.findByIdAndUpdate(req.params.userId,{$pull:{cart:req.params.id}})

    req.flash('success','Product removed from your cart successfully');

    res.redirect(`/user/${req.params.userId}/cart`);
})


router.get('/user/:userId/products',isLoggedIn,async(req,res)=>{
    try{
        const user = await User.findById(req.params.userId).populate('myProducts');
        res.render('user/showProducts',{userProducts:user.myProducts});
    }
    catch(e){
        req.flash('error','Could not find your products');
        res.redirect('/products');
    }
})


// TO EDIT A DOCUMENT
//get edit form
router.get('/user/:userId/products/:id/edit',isLoggedIn,async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.render('products/edit',{product});
    }
    catch(e){
        req.flash('error','Product does not exist!!!');
        res.redirect('/error');
    }
})
//edit document
router.patch('/user/:userId/products/:id',isLoggedIn,async (req,res)=>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id , req.body.product);
        req.flash('success','Product updated successfully!!!');
        res.redirect(`/user/${req.params.userId}/products`);
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Failed to update product!!!');
        res.redirect(`/products/${req.params.id}`);
    }
})

//To Delete Product
router.delete('/user/:userId/products/:id',isLoggedIn,async(req,res)=>{
    try{
        const {userId,id} = req.params;
        await Product.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId,{$pull:{myProducts:id , cart:id}});
        req.flash('success','Product deleted successfully');
        res.redirect(`/user/${userId}/products`);
    }
    catch(e){
        req.flash('error','Failed to remove product');
        res.redirect(`/user/${req.params.userId}/products`);
    }
})






module.exports = router;