const Medicine = require("../models/medicineModel");
const Stock = require("../models/stockModel");

const getAllMedicine = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    next(error);
  }
};

const getMedicineBySearch = async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "please enter the medicine name",
      });
    }

    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" },
    });

    if (medicines.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no medicines found",
      });
    }

    res.status(200).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    next(error);
  }
};

const searchMedicines = async (req, res, next) => {
  try {
    const { name, lat, lng } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide a medicine name",
      });
    }

    const medicines = await Medicine.find({
      name: { $regex: name, $options: "i" },
    });

    if (medicines.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No medicines found matching that name",
      });
    }

    const medicineIds = medicines.map((m) => m._id);

    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      const results = await Stock.aggregate([
        {
          $match: {
            medicine: { $in: medicineIds },
            isAvailable: true,
          },
        },
        {
          $lookup: {
            from: "pharmacies",
            localField: "pharmacy",
            foreignField: "_id",
            as: "pharmacy",
          },
        },
        { $unwind: "$pharmacy" },
        {
          $match: {
            "pharmacy.status": "approved",
          },
        },
        {
          $addFields: {
            distance: {
              $multiply: [
                {
                  $acos: {
                    $add: [
                      {
                        $multiply: [
                          { $sin: { $degreesToRadians: latitude } },
                          {
                            $sin: {
                              $degreesToRadians: {
                                $arrayElemAt: [
                                  "$pharmacy.location.coordinates",
                                  1,
                                ],
                              },
                            },
                          },
                        ],
                      },
                      {
                        $multiply: [
                          { $cos: { $degreesToRadians: latitude } },
                          {
                            $cos: {
                              $degreesToRadians: {
                                $arrayElemAt: [
                                  "$pharmacy.location.coordinates",
                                  1,
                                ],
                              },
                            },
                          },
                          {
                            $cos: {
                              $subtract: [
                                {
                                  $degreesToRadians: {
                                    $arrayElemAt: [
                                      "$pharmacy.location.coordinates",
                                      0,
                                    ],
                                  },
                                },
                                { $degreesToRadians: longitude },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                },
                6371,
              ],
            },
          },
        },
        { $match: { distance: { $lte: 5 } } },
        { $sort: { distance: 1 } },
        {
          $project: {
            _id: 0,
            pharmacy: {
              name: "$pharmacy.name",
              address: "$pharmacy.address",
              openingHours: "$pharmacy.openingHours",
            },
            distance: { $round: ["$distance", 2] },
            price: 1,
            units: 1,
            isAvailable: 1,
          },
        },
      ]);

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pharmacies found within 5km stocking this medicine",
        });
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    } else {
      const results = await Stock.find({
        medicine: { $in: medicineIds },
        isAvailable: true,
      }).populate({
        path: "pharmacy",
        match: { status: "approved" },
        select: "name address openingHours",
      });

      const filtered = results.filter((s) => s.pharmacy !== null);

      if (filtered.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pharmacies currently stock this medicine",
        });
      }

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMedicine,
  getMedicineBySearch,
  searchMedicines,
};
