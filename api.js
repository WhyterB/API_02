//1 requires
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const mysql_config = require('./inc/mysql_config');
const functions = require('./inc/functions');

//2 criação de duas constantes para definição de disponibilidade da api e da
//api e da versão da api

const API_AVAILABILITY = true;
const API_VERSION = '1.0.0';

//3 iniciar o server

const app = express();
app.listen(3000, ()=>{
    console.log("API está executando")
})

//4 checar se a API está disponivel

app.use((req, res, next)=>{
    if (API_AVAILABILITY){
        next();
    } else{
        res.json(functions.response('atenção', 'API está em manutenção. Sinto muito',0,null))
    }
})

//5 mysql conecction

const conncetion = mysql.createConecction(mysql_config);

//6 cors

app.use(cors());

//7 rotas
//rota inicial que vai dizer que a API está disponivel

app.get('/', (req,res)=>{
    res.json(functions.response('sucesso', 'API está rodando',0,null))
})

//9 rota para pegar todas as tarefas
app.get('/tasks',(req,res)=>{
    conncetion.query('SELECT * FROM tasks', (err,rows))
})

//10 rota para pegar a task id

app.get('/tasks/:id', (req,res)=>{
    const id = req.params.id;
    conncetion.query('SELECT * FROM tasks WHERE id=?',[id],(err,rows)=>{
        if(!err){
            //devolver os dados da taks
            if(rows,lenght>0){
                res.json(functions.response('Sucesso','Sucesso na pesquisa',rows.effectedRows(data)))
            }else{
                res.json(functions.response('Atenção', 'Não foi possivel encontrar a taks solicitada',0,null))
            }
        }
        else{
            res.json(functions.response('error',err.message,0,null))
        }
    })
})

//11 atualizar o status de uma task

app.put('/tasks/:id/status:status',(req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    conncetion.query('UPDATE tasks SET status =? WHERE id =?',[status,id],(err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Sucesso na lateração do status',rows.affectedRows,null))
            }
            else{
                res.json(functions.response('Atenção','Task não encontrada',0,null))
            }
        }
        else{
            res.json(functions.response('Erro',err.message,0,null))
        }
    })
})

//8 midleware para caso alguma rota não seja encontrada
app.use((req,res)=>{
    res.json(functions.response('atenção', 'Rota não encontrada', 0, null))
})


