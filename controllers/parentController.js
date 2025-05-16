const TempCode = require('../models/TempCode');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.generateLinkCode = async (req, res, next) => {
  try {
    const newCode = await TempCode.create({
      parentId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        code: newCode.code,
        expiresAt: newCode.expiresAt
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getChildren = async (req, res, next) => {
  try {
    const parent = await User.findById(req.user.id)
      .populate('children', 'username createdAt');

    res.status(200).json({
      status: 'success',
      results: parent.children.length,
      data: {
        children: parent.children
      }
    });
  } catch (err) {
    next(err);
  }
};