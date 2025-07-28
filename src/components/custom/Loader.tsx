import React from 'react'


const Loader = () => {
  return (
   
    <aside className="fixed inset-0 flex items-center justify-center z-50 bg-foreground/20">
      <div className="loading-dot"></div>
       <div data-id="0" className="loading-rings"></div>
       <div data-id="1" className="loading-rings"></div>
       <div data-id="2" className="loading-rings"></div>
       <div data-id="3" className="loading-rings"></div>
    </aside>
  )
}

export default Loader