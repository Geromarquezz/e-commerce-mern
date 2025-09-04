import './Footer.css'
import footer_logo from '../Assets/logo_big.png'
import instagram_icon from '../Assets/instagram_icon.png'
import pintester_icon from '../Assets/pintester_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'


export const Footer = () => {
  return (
    <div className='footer'>
        <hr />
        <div className="footer-logo">
            <img src={footer_logo} alt="" />
            <p>Shooper</p>
        </div>
        <ul className="footer-links">
            <li className="">Company</li>
            <li className="">Products</li>
            <li className="">Offices</li>
            <li className="">About Us</li>
            <li className="">Contact Us</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <img src={instagram_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={pintester_icon} alt="" />
            </div>
            <div className="footer-icons-container">
                <img src={whatsapp_icon} alt="" />
            </div>
        </div>
        <div className="footer-copyright">
            <p>© 2025 Shooper. All rights reserved.</p>
        </div>
    </div>
  )
}
