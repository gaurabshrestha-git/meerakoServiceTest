const puppeteer = require("puppeteer");
const $ = require("cheerio");
const dotenv = require("dotenv");
dotenv.config();

const { db } = require("../database/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");
const ProductModel = require("../model/ProductModel");

//controller to scrpes the data from the website
const getDataController = async (req, res) => {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    const data = [];

    await page.goto(process.env.FLASH_SALE_URL);

    for (i = 1; i < 108; i++) {
      var title = await page.waitForSelector(
        "#campaign-1670004900000 > div > a:nth-child(" +
          i +
          ") > .flash-unit > .unit-content > .sale-title"
      );

      var price = await page.waitForSelector(
        "#campaign-1670004900000 > div > a:nth-child(" +
          i +
          ") > .flash-unit > .unit-content > .sale-price"
      );

      var titleText = await page.evaluate((title) => title.textContent, title);
      var priceText = await page.evaluate((price) => price.textContent, price);
      const product = {
        productName: titleText,
        price: parseInt(priceText.trim().substring(3)),
      };
      data.push(product);
    }

    browser.close();

    res.json({
      data,
    });
  } catch (error) {
    throw error;
  }
};

//controller to check the exsisting user email in the database, if it does then it checks the password. If the password is correct, it returns a token and the users id
const loginUserController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await UserModel.findOne({ email });
    console.log(user._id);
    if (user) {
      const auth = await bcrypt.compare(password, user.hashedPassword);
      if (auth) {
        const token = jwt.sign({ _id: email }, "secretcode");

        return res.json({
          token: token,
          login: true,
          _id: user._id,
        });
      } else {
        return res.json({
          login: false,
        });
      }
    } else {
      return res.json({
        login: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//made this controller to insert user using postman
//controller that takes email and password and hashes the password and save the email and hashed passsword to database
const registerUserController = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 8);

    const doc = {
      email,
      hashedPassword,
    };
    let data = new UserModel(doc);
    data.save((err, dataAll) => {
      if (err) {
        console.log(err);
      } else {
        console.log(dataAll);
      }
    });
  } catch (error) {
    throw error;
  }
};

//controller to verify the token and pass the response accordingly
const verifyTokenController = async (req, res) => {
  try {
    const token = req.body.token;
    if (token === null) {
      return res.json({
        login: false,
      });
    }
    const userData = jwt.verify(token, "secretcode", function (err, decoded) {
      if (err) {
        return res.json({
          login: false,
        });
      } else {
        return res.json({
          login: true,
        });
      }
    });
  } catch (e) {
    throw e;
  }
};

//controller to save data to the database
const saveDataController = async (req, res) => {
  try {
    const products = req.body.productDetails;
    console.log(products);

    const userId = req.body.userId;
    console.log(userId);

    const doc = {
      products,
      userId,
    };

    let saveData = new ProductModel(doc);
    saveData.save((err, dataAll) => {
      if (dataAll) {
        return res.json({
          submitted: true,
        });
      } else {
        throw err;
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDataController,
  loginUserController,
  registerUserController,
  verifyTokenController,
  saveDataController,
};
