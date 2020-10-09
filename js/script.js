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

const allEqual = array => array.every( item => item.value === array[0].value )

function validateForm(event) {
    event.preventDefault();
    let form = event.target;
    let validated = false;

    let passwords = [...form.querySelectorAll(`input[type="password"]`)];
    if (passwords.length > 1) {
        if (allEqual(passwords)) {
            passwords[0].classList.remove('passwords');
            validated = true;
        } else {
            passwords[0].classList.add('passwords');
            validated = +validated * 0;
        }
    }

    let emails = [...form.querySelectorAll(`input[type="email"]`)];
    if (emails.length < 1) {
        if (allEqual(emails)) {
            emails[0].classList.remove('emails');
            validated = +validated * 1;
        } else {
            passwords[0].classList.add('emails');
            validated = +validated * 0;
        } 
    }

    if (validated) {
        alert('Success!');
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
                    let labelName = field['label'];
                    field = field['input'];
                    let input, label;
                    switch (field['type']) {
                        case 'file':
                            input = document.createElement('input');
                            input.type = 'file';
                            input.multiple = field['multiple'];
                            input.accept = field['fieldtype'];

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }

                            break;
                        case 'date':
                            input = document.createElement('input');
                            input.type = 'file';

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }

                            break;
                        case 'checkbox':
                            input = document.createElement('input');
                            input.type = field['type'];

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;
                            input.checked = field['checked'] === "true" || false;
                            console.log(!!field['checked'], field['checked']);

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }
                            /*
                            <input type="checkbox" id="development" value="interest_development" name="user_interest"><label class="light" for="development">Development</label><br>
                            <input type="checkbox" id="design" value="interest_design" name="user_interest"><label class="light" for="design">Design</label><br>
                            <input type="checkbox" id="business" value="interest_business" name="user_interest"><label class="light" for="business">Business</label>
                            */
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

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }

                            break;
                        case 'textarea': 
                            input = document.createElement('textarea'); 
                            
                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;
                            
                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }

                            break;
                        case 'text':
                        case 'email':
                        case 'password':
                        case 'number':
                            input = document.createElement('input');
                            input.type = field['type'];

                            input.id = (labelName || field['placeholder'] || filed['type']) + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                            if (field['mask']) {

                            }

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                form.appendChild(label);
                            }

                            input.placeholder = field['placeholder'] || '';
                            break;
                        default:
                          console.log(`Sorry, unvalid type.${field['type']}`);
                          return;
                          input = document.createElement('input');
                            input.type = field['type'];

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                    }

                    form.appendChild(input);
                    form.onsubmit = validateForm;
                    form.appendChild(document.createElement('br'));
                });

                if (contents['buttons']) {
                    contents['buttons'].forEach(btn => {
                        let button = document.createElement('button');
                        button.innerHTML = btn['text'];
                        form.appendChild(button);

                        form.appendChild(document.createElement('span'));
                    });
                }

                out.appendChild(form);
            }
            fileReader.readAsText(file);
        }
    });
}