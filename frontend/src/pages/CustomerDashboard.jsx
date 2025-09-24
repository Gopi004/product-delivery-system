import CardGrid from "../components/CardGrid";
import NavBar from "../components/NavBar";
import React from "react";


function CustomerDashboard(){
    return (
        <div>
            <div><NavBar /></div>
            <div><CardGrid actor="customer"/></div>
        </div>
    );

}

export default CustomerDashboard;