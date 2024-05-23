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
    document.addEventListener('keydown', () => {
        $input.focus()
    })
    $input.addEventListener('keydown', handleKeyDown)
    $input.addEventListener('keyup', handleKeyUp)
}

function handleKeyDown(event) {
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')
    const { key } = event


    if (key === ' ') {
        event.preventDefault()
        const $nextWord = $currentWord.nextElementSibling
        if (!$nextWord) {
            gameover()
        }

        const $nextLetter = $nextWord.querySelector('x-letter')
        const isCorrect = $currentWord.querySelectorAll('x-letter.correct').length === $currentWord.textContent.length
        const wordClass = isCorrect ? 'correct' : 'wrong'
        $currentWord.classList.add(wordClass)

        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        $nextWord.classList.add('active')
        $nextLetter.classList.add('active')

        $input.value = ''
    }

    if (key === 'Backspace') {
        const $prevWord = $currentWord.previousElementSibling
        const isEmpty = $input.value.length === 0
        const isAllCorrect = $prevWord.querySelectorAll(':not(.correct)').length === 0

        if (!$prevWord || !isEmpty || isAllCorrect) return
        event.preventDefault()
        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        $prevWord.classList.remove('correct', 'wrong')
        $prevWord.classList.add('active')

        const $userLetters = $prevWord.querySelectorAll(':is(.correct,.wrong)')
        const lastLetterIndex = $userLetters.length
        const $allLetters = Array.from($prevWord.children)
        const $prevLetter = $allLetters[lastLetterIndex]
        $prevLetter.classList.add('active')
        $input.value = Array.from($userLetters).map($letter => {
            const isCorrect = $letter.classList.contains('correct')
            return isCorrect ? $letter.textContent : '*'
        }).join('')
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
    const letterClass = $nextLetter ? ['active'] : ['active', 'is-last']

    $letterChose.classList.add(...letterClass)

    const $nextWord = $currentWord.nextElementSibling
    if (!$nextWord && $letterChose.classList.contains('is-last')) {
        gameover()
    }

}

function gameover() {
    console.log('gameover')
}