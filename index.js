const { sequelize } = require("./models");
const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const {
  login_post,
  firstuser_post,
  forgotpassword,
  changepassword
} = require("./controllers/user_apis");

const {
 student_post,
 student_delete,
 student_get,
 staff_post,
 staff_delete,
 staff_get,
 create_subject,
 delete_subject,
 get_batch,
 student_batch_delete,
 get_assignment
} = require("./controllers/admin_apis");

const {
  add_attendance,
  view_subjects
 } = require("./controllers/staff_apis");


//user
app.post("/user/first",firstuser_post);
app.post("/user/login", login_post);
app.post("/user/forgotpassword", forgotpassword);
app.post("/user/changepassword/:id", changepassword);

//admin
app.post ("/student",student_post);
app.delete ("/student/:id",student_delete);
app.get ("/students/:batch",student_get);
app.delete ("/students/:batch",student_batch_delete);
app.get ("/batch",get_batch);


app.post ("/staff",staff_post);
app.delete ("/staff/:id",staff_delete);
app.get ("/staffs",staff_get);


app.post ("/subject",create_subject);
app.get("/subject/:batch",get_assignment);
app.delete ("/subject/:id",delete_subject);


//staff
app.post ("/take/attendance",add_attendance);
app.get("/view/mysubject/:id",view_subjects);



app.listen({ port: 5000 }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
