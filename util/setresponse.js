

const setresponse = (err, dbObject,res )=>{


    if(err){
            return res.status(500).json({
            ok: false,
            err
        })
   
    }

    if(!dbObject){
        return res.status(400).json({
            ok: false,
             err
         })
    }

    res.json({
            ok: true,
            dbObject
    });




}


module.exports= setresponse;