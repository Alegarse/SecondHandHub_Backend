const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

async function insertInitialProducts(mockProducts) {
  try {
    await productModel.insertMany(mockProducts);
    console.log("Products inserted successfully");
  } catch (error) {
    console.error(`Products insert failed: ${error.message}`);

  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products) {
      return res.status(200).send("Can't find any products");
    }
    res.status(200).send({ status: "Success", data: products });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await productModel.create(newProduct);
    res.status(200).send("Product upload successfully");
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const product = await productModel.findById(idProduct);
    if (!product) {
      return res.status(200).send("Can't find any product by that ID");
    }
    res.status(200).send({ status: "Success", data: product });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const newProduct = req.body;
    const updatedProduct = await productModel.findByIdAndUpdate(
      idProduct,
      newProduct,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(200).send("Can't find any product by that ID");
    }
    res
      .status(200)
      .send({ status: "Success", message: "Product successfully updated" });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { idProduct } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(idProduct);
    if (!deletedProduct) {
      return res.status(200).send("Can't find any product by that ID");
    } else {
      //Remove this product from users favorites
      await userModel.updateMany(
        {
          favorites: idProduct,
        },
        {
          $pull: { favorites: idProduct },
        }
      );
    }
    res
      .status(200)
      .send({ status: "Success", message: "Product successfully deleted" });
  } catch (error) {
    res.status(500).send({ status: "Failed", message: error.message });
  }
};

module.exports = {
  insertInitialProducts,
  getAllProducts,
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
