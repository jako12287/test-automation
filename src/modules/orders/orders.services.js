import { getOrderById } from "./orders.controller"

export const finderOrderById = ()=>{
    try {

        getOrderById("test")
        
    } catch (error) {
		console.log("TCL: finderOrderById -> error", error)
        
    }
}