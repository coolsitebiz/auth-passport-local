const passwordValidator = require('password-validator');

function isValid(password) {
    const schema = new passwordValidator();

    //validator config
    schema
        .is().min(8)
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2);

    return schema.validate(password);
}





module.exports = isValid;