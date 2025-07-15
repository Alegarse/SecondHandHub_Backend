const productModel = require("../../models/productModel")

const getOwnerByProductId = async (idProduct) => {
    try {
        const product = await productModel.findById(idProduct).select('owner');
        if(!product){
            return false
        }
        return product.owner
    } catch (error) {
        return error.toString()
    }
}

module.exports = { getOwnerByProductId }