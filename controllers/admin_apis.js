const { sequelize, User, Student, Staff, Assignment } = require("../models");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { Op, where } = require("sequelize");
const { QueryTypes } = require("sequelize");

// CREATION PART

const student_post = async (req, res) => {
  const { rollno, name, email, batch, branch } = req.body;
  try {
    let detailsid = 0;
    let generated_password = uuidv4().slice(0, 8);
    const hashpassword = await bcrypt.hash(generated_password, 10);

    const t = await sequelize.transaction();

    const student = await Student.create(
      { rollno, name, email, batch, branch },
      { transaction: t }
    ).then(async (insertid) => {
      detailsid = insertid.dataValues.id;
    });

    const role = "student";
    const user = await User.create(
      { email, password: hashpassword, role, detailsid },
      { transaction: t }
    );

    var smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use SSL
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
        `<h2>Hi ${req.body.name}, </h2> ` +
        `<p>The password for your first time login on attendance tracker has been attached here.. </p>` +
        `<p><b> ${generated_password} </b></p>` +
        "<p>Use this password for first time login. After successfull login, kindly change your password.</p>" +
        "<p>Thank you,</p>" + // html tent need to be changed
        "<p><b>Department Of Mathematics</b></p>" +
        "<p>CEG, ANNA UNIVERSITY</p>",
    };

    const checker = await transporter.sendMail(
      mailOptions,
      (error, info) => {
        if (error) {
          console.log(error);
          t.rollback();
          return res.status(500).json({ message: "user not created" });
        } else {
          t.commit();
          return res.status(200).json({ message: "user created successfully" });
        }
      },
      {
        transaction: t,
      }
    );
  } catch (err) {
    console.log("iam catch");
    t.rollback();
    return res.status(500).json(err);
  }
};

const staff_post = async (req, res) => {
  const { staffid, name, email } = req.body;
  try {
    let detailsid = 0;
    let generated_password = uuidv4().slice(0, 8);
    const hashpassword = await bcrypt.hash(generated_password, 10);

    const t = await sequelize.transaction();

    const staff = await Staff.create(
      { staffid, name, email },
      { transaction: t }
    ).then(async (insertid) => {
      detailsid = insertid.dataValues.id;
    });

    const role = "staff";
    const user = await User.create(
      { email, password: hashpassword, role, detailsid },
      { transaction: t }
    );

    var smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // use SSL
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
        `<h2>Hi ${req.body.name}, </h2> ` +
        `<p>The password for your first time login on attendance tracker has been attached here.. </p>` +
        `<p><b> ${generated_password} </b></p>` +
        "<p>Use this password for first time login. After successfull login, kindly change your password.</p>" +
        "<p>Thank you,</p>" + // html tent need to be changed
        "<p><b>Department Of Mathematics</b></p>" +
        "<p>CEG, ANNA UNIVERSITY</p>",
    };

    const checker = await transporter.sendMail(
      mailOptions,
      (error, info) => {
        if (error) {
          console.log(error);
          t.rollback();
          return res.status(500).json({ message: "user not created" });
        } else {
          t.commit();
          return res.status(200).json({ message: "user created successfully" });
        }
      },
      {
        transaction: t,
      }
    );
  } catch (err) {
    t.rollback();
    return res.status(500).json(err);
  }
};

const create_subject = async (req, res) => {
  const { subjectcode, subjectname, branch, semester, batch, staff_pk_id } =
    req.body;

  try {
    const subject = await Assignment.create({
      subjectcode,
      subjectname,
      branch,
      semester,
      batch,
      staff_pk_id,
    });
    return res.json(subject);
  } catch (err) {
    return res.status(500).json(err);
  }
};

// DELETION PART

const student_delete = async (req, res) => {
  const singleid = req.params.id;

  try {
    const result = await sequelize.transaction(async (t) => {
      const student = await Student.destroy(
        {
          where: {
            id: singleid,
          },
        },
        { transaction: t }
      ).then(async (insertedentry) => {
        await User.destroy(
          {
            where: {
              [Op.and]: [{ detailsid: singleid }, { role: "student" }],
            },
          },
          { transaction: t }
        );
      });
    });

    return res.status(200).json({ message: "student deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const student_batch_delete = async (req, res) => {
  const batchid = req.params.batch;
  try {
    const student = await Student.findAll({
      where: {
        batch: batchid,
      },
      attributes: ["id"],
    });
    let ids = [];

    for (let x of student) {
      ids.push(x.dataValues.id);
    }
    const result = await sequelize.transaction(async (t) => {
      const student = await Student.destroy(
        {
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        },
        { transaction: t }
      ).then(async (ins) => {
        await User.destroy(
          {
            where: {
              [Op.and]: [{ detailsid: { [Op.in]: ids } }, { role: "student" }],
            },
          },
          { transaction: t }
        );
      });
    });
    return res.status(200).json({ message: "students deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const staff_delete = async (req, res) => {
  const singleid = req.params.id;

  try {
    const result = await sequelize.transaction(async (t) => {
      const student = await Staff.destroy(
        {
          where: {
            id: singleid,
          },
        },
        { transaction: t }
      ).then(async (insertedentry) => {
        await User.destroy(
          {
            where: {
              [Op.and]: [{ detailsid: singleid }, { role: "staff" }],
            },
          },
          { transaction: t }
        );
      });
    });

    return res.status(200).json({ message: "staff deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const delete_subject = async (req, res) => {
  const singleid = req.params.id;
  try {
    const subject = await Assignment.destroy({
      where: {
        id: singleid,
      },
    });
    return res.status(200).json({ message: "subject deleted successfully" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

//SELECTION PART

const student_get = async (req, res) => {
  const batch = req.params.batch;

  try {
    const student = await Student.findAll({
      where: {
        batch: batch,
      },
      attributes: { exclude: ["createdAt","updatedAt"] },
    });
    return res.json(student);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const staff_get = async (req, res) => {
  try {
    const staff = await Staff.findAll({
      attributes: { exclude: ["createdAt","updatedAt"] },
    });
    return res.json(staff);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const get_batch = async (req, res) => {
  try {
    const batch = await Student.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("batch")), "batches"],
      ],
    });
    return res.json(batch);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const get_assignment = async (req, res) => {
  const batch = req.params.batch;

  try {
    const allocated = await Assignment.findAll({
      where: {
        batch: batch,
      },
      attributes: { exclude: ["createdAt","updatedAt","staff_pk_id"] },
    });
    return res.json(allocated);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  student_post,
  student_delete,
  student_get,
  student_batch_delete,
  staff_post,
  staff_delete,
  staff_get,
  create_subject,
  delete_subject,
  get_batch,
  get_assignment
};
