import { Router } from "express";

const router = Router()

router.get("/", (req, res)=>{
    res.json({
        message:"Bienvenido demo_pg para automatizaciones",
        routes:["orders", "users"]
    })
})

export default router