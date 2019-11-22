module.exports = function upperCaseFirst (word) {
    return word ? word[0].toUpperCase() + word.slice(1) : '';
};
