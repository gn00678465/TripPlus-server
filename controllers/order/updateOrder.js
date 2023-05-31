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
  const { RtnCode, TradeAmt, PaymentDate, CustomField1 } = req.body;
  console.log(RtnCode);

  if (RtnCode == 1) {
    //付款成功
    const order = await Order.findById(CustomField1);

    const user = User.findById(order.member);
    let project = null;
    let product = null;
    if (order.projectId) {
      project = await Project.findById(order.projectId);
    }
    if (order.productId) {
      product = await Product.findById(order.productId);
    }
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
          {
            $set: {
              bonus: Math.floor(TradeAmt * 0.005),
              paidAt: new Date(PaymentDate).toISOString(),
              paymentStatus: 1
            }
          },
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
                Math.floor(TradeAmt * 0.005) -
                (order.bonusDiscount ?? 0)
            }
          },
          { runValidators: true },
          { session }
        );
      })
      .then(async () => {
        //console.log('success');
        await session.commitTransaction();
        successHandler(res, '', {});
      })
      .catch(async (error) => {
        //console.log(error);
        await session.abortTransaction();
        return next(appError(500, ''));
      })
      .finally(async () => {
        await session.endSession();
      });
  } else {
    //付款失敗， 無需更新訂單
    successHandler(res, '', {});
  }
});

module.exports = handleUpdateOrder;
