import  {routes} from './server/Routes';

const PORT = 8070


routes.listen(PORT,()=>{
    console.log(`Servidor Rodando na porta ${PORT}`)
});