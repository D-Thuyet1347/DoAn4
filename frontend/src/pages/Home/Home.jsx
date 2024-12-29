import React, { useState } from 'react'
import './Home.css' 
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'
// import Contact from '../../components/Contact/Contact'

const Home = () => {
  const[category,setCategory]=useState("ALL");
  return (

      <>
    {/* <Contact/> */}

      <div>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category} />
      <AppDownload/>
    </div>
      </>
  )
}

export default Home
