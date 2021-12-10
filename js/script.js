document.addEventListener('contextmenu', event => event.preventDefault());

// Wrap every letter in a span
var textWrapper3 = document.querySelector('.ml13');
textWrapper3.innerHTML = textWrapper3.textContent.replace(/\S/g, "<span class='letter3'>$&</span>");

anime.timeline({ loop: false })
    .add({
        targets: '.ml13 .letter3',
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1000,
        delay: (el, i) => 300 + 30 * i
    })

function getLogin() {
    var fn = document.getElementById("fname").value;

}

$("button").click(function() {
    var val = $(this).val();
    val = parseInt(val, 10);


    switch (val) {
        case 1:
            document.getElementById("avatar").style.background = "url('assets/kirby.png')";
            break;
        case 2:
            document.getElementById("avatar").style.background = "url('assets/kingdede.gif')";
            break;
        case 3:
            document.getElementById("avatar").style.background = "url('assets/metaknight.gif')";
            break;
        case 4:
            document.getElementById("avatar").style.background = "url('assets/mario.gif')";
            break;
        case 5:
            document.getElementById("avatar").style.background = "url('assets/bowser.gif')";
            break;
        case 6:
            document.getElementById("avatar").style.background = "url('assets/daisy.gif')";
            break;
        case 7:
            document.getElementById("avatar").style.background = "url('assets/sonic.png')";
            break;
        case 8:
            document.getElementById("avatar").style.background = "url('assets/pikachu.png')";
            break;
        case 9:
            document.getElementById("avatar").style.background = "url('assets/gengar.png')";
            break;
        case 10:
            document.getElementById("avatar").style.background = "url('assets/jira.png')";
            break;
        case 11:
            document.getElementById('resume-container').style.display = 'block';
            break;
        case 12:
            document.getElementById('projects-container').style.display = 'block';
            break;
        case 13:
            document.getElementById('contact-container').style.display = 'block';
            break;
        case 14:
            document.getElementById('profile-container').style.display = 'block';
            break;
        case 0:
            document.getElementById('login-container').style.display = 'block';
            break;
        default:
            document.getElementById("avatar").style.background = "url('assets/mariosmushroom.png')";
    }

    document.getElementById("avatar").style.backgroundRepeat = "no-repeat";
    document.getElementById("avatar").style.backgroundPosition = "center";
    document.getElementById("avatar").style.backgroundSize = "80%";
    document.getElementById("avatar").style.backgroundColor = "#FED7DA";


});

var colorWell;
var defaultColor = "#FED7DA";

window.addEventListener("load", startup, false);

function startup() {
    colorWell = document.querySelector("#bg");
    colorWell.value = defaultColor;
    colorWell.addEventListener("input", updateFirst, false);
    colorWell.select();
}

function updateFirst(event) {
    document.getElementById("avatar").style.backgroundColor = event.target.value;
}

new Vue({
    el: "#time",
    data() {
        return {
            time: '',
            date: '',
            day: ''
        }
    },
    beforeMount() {
        setInterval(() => {
            this.time = moment().format('h:mm A')
        }, 1000)
        setInterval(() => {
            this.day = moment().format('dddd')
        }, 1000)
        setInterval(() => {
            this.date = moment().format('MMMM D')
        }, 1000)
    }
})

var audio = new Audio('assets/unlock.mp3');

$(document).ready(function() {
    $("#unlock").click(function() {
        document.getElementById('unlock-container').style.position = "relative";
        audio.play();
        unlock();
    });
});

function unlock() {
    document.getElementById('unlock-screen').style.top = "-105%";
    document.getElementById('unlock').style.top = "-105%";
    document.getElementById('flashlight').style.top = "-105%";
    document.getElementById('camera').style.top = "-105%";

}