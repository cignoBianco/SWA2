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
                    let input;
                    switch (field['type']) {
                        case 'file':
                            break; 
                        case 'color': 
                            let colors = document.createElement('datalist');
                            colors.id = 'colors' + contents['name'];

                            field['colors'].forEach(colour => {
                                let option = document.createElement('option');
                                option.value = colour;
                                colors.appendChild(option);
                            });

                            input = document.createElement('input');
                            input.type = field['type'];
                            input.list = colors.id;
                            break;
                        case 'textarea': 
                            input = document.createElement('textarea'); 
                            break;
                        case 'text':
                        case 'email':
                        case 'passowrd':
                            input = document.createElement('input');
                            input.type = field['type'];
                            input.placeholder = field['placeholder'] || '';
                            break;
                        default:
                          console.log(`Sorry, unvalid type.`);
                    }

                    input.id = field['label'] + '_' + contents['name'];
                    input.required = field['required'];

                    let label = document.createElement('label');
                    label.for = input.id;
                    form.appendChild(label);
            
                    form.appendChild(input);
                    form.appendChild(document.createElement('hr'));
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