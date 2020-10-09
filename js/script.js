const form = document.querySelector('form');
const output = document.querySelector('#out');

form.addEventListener('submit', processForm);

function processForm(event) {
    event.preventDefault();
    console.log(1);
    let f = form.querySelector('input').files[0]; 
    console.log(f);
    if (f) {
        let r = new FileReader();
        r.onload = function(e) {
            let contents = e.target.result;
            output.innerHTML = contents;
        }
        r.readAsText(f);
    }
}