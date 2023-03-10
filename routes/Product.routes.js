const express = require("express");
const { ProductModel } = require("../model/Product.model");


const ProductRouter = express.Router();

ProductRouter.get("/", async (req, res) => {
const query = req.query
const q = query.q || ""


const sort = query._sort || null
const order = query._order || null
const limit = query._limit || null
const page = query._page || 1
let discount = query.discount || 0
let rating = query.rating || 0

delete query.q
delete query._sort
delete query._order
delete query._limit
delete query.discount
delete query.rating

let _sorting = {}
_sorting[`${sort}`] = order

let Skip;
if(page==1){
  Skip = 0
}
else{
 Skip= (page-1)*limit
}
try {
const ProductData = await ProductModel.find({name:{$regex:q},...query,discount:{$gte:+discount},rating:{$gte:+rating}}).sort(_sorting).skip(Skip).limit(limit)
 res.send(ProductData) 
} catch (error) {
 res.send({message:"Cannot get the products data",error:error.message}) 
}
});


ProductRouter.get("/carousel", async (req, res) => {

  try {
  const ProductData = await ProductModel.find()
   res.send(ProductData) 
  } catch (error) {
   res.send({message:"Cannot get the products data",error:error.message}) 
  }
  });
  



ProductRouter.post("/add", async (req, res) => {
  try {
    const ProductData = new ProductModel(req.body);
    await ProductData.save();
    res.send({ message: "Product has been added successfully" });
  } catch (error) {
    res.send({ message: "Cannot add product", error: error.message });
  }
});

ProductRouter.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await ProductModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ message: "Product has been updated successfully" });
  } catch (error) {
    res.send({
      message: "Cannot update the product",
      error: error.message,
    });
  }
});

ProductRouter.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await ProductModel.findByIdAndDelete({ _id: id });
    res.send({ message: "Product has been deleted successfully" });
  } catch (error) {
    res.send({
      message: "Cannot delete the product",
      error: error.message,
    });
  }
});

module.exports = { ProductRouter };

