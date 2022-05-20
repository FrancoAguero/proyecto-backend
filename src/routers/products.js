import { Router } from "express";
import productsApiFile from "../daos/products/productsDaoFile.js";
import productsApiMongo from "../daos/products/productsDaoMongo.js";
import productosApiFirebase from "../daos/products/productsDaoFirebase.js";
import 'dotenv/config';
import logger from "../logger.js";



const selectDao = (db) => {
    switch (db) {
        case "mongo":
            return productsApiMongo;
        case "archivo":
            return productsApiFile;
        case "firebase":
            return productosApiFirebase;
        default:
            break;
    }
}


const products = selectDao(process.env.DB) 
const productsApiRouter = new Router();

let Admin = true;

productsApiRouter.get('/', async (req, res) => {
    try {
        res.json(await products.listAll())
    } catch (error) {
        res.json({
            err: -1,
            message: error
        })
    }
})

productsApiRouter.get('/:id', async (req, res) => {
    try {
        res.json(await products.list(req.params.id))
    } catch (error) {
        res.json({
            err: -1,
            message: error
        })
    }
})

productsApiRouter.post('/', async (req, res) => {
    if(Admin){
        try {
            res.json(await products.save(req.body))
        } catch (error) {
            res.json({
                err: -1,
                message: error
            })
        }
    }
    else{
        res.json({
            err: -1,
            message: "ruta no autorizada"
        })
    }
})

productsApiRouter.put('/:id', async (req, res) => {
    if(Admin){
        try {
            res.json(await products.update({ ...req.body, id: req.params.id }))
        } catch (error) {
            logger.error(error)
            res.json({
                err: -1,
                message: error
            })
        }
    }
    else{
        res.json({
            err: -1,
            message: "ruta no autorizada"
        })
    }
})

productsApiRouter.delete('/:id', async (req, res) => {
    if(Admin){
        try {
            res.json(await products.delete(req.params.id))
        } catch (error) {
            res.json({
                err: -1,
                message: error
            })
        }
    }
    else{
        res.json({
            err: -1,
            message: "ruta no autorizada"
        })
    }
})

productsApiRouter.delete('/', async (req, res) => {
    if(Admin){
        try {
            res.json(await products.deleteAll())
        } catch (error) {
            logger.error(error)
            res.json({
                err: -1,
                message: error
            })
        }
    }
    else{
        res.json({
            err: -1,
            message: "ruta no autorizada"
        })
    }
})


export default productsApiRouter;