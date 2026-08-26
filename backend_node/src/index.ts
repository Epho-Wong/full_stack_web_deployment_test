// // require('dotenv').config();
// const dotenv    = require('dotenv');
// const express   = require('express');
// const cors      = require('cors');
// const morgan    = require('morgan');
// const fs        = require('fs');
// const path      = require('path');
// // const {Sequelize, DataTypes} = require('sequelize');
// const redis = require('redis');

// // const {PrismaClient} = require('@prisma/client')
// // const {PrismaClient} = require('./generated/prisma/client')
// const {PrismaClient} = require('./generated/prisma/client.js')

// // import {PrismaMariaDb} from '@prisma/adapter-mariadb'
// const {PrismaMariaDb} = require('@prisma/adapter-mariadb');
// ===================================it's commonJS style above=====

// ===================================modify to ESmodule style above=====
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import redis from 'redis';

// const {Sequelize, DataTypes} = require('sequelize');
// const {PrismaClient} = require('@prisma/client')
// const {PrismaClient} = require('./generated/prisma/client')
// const {PrismaClient} = require('./generated/prisma/client.js')
import {PrismaClient} from './generated/prisma/client.js';
// import {PrismaMariaDb} from '@prisma/adapter-mariadb'
// const {PrismaMariaDb} = require('@prisma/adapter-mariadb');
import {PrismaMariaDb} from '@prisma/adapter-mariadb';

//use for django api proxy in nodejs without nginx
//if we use nginx to proxy all api, please disable this middleware as below
// const {createProxyMiddleware} = require('http-proxy-middleware');
const envPath = path.resolve(process.cwd(), '../', '.env');
dotenv.config({path:envPath});

const app = express();
const PORT= parseInt(process.env.NODE_PORT as string, 10);
// const PORT = process.env.NODE_PORT||8001;

// const redisClient = redis.createClient({url:process.env.REDIS_URL_NODE});
const redisClient = redis.createClient({url:process.env.REDIS_URL_NODE as string});
redisClient.on('error', err=>console.log('redis client error:', err));



app.use(cors());

//logger:
// const logDir='/var/log/test_node';
// const accessLogStrean=fs.createWriteStream(path.join(logDir, 'node_access.log'), {flags:'a'});
// app.use(morgan('combined', {stream:accessLogStrean}));

//database:
// const sequelize = new Sequelize(
//     process.env.MYSQL_DB_NAME,
//     process.env.MYSQL_DB_USER,
//     process.env.MYSQL_DB_PASS,
//     {
//         host:process.env.MYSQL_DB_HOST,
//         dialect:'mysql',
//         logging:false
//     }
// );
// const MySqlData=sequelize.define('MySqlData', {
//     name:{type:DataTypes.STRING, allowNull:false},
//     description:{type:DataTypes.TEXT}
// });
// sequelize.sync().then(()=>{
//     console.log('Mysql database synced');
// })

const adapter = new PrismaMariaDb({
    host: process.env.MYSQL_DB_HOST as string, // your database host
    user: process.env.MYSQL_DB_USER as string, // your database username
    password: process.env.MYSQL_DB_PASS as string, // your database password
    database: process.env.MYSQL_DB_NAME as string, // optional, your database name
  });
  

const prisma = new PrismaClient({adapter});

// const distdir = path.join('/home/hf/test/web_deployment/20260803_react_django_nodejs/frontend_react/dist/');
// const distdir = path.join(__dirname, process.env.NODE_CONFIG_FRONTEND_DIST_PATH);
// const distdir = path.join(process.env.NODE_CONFIG_FRONTEND_DIST_PATH);   //please disable it if you use nginx to proxy static frontend files
// NODE_CONFIG_FRONTEND_DIST_PATH=../frontend_react/dist/
// app.use(express.static(path.join(__dirname, process.env.NODE_CONFIG_FRONTEND_DIST_PATH)));
// app.use(express.static(path.join(__dirname,'../frontend_react/dist/')));

// app.use(express.static(distdir));

// app.use('/api/django/', createProxyMiddleware({
//     target:process.env.NODE_PROXY_DJANGO_API_URL,
//     // target:'http://127.0.0.1:8002',
//     changeOrigin:true,
//     //pathRewrite:{'^/api/django':'/api'} //if node match url '/api/django/test', node will transmit it to django
//     pathRewrite:{'^/':'/api/'}, 
// }));

app.get('/api/node/test', (req,res)=>{
    res.json({
        message: 'test from node',
        secret_from_env: process.env.NODE_SECRET||'node_default_secret',
        timestamp: new Date().toISOString()
    });
    console.log("check url/api/test/node");
});

app.get('/api/node/db', async(req,res)=>{
    try{
        const cacheKey="node_mysql_data_list";
        const cachedData=await redisClient.get(cacheKey);
        if(cachedData){
            return res.json({database:"mysql", source:"Redis_cache", "items":JSON.parse(cachedData)});
        }

        // const count = await MySqlData.count();
        // if(count===0){
        //     await MySqlData.create({name:"node mysql item", description:"this item was created by node itself cause no data yet"});
        // }
        // const items = await MySqlData.findAll({raw:true});
        let items = await prisma.mysqldata3.findMany();
        if(items.length===0){
            const newItem = await prisma.mysqldata3.create({
                data:{name:"nodejs_prisma_mysql_item", description:"this item was created manual cause no items store yet"}
            });
            items=[newItem];
        }

        await redisClient.set(cacheKey, JSON.stringify(items), {EX:300});  //expire:300s

        res.json({database:"mysql", source:"database_direct", items:items});
    }catch(error){
        res.status(500).json({error:"mysql query failed, "+error});
    }
});

// please disable this fallback route function if we use nginx to configurate
// app.use((req, res, next)=>{
//     if(req.method !== 'GET') return next();

//     if (/\.[a-z0-9]+$/i.test(req.path)) return next();

//     res.sendFile(path.join(distdir, 'index.html'));
// });
async function startServer(){
    await redisClient.connect();
    console.log('connect to redis db1 successfully');

    app.listen(PORT, '127.0.0.1', ()=>{
        console.log(`node server is running on port:${PORT}`);
    });    
}

startServer();