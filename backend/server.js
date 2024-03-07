const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mysql = require("mysql2");

const userRoutes = require("./routes/user");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage });
const db = require('./dbConfig/dbConfig');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/user", userRoutes);

//file upload
app.post("/uploads",upload.single('imageFile'), (req, res) => {
  res.send('Uploaded Successfully');
})

//db
const port = 3000;
async function run() {
  await db.getConnection(() => {
    //run app
    app.listen(port, () => {
      console.log(`Server Running with DB... port:${port}`);
    });
  });

  app.get("/db_action", (req, res) => {
    const sql =
      'create table user (ID INT NOT NULL AUTO_INCREMENT, email VARCHAR(255) CHARACTER SET "utf8mb4" NOT NULL, password VARCHAR(255) CHARACTER SET "utf8mb4" NOT NULL, type VARCHAR(255) CHARACTER SET "utf8mb4" NOT NULL, active TINYINT default 1, primary key (ID))';
    db.query(sql, (err, result) => {
      if (err){
        console.log(err.code);
        res.send(err.sqlMessage);
      }
      else {
        console.log(result);
        res.send("User Table Created");
      }
    });
  });
}

run().catch((error) => console.log(error));
