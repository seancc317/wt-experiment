document.addEventListener('DOMContentLoaded', (event) => {
    let beep = new Audio('https://raw.githubusercontent.com/seancc317/workout-timer/main/699701__magnuswaker__elevator-beep.wav');
    let applause = new Audio('https://raw.githubusercontent.com/seancc317/workout-timer/main/181934__landub__applause2.wav'); // Replace with your applause sound URL
    let soundEnabled = false;

    const enableSoundButton = document.getElementById('enable-sound-button');
    enableSoundButton.textContent = 'Enable Sound';

    enableSoundButton.addEventListener('click', function() {
        beep.load();
        beep.play().then(() => {
            soundEnabled = true;
            enableSoundButton.textContent = 'Sound Enabled';
        }).catch(e => {
            console.error("Audio enable failed: ", e.message);
            enableSoundButton.textContent = 'Enable Sound (Click Again if Needed)';
            setTimeout(() => {
                enableSoundButton.textContent = 'Enable Sound';
            }, 3000);
        });
    });

    document.getElementById('start-button').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Please enter valid durations.');
            return;
        }

        const totalDuration = getSeconds('total-minutes', 'total-seconds');
        const exerciseInterval = getSeconds('exercise-minutes', 'exercise-seconds');
        const restInterval = getSeconds('rest-minutes', 'rest-seconds');

        preWorkoutCountdown(3, totalDuration, exerciseInterval, restInterval, beep, soundEnabled);
    });

    function validateInputs() {
        if (!document.getElementById('total-minutes') || !document.getElementById('total-seconds') ||
            !document.getElementById('exercise-minutes') || !document.getElementById('exercise-seconds') ||
            !document.getElementById('rest-minutes') || !document.getElementById('rest-seconds')) {
            console.error('One or more input elements cannot be found.');
            return false;
        }

        const totalMinutes = parseInt(document.getElementById('total-minutes').value) || 0;
        const totalSeconds = parseInt(document.getElementById('total-seconds').value) || 0;
        const exerciseMinutes = parseInt(document.getElementById('exercise-minutes').value) || 0;
        const exerciseSeconds = parseInt(document.getElementById('exercise-seconds').value) || 0;
        const restMinutes = parseInt(document.getElementById('rest-minutes').value) || 0;
        const restSeconds = parseInt(document.getElementById('rest-seconds').value) || 0;

        return isNumberInRange(totalMinutes, 0, 180) &&
               isNumberInRange(totalSeconds, 0, 59) &&
               isNumberInRange(exerciseMinutes, 0, 180) &&
               isNumberInRange(exerciseSeconds, 0, 59) &&
               isNumberInRange(restMinutes, 0, 180) &&
               isNumberInRange(restSeconds, 0, 59);
    }

    function isNumberInRange(value, min, max) {
        return typeof value === 'number' && value >= min && value <= max;
    }

    function getSeconds(minutesId, secondsId) {
        const minutes = parseInt(document.getElementById(minutesId).value) || 0;
        const seconds = parseInt(document.getElementById(secondsId).value) || 0;
        return minutes * 60 + seconds;
    }

    function preWorkoutCountdown(countdownSeconds, totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        let countdown = countdownSeconds;
        document.getElementById('countdown-display').textContent = `Starting in ${countdown}...`;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                document.getElementById('countdown-display').textContent = `Starting in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                document.getElementById('countdown-display').textContent = '';
                updateMessage('GO!');
                startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled);
            }
        }, 1000);
    }

    function startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        let remainingTime = totalDuration;
        let intervalTime = exerciseInterval;
        let isExercise = true;

        document.querySelector('.container').classList.remove('active');
        document.querySelector('.timer-screen').classList.add('active');
        
        if (soundEnabled) {
            beep.play(); // Play beep sound at the start
        }

        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                updateTimerDisplay(0);
                updateMessage('Workout COMPLETE!');
                showResetButton();
                return;
            }

            if (intervalTime <= 0) {
                isExercise = !isExercise;
                intervalTime = isExercise ? exerciseInterval : restInterval;
                updateMessage(isExercise ? 'GO!' : 'Rest!');
                if (soundEnabled) {
                    beep.play(); // Play beep sound at each transition
                }
            }

            updateTimerDisplay(remainingTime);
            intervalTime--;
            remainingTime--;
        }, 1000);
    }

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('timer-display').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateMessage(message) {
        document.getElementById('timer-message').textContent = message;
        if (message === 'Workout COMPLETE!' && soundEnabled) {
            applause.play();
        }
    }

    function showResetButton() {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Workout';
        resetButton.onclick = resetWorkout;
        document.querySelector('.timer-screen').appendChild(resetButton);
    }

    function resetWorkout() {
        document.querySelector('.timer-screen').classList.remove('active');
        document.querySelector('.container').classList.add('active');
        document.getElementById('total-minutes').value = '';
        document.getElementById('total-seconds').value = '';
        document.getElementById('exercise-minutes').value = '';
        document.getElementById('exercise-seconds').value = '';
        document.getElementById('rest-minutes').value = '';
        document.getElementById('rest-seconds').value = '';
        enableSoundButton.textContent = 'Enable Sound';
        soundEnabled = false;
        this.remove(); // Remove the reset button
    }
});
