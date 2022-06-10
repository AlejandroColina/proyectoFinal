const express = require("express");
const router = express.Router();
const axios = require("axios");
const {Comentario,Publicacion} = require('../db');
router.use(express.json());

router.get('/:idPublicacion', async(req,res)=>{
    try{
        const {idPublicacion}=req.params;
        let comments = await Comentario.findAll({
            where: {
                PublicacionId: idPublicacion
            }
        })
        res.status(200).send(comments)
    }catch{
        res.json({message:"No se encontraron comentarios"})
    }
})




router.post('/', async(req,res)=>{
    try{
        const {puntaje, comentario, persona,PublicacionId} =req.body;
        
        if(!puntaje || !comentario || !profesional){
            return res.send({message:"No se pudo comentar la publicacion, intente mas tarde"})
        }else{
            await Comentario.create({
                PublicacionId,
                puntaje: parseInt(puntaje),
                comentario,
                profesional
            })
        }
        return res.status(200).json({message:"Gracias por tu comentario !"})
    }catch{
        res.status(400).json({message:"Algo salio mal, intenta mas tarde!"})
    }
})
router.delete('/:id',async(req,res)=>{
    try{
        let {id}= req.params;
        let toDelete = await Comentario.findOne({
            where:{
                id,
            }
        })
        await toDelete.destroy();
        res.status(200).json({message:"Comentario borrado con exito!"})
    }catch{
        res.status(400).json({message:"Algo salio mal !"})
    }
})
module.exports=router;