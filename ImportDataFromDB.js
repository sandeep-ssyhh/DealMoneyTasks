const mongodb = require("mongodb").MongoClient;

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// let url = "mongodb://username:password@localhost:27017/";

let url = "mongodb://localhost:27017/";

const createCSV = async (req, res) => {

  mongodb.connect(
    url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, client) => {
      if (err) throw err;

      client
        .db("user_db")
        .collection("usertables")
        .find({})
        .toArray((err, data) => {
          if (err) throw err;

          // console.log(data);

          const csvWriter = createCsvWriter({
            path: "./uploads/userTableData.csv",
            header: [{
                id: "_id",
                title: "ObjectId"
              },
              {
                id: "ts",
                title: "ts"
              },
              {
                id: "val",
                title: "val"
              }
            ]
          });

          csvWriter
            .writeRecords(data)
            .then(() =>
              res.status(200).send({
                link: "http://localhost:8080/userTableData.csv"
              })
              // console.log('file created')
            );

          client.close();
        });
    }
  );
}

module.exports = {
  createCSV
};