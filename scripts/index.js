import { words } from './data.js'
import { LIMIT_TIME } from './const.js'
import { getCounterFormat, getHtmlFromArray } from './utils.js'


const $paragraph = document.querySelector('p')
const $timer = document.querySelector('time')
const $input = document.querySelector('input')

let wordsSelected = []
let currentTime = 0

startGame()
initEvents()

function startGame() {
    wordsSelected = words.slice(1, 20)
    currentTime = LIMIT_TIME

    $timer.textContent = getCounterFormat(currentTime)
    const worrdsToShow = getHtmlFromArray(wordsSelected)
    $paragraph.innerHTML = worrdsToShow

    const $firstWord = $paragraph.querySelector('x-word')
    const $firstLetter = $firstWord.querySelector('x-letter')
    $firstWord.classList.add('active')
    $firstLetter.classList.add('active')

    const countdownID = setInterval(() => {
        currentTime--
        $timer.textContent = getCounterFormat(currentTime)
        if (currentTime === 0) {
            gameover()
            clearInterval(countdownID)

        }
    }, 1000)
}


function initEvents() {
    $input.focus()
    $input.addEventListener('keydown', handleKeyDown)
    $input.addEventListener('keyup', handleKeyUp)
}

function handleKeyDown(event) {
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')
    const { key } = event
    if (key === ' ') {
        event.preventDefault()
    }
}

function handleKeyUp() {
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')

    const $allLetters = Array.from($currentWord.children)
    const word = $currentWord.textContent.trim()

    $input.maxLength = word.length
    $allLetters.forEach($letter => $letter.classList.remove('correct', 'wrong'))

    $input.value.split('').forEach((userLetter, index) => {
        const isCorrect = userLetter === word[index]
        const classValue = isCorrect ? "correct" : "wrong"
        $allLetters[index].classList.add(classValue)
    })

    $currentLetter.classList.remove('active', 'is-last')

    const $nextLetter = $allLetters[$input.value.length]
    const $letterChose = $nextLetter ?? $currentLetter
    const letterClass = !$nextLetter && "is-last"

    $letterChose.classList.add('active', letterClass)

}

function gameover() {
    console.log('gameover')
}