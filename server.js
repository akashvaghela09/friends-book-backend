const  { app} = require("./src/index")
const  { connect } = require("./src/config/db")
require("dotenv").config();
const PORT = 2244

app.listen(process.env.PORT || PORT, async () => {
    await connect()
    console.log(`Listening on port ${PORT}`);
})
