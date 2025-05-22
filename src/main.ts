import './style.css'
import './components/Calculator'


document.addEventListener('DOMContentLoaded',()=>{
    const app = document.getElementById('app')
    if(app){
        const el = document.createElement('slope-calculator')
        app.appendChild(el)
    }
})