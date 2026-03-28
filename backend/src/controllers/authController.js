const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const config = require('../config');
const ApiResponse = require('../utils/apiResponse');
const AppError = require('../utils/AppError');
const logAudit = require('../utils/auditLogger');

const generateToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpire });
const generateRefreshToken = (id) => jwt.sign({ id }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpire });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new AppError('Email already registered', 400);

    const user = await User.create({ name, email, password, role: 'user' });
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await logAudit(req, 'REGISTER', 'User', user._id, 'User registered');
    ApiResponse.created(res, { user, token, refreshToken }, 'Registration successful');
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (user.status === 'suspended') throw new AppError('Account suspended', 403);

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await logAudit(req, 'LOGIN', 'User', user._id, `${user.role} logged in`);
    ApiResponse.success(res, { user, token, refreshToken }, 'Login successful');
  } catch (error) { next(error); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    ApiResponse.success(res, { user });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio },
      { new: true, runValidators: true }
    );
    ApiResponse.success(res, { user }, 'Profile updated');
  } catch (error) { next(error); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Current password is incorrect', 400);
    }
    user.password = newPassword;
    await user.save();
    await logAudit(req, 'CHANGE_PASSWORD', 'User', user._id);
    ApiResponse.success(res, null, 'Password changed successfully');
  } catch (error) { next(error); }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new AppError('No user with that email', 404);

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await user.save();

    // In production, send email with reset link
    ApiResponse.success(res, { resetToken }, 'Password reset token generated (dev mode)');
  } catch (error) { next(error); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) throw new AppError('Invalid or expired reset token', 400);

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    ApiResponse.success(res, null, 'Password reset successful');
  } catch (error) { next(error); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError('User not found', 401);

    const token = generateToken(user._id);
    ApiResponse.success(res, { token }, 'Token refreshed');
  } catch (error) { next(error); }
};
