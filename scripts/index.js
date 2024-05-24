import { words } from './data.js'
import { LIMIT_TIME } from './const.js'
import { getCounterFormat, getHtmlFromArray } from './utils.js'


const $paragraph = document.querySelector('p')
const $timer = document.querySelector('time')
const $input = document.querySelector('input')
const $game = document.querySelector('#game')
const $results = document.querySelector('#results')
const $wpm = $results.querySelector('#results-wpm')
const $accuracy = $results.querySelector('#results-accuracy')
const $button = document.querySelector('#reload-button')

let wordsSelected = []
let currentTime = 0
let playing

startGame()
initEvents()

function startGame() {
    $game.style.display = 'flex'
    $results.style.display = 'none'
    $input.value = ''

    playing = false

    wordsSelected = words.toSorted(
        () => Math.random() - 0.5
    ).slice(0, 30)
    currentTime = LIMIT_TIME

    $timer.textContent = getCounterFormat(currentTime)
    const worrdsToShow = getHtmlFromArray(wordsSelected)
    $paragraph.innerHTML = worrdsToShow

    const $firstWord = $paragraph.querySelector('x-word')
    const $firstLetter = $firstWord.querySelector('x-letter')
    $firstWord.classList.add('active')
    $firstLetter.classList.add('active')
}


function initEvents() {
    document.addEventListener('keydown', () => {
        $input.focus()
        if (!playing) {
            playing = true
            const intervalId = setInterval(() => {
                currentTime--
                $timer.textContent = currentTime

                if (currentTime === 0) {
                    clearInterval(intervalId)
                    gameOver()
                }
            }, 1000)
        }
    })
    $input.addEventListener('keydown', handleKeyDown)
    $input.addEventListener('keyup', handleKeyUp)
    $button.addEventListener('click', startGame)
}

function handleKeyDown(event) {
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')
    const { key } = event


    if (key === ' ') {
        event.preventDefault()
        const $nextWord = $currentWord.nextElementSibling
        if (!$nextWord) {
            gameOver()
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
        if (!$prevWord) return
        const isEmpty = $input.value.length === 0
        const isAllCorrect = $prevWord.querySelectorAll(':not(.correct)').length === 0

        if (!isEmpty || isAllCorrect) return
        event.preventDefault()
        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        $prevWord.classList.remove('correct', 'wrong')
        $prevWord.classList.add('active')

        const $userLetters = $prevWord.querySelectorAll(':is(.correct,.wrong)')
        const $allLetters = Array.from($prevWord.children)

        const isLastLetter = $userLetters.length === $prevWord.textContent.trim().length
        const lastUserLetter = isLastLetter ? $userLetters.length - 1 : $userLetters.length
        const $letterToGo = $allLetters[lastUserLetter]
        $letterToGo.classList.add('active')

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
        gameOver()
    }

}

function gameOver() {
    $game.style.display = 'none'
    $results.style.display = 'flex'

    const correctWords = $paragraph.querySelectorAll('x-word.correct').length
    const correctLetter = $paragraph.querySelectorAll('x-letter.correct').length
    const incorrectLetter = $paragraph.querySelectorAll('x-letter.wrong').length

    const totalLetters = correctLetter + incorrectLetter

    const accuracy = totalLetters > 0
        ? (correctLetter / totalLetters) * 100
        : 0
    console.log({ correctLetter, totalLetters })
    const wpm = correctWords * 60 / LIMIT_TIME
    $wpm.textContent = wpm
    $accuracy.textContent = `${accuracy.toFixed(2)}%`
}