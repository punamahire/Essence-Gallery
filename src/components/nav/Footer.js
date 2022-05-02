import React from "react"

export const Footer = (props) => {    
  return (
    <>  
      <footer className="text-center text-lg-start bg-dark text-light text-muted">
        <div className="text-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
          © 2022 Copyright: &nbsp;
          <a className="text-reset fw-bold" href="http://localhost:3000/">Essence Gallery</a>
        </div>
      </footer>
    </>
  )
}


