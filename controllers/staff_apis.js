const { sequelize, Attendance, Assignment } = require("../models");

const add_attendance = async (req, res) => {
    const { hours,data, subject_pk_id } = req.body;
  
    try {
      const attendance = await Attendance.create({ hours,data, subject_pk_id });
      return res.json(attendance);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  const view_subjects = async (req, res) => {
  const staffid = req.params.id;

  
    try {
      const subject = await Assignment.findAll({
        where: {
          staff_pk_id: staffid,
        },
        attributes: { exclude: ["createdAt","updatedAt","staff_pk_id"] },
      });
      return res.json(subject);
    } catch (err) {
      return res.status(500).json(err);
    }
  };

  
module.exports = {
    add_attendance,
    view_subjects
  };
  