//----------------------------------------------//
//                                              //
//     written by github.com/andremalveira      //
//                                              //
//----------------------------------------------//

// how to use
// <input type="text"            fieldmask="onlyNumbers"             name="" id="">
// <script src="https://andremalveira.github.io/cdnjs/fieldmask.js"></script>
//  <script>fieldmask()</script>
// Options
//fieldmask="cpf"
//fieldmask="cnpj"
//fieldmask="tel"
//fieldmask="ddd+tel"
//fieldmask="cel"
//fieldmask="ddd+cel"
//fieldmask="cep"
//fieldmask="date"
//fieldmask="time"
//fieldmask="dateTime"
//fieldmask="currency"
//fieldmask="centimeter"
//fieldmask="meter"
//fieldmask="ip"
//fieldmask="letter"  -> Apenas Letras
//fieldmask="number"  -> Apenas Números

const fieldmask = (clientFormatMask) => {
    var allInputs = document.querySelectorAll("input[fieldmask]");
    var formatMask = {
        "cpf": "000.000.000-00",
        "cnpj": "00.000.000/0000-00",
        "tel": "0000-0000",
        "ddd+tel": "(00) 0000-0000",
        "cel": "00000-0000",
        "ddd+cel": "(00) 00000-0000",
        "cep": "00000-000",
        "date": "00/00/0000",
        "time": "00:00:00",
        "dateTime": "00/00/0000 00:00:00",
        "currency": ["000.000.000,00", { reverse: true}],
        "centimeter": ["000", { reverse: true, suffix: "cm" }],
        "meter": ["0000", { reverse: true, suffix: "m" }],
        "ip": "000.000.000.000",
        "letter": "",
        "number": "",
    };

    clientFormatMask
        ? (formatMask = Object.assign({}, formatMask, clientFormatMask))
        : formatMask;

    function ifKeyExist(obj, key) {
        if (obj[key] == undefined) {
            return false;
        } else {
            return true;
        }
    }

    Array.prototype.forEach.call(allInputs, function (inputs) {
        var codOk = null;
        const _INPUT_MASK = inputs.attributes["fieldmask"].value;

        let formatMaskValue,
            isReverse = false,
            hasPrefix,
            hasSuffix,
            maxInputLength, 
            valueLength;

        String.prototype.reverse = function () {
            return this.split("").reverse().join("");
        };

        _INPUT_MASK == ""
            ? (console.error(
                  'pt-BR: Fala dev! O Atributo [fieldmask=""] do input está vazio, informe um tipo de máscara como valor. Ex: fieldmask="cpf", "cnpj", "cep" e etc...'
              ),
              console.error(
                  'en-US: Speak dev! Input attribute [fieldmask=""] is empty, enter a mask type as value. Ex: fieldmask="cpf", "cnpj", "zip" and etc... '
              ),
              (codOk = false),
              console.error("Input: ", inputs))
            : ifKeyExist(formatMask, _INPUT_MASK) == false
            ? (console.error(
                  'pt-BR: Fala dev! A Máscara "' +
                      _INPUT_MASK +
                      '" em [fieldmask="' +
                      _INPUT_MASK +
                      '"] não existe, verifique se o nome está correto, ou declare sua própria máscara na execução do fieldmask, dessa maneira: fieldmask({"' +
                      _INPUT_MASK +
                      '":"formato da máscara, Ex: 00.00.00"})'
              ),
              console.error(
                  'en-US: Speak dev! Mask "' +
                      _INPUT_MASK +
                      '" in [fieldmask="' +
                      _INPUT_MASK +
                      '"] does not exist, check that the name is correct, or declare your own mask in the fieldmask run, like this: fieldmask({"' +
                      _INPUT_MASK +
                      '":"mask format, Ex: 00.00.00"})'
              ),
              (codOk = false),
              console.error("Input: ", inputs))
            : (codOk = true);

        if (codOk) {
            formatMaskValue = (isArray =
                Array.isArray(formatMask[_INPUT_MASK]) == true)
                ? formatMask[_INPUT_MASK][0]
                : formatMask[_INPUT_MASK];
            maxInputLength = formatMaskValue.length;

            if (isArray == true && formatMask[_INPUT_MASK][1]) {
                const {
                    reverse,
                    prefix = "",
                    suffix = "",
                } = formatMask[_INPUT_MASK][1];

                isReverse = reverse;
                hasPrefix = prefix;
                hasSuffix = suffix;

                maxInputLength =
                    formatMaskValue.length +
                    hasPrefix.length +
                    hasSuffix.length;
            }

            if (_INPUT_MASK == "number" || _INPUT_MASK == "letter") {
                const onlyLetters = (value) => {
                    return value.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, "");
                };
                const onlyNumbers = (value) => {
                    return value.replace(/\D/g, "");
                };

                if (_INPUT_MASK == "number") {

                    inputs.oninput = function () {
                        var i = inputs.value.length;
                        var str = inputs.value;
                        if (isNaN(Number(str.charAt(i - 1)))) {
                            inputs.value = str.substr(0, i - 1);
                        }

                        inputs.value = onlyNumbers(inputs.value);
                    };

                } else if (_INPUT_MASK == "letter") {

                    inputs.oninput = function () {
                        var i = inputs.value.length;
                        var str = inputs.value;
                        if (Number(str.charAt(i - 1))) {
                            inputs.value = str.substr(0, i - 1);
                        }
                        inputs.value = onlyLetters(inputs.value);
                    };
                }
            } else {
                inputs.setAttribute("maxlength", maxInputLength);

                const insertMask = (value) => {
                    var inputValue =
                        isReverse == true
                            ? value.replace(/[^\d]+/gi, "").reverse()
                            : value.replace(/[^\d]+/gi, "");

                    var inputValueLength =
                        isReverse == true
                            ? inputValue.length
                            : inputValue.length + 1;

                    var result = "";
                    var mask =
                        isReverse == true
                            ? formatMaskValue.reverse()
                            : formatMaskValue;

                    for (
                        var x = 0, y = 0;
                        x < mask.length && y < inputValueLength;

                    ) {
                        if (mask.charAt(x) != "0") {
                            result += mask.charAt(x);
                            x++;
                        } else {
                            result += inputValue.charAt(y);
                            y++;
                            x++;
                        }
                    }

                    return isReverse == true
                        ? (hasPrefix ? hasPrefix : "") +
                              result.reverse() +
                              (hasSuffix ? hasSuffix : "")
                        : (hasPrefix ? hasPrefix : "") +
                              result +
                              (hasSuffix ? hasSuffix : "");
                };

                const setCursorPosition = () => {
                    let l = inputs.value.length - hasSuffix.length;
                    valueLength = l.toString().includes("-") ? l * -1 : l;

                    if(valueLength === 0) {
                        inputs.value = ''
                    }

                    inputs.setSelectionRange(valueLength, valueLength);
                };

                if (inputs.value.length >= 1) {
                    inputs.value = insertMask(inputs.value);
                }

                inputs.oninput = function (event) {
                    var i = inputs.value.length;
                    var str = inputs.value;

                    if (i <= maxInputLength) {
                        if (isNaN(Number(str.charAt(i - 1)))) {
                            inputs.value = str.substr(0, i - 1);
                        }
                        inputs.value = insertMask(inputs.value);
                    }

                    setCursorPosition();
                };

                inputs.onfocus = setCursorPosition;
                inputs.onclick = setCursorPosition;
            }
        }
    });
};
