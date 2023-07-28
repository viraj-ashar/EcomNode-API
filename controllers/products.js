import Product from "../models/Product.js";
import asyncHandler from 'express-async-handler';

/**
 * @desc Create new Product
 * @route POST /api/products
 * @access Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
    // TODO: keep appropriate condition to check "Product already existed"
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

/**
 * @desc Get all Products
 * @route GET /api/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
    console.log(req.query);
    //query
    let productQuery = Product.find();

    //search by name
    if (req.query.name) {
        productQuery = productQuery.find({
            name: { $regex: req.query.name, $options: "i" },
        });
    }

    //filter by brand
    if (req.query.brand) {
        productQuery = productQuery.find({
            brand: { $regex: req.query.brand, $options: "i" },
        });
    }

    //filter by category
    if (req.query.category) {
        productQuery = productQuery.find({
            category: { $regex: req.query.category, $options: "i" },
        });
    }

    //filter by color
    if (req.query.color) {
        productQuery = productQuery.find({
            colors: { $regex: req.query.color, $options: "i" },
        });
    }

    //filter by size
    if (req.query.size) {
        productQuery = productQuery.find({
            sizes: { $regex: req.query.size, $options: "i" },
        });
    }
    //filter by price range
    if (req.query.price) {
        const priceRange = req.query.price.split("-").map(val => Number(val));
        console.log(priceRange)
        //gte: greater or equal
        //lte: less than or equal to
        productQuery = productQuery.find({
            price: { $gte: priceRange[0], $lte: priceRange[1] },
        });
    }

    // pagination
    const page = parseInt(req.query.page ? req.query.page : 1);
    const limit = parseInt(req.query.limit ? req.query.limit : 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    productQuery = productQuery.skip(startIndex).limit(limit);

    //pagination results
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    var products = await productQuery;

    res.json({
        status: "success",
        total,
        results: products.length,
        pagination,
        message: 'Products fetched successfully',
        products,
    });
});

/**
 * @desc Get single product
 * @route GET /api/products/:id
 * @access Public
 */

export const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new Error("Product not found");
    }
    res.json({
        status: 'Success',
        message: 'Product fetched successfully',
        product
    });
})

/**
 * @desc update product
 * @route PUT /api/products/:id/update
 * @access Private/Admin
 */

export const updateProduct = asyncHandler(async (req, res) => {
    const updateFields = req.body;

    const product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
        new: true
    })

    res.json({
        status: 'Success',
        message: 'Product updated successfully',
        product
    });
})

/**
 * @desc delete product
 * @route DELETE /api/products/:id/delete
 * @access Private/Admin
 */

export const deleteProduct = asyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
        status: 'Success',
        message: 'Product deleted successfully',
    });
})