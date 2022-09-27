const { sequelize, User, Staff, Student } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const firstuser_post = async (req, res) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hashpassword,
      role: "admin",
      detailsid: 1,
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const login_post = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (user == null) {
      return res.status(500).json({ error: "Email is incorrect" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(500).json({ error: "Incorrect password" });
    }
    if (user.role != role) {
      return res.status(500).json({ error: "Incorrect role" });
    }

    if (user.role == "staff") {
      const details = await Staff.findOne({
        where: { id: user.detailsid },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return res.json({ ...details.dataValues, ...user.dataValues });
    } else if (user.role == "student") {
      const details = await Student.findOne({
        where: { id: user.detailsid },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      return res.json({ ...details.dataValues, ...user.dataValues });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });

    if (user == null) {
      return res.status(500).json({ error: "Email is not exists" });
    } else {
      const t = await sequelize.transaction();
      let generated_password = uuidv4().slice(0, 8);
      const hashpassword = await bcrypt.hash(generated_password, 10);

      await user.update(
        {
          password: hashpassword,
        },
        { transaction: t }
      );

      var smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: "sreeharan612@gmail.com", // generated ethereal user
          pass: "xycitjijisqbtsvh",
        },
      };
      var transporter = nodemailer.createTransport(smtpConfig);
      let mailOptions = {
        from: "sreeharan612@gmail.com", // sender address
        to: req.body.email, // list of receivers
        subject: `Department Of Mathematics - Attendance Tracker`, // Subject line
        html:
          `<h2>Hi, </h2> ` +
          `<p><b>As per your request new password for login is generated.</b></p>` +
          `<p>The password for your login has been attached here.. </p>` +
          `<p><b> ${generated_password} </b></p>` +
          "<p>Use this password for login. After successfull login, kindly change your password.</p>" +
          "<p>Thank you,</p>" + // html tent need to be changed
          "<p><b>Department Of Mathematics</b></p>" +
          "<p>CEG, ANNA UNIVERSITY</p>",
      };
      transporter.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            t.rollback();
            return res.status(500).json({ message: "mail is not sent" });
          } else {
            t.commit();
            return res.status(200).json({ message: " mail is sent" });
          }
        },
        {
          transaction: t,
        }
      );
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const changepassword = async (req, res) => {
  const singleid = req.params.id;
  const { email, oldpassword, newpassword } = req.body;

  try {
    const user = await User.findOne({
      where: { id: singleid },
    });
    if (user == null) {
      return res.status(500).json({ error: "User is not exists" });
    }
    const validPassword = await bcrypt.compare(oldpassword, user.password);
    if (!validPassword) {
      return res
        .status(500)
        .json({ error: "Pls enter old password correctly" });
    } else {
      const t = await sequelize.transaction();
      const hashpassword = await bcrypt.hash(newpassword, 10);
      await user.update(
        {
          password: hashpassword,
        },
        { transaction: t }
      );

      var smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          user: "sreeharan612@gmail.com", // generated ethereal user
          pass: "xycitjijisqbtsvh",
        },
      };
      var transporter = nodemailer.createTransport(smtpConfig);
      let mailOptions = {
        from: "sreeharan612@gmail.com", // sender address
        to: email, // list of receivers
        subject: `Department Of Mathematics - Attendance Tracker`, // Subject line
        html:
          `<h2>Hi, </h2> ` +
          `<p><b>As per your request, your password has been changed successfully for your login.</b></p>` +
          `<p>your new password for login is ${newpassword}</p>` +
          "<p>Thank you,</p>" + // html tent need to be changed
          "<p><b>Department Of Mathematics</b></p>" +
          "<p>CEG, ANNA UNIVERSITY</p>",
      };
      transporter.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            t.rollback();
            return res.status(500).json({ message: "Password not changed" });
          } else {
            t.commit();
            return res
              .status(200)
              .json({ message: "Password changed successfully" });
          }
        },
        {
          transaction: t,
        }
      );
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  login_post,
  firstuser_post,
  forgotpassword,
  changepassword,
};
