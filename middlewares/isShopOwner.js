const isShopOwner = (req, res, next) => {
    if(req.user && req.user.role === 'shopOwner') {
      return next()
    }else{
      return res.status(403).json({
        success: false,
        message: "access denied"
      })
    }
  }

module.exports = isShopOwner