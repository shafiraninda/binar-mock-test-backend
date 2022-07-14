require("dotenv").config();
const express = require("express");
const app = express();
const { sequelize } = require("./models");
const routes = require("./routes/index");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// router
app.use(routes);

sequelize
  .sync({
    // force: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
