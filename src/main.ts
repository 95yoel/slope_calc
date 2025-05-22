import './style.css'
import './components/Calculator'
import './components/Form'
import './components/CustomInput'


document.addEventListener('DOMContentLoaded',()=>{
    const app = document.getElementById('app')
    if(app){
        const el = document.createElement('slope-calculator')
        app.appendChild(el)
    }
})