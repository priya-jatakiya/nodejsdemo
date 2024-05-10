const router = require('express').Router();
const multer = require('multer');
const productModel = require('../models/product');
const auth = require('../middleware/auth');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            let fDest = __dirname + '/../images';
            cb(null, fDest)
        },
        filename: function ( req, file, cb ) {
            let origName = (file.originalname).split(/\.(?=[^\.]+$)/);
            let newFileName = origName[0] + '-' + Date.now() + "." + origName[1];
            cb( undefined, newFileName);
        }
    }),
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (file.originalname.match(/\.(doc|docx)$/)) return cb(new Error("Please don't upload doc file."))
        cb(undefined, true);
    },
});

// Get products based on search parameter with pagination 
router.get('/api/products', auth, async (req, res) => {
    try {
        let searchOpt = {};
        if(req.query.keyword != '' && req.query.keyword != undefined) {
            searchOpt = [
                {
                    name: {'$regex' : new RegExp(".*" + req.query.keyword + ".*", "i")}
                },
                {
                    description: {'$regex' : new RegExp(".*" + req.query.keyword + ".*", "i")}
                }
            ]
        }
        let skip = (req.query.skip) ? req.query.skip : 0;
        let limit = (req.query.limit) ? req.query.limit : '';
        let productData = await productModel.find().or(searchOpt).skip(skip).limit(limit);
        if (!productData) res.status(200).send({"message": "No records found."});
        res.status(200).send(productData);
    } catch(error) {
        res.status(401).send({"error": error.message});
    }
});

// Get product by ID
router.get('/api/products/:id', auth, async (req, res) => {
    try {
        let productData = await productModel.findById(req.params.id);
        if (!productData._id) res.status(200).send({"message": "No records found."});
        res.status(200).send(productData);
    } catch(error) {
        res.status(400).send({"error": error.message});
    }
});

// Add new product
router.post('/api/products', auth, upload.single('product_image'), async (req, res) => {
    try {
        let productReqData = {
            ...req.body,
        };
        if (req.file != undefined && req.file.filename != '' && req.file.filename != undefined) productReqData.product_image = req.file.filename;
        let productData = await (new productModel(productReqData)).save();
        if (!productData._id) throw new Error('Something went wrong.');
        res.status(201).send(productData);
    } catch(error) {
        res.status(401).send({"error": error.message});
    }
});

// Update existing product
router.put('/api/products/:id', auth, upload.single('product_image'), async (req, res) => {
    try {
        let reqProData = {};
        if (req.body.name != '' && req.body.name != undefined) reqProData.name = req.body.name;
        if (req.body.price != '' && req.body.price != undefined) reqProData.price = req.body.price;
        if (req.body.product_type != '' && req.body.product_type != undefined) reqProData.product_type = req.body.product_type;
        if (req.body.description != '' && req.body.description != undefined) reqProData.description = req.body.description;
        if (req.file != undefined && req.file.filename != '' && req.file.filename != undefined) reqProData.product_image = req.file.filename;
        let productData = await productModel.findByIdAndUpdate(req.params.id, reqProData, {returnDocument: true});
        if (!productData._id) throw new Error('Something went wrong.');
        res.status(200).send(productData);
    } catch(error) {
        res.status(401).send({"error": error.message});
    }
});

// Delete existing product
router.delete('/api/products/:id', auth, async (req, res) => {
    try {
        let productData = await productModel.findByIdAndDelete(req.params.id);
        if (!productData._id) throw new Error('Something went wrong.');
        res.status(200).send({"message": "Product deleted successfully."});
    } catch(error) {
        res.status(401).send({"error": error.message});
    }
});

module.exports = router;