import React from 'react'
import './DescriptionBox.css'
const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>

        </div>
        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem harum ducimus quae, voluptate optio earum distinctio repellat vel sunt atque ex cumque, dolorem veniam quos nam iure ratione repellendus ea!</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus beatae enim tempora. Repudiandae labore maxime velit ab fugiat libero quisquam recusandae mollitia debitis iste! Suscipit hic inventore itaque! Porro, non?</p>
        </div>
    </div>
  )
}

export default DescriptionBox