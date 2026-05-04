
import { useState } from "react";

export default function Orders() {

    const [filter,setFilter]= useState("all");



    return(

        <div className="flex flex-col gap-5 p-6 bg-white rounded-lg shadow-lg border border-white/20">


            <div className="felex flex-row gap-5 border-b border-red-900">

                <button className="border" onClick={()=>setFilter("all")}>All Orders</button>
                <button className="border" onClick={()=>setFilter("all")}>All Orders</button>
                <button className="border" onClick={()=>setFilter("all")}>All Orders</button>
                

            </div>

        </div>

    );
}