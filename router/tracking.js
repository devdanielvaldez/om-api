const { trackingData } = require("../data/tracking");

const findTracking = (req, res) => {
    const id = req.params.id;
    const result = trackingData.data.find(item => item.id === id);
  
    if (result) {
      res.json({
        success: true,
        data: result
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Tracking ID ${id} not found`
      });
    }
}

module.exports = findTracking