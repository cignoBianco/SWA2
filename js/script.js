const form = document.querySelector('form');
const button = form.querySelector('button');
      button.disabled = true;
const errorMessage = form.querySelector('#errorMessage');
const output = document.querySelector('#out');

form.addEventListener('change', validateInput);
form.addEventListener('submit', processForm);

function validateInput(event) {
    let files = form.querySelector('input').files;
    try {
        Object.values(files).forEach(file => {
            if (file.type != 'text/javascript' && file.type != 'text/json') {
                throw unvalidFile;
            }   
            errorMessage.classList = 'hidden';
            return button.disabled = false;
        });
    } catch(e) {
        errorMessage.classList = '';
        button.disabled = true;
    }
}

function processForm(event) {
    event.preventDefault();
    let files = form.querySelector('input').files; 

    Object.values(files).forEach(file => {
        if (file) {
            let fileReader = new FileReader();
            fileReader.onload = function(e) {
                let contents = JSON.parse(e.target.result);
                let form = document.createElement('form');

                let title = document.createElement('h2');
                title.innerHTML = contents['name'];
                form.appendChild(title);
        
                //fields // input -> placeholder: "Enter full name", required: true, type: "text"
                contents['fields'].forEach(field => {
                    field = field['input'];
                    let input = document.createElement('input');
                    input.required = field['required'];
                    input.placeholder = field['placeholder'];
                    input.type = field['type'];
                    form.appendChild(input);
                });

                let button = document.createElement('button');
                console.log(contents['buttons'][0]);
                button.innerHTML = contents['buttons'][0]['text'];
                form.appendChild(button);

                out.appendChild(form);
            }
            fileReader.readAsText(file);
        }
    });
}