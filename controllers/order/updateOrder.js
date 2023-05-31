const mongoose = require('mongoose');
const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Order = require('../../models/ordersModel');
const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');
const User = require('../../models/usersModel');

const handleUpdateOrder = handleErrorAsync(async (req, res, next) => {
  console.log(req);
  const { RtnCode, TradeAmt, PaymentDate, CustomField1 } = req.body;

  const order = await Order.findById(CustomField1).lean().exec();
  order.bonus = Math.floor(TradeAmt * 0.005);
  order.payat = new Date(PaymentDate).toISOString();
  order.paystatus = RtnCode === 1 ? 1 : 0;

  const user = User.findById(order.member);
  const project = null;
  const product = null;
  if (order.projectId) {
    project = await Project.findById(order.projectId);
  }
  if (order.productId) {
    product = await Product.findById(order.productId);
  }

  // transaction
  let session = null;
  let newOrder = null;
  Order.createCollection()
    .then(() => {
      return mongoose.startSession();
    })
    .then(async (_session) => {
      session = _session;
      session.startTransaction();
      newOrder = await Order.findByIdAndUpdate(
        order.id,
        order,
        { new: true, runValidators: true },
        { session }
      );
      return newOrder;
    })
    .then(() => {
      if (project) {
        return Project.findByIdAndUpdate(
          project.id,
          {
            $set: {
              sum:
                project.sum +
                order.fundPrice * order.count +
                (order.extraFund ?? 0),
              sponsorCount: project.sponsorCount + 1
            }
          },
          { runValidators: true },
          { session }
        );
      }
      if (product) {
        return Product.findByIdAndUpdate(
          product.id,
          {
            $set: {
              sum: product.sum + order.fundPrice * order.count,
              buyerCount: product.buyerCount + 1
            }
          },
          { runValidators: true },
          { session }
        );
      }
    })
    .then(() => {
      return User.findByIdAndUpdate(
        order.member,
        {
          $set: {
            bonus:
              (user.bonus ?? 0) +
              (order.bonus ?? 0) -
              (order.bonusDiscount ?? 0)
          }
        },
        { runValidators: true },
        { session }
      );
    })
    .then(async () => {
      console.log('success');
      await session.commitTransaction();
      successHandler(res, '', {});
    })
    .catch(async (error) => {
      console.log(error);
      await session.abortTransaction();
      return next(appError(500, ''));
    })
    .finally(async () => {
      await session.endSession();
    });
});

module.exports = handleUpdateOrder;
