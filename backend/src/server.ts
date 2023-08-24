import express from 'express'

import {createUser} from ".controller/UserController";

const app = express()
app.use(express.json())
app.use(router);

app.listen(3333, () => console.log("Server started"))