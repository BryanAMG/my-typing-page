
export const getHtmlFromArray = (array) => {
    return array.map(word => {
        const letters = word.split('')
        const lettersToShow = letters.map(letter => (
            `<x-letter>${letter}</x-letter>`
        )).join('')
        return `<x-word>${lettersToShow}</x-word>`
    }).join('')

}

export const getCounterFormat = (number) => {
    const stringNumber = number instanceof String ? number : number.toString()
    return stringNumber.padStart(2, '0')
}