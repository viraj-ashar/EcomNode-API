import Product from "../models/Product.js";
import asyncHandler from 'express-async-handler';

/**
 * @desc Create new Product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.userAuthId);
    const { name,
        description,
        brand,
        category,
        sizes,
        colors,
        images,
        reviews,
        price,
        totalQty,
        totalSold } = req.body;

    // Check if product already exists
    const productExists = await Product.findOne({ name });
    if (productExists) {
        console.log("Product existing")
        // throw new Error('Product Already Exists');
        res.json({
            status: 'Failure',
            msg: 'Product Already Existed',
        })
    } else {
        console.log("Product Creating")
        // Create new product
        const product = await Product.create({
            name,
            description,
            brand,
            category,
            sizes,
            colors,
            user: req.userAuthId,
            images,
            reviews,
            price,
            totalQty,
            totalSold
        });
        console.log("product created")
        console.log(productExists);

        // push the product in the category

        //send response
        res.json({
            status: 'Success',
            msg: 'Product Created Successfully',
            product,
        })
    }
})