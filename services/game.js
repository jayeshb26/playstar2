const express = require('express');
const app = express();

const now = new Date().getTime();
const countDownDate = new Date().setHours(14, 0, 0, 0);
const startTime = new Date().setHours(14, 0, 0, 0);
const endTime = new Date().setHours(18, 55, 1, 0);

const GameTimer = () => {
    const distance = countDownDate - now;
    if (countDownDate > startTime && now <= endTime && now > startTime && countDownDate <= endTime && Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) < 15) {
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (hours < 0) {
            distance = hours = 0;
        }
        if (minutes < 0) {
            distance = minutes = 0;
        }
        if (seconds < 0) {
            distance = seconds = 0;
        }
        return { hours, minutes, seconds };
    } else {
        return { hours: 0, minutes: 0, seconds: 0 };
    }
};

app.get('/countdown', (req, res) => {
    const timer = GameTimer();
    res.json(timer);
});

app.listen(3000, () => console.log('API server listening on port 3000'));
