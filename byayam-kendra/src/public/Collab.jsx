import React from 'react'
import '../css//Landingpage.css'
function Collab(){
    const brands = [
        { logo: "/resources/collab1.png" },
        { logo: "/resources/collab2.png" },
        {logo: "/resources/collab3.jpg" },
        { logo: "/resources/collab4.png" },
        { logo: "/resources/collab5.png" },
        { logo: "/resources/collab6.png" },
        { logo: "/resources/collab7.png" },
        { logo: "/resources/collab8.jpg" },
        { logo: "/resources/collab9.png" },
        { logo: "/resources/collab10.png" },
        { logo: "/resources/collab11.jpg" },
        { logo: "/resources/collab12.jpg" },
        { logo: "/resources/collab13.png" },
      ];
    return(
        <section className='ScrollView' id="#collab">
        <div className="Collab" id="plans">
            <h1 className='Collabh1'>We Are Stronger With</h1>
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