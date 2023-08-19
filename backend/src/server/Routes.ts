import Express from "express";

const routes = Express();

routes.get('/', (req,res)=>{

    return res.send('Opa')
})


export {routes};