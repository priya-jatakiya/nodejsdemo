const {model, Schema} = require('mongoose');

const productSchema = new  Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
        validate(value) {
            if(typeof value !== 'number') throw new Error('Please enter valid price.');
        }
    },
    description: {
        type: String,
        trim: true,
        validate(value) {
            if (value.length > 255) {
                throw new Error('Maximum allowed characters are 255.');
            }
        }
    },
    product_type: {
        type: String,
        trim: true,
        default: 'Print Product',
        validate(value) {
            if (value != 'Print Product' && value != 'Promotional Product') {
                throw new Error('Please provide product types as Print Product or Promotional Product');
            }
        }
    },
    product_image: {
        type: String,
        trim: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
      }
});

const productModel = model('products', productSchema);

module.exports = productModel;