import easySpeech from 'https://cdn.jsdelivr.net/npm/easy-speech/+esm'

const buttonContainer = document.querySelector('.container_button');


const typingPromises = (joke) =>
    [...joke].map(
        (ch, i) =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(joke.substring(0, i + 1));
                }, 120 * i);
            })
    );

function toggleButton() {
    buttonContainer.disabled = !buttonContainer.disabled;
}

function talkToMe(joke) {
    const easySpeechExist = easySpeech.detect();
    if (Object.keys(easySpeechExist).length <= 0) {
        typingPromises(joke).forEach(promise => {
            promise.then(portion => {
                document.querySelector('p').innerHTML = portion;
            });
        });
    }

    easySpeech.init({ maxTimeout: 5000, interval: 250 })
        .then(async () => {
            return await easySpeech.speak({
                text: joke,
                pitch: 1,
                rate: 1,
                volume: 5
            })
        })
        .then(() => toggleButton())
        .catch(e => console.error(e))
}

async function getJokes() {
    toggleButton();

    const apiUrl =
        'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const joke = data.joke ? data.joke : `${data.setup} ... ${data.delivery}`;

        talkToMe(joke);
    } catch (error) {
        console.log('Something went wrong', error);
    }
}

buttonContainer.addEventListener('click', getJokes);