const TempCode = require('../models/TempCode');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.linkToParent = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    const tempCode = await TempCode.findOne({ 
      code, 
      used: false,
      expiresAt: { $gt: Date.now() }
    });

    if (!tempCode) {
      return next(new AppError('كود الربط غير صالح أو منتهي الصلاحية', 400));
    }

    // تحديث بيانات الابن
    await User.findByIdAndUpdate(
      req.user.id,
      { parentId: tempCode.parentId },
      { new: true }
    );

    // تحديث بيانات الأب
    await User.findByIdAndUpdate(
      tempCode.parentId,
      { $addToSet: { children: req.user.id } }
    );

    // تعليم الكود كمستخدم
    tempCode.used = true;
    await tempCode.save();

    res.status(200).json({
      status: 'success',
      message: 'تم الربط بنجاح',
      data: {
        parentId: tempCode.parentId
      }
    });
  } catch (err) {
    next(err);
  }
};