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



router.get('/user/:userid/paymentinfo',isLoggedIn, (req, res) => {
    console.log(req.query.amount);
    res.render(`payment/payment`,{amount:req.query.amount,email:req.query.email});
})



module.exports = router;