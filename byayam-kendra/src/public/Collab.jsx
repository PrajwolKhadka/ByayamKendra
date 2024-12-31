import React from 'react'
import '../css//Landingpage.css'
function Collab(){
    const brands = [
        { logo: "../assests/brand1.jpg" },
        { logo: "../assests/brand2.png" },
        {logo: "../assests/brand3.png" },
        { logo: "../assests/brand4.png" },
        { logo: "../assests/brand5.jpg" },
        { logo: "../assests/brand6.png" },
        { logo: "../assests/brand7.png" },
        { logo: "../assests/brand8.jpg" },
        { logo: "../assests/brand9.png" },
        { logo: "../assests/brand10.png" },
        { logo: "../assests/brand11.png" },
        { logo: "../assests/brand12.jpg" },
        { logo: "../assests/brand13.png" },
        { logo: "../assests/brand14.jpg" },
        { logo: "../assests/brand15.png" },
        { logo: "../assests/brand16.jpg" },
        { logo: "../assests/brand17.jpg" },
      ];
    return(
        <section className='ScrollView' id="#collab">
        <div className="Collab" id="plans">
            <h1 className='Collabh1'>Our Partners</h1>
            <p>साझेदारी र समजदारी</p>
        </div>
    <div className="horizontal-scroll-container">
     <div className="horizontal-scroll">
          {brands.map((brand, index) => (
             <div className="brand-item" key={index}>
<img src={brand.logo} alt={brand.name} loading="lazy" />
<p>{brand.name}</p>
</div>
))}
</div>
</div>
    </section>
    );
}


export default Collab;