import 'express-async-errors';
import { checkPrismaConnection, validateDbConnection } from './helpers/validatorBd'; 
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error';
import { router } from './server/Routes';
import Express from 'express';
import dotenv from 'dotenv';

const app = Express();
const PORT: number = 8070;

dotenv.config();
app.use(validateDbConnection);
app.use(Express.json())
app.use(helmet());
app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log('\x1b[32m%s\x1b[0m', `Servidor iniciado na porta ${PORT}`);
    checkPrismaConnection();
});


