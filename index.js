const express = require("express")
const app = express();
const api2 = require("fordonsuppgifter-api-wrapper");


app.use(express.json())

app.get("/api/:id",async (req,res)=>{
    const id = req.params.id;

    try{
        console.log("fetching vehicle info");
        var data = await api2.GetVehicleInformation(req.params.id);
        res.json(data)
    }catch(err){
        console.log(err)
        res.status(400).json({error:err})
    }
}) 


app.listen(3000,(err)=>{
    if(err) console.log(err);
    console.log("runnning API port 3000");
})