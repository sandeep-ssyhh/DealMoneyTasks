// *******Insterted Required Pacages**************************/
let express = require('express');
var fs = require("fs");
const JSONStream = require('JSONStream');
var mongoose = require('mongoose');
const path = require("path");
var bodyParser = require('body-parser');

const csvFile = require('./ImportDataFromDB')
const taskSchemaTable = require('./userModel');

const app = express();

app.use(express.static(path.join(__dirname, "uploads")));

//**************************Database Connection***************************** */
mongoose.connect('mongodb://localhost:27017/user_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});




var arrayOfUsers = [];

//********************Post Method API****************************************** */ 

app.post('/uploadJsondata', (req, res) => {


  var readerStream = fs.createReadStream('./uploads/THERM0001.json');
  console.log("File has been read");


  //************* Inserting  100 records data from the array to database ************* */
  readerStream.pipe(JSONStream.parse('*')).on('data', async (userData) => {

    arrayOfUsers.push(userData);

    console.log(` Data uploading  please wait .... `);

    if (arrayOfUsers.length === 99) {
      readerStream.pause();

      await taskSchemaTable.insertMany(arrayOfUsers);
      arrayOfUsers = [];

      readerStream.resume();



    }
  });
  // *********************************Inserted rest remaining datas**********/

  readerStream.on('end', async () => {
    await taskSchemaTable.insertMany(arrayOfUsers); // left over data

    console.log(`Data upload completed `)
      });

      res.send('Thanks, Data start inserting into the database');

});
//***********************End Of Post API***********************************************888 */



//******Fetching data from table to CSV file(API) ********** */
app.get('/downloadCSV', csvFile.createCSV);


//*************Port Running on 3000******************************************* */
app.listen(8080, () => {
  console.log("Post started and running on 8080");
});