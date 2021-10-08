var mongoose = require('mongoose');
const creds = require('./creds.js')

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(`mongodb+srv://${creds.user}:${creds.password}@cluster0.osztx.mongodb.net/morningnews?retryWrites=true&w=majority`
    ,
    options,
    function (err) {
        if (err == null) {
            console.log("===>> Connection Database successfull <<===")
        } else { console.log(err) }

    }

);

module.exports = mongoose