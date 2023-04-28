import React from 'react'

function Footer() {
  return (
    <div>
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-8 order-md-2">
                <ul className="footer-links">
                    <li>
                      <a className="telegram-icon" target="_blank" href="https://t.me/Foundation_Token"></a>
                    </li>
                    <li>
                      <a className="twitter-icon" target="_blank" href="https://twitter.com/TokenFoundation"></a>
                    </li>
                </ul>
              </div>
              <div className="col-12 col-md-4 order-md-1 copyrightCol">
                <p>© copyright Foundation Stake 2023</p>
              </div>
            </div>
          </div>
        </footer> 
    </div>
  )
}

export default Footer
