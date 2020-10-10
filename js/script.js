const form = document.querySelector('form');
const button = form.querySelector('button');
      button.disabled = true;
const errorMessage = form.querySelector('#errorMessage');
const output = document.querySelector('#out');

form.addEventListener('change', validateInput);
form.addEventListener('submit', processForm);

function applyMask(input) {
	return input.value = generateMask(input.value, input.getAttribute('data-mask'));
}

function generateMask(value, mask) {
    let insertedValue = (value) ? value.replace(/\D+()/g, "") : '';
    let symbols = mask.replace(/\w/g, "0"); //+0 (000) 000 00-0
    let separators = symbols.match(/\D+/g);

    // Get length os symboles
	let symboles =  symbols.match(/\w+/g); // ["0", "000", "000", "00", "0"]	
    let lengths = [];
	symboles.forEach(s => {lengths.push(s.length)});

    return (isNumeric(symbols)) ? merge(separators, insertedValue, lengths) : merge(separators, insertedValue, lengths, 1);
}

function isNumeric(str) {
    return str[0] < 10;
}

function merge(separators, insertedValue, lengths, separatorStarts = 0) {
    let res = [];
    if (separatorStarts) res.push(separators.shift());
    for (let i = 0; i <= separators.length && insertedValue[0]; ++i) {
        let len = lengths[i];
        res.push(insertedValue.substr(0,len));
        insertedValue = insertedValue.substr(len++,);
        res.push(separators[i]);
    }
    return res.join('');
}

function validateInput(event) {
    let files = form.querySelector('input').files;
    try {
        Object.values(files).forEach(file => {
            if (file.type != 'text/javascript' && file.type != 'text/json') {
                throw unvalidFile;
            }   
            errorMessage.classList.remove('block');
            return button.disabled = false;
        });
    } catch(e) {
        errorMessage.classList.add('block');
        button.disabled = true;
    }
}

const allEqual = array => array.every( item => item.value === array[0].value );

function generateErrorMessage(text, form) {
    if (form.querySelector('span.err')) {
        form.querySelector('span.err').innerHTML = text;
    } else {
        let span = document.createElement('span');
        span.className = 'err';
        span.innerHTML = text;
        form.appendChild(span);
    }
}

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
            generateErrorMessage('Пароли не совпадают', form);
            validated = +validated * 0;
        }
    }

    let emails = [...form.querySelectorAll(`input[type="email"]`)];
    if (emails.length < 1) {
        if (allEqual(emails)) {
            emails[0].classList.remove('emails');
            validated = +validated * 1;
        } else {
            emails[0].classList.add('emails');
            generateErrorMessage('Почта не совпадает', form);
            validated = +validated * 0;
        } 
    }

    if (validated) {
        alert('Success!');
    }
}

function removeForm(event) {
    let form = event.target.parentElement.parentElement;
    form.parentElement.removeChild(form);
}

function processForm(event) {
    event.preventDefault();
    let files = form.querySelector('input').files; 

    let h2 = document.createElement('h2');
    h2.className = "mb-3";
    h2.innerHTML = "Сгенерированные формы";

    let wr = document.createElement('div');
    wr.classList = "py-3 text-center";
    wr.appendChild(h2);
    output.appendChild(wr);

    Object.values(files).forEach(file => {
        if (file) {
            let fileReader = new FileReader();
            fileReader.onload = function(e) {

                let wrapper = document.createElement('div');
                wrapper.className = "mb-5 pb-5 formDiv";

                let contents = JSON.parse(e.target.result);
                let form = document.createElement('form');
                form.classList.add("row");

                let formHeader = document.createElement('div');
                formHeader.className = 'fl-jc';

                let title = document.createElement('h2');
                title.innerHTML = contents['name'];
                formHeader.appendChild(title);

                let removeBtn = document.createElement('div');
                removeBtn.className = 'removeBtn';
                removeBtn.innerHTML = 'x';
                removeBtn.onclick = removeForm;
                formHeader.appendChild(removeBtn);

                wrapper.appendChild(formHeader);
        
                //fields // input -> placeholder: "Enter full name", required: true, type: "text"
                contents['fields'].forEach(field => {
                    let labelName = field['label'];
                    field = field['input'];
                    let input, label;

                    let inputWrapper = document.createElement('div');
                    inputWrapper.className = "mb-3 col-6";

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
                                inputWrapper.appendChild(label);
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
                                inputWrapper.appendChild(label);
                            }

                            break;
                        case 'checkbox':
                            input = document.createElement('input');
                            input.classList.add('checkbox');
                            input.type = field['type'];

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;
                            input.checked = field['checked'] === "true" || false;
                            console.log(!!field['checked'], field['checked']);

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                inputWrapper.appendChild(label);
                            }
                            break; 
                        /*case 'color': 
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
                            input.classList.add('color');

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                inputWrapper.appendChild(label);
                            }

                            break;*/
                        case 'textarea': 
                            input = document.createElement('textarea'); 
                            
                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;
                            
                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                inputWrapper.appendChild(label);
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
                                input.type = 'text';
                                input.setAttribute('data-mask', field['mask']);
                                input.onkeypress=function() {applyMask(this)};
                                input.onblur=function() {applyMask(this)};
                            }

                            if (labelName) {
                                label = document.createElement('label');
                                label.innerHTML = labelName;
                                label.htmlFor = input.id;
                                inputWrapper.appendChild(label);
                            }

                            input.placeholder = field['placeholder'] || '';
                            break;
                        default:
                          console.log(`Sorry, unvalid type.${field['type']}`);

                            Object.values(field).forEach(f => {
                                if (Array.isArray(f)) {

                                    input = document.createElement('select');
                                    input.id = (labelName || field['placeholder'] || filed['type']) + '_' + contents['name'];
        
                                    if (labelName) {
                                        label = document.createElement('label');
                                        label.innerHTML = labelName;
                                        label.htmlFor = input.id;
                                        inputWrapper.appendChild(label);
                                    }

                                    f.forEach(item => {
                                        let option = document.createElement('option');
                                        option.innerHTML = item;
                                        input.appendChild(option);
                                    })

                                    return input;
                                }
                            })
                                inputWrapper.append(input);
                                break;
                          return input;
                          input = document.createElement('input');
                            input.type = field['type'];

                            input.id = labelName + '_' + contents['name'];
                            input.required = field['required'] === "true" || field['required'] === true || false;

                    }
                    input.classList.add('form-control');
                    inputWrapper.append(input);

                    form.appendChild(inputWrapper);
                    form.onsubmit = validateForm;
                    form.appendChild(document.createElement('br'));
                });
/*
                if(contents['references']) {
                    continue; //idk what is it
                    contents['references'].forEach(ref => {
                        if(ref['input']) delete ref['input'];
                        if (Object.keys(ref).length === 0) return;

                        console.log(ref);

                        for (const [key, value] of Object.entries(ref)) {  
                            let input = document.createElement('input');
                            input.classList = 'checkbox reference';
                            //input .
                        }
                    });
                }*/

                if (contents['buttons']) {
                    contents['buttons'].forEach(btn => {
                        let button = document.createElement('button');
                        button.innerHTML = btn['text'];
                        button.classList = 'btn btn-primary btn-lg btn-block mb-3';
                        form.appendChild(button);

                        form.appendChild(document.createElement('span'));
                    });
                }

                wrapper.appendChild(form);
                output.appendChild(wrapper);
            }
            fileReader.readAsText(file);
        }
    });
}