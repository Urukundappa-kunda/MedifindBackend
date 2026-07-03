const Pharmacy = require("../models/pharmacyModel");
const Stock = require("../models/stockModel");

const addStock = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "pharmacy not found",
      });
    }
    const { medicine, units, price } = req.body;

    const stock = await Stock.create({
      pharmacy: pharmacy._id,
      medicine,
      units,
      price,
      isAvailable: units > 0,
    });
    res.status(201).json({
      success: true,
      message: "stock added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "stock not found",
      });
    }

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy || !stock.pharmacy.equals(pharmacy._id)) {
      return res.status(403).json({
        success: false,
        message: "you are not authorised to update the stock",
      });
    }

    stock.units = req.body.units;
    stock.price = req.body.price;
    stock.isAvailable = stock.units > 0;

    await stock.save();

    res.status(200).json({
      success: true,
      data: stock,
    });
  } catch (error) {
    next(error);
  }
};

const getMyStock = async (req , res , next) => {
  try{
    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id
    })

    if(!pharmacy) {
      return res.status(404).json({
        success:  false,
        message: "pharmacy not found",
      })
    }

    const stocks = await Stock.find({
      pharmacy: pharmacy._id
    }).populate("medicine");

    res.status(200).json({
      success: true,
      data: stocks,
      count: stocks.length
    })
  }catch(error){
    next(error)
  }
}

module.exports = {
  getMyStock, updateStock, addStock
}
